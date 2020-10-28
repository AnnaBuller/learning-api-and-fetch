import './../css/admin.css';
import ExcursionsAPI from './ExcursionsAPI';
import DOMHelper from './DOMHelper';

document.addEventListener('DOMContentLoaded', init)
const tripsList = new ExcursionsAPI;
const domHelper = new DOMHelper; 
const pathToTrips = 'excursions';

function init() {
  const ulEl = domHelper.findElement('.panel__excurions');
  const prototypeLi = domHelper.findElement('.excurions__item--prototype');

  findEl()
  showTrips(ulEl, prototypeLi);
  findEl()
  createTrip(ulEl, prototypeLi);
  deleteTrip();
  // changeTripData()
}


function showTrips(ulEl, prototypeLi) {
  ulEl.innerText = '';
  tripsList.loadData(pathToTrips)
    .then(res => {
      const apiKeys = ['title', 'description', 'price-adult', 'price-child', 'id']
      const apiValuesArrs = _getValuesOfKeys(res, apiKeys);

      apiValuesArrs.forEach(arr => createLiWithItems(arr, ulEl, prototypeLi))
    })
}

function createLiWithItems(arrOfInnerText, ulEl, prototypeLi) {
  const [title, description, priceAdult, priceChild, id] = arrOfInnerText;
  const liEl = domHelper.createElementFromPrototype(prototypeLi, 'prototype');
  liEl.dataset.id = id;

  const arrOfElAndTextPairs = [
    matchElementWithText('.excursions__title', liEl, title),
    matchElementWithText('.excursions__description', liEl, description),
    matchElementWithText('.excursions__price-adult', liEl, priceAdult),
    matchElementWithText('.excursions__price-child', liEl, priceChild)];

  arrOfElAndTextPairs.forEach(pair => {
    return domHelper.setInnerText(pair.element, pair.value);
  })

  ulEl.appendChild(liEl)
}

function matchElementWithText(selector, rootEl, value) {
  const element = domHelper.findElement(selector, rootEl);
  const obj = {
    element,
    value
  }
  return obj
}

function createTrip(ulEl, prototypeLi) {
  const form = domHelper.findElement('.form')
  form.addEventListener('submit', e => {
    e.preventDefault();
    manageTripFromForm(e.target, ulEl, prototypeLi)
  }) 
}

function manageTripFromForm(form, ulEl, prototypeLi) {
  const formValues = domHelper.getValuesFromForm(form, '.form__field');
  addTripToAPI(formValues, pathToTrips);
  showTrips(ulEl, prototypeLi)
}

function addTripToAPI(formValues, pathToTrips) {
  const [title, description, priceAdult, priceChild] = formValues;
  const tripData = {
    title,
    description,
    'price-adult': priceAdult,
    'price-child': priceChild
  }
  tripsList.createNewData(tripData, pathToTrips)
}

// /////////////////???????????????????

function findEl() {
  const deleteBtns = document.querySelector('li');
  console.log(deleteBtns)
  console.log(document)
}

function deleteTrip() {
  const deleteBtns = document.querySelector('li');
  console.log(deleteBtns)
  console.log(document)
  // tripsList.deleteData(pathToTrips, 6)
  // showTrips(ulEl, prototypeLi)
}
// /////////////////???????????????????


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


