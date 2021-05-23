import { By } from 'selenium-webdriver'

module.exports = function(radiobuttonStructure) {
  const element = {}
  element.root = By.css(radiobuttonStructure.root)
  element.radiobutton = By.css(
    `${radiobuttonStructure.root} ${radiobuttonStructure.elements.radiobutton}`
  )
  if (radiobuttonStructure.elements.mark) {
    element.mark = By.css(
      `${radiobuttonStructure.root} ${radiobuttonStructure.elements.mark}`
    )
  }
  if (radiobuttonStructure.elements.name) {
    element.name = By.css(
      `${radiobuttonStructure.root} ${radiobuttonStructure.elements.name}`
    )
  }
  if (radiobuttonStructure.elements.description) {
    element.description = By.css(
      `${radiobuttonStructure.root} ${radiobuttonStructure.elements.description}`
    )
  }
  return element
}
