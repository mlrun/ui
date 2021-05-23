import { By } from 'selenium-webdriver'

module.exports = function(inputStructure) {
  const element = {}
  element.root = By.css(inputStructure.root)
  element.inputField = By.css(
    `${inputStructure.root} ${inputStructure.elements.input}`
  )
  if (inputStructure.elements.label) {
    element.inputLabel = By.css(
      `${inputStructure.root} ${inputStructure.elements.label}`
    )
  }
  if (inputStructure.elements.hint) {
    element.hintButton = By.css(
      `${inputStructure.root} ${inputStructure.elements.hint}`
    )
  }
  if (inputStructure.elements.hint_text) {
    element.hintText = By.css(
      `${inputStructure.root} ${inputStructure.elements.hint_text}`
    )
  }
  if (inputStructure.elements.warningHint) {
    element.warningHint = By.css(
      `${inputStructure.root} ${inputStructure.elements.warningHint}`
    )
    element.warningText = By.css(
      `${inputStructure.root} ${inputStructure.elements.warningText}`
    )
  }
  return element
}
