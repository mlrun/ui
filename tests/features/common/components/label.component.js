import { By } from 'selenium-webdriver'

module.exports = function(labelStructure) {
  const element = {}
  element.root = By.css(labelStructure.root)
  element.label = By.css(
    `${labelStructure.root} ${labelStructure.elements.label}`
  )
  if (labelStructure.elements.hintButton) {
    element.hintButton = By.css(
      `${labelStructure.root} ${labelStructure.elements.hintButton}`
    )
  }
  if (labelStructure.elements.hint) {
    element.hint = By.css(
      `${labelStructure.root} ${labelStructure.elements.hint}`
    )
  }
  return element
}
