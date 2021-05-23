import { By } from 'selenium-webdriver'

module.exports = function(menuStructure) {
  return {
    open_button: By.css(
      `${menuStructure.root} ${menuStructure.menuElements.open_button}`
    ),
    options: By.css(
      `${menuStructure.root} ${menuStructure.menuElements.options}`
    ),
    option: function(index) {
      return By.css(
        `${menuStructure.root} ${menuStructure.menuElements.options}:nth-of-type(${index})`
      )
    }
  }
}
