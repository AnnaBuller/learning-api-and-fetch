import './../css/admin.css';
// import ExcursionsAPI from './ExcursionsAPI';
import DOMHelper from './DOMHelper';
import ExcursionsManager from './ExcursionsManager';

document.addEventListener('DOMContentLoaded', init);
const domHelper = new DOMHelper; 
const exManager = new ExcursionsManager; 

function init() {
  const ulEl = domHelper.findElement('.panel__excursions');
  const prototypeLi = domHelper.findElement('.excursions__item--prototype');
  const form = domHelper.findElement('.form');
  const elementsExist = domHelper.areElementsInDOM(ulEl, prototypeLi, form);

  if (elementsExist) {
    exManager.showTrips(ulEl, prototypeLi);
    exManager.createTrip(form, ulEl, prototypeLi);

    ulEl.addEventListener('listLoaded', exManager.manageTrips(ulEl, prototypeLi))
  }
}

