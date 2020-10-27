import './../css/admin.css';
import ExcursionsAPI from './ExcursionsAPI';

document.addEventListener('DOMContentLoaded', init)
const tripsList = new ExcursionsAPI;
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
      const valuesArrs = _getValuesOfKeys(res, apiKeys);
      const DOMElementsSelectors = ['.excursions__title', '.excursions__description', '.excursions__price-adult', '.excursions__price-child'];
      const ulEl = document.querySelector('.panel__excurions')
      valuesArrs.forEach(arr => {
        const liElement = createElementFromPrototype('.excurions__item--prototype', 'prototype')
        const DOMElements = getDOMElementsOfSelectors(DOMElementsSelectors, liElement);
        assignInnerTextFromValuesArr(DOMElements, arr)
        ulEl.appendChild(liElement)
      })
    })
}

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

function getDOMElementsOfSelectors(arrOfSelectors, rootElement = document) {
  return arrOfSelectors.map(selector => {
    return rootElement.querySelector(selector)
  })
}

function createElementFromPrototype(selector, prototypeIndicatorWord, rootElement = document) {
  const prototype = rootElement.querySelector(selector);
  const createdEl = prototype.cloneNode(true);
  const classList = createdEl.classList;
  removeClassContainingString(classList, prototypeIndicatorWord);
  console.log(createdEl)
  return createdEl
}

function removeClassContainingString(classList, string) {
  const classListArr = Array.from(classList);
  const unwantedClassesArr = classListArr.filter(el => el.includes(string));
  unwantedClassesArr.forEach(item => classList.remove(item))
}

function assignInnerTextFromValuesArr(DOMElArr, valuesArr) {
  const arr = [];
  for (let i = 0; i < DOMElArr.length; i++) {
    DOMElArr[i].innerText = valuesArr[i];
    arr.push(DOMElArr[i]);
  }
  return arr
}

// createElementFromPrototype('.excurions__item--prototype', 'prototype')

// const domArr = getDOMElementsOfSelectors(['.excursions__title', '.excursions__description'], createElementFromPrototype('.excurions__item--prototype', 'prototype'));
// const valuesArr = ['JEDEDN DWA TRZY', 'próba generalna']
// // console.log(domArr)

// const wynik = _assignInnerTextFromValuesArr(domArr, valuesArr);
// console.log(wynik)

// const arrOfSelectors = ['.excursions__title', '.excursions__description'];

// const arr1 = _getDOMElements(arrOfSelectors);
// const arr2 = ['KOCI KOCI ŁAPCI', 'pojedziem do babci, babcia da nam mleczka. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Amet aliquam quam laboriosam quaerat temporibus dicta vitae maxime!']

// _assignInnerText(arr1, arr2)

