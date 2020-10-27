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

//posprawdzać czy wyszukane elementy istnieją! (prototypy i ul)

function showTrips() {
  tripsList.loadData(pathToTrips)
    .then(res => {
      const apiKeys = ['title', 'description', 'price-adult', 'price-child']
      const valuesArrs = _getValuesOfKeys(res, apiKeys);
      const DOMElementsSelectors = ['.excursions__title', '.excursions__description', '.excursions__price-adult', '.excursions__price-child'];
      const ulEl = document.querySelector('.panel__excurions')
      if (ulEl) {
        valuesArrs.forEach(arr => {
          const liElement = domHelper.createElementFromPrototype('.excurions__item--prototype', 'prototype')
          const DOMElements = domHelper.getDOMElementsOfSelectors(DOMElementsSelectors, liElement);
          domHelper.assignInnerTextFromValuesArr(DOMElements, arr)
        ulEl.appendChild(liElement)
        })
      }
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


