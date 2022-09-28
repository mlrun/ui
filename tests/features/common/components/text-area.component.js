import { By } from 'selenium-webdriver'

module.exports = function (textAreaStructure) {
  const element = {}
  element.root = By.css(textAreaStructure.root)
  element.inputField = By.css(`${textAreaStructure.root} ${textAreaStructure.elements.input}`)

  if (textAreaStructure.elements.label) {
    element.inputLabel = By.css(`${textAreaStructure.root} ${textAreaStructure.elements.label}`)
  }

  element.counter =  By.css(`${textAreaStructure.root} ${textAreaStructure.elements.counter}`)
  element.warningHint = By.css(`${textAreaStructure.root} ${textAreaStructure.elements.warningHint}`)
  element.warningText = By.css(`${textAreaStructure.elements.warningText}`)

  return element
}
