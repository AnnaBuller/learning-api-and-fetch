export default class DOMHelper {

  getElementsOfSelectors(arrOfSelectors, rootElement = document) {
    return arrOfSelectors.map(selector => {
      return rootElement.querySelector(selector)
    })
  }

  createElementFromPrototype(element, prototypeIndicatorWord) {
    if (element) {
      const createdEl = element.cloneNode(true);
      const classList = createdEl.classList;
      this.removeClassContainingString(classList, prototypeIndicatorWord);
      return createdEl
    }
  }

  findElement(selector, rootElement = document) {
    const element = rootElement.querySelector(selector);
    return element
  }

  findMultipleElements(selector, rootElement = document) {
    const elements = rootElement.querySelectorAll(selector);
    return [...(elements)]
  }

  hideElement(element) {
    element.style.display = 'none'
  }

  removeChildrenOfParent(childrenArr, parentEl) {
    childrenArr.forEach(item => parentEl.removeChild(item))
  }

  setInnerText(element, value) {
    element.innerText = value;
    return element
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

  getValuesFromForm(form, slotSelector) {
    const formElements = form.querySelectorAll(slotSelector);
    return Array.from(formElements).map(slot => slot.value)
  }

  isElementInDOM(element) {
    return element !== null
  }
  areElementsInDOM(...elements) {
    return [...elements].every(element => this.isElementInDOM(element))
}
}
