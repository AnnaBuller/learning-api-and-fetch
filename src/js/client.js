import './../css/client.css';
import DOMHelper from './DOMHelper';
import ExcursionsManager from './ExcursionsManager';

document.addEventListener('DOMContentLoaded', init);
const domHelper = new DOMHelper;
const exManager = new ExcursionsManager;

function init() {
  const ulEl = domHelper.findElement('.panel__excursions');
  const prototypeLi = domHelper.findElement('.excursions__item--prototype');
  const ulElCart = domHelper.findElement('.panel__summary');
  const prototypeLiCart = domHelper.findElement('.summary__item--prototype');
  const elementsExist = domHelper.areElementsInDOM(ulEl, prototypeLi, ulElCart, prototypeLiCart)

  if (elementsExist) {
    exManager.showTrips(ulEl, prototypeLi);
    ulEl.addEventListener('listLoaded', exManager.orderTrips(ulEl, ulElCart, prototypeLiCart))
  }
}

