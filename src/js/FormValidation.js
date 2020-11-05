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

  isFieldValueZeroOrEmpty(formEl) {
    return formEl.value === '' || formEl.value === "0"
  }
  
  isValueZeroOrEmpty(value) {
    return value === '' || value === "0"
  }

  onlyOneValueMoreThanZero(...values) {
    return [...values].some(value => !this.isValueZeroOrEmpty(value))
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
