import './../css/admin.css';
import ExcursionsAPI from './ExcursionsAPI';
import DOMHelper from './DOMHelper';

document.addEventListener('DOMContentLoaded', init)
const tripsList = new ExcursionsAPI;
const domHelper = new DOMHelper; 
const pathToTrips = 'excursions';

function init() {
  showTrips();
  // createTrip();
  // deleteTrip();
  // changeTripData()
}


function showTrips() {
  tripsList.loadData(pathToTrips)
    .then(res => {
      const apiKeys = ['title', 'description', 'price-adult', 'price-child']
      const apiValuesArrs = _getValuesOfKeys(res, apiKeys);
      const ulEl = domHelper.findElement('.panel__excurions');
      const prototypeLi = domHelper.findElement('.excurions__item--prototype');

      apiValuesArrs.forEach(arr => {
        const [title, description, priceAdult, priceChild] = arr;
        const arrOfElAndTextPairs = [
          matchSelectorWithValue('.excursions__title', title),
          matchSelectorWithValue('.excursions__description', description),
          matchSelectorWithValue('.excursions__price-adult', priceAdult),
          matchSelectorWithValue('.excursions__price-child', priceChild)];

        const liEl = domHelper.createElementFromPrototype(prototypeLi, 'prototype');

        arrOfElAndTextPairs.forEach(pair => {
          const element = setInnerText(pair.selector, pair.value);
          liEl.appendChild(element);
        })

        ulEl.appendChild(liEl)
      })
      // createLiWithValues(apiValuesArrs)
    })
}

function matchSelectorWithValue(selector, value) {
  const obj = {
    selector,
    value
  }
  return obj
}

function setInnerText(selector, value) {
  const element = domHelper.findElement(selector);
  element.innerText = value;
  return element
}
/* function createLiWithValues(arrOfArrays) {
  const DOMElementsSelectors = ['.excursions__title', '.excursions__description', '.excursions__price-adult', '.excursions__price-child'];
  const ulEl = domHelper.findElement('.panel__excurions');
  const prototypeLi = domHelper.findElement('.excurions__item--prototype');
  if (ulEl && prototypeLi) {
    arrOfArrays.forEach(arr => {
      const liElement = domHelper.createElementFromPrototype(prototypeLi, 'prototype');
      const DOMElements = domHelper.getElementsOfSelectors(DOMElementsSelectors, liElement);
          domHelper.assignInnerTextFromValuesArr(DOMElements, arr)
          ulEl.appendChild(liElement)
        })
        // ---- haloo! Coś z tym zrobić! Bo znika mi za każdym razem, jak wywołuję za pierwszym razem funkcję
    // domHelper.hideElement(prototypeLi)
  }
} */

/* const form = domHelper.findElement('.form')
form.addEventListener('submit', e => {
  e.preventDefault();
  displayTripFromForm(e.target)
})
function displayTripFromForm(form) {
  const formElements = form.elements
  const formElArr = Array.from(formElements)
  const formFields = formElArr.filter(el => el.classList.contains('form__field'));
  const formValues = formFields.map(el => el.value);
  const arrofArrs = [];
  arrofArrs.push(formValues);
  console.log(arrofArrs)

  createLiWithValues(arrofArrs)
  // formElements.forEach(element =>
  //   console.log(element.value))
  //pobierz value inputów
  //stwórz nową li
  //pobierz elementy DOM wycieczki
  //wstaw value inputów jako innerText elementów DOM

} */
// displayTripFromForm(form)

function createTrip() {
  tripsList.createNewData({ name: 'Zakopiec' }, pathToTrips)
}

function deleteTrip() {
  tripsList.deleteData(pathToTrips, 7)
}

function changeTripData() {
  tripsList.updateData({ name: 'updateTEST' }, pathToTrips, 8)
}

function _getValuesOfKeys(arrOfObj, key) {
  const arr = arrOfObj.map(element => {
    const array = [];
    for (let i = 0; i < key.length; i++) {
      array.push(element[key[i]])
    }
    return array
  })
  return arr
}


