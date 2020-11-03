export default class FormValidation {

  isValueANumber(formEl) {
    return !isNaN(formEl.value)
  }

  areValuesNumbers(...formElements) {
    return [...formElements].every(element => this.isValueANumber(element))
  }

  isFieldFilled(formEl) {
    return formEl.value !== ''
    // else { this.returnError(`pole \"${formEl.parentElement.innerText}\" nie zostało wypełnione`) }
  }

  isValueZeroOrEmpty(formEl) {
    return formEl.value === '' || formEl.value === "0"
  }

  onlyOneValueMoreThanZero(...formElements) {
    return [...formElements].some(element => !this.isValueZeroOrEmpty(element))
  }

  areReqFieldsFilled(fieldsArr) {
    console.log(fieldsArr)
    return fieldsArr.every(field => this.isFieldFilled(field)
    )
  }

  returnError(message) {
    console.log(message)
  }
}
