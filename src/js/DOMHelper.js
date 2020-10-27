export default class DOMHelper {

  getDOMElementsOfSelectors(arrOfSelectors, rootElement = document) {
    return arrOfSelectors.map(selector => {
      return rootElement.querySelector(selector)
    })
  }

  createElementFromPrototype(selector, prototypeIndicatorWord, rootElement = document) {
    const prototype = rootElement.querySelector(selector);
    if (prototype) {
      const createdEl = prototype.cloneNode(true);
      const classList = createdEl.classList;
      this.removeClassContainingString(classList, prototypeIndicatorWord);
      console.log(createdEl)
      return createdEl
    }
  }

  removeClassContainingString(classList, string) {
    const classListArr = Array.from(classList);
    const unwantedClassesArr = classListArr.filter(el => el.includes(string));
    unwantedClassesArr.forEach(item => classList.remove(item))
  }

  assignInnerTextFromValuesArr(DOMElArr, valuesArr) {
    const arr = [];
    for (let i = 0; i < DOMElArr.length; i++) {
      DOMElArr[i].innerText = valuesArr[i];
      arr.push(DOMElArr[i]);
    }
    return arr
  }
}