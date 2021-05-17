import ExcursionsAPI from './ExcursionsAPI';
import DOMHelper from './DOMHelper';
import FormValidation from './FormValidation';


const excursionsAPI = new ExcursionsAPI;
const domHelper = new DOMHelper;
const formValidation = new FormValidation;

const pathToTrips = 'excursions';
const pathToOrders = 'orders';

export default class ExcursionsManager {

  // TU WYŚWIETLAM WYCIECZKI 
  showTrips(ulEl, prototypeLi) {
    /////////////////////PONIŻSZEGO IFA ZAMIENIĆ NA FUNCKJĘ CLEARLIST()
    if (ulEl.children.length > 1) {
      const currTripList = domHelper.findMultipleElements('.excursions__item:not(.excursions__item--prototype)', ulEl);
      domHelper.removeChildrenOfParent(currTripList, ulEl);
    }

    excursionsAPI.loadData(pathToTrips)
      .then(res => {
        const apiKeys = ['title', 'description', 'price-adult', 'price-child', 'id']
        const apiValuesArrs = this._getValuesOfKeys(res, apiKeys);

        apiValuesArrs.forEach(arr => this.createLiWithItems(arr, ulEl, prototypeLi));

        this.fireCustomEvent('listLoaded', document.querySelector('li'))
      })
  }
 

  //TUTAJ TWORZĘ NAMACALNE ELEMENTY LISTY
  createLiWithItems(arrOfInnerText, ulEl, prototypeLi) {
    const [title, description, priceAdult, priceChild, id] = arrOfInnerText;
    const liEl = domHelper.createElementFromPrototype(prototypeLi, 'prototype');
    liEl.dataset.id = id;

    const arrOfElAndTextPairs = [
      this._matchElementWithText('.excursions__title', liEl, title),
      this._matchElementWithText('.excursions__description', liEl, description),
      this._matchElementWithText('.excursions__price-adult', liEl, priceAdult),
      this._matchElementWithText('.excursions__price-child', liEl, priceChild)];

    arrOfElAndTextPairs.forEach(pair => {
      return domHelper.setInnerText(pair.element, pair.value);
    })

    ulEl.appendChild(liEl);
  }

  fireCustomEvent(eventName, element) {
    const event = new CustomEvent(eventName, {
      bubbles: true
    });
    element.dispatchEvent(event);
  }
  
  // POBIERAM WARTOŚCI Z INPUTÓW, WALIDUJĘ 
  createTrip(form, ulEl, prototypeLi) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const formElements = domHelper.findMultipleElements('.form__field', form);
      if (formValidation.areReqFieldsFilled(formElements)) {
        //sprawdzenie poprawności pól liczbowych
        const numFields = domHelper.findMultipleElements('[type=number]', form);
        numFields.forEach(field => {
          if (!formValidation.isFormValueANumber(field)) {
            alert('Proszę wprowadzić prawidłową cenę - dozwolone tylko cyfry.');
            return
          }
        })
        //jak wszystko ok, to je wrzucam do API i na listę
        this.manageTripFromForm(e.target, ulEl, prototypeLi);
        domHelper.clearFormFields(formElements);
      } else { alert('Proszę wypełnić wszystkie dane wycieczki.') }

    })
  }
  //POBIERAM DANE Z INPUTÓW I WYWOŁUJĘ DODANIE DANYCH DO API ORAZ ODŚWIEŻAM LISTĘ
  manageTripFromForm(form, ulEl, prototypeLi) {
    const formValues = domHelper.getValuesFromForm(form, '.form__field');
    const tripData = this._createDataForAPI(formValues);
    excursionsAPI.createNewData(tripData, pathToTrips)
      .finally(() => {
        this.showTrips(ulEl, prototypeLi);
        const successInfo = document.createElement('p');
        successInfo.innerText = 'Wycieczka została dodana.';
        successInfo.classList.add('form__send-success');
        form.appendChild(successInfo);
        // debugger // blaknięcie nie działa, ale mogłoby być ciekawie :P
        console.log(successInfo.style.color)
        setTimeout(this._fadeOutRemovedEl(successInfo), 3000);
      })
  }
  // TUTAJ AKTUALIZUJĘ DODANIE WYCIECZKI Z FORMULARZA DO API

  _fadeOutRemovedEl(element) {
    const elOpacity = element.style.opacity;
    console.log(elOpacity)
    for (opacity = 0; opacity < 1.1; opacity = opacity + 0.1) {
      setTimeout(() => elOpacity = opacity, 100)
    }
  }
