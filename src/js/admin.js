import './../css/admin.css';
// import ExcursionsAPI from './ExcursionsAPI';
import DOMHelper from './DOMHelper';
import ExcursionsManager from './ExcursionsManager';

document.addEventListener('DOMContentLoaded', init);
// const tripsList = new ExcursionsAPI;
const domHelper = new DOMHelper; 
const exManager = new ExcursionsManager; 

function init() {
  const ulEl = domHelper.findElement('.panel__excurions');
  const prototypeLi = domHelper.findElement('.excurions__item--prototype');

  exManager.showTrips(ulEl, prototypeLi);
  exManager.createTrip(ulEl, prototypeLi);

  // ulEl.addEventListener('listLoaded', exManager.deleteTrip)
  // ulEl.addEventListener('listLoaded', exManager.changeTripData)
}

