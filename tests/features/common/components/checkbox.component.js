import { By } from 'selenium-webdriver'

module.exports = function(checkboxStructure) {
  const element = {}
  element.root = By.css(checkboxStructure.root)
  element.checkbox = By.css(
    `${checkboxStructure.root} ${checkboxStructure.elements.checkbox}`
  )
  if (checkboxStructure.elements.name) {
    element.inputLabel = By.css(
      `${checkboxStructure.root} ${checkboxStructure.elements.name}`
    )
  }
  if (checkboxStructure.elements.icon) {
    element.hintButton = By.css(
      `${checkboxStructure.root} ${checkboxStructure.elements.icon}`
    )
  }
  return element
}
