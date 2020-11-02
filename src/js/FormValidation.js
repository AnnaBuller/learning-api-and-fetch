export default class FormValidation {

  isValueANumber(formEl) {
    if (!isNaN(formEl.value)) {
      return true
    }
    else { this.returnError('wprowadzona wartość nie jest liczbą') }
  }

  isFieldFilled(formEl) {
    if (formEl.value !== '') {
      return true
    }
    else { this.returnError(`pole \"${formEl.parentElement.innerText}\" nie zostało wypełnione`) }
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