// TUTAJ URUCHAMIAM FUNKCJĘ PO CUSTOMOWYM EVENCIE - JAK ZAŁADUJĄ SIĘ li
  manageTripsData(ulEl, prototypeLi) {
    ulEl.addEventListener('click', e => {
      e.preventDefault();
      this.removeTripData(e, ulEl, prototypeLi);
      this.updateTripData(e)
    })
  }

  //USUWAM WYCIECZKĘ Z API PO KLIKNIĘCIU NA 'USUŃ' I ODŚWIEŻAM LISTĘ
  removeTripData(e, ulEl, prototypeLi) {
    if (e.target.classList.contains('excursions__field-input--remove')) {
      const liEl = e.target.closest('.excursions__item')
      const id = liEl.dataset.id;
      excursionsAPI.deleteData(pathToTrips, id);
      this.showTrips(ulEl, prototypeLi)
    }
  } //.finally(this.showTrips()) - ogarnąć obsługę jak w projekcie z modułu

  //EDYTUJĘ WYCIECZKĘ - TU JEST DO ZROBIENIA SPORO FUNKCJI '_INDYWIDUALNYCH'
  updateTripData(e) {
    //sprawdzam czy kliknęłam w przycisk 'edytuj'
    if (e.target.classList.contains('excursions__field-input--update')) {
      const liToEdit = e.target.closest('.excursions__item');
      const selectors = ['.excursions__title', '.excursions__description', '.excursions__price-adult', '.excursions__price-child'];
      //pobieram elementy listy do edytowania
      const editableElements = domHelper.getElementsOfSelectors(selectors, liToEdit);

      //sprawdzam czy elementy są edytowalne
      if (domHelper.areElementsEditable(editableElements)) {
        const id = liToEdit.dataset.id;
        //pobieram zedytowany tekst z każdego elementu
        const editedValues = editableElements.map(el => el.innerText);

        const data = this._createDataForAPI(editedValues) 
        //aktualizuję dane w API
        excursionsAPI.updateData(data, pathToTrips, id)
          // /////////////////dodać catch i wszędzie go w ogóle dodać o_O może
          .finally(() => {
            // na końcu tego wszystkiego przywracam ustawienia początkowe
            editableElements.forEach(el => el.contentEditable = false);
            e.target.value = 'edytuj';
            console.log('koniec edycji');
          })
        //jeśli nie są edytowalne (bo za 1 razem, czyli przy init(), nie jest) to robię, by były edytowalne i zmieniam tekst przycisku
      } else {
        editableElements.forEach(el => el.contentEditable = true);
        e.target.value = 'zapisz';
        console.log('możesz edytować')
      }
    }
  }

  // to wykorzystuję tylko raz - by dopasować przy showTrips() elementy DOM do wartości z API 
  _matchElementWithText(selector, rootEl = document, value) {
    const element = domHelper.findElement(selector, rootEl);
    const obj = {
      element,
      value
    }
    return obj
  }

  // FUNKCJA POZWALA POBRAĆ WYBRANE WARTOŚCI Z PRZSŁANEGO OBIEKTU Z OBIEKTAMI (Z JSONA) 
  _getValuesOfKeys(arrOfObj, arrOfKeys) {
    const arr = arrOfObj.map(element => {
      const array = [];
      for (let i = 0; i < arrOfKeys.length; i++) {
        array.push(element[arrOfKeys[i]])
      }
      return array
    })
    return arr
  }

  _createDataForAPI(valuesArr) {
    const [title, description, priceAdult, priceChild] = valuesArr;
    const data = {
      title,
      description,
      'price-adult': priceAdult,
      'price-child': priceChild
    }
    return data
  }


  // ///////////////////////////////////////////////////////////////////
  // tutaj dla client.js

  chooseTrips(ulEl, ulElCart, prototypeLiCart) {
    ulEl.addEventListener('submit', e => {
      e.preventDefault();
      this.createCartLiEl(e, ulElCart, prototypeLiCart);
      this.sumWholeCart(ulElCart);
    })
  }

  // TO SĄ MIEJSCA W KOSZYKU, DO KTÓRYCH MAM WRZUCIĆ NOWY INNER TEXT
  createCartLiEl(e, ulElCart, prototypeLiCart) {
    const liEl = domHelper.createElementFromPrototype(prototypeLiCart, 'prototype');

    const objOfEls = this._createObjWithDOMElements(liEl);
    const objOfValues = this._createObjWithValues(e.target);

    if (objOfEls && objOfValues) {
      domHelper.assignInnerTextFromValuesObj(objOfEls, objOfValues);
      this._makeTripRemovable(liEl, ulElCart);
      ulElCart.appendChild(liEl);
    }
  }

  sumWholeCart(ulElCart) {
    //chciałam zrobić selektor z ":not", by ominąć cenę z prototypu (i nie musieć stosować metody shift()), np.:
    // `.summary__total-price:not(.summary__item--prototype .summary__total-price)`
    // lecz nie mogę wpaść na prawidłowy selektor
    const liElSums = domHelper.findMultipleElements(`.summary__total-price`, ulElCart);
    const totalSum = domHelper.findElement('.order__total-price-value');
    liElSums.shift() //usuwam element pobrany z klasy --prototype (zapewne można lepiej...?)
    const valuesToSum = liElSums.map(el => parseFloat(el.innerText))
    const valuesSum = valuesToSum.reduce((a, b) => a + b, 0)
    totalSum.innerText = valuesSum
  }

 _createObjWithDOMElements(root) {
    const options = {
      title: { sel: '.summary__name' },
      priceAdult: { sel: '.summary__prices-adult' },
      priceChildren: { sel: '.summary__prices-children' },
      amountAdult: { sel: '.summary__amount-adult' },
      amountChildren: { sel: '.summary__amount-children' },
      sumPrice: { sel: '.summary__total-price' }
    }

    const objOfEls = domHelper.createObjOfElementsOrValues(options, root);

    const elementsExist = domHelper.areElementsInDOM({ ...objOfEls });

    if (elementsExist) {
      return objOfEls
    }
  }

  _createObjWithValues(root) {
    const options = {
      title: { sel: '.excursions__title', root: root.parentElement, prop: 'innerText' },
      priceAdult: { sel: '.excursions__price-adult', prop: 'innerText' },
      priceChildren: { sel: '.excursions__price-child', prop: 'innerText' },
      amountAdult: { sel: '[name=adults]', prop: 'value' },
      amountChildren: { sel: '[name=children]', prop: 'value' },
      sumPrice: ''
    }

    const objOfValues = domHelper.createObjOfElementsOrValues(options, root);
    //TUTAJ ZROBIĆ WALIDACJĘ WARTOŚCI Z FORMULARZA
    const { amountAdult, amountChildren } = objOfValues;
    if (isNaN(amountAdult) || isNaN(amountChildren)) {
      alert('Proszę wprowadzić prawidłową liczbę uczestików.');
      return
    }
    if (formValidation.onlyOneValueMoreThanZero(amountAdult, amountChildren)) {
      if (formValidation.isValueZeroOrEmpty(amountAdult)) {
        objOfValues.amountAdult = 0;
      }
      if (formValidation.isValueZeroOrEmpty(amountChildren)) {
        objOfValues.amountChildren = 0
      }

      objOfValues.sumPrice = this._createSumPriceProperty(objOfValues)

      // w takiej sytuacji chyba nie bardzo mam jak sprawdzić, czy wyszukane elementy istnieją (?)
      return objOfValues
    } else { alert('Wybierz liczbę uczestników') } 
  }

  _createSumPriceProperty({ priceAdult, amountAdult, priceChildren, amountChildren }) {
    return parseFloat(priceAdult) * parseFloat(amountAdult) + parseFloat(priceChildren) * parseFloat(amountChildren);
  }

  _makeTripRemovable(liEl) {
    const removeBtn = domHelper.findElement('.summary__btn-remove', liEl);
    removeBtn.addEventListener('click', this._removeTripFromCart.bind(this));
  }

  _removeTripFromCart(e) {
    e.preventDefault()
    const parentLiEl = e.currentTarget.closest('.summary__item');
    parentLiEl.remove();
    const ulElCart = domHelper.findElement('.panel__summary');
    this.sumWholeCart(ulElCart);
  }

  orderTrips() {
    const orderForm = domHelper.findElement('.order');
    orderForm.addEventListener('submit', this.sendOrderToAPI.bind(this))
  }

  sendOrderToAPI(e) {
    e.preventDefault();
    const name = e.target.elements.name.value;
    const email = e.target.elements.email.value;
    const totalPrice = domHelper.findElement('.order__total-price-value', e.target);
    const orderedTrips = domHelper.findMultipleElements(`.summary__item:not(.summary__item--prototype)`)
    const orderedTripsData = {
      title: { sel: '.summary__name', prop: 'innerText' },
      priceAdult: { sel: '.summary__prices-adult', prop: 'innerText' },
      priceChildren: { sel: '.summary__prices-children', prop: 'innerText' },
      amountAdult: { sel: '.summary__amount-adult', prop: 'innerText' },
      amountChildren: { sel: '.summary__amount-children', prop: 'innerText' },
      tripTotalPrice: { sel: '.summary__total-price', prop: 'innerText' }
    }
    if (name && email) {
      const errors = domHelper.findMultipleElements('.order__error');
      errors.forEach(err => err.remove())
      const errArr = [];
      // NO I NIE DZIAŁA?!!!!!!!!!!!!!!!!
      // debugger //false (! -> true)                           true (! -> false)
      if (!formValidation.hasEnoughWords(name, 2) && !formValidation.hasLetterSpaceDash(name)) {
        const error = 'Proszę wpisać poprawne imię i nazwisko.';
        errArr.push(error);
      };
      if (!formValidation.isValidEmail(email)) {
        const error = 'Proszę wpisać poprawny adres email.';
        errArr.push(error);

      }
      if (errArr.length > 0) {
        errArr.forEach(err => this._showErrorMsg(err, e.target));
        return
      }
    } else {
      alert('Proszę wprowadzić pełne dane.');
      return
    };

    const tripsDataObj = orderedTrips.map(trip => {
      return domHelper.createObjOfElementsOrValues(orderedTripsData, trip);
    })

    const data = {
      name,
      email,
      'total-price': parseFloat(totalPrice.innerText),
      'ordered-trips-data': tripsDataObj
    }
    excursionsAPI.createNewData(data, pathToOrders);
    orderedTrips.forEach(item => item.remove());
    alert(`Dziękujemy za złożenie zamówienia. Szczegóły zamówienia przesłano na adres ${email}.`)

  }

  _showErrorMsg(msg, parentElement) {
    const pEl = document.createElement('p');
    pEl.classList.add('order__error')
    pEl.innerText = msg;
    parentElement.appendChild(pEl)
  }
}

