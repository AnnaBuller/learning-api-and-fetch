import ExcursionsAPI from './ExcursionsAPI';
import DOMHelper from './DOMHelper';
import FormValidation from './FormValidation';


const exAPIManager = new ExcursionsAPI;
const domHelper = new DOMHelper;
const formValidation = new FormValidation;

const pathToTrips = 'excursions';

export default class ExcursionsManager {

  // TU JEST EVENT, NA KTÓRY REAGUJE ODPALANIE FUNKCJI ODPALAJĄCEJ DELETE I UPDATE
  fireCustomEvent(eventName, element) {
    const event = new CustomEvent(eventName, {
      bubbles: true
    });
    element.dispatchEvent(event);
  }

  // TU WYŚWIETLAM WYCIECZKI 
  showTrips(ulEl, prototypeLi) {
    /////////////////////PONIŻSZEGO IFA ZAMIENIĆ NA FUNCKJĘ CLEARLIST()
    if (ulEl.children.length > 1) {
      const currTripList = domHelper.findMultipleElements('.excursions__item:not(.excursions__item--prototype)', ulEl);
      domHelper.removeChildrenOfParent(currTripList, ulEl);
    }

    exAPIManager.loadData(pathToTrips)
      .then(res => {
        const apiKeys = ['title', 'description', 'price-adult', 'price-child', 'id']
        const apiValuesArrs = this.getValuesOfKeys(res, apiKeys);

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
      this.matchElementWithText('.excursions__title', liEl, title),
      this.matchElementWithText('.excursions__description', liEl, description),
      this.matchElementWithText('.excursions__price-adult', liEl, priceAdult),
      this.matchElementWithText('.excursions__price-child', liEl, priceChild)];

    arrOfElAndTextPairs.forEach(pair => {
      return domHelper.setInnerText(pair.element, pair.value);
    })

    ulEl.appendChild(liEl);
  }
  // TUTAJ AKTUALIZUJĘ DODANIE WYCIECZKI Z FORMULARZA DO API
  addTripToAPI(formValues, pathToTrips) {
    // ////////////////Z TEGO ZROBIĆ FUNKCJĘ BO SIĘ POWTARZA W FUNKCJI UPDATE()
    const [title, description, priceAdult, priceChild] = formValues;
    const tripData = {
      title,
      description,
      'price-adult': priceAdult,
      'price-child': priceChild
    }
    exAPIManager.createNewData(tripData, pathToTrips)
  }

  // POBIERAM WARTOŚCI Z INPUTÓW, WALIDUJĘ I POWINNAM PRZEKAZAĆ DALEJ FORMELEMENTS
  // A PÓKI CO PRZEKAZUJĘ CAŁY FORMULARZ - MAŁO WYDAJNE
  createTrip(form, ulEl, prototypeLi) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const formElements = domHelper.findMultipleElements('.form__field', form);
      console.log(formElements)
      if (formValidation.areReqFieldsFilled(formElements)) {
        //sprawdzenie poprawności pól liczbowych
        const numFields = domHelper.findMultipleElements('[type=number]', form);
        numFields.forEach(field => formValidation.isValueANumber(field))

        //jak wszystko ok, to je wrzucam do API i na listę
        this.manageTripFromForm(e.target, ulEl, prototypeLi)
      } else { console.log('nie wypelniono?!') }

    })
  }
  // TUTAJ URUCHAMIAM FUNKCJĘ PO CUSTOMOWYM EVENCIE - JAK ZAŁADUJĄ SIĘ li
  manageTrips(ulEl, prototypeLi) {
    ulEl.addEventListener('click', e => {
      e.preventDefault();
      this.removeTripData(e, ulEl, prototypeLi);
      this.updateTripData(e, ulEl, prototypeLi)
    })
  }

  //USUWAM WYCIECZKĘ Z API PO KLIKNIĘCIU NA 'USUŃ' I ODŚWIEŻAM LISTĘ
  removeTripData(e, ulEl, prototypeLi) {
    if (e.target.classList.contains('excursions__field-input--remove')) {
      const liEl = e.target.closest('.excursions__item')
      const id = liEl.dataset.id;
      exAPIManager.deleteData(pathToTrips, id);
      this.showTrips(ulEl, prototypeLi)
    }
  } //.finally(this.showTrips()) - ogarnąć obsługę jak w projekcie z modułu

  //POBIERAM DANE Z INPUTÓW I WYWOŁUJĘ DODANIE DANYCH DO API ORAZ ODŚWIEŻAM LISTĘ
  manageTripFromForm(form, ulEl, prototypeLi) {
    const formValues = domHelper.getValuesFromForm(form, '.form__field');
    this.addTripToAPI(formValues, pathToTrips);
    this.showTrips(ulEl, prototypeLi)
  }

  //EDYTUJĘ WYCIECZKĘ - TU JEST DO ZROBIENIA SPORO FUNKCJI '_INDYWIDUALNYCH'
  updateTripData(e, ulEl, prototypeLi) {
    //sprawdzam czy kliknęłam w przycisk 'edytuj'
    if (e.target.classList.contains('excursions__field-input--update')) {
      const liToEdit = e.target.closest('.excursions__item');
      const selectors = ['.excursions__title', '.excursions__description', '.excursions__price-adult', '.excursions__price-child'];
      //pobieram elementy listy do edytowania
      const editableElements = domHelper.getElementsOfSelectors(selectors, liToEdit);

      //sprawdzam czy elementy są edytowalne
      if (this._areEditable(editableElements)) {
        const id = liToEdit.dataset.id;
        //pobieram zedytowany tekst z każdego elementu
        const editedValues = editableElements.map(el => el.innerText);
        //poniższy kawałek kodu powiela się z addTripToAPI!!! Zrobić z tego f-cję!
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        const [title, description, priceAdult, priceChild] = editedValues;
        //tworzę dane dla funckji z API
        const data = {
          title,
          description,
          'price-adult': priceAdult,
          'price-child': priceChild
        }
        //aktualizuję dane w API
        exAPIManager.updateData(data, pathToTrips, id)
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
  matchElementWithText(selector, rootEl = document, value) {
    const element = domHelper.findElement(selector, rootEl);
    const obj = {
      element,
      value
    }
    return obj
  }

  // FUNKCJA POZWALA POBRAĆ WYBRANE WARTOŚCI Z PRZSŁANEGO OBIEKTU Z OBIEKTAMI (Z JSONA) 
  getValuesOfKeys(arrOfObj, arrOfKeys) {
    const arr = arrOfObj.map(element => {
      const array = [];
      for (let i = 0; i < arrOfKeys.length; i++) {
        array.push(element[arrOfKeys[i]])
      }
      return array
    })
    return arr
  }

  //FUNCKJA SPRAWDZA CZY ATRYBUT contentEditable JEST TRUE DLA ELEMENTÓW TABLICY
  _areEditable(arr) {
    return [...arr].every(el => el.isContentEditable)
  }

  // ///////////////////////////////////////////////////////////////////
  // tutaj dla client.js


  orderTrips(ulEl, prototypeLi, ulElCart, prototypeLiCart) {

    ulEl.addEventListener('submit', e => {
      e.preventDefault();
      this.addToCart(e, ulEl, prototypeLi, ulElCart, prototypeLiCart);
    })
  }

  addToCart(e, ulEl, prototypeLi, ulElCart, prototypeLiCart) {
    console.log('funckja jedynie się uruchomiła');
    const cartItemsObj = this._createCartLiEl(ulElCart, prototypeLiCart);
    const orderDataObj = this._getTripOrderData(e);

    this._putOrderToCart(cartItemsObj, orderDataObj);
  }

  _putOrderToCart(cartItemsObj, orderDataObj) {
    for (let element in cartItemsObj) {
      cartItemsObj[element].innerText = orderDataObj[element]
    }
  }
  // OK, nie tak. Trzeba wrzucić przyporządkowywanie innerTextu do jednej funkcji, by można było dodać Li do koszyka


  _getInnerText(element) {
    return element.innerText
  }

  // TO SĄ DANE I INPUTY KTÓRE MAM POBRAĆ Z DANEJ WYCIECZKI Z LISTY
  _getTripOrderData(e) {
    const title = domHelper.findElement('.excursions__title', e.target.parentElement);
    const priceAdult = domHelper.findElement('.excursions__price-adult', e.target);
    const priceChildren = domHelper.findElement('.excursions__price-child', e.target);
    const amountAdult = domHelper.findElement('[name=adults]', e.target);
    const amountChildren = domHelper.findElement('[name=children]', e.target);

    //optymalniej byłoby wrzucić powyższe zmienne do tablicy i zrobić spread, czy przy tej ilości można jak poniżej - po prostu je wymienić?
    if (this._isOrderValid(title, priceAdult, priceChildren, amountAdult, amountChildren)) {
      return this._createObjWithOrderData(title, priceAdult, priceChildren, amountAdult, amountChildren)
    }
  }

  _createObjWithOrderData(title, priceAdult, priceChildren, amountAdult, amountChildren) {
    return {
      title: title.innerText,
      priceAdult: priceAdult.innerText,
      priceChild: priceChildren.innerText,
      amountAdult: amountAdult.value === '' ? 0 : amountAdult.value,
      amountChildren: amountChildren.value === '' ? 0 : amountChildren.value
    }
  }

  _isOrderValid(title, priceAdult, priceChildren, amountAdult, amountChildren) {
    if (formValidation.isFieldFilled(amountAdult) || formValidation.isFieldFilled(amountChildren)) {
      const areInDOM = domHelper.isElementInDOM(title, priceAdult, priceChildren);
      const oneSlotNotZeroOrEmpty = formValidation.onlyOneValueMoreThanZero(amountAdult, amountChildren);
      const areValuesNumbers = formValidation.areValuesNumbers(amountAdult, amountChildren);
      const boleanArr = [areInDOM, oneSlotNotZeroOrEmpty, areValuesNumbers];
      return boleanArr.every(el => el === true)
    }
    // else - obsługa błędu -> pola nie zostały wypełnione
  }
  // TO SĄ MIEJSCA W KOSZYKU, DO KTÓRYCH MAM WRZUCIĆ NOWY INNER TEXT
  _createCartLiEl(ulElCart, prototypeLiCart) {
    const liEl = domHelper.createElementFromPrototype(prototypeLiCart, 'prototype');
    const title = domHelper.findElement('.summary__name', liEl);
    const priceAdult = domHelper.findElement('.summary__prices-adult', liEl);
    const priceChildren = domHelper.findElement('.summary__prices-children', liEl);
    const amountAdult = domHelper.findElement('.summary__amount-adult', liEl);
    const amountChildren = domHelper.findElement('.summary__amount-children', liEl);
    const elementsExist = domHelper.areElementsInDOM(title, priceAdult, priceChildren, amountAdult, amountChildren)

    if (elementsExist) {
      return this._createObjWithCartItems(title, priceAdult, priceChildren, amountAdult, amountChildren)
    }
  }

  _createObjWithCartItems(title, priceAdult, priceChildren, amountAdult, amountChildren) {
    return {
      title,
      priceAdult,
      priceChildren,
      amountAdult,
      amountChildren
    }
  }

}

