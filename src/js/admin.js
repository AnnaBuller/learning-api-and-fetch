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
      const values = _getValuesOfKeys(res, ['title', 'description', 'price-adult', 'price-child']);
      const DOMElements = _getDOMElements(['.excursions__title', '.excursions__description', '.excursions__price-adult', '.excursions__price-child'], document.querySelector('.panel__excurions'));
      console.log(values)
      console.log(DOMElements)
      _assignInnerText(DOMElements, values)
      //Trzeba to rozwiązać jakoś inaczej. Lepiej chyba destrukturyzować pobrane wartości i przypisać je do konkretnych elementów DOM ręcznie (choć można nadal pobierac je jako array i potem destrukturyzować)
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

// function _createListItems(arrOfObj) {
//   return arrOfObj.map(item => {
//     const liItem = document.createElement('li');
//     const { name, id } = item;
//     liItem.innerText = name + ' ' + id;
//     return liItem
//   })
// }

function _assignInnerText(arr1, arr2) {
  arr1.forEach(function (element, index) {
    element.innerText = arr2[index]
  })
}

function _getDOMElements(arrOfSelectors, rootElement = document) {
  return arrOfSelectors.map(selector => {
    return rootElement.querySelector(selector)
  })
}

// const arrOfSelectors = ['.excursions__title', '.excursions__description'];

// const arr1 = _getDOMElements(arrOfSelectors);
// const arr2 = ['KOCI KOCI ŁAPCI', 'pojedziem do babci, babcia da nam mleczka. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Amet aliquam quam laboriosam quaerat temporibus dicta vitae maxime!']

// _assignInnerText(arr1, arr2)

console.log('na końcu')