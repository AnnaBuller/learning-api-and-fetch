import ExcursionsAPI from './ExcursionsAPI';
import DOMHelper from './DOMHelper';

const tripsList = new ExcursionsAPI;
const domHelper = new DOMHelper;
const pathToTrips = 'excursions';

export default class ExcursionsManager {

  fireCustomEvent(element, eventName) {
    const event = new CustomEvent(eventName, {
      bubbles: true
    });
    element.dispatchEvent(event);
  }

  showTrips(ulEl, prototypeLi) {
    ulEl.innerText = '';
    tripsList.loadData(pathToTrips)
      .then(res => {
        const apiKeys = ['title', 'description', 'price-adult', 'price-child', 'id']
        const apiValuesArrs = this.getValuesOfKeys(res, apiKeys);

        apiValuesArrs.forEach(arr => this.createLiWithItems(arr, ulEl, prototypeLi));
      })
      .then(this.deleteTrip)
  }

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

  addTripToAPI(formValues, pathToTrips) {
    const [title, description, priceAdult, priceChild] = formValues;
    const tripData = {
      title,
      description,
      'price-adult': priceAdult,
      'price-child': priceChild
    }
    tripsList.createNewData(tripData, pathToTrips)
  }

  createTrip(ulEl, prototypeLi) {
    const form = domHelper.findElement('.form')
    form.addEventListener('submit', e => {
      e.preventDefault();
      this.manageTripFromForm(e.target, ulEl, prototypeLi)
    })
  }

  deleteTrip() {
    const deleteBtns = domHelper.findMultipleElements('.excursions__field-input--remove');
    console.log(deleteBtns)
    // tripsList.deleteData(pathToTrips, 6)
    // showTrips(ulEl, prototypeLi)
  }

  manageTripFromForm(form, ulEl, prototypeLi) {
    const formValues = domHelper.getValuesFromForm(form, '.form__field');
    this.addTripToAPI(formValues, pathToTrips);
    this.showTrips(ulEl, prototypeLi)
  }

  changeTripData() {
    tripsList.updateData({ name: 'updateTEST' }, pathToTrips, 8)
  }

  matchElementWithText(selector, rootEl, value) {
    const element = domHelper.findElement(selector, rootEl);
    const obj = {
      element,
      value
    }
    return obj
  }

  getValuesOfKeys(arrOfObj, key) {
    const arr = arrOfObj.map(element => {
      const array = [];
      for (let i = 0; i < key.length; i++) {
        array.push(element[key[i]])
      }
      return array
    })
    return arr
  }
}