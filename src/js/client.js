import './../css/admin.css';
import DOMHelper from './DOMHelper';
import ExcursionsManager from './ExcursionsManager';

document.addEventListener('DOMContentLoaded', init);
const domHelper = new DOMHelper;
const exManager = new ExcursionsManager;

function init() {
  const ulEl = domHelper.findElement('.panel__excursions');
  const prototypeLi = domHelper.findElement('.excursions__item--prototype');

  exManager.showTrips(ulEl, prototypeLi);
  exManager.addToCart()
  ulEl.addEventListener('listLoaded', exManager.orderTrips(ulEl))
}

