export default class FormValidation {

  isValueANumber(value) {
    return !isNaN(value)
  }

  isFormValueANumber(formEl) {
    return !isNaN(formEl.value)
  }

  areValuesNumbers(...formElements) {
    return [...formElements].every(element => this.isValueANumber(element))
  }

  isFieldFilled(formEl) {
    return formEl.value !== ''
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
    return fieldsArr.every(field => this.isFieldFilled(field)
    )
  }

  returnError(message) {
    console.log(message)
  }

  isValidEmail(emailAddress) {
    return /^\S+@\S+\.\S+$/.test(emailAddress)
  }

  hasLetterSpaceDash(myString) {
    return /^[a-z\s\-]+$/i.test(myString);
  }

  hasEnoughWords(string, nWords) {
    return string.split(' ').length >= nWords
  }

  capitFirstLetters(string) {
    const splitArr = string.includes('-') ? string.toLowerCase().split('-') : string.toLowerCase().split(' ');
    const temporaryArr = [];
    splitArr.forEach(word => {
      if (word !== '') {
        temporaryArr.push(word.replace(word[0], word[0].toUpperCase()));
      }
    })
    const lastArr = string.includes('-') ? temporaryArr.join('-') : temporaryArr.join(' ')
    return lastArr
  }
}
