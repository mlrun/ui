import { By } from 'selenium-webdriver'

module.exports = function(labelStructure) {
  const element = {}
  element.root = By.css(labelStructure.root)
  element.label = By.css(
    `${labelStructure.root} ${labelStructure.elements.label}`
  )
  if (labelStructure.elements.hint) {
    element.hintButton = By.css(
      `${labelStructure.root} ${labelStructure.elements.hint}`
    )
  }
  return element
}
