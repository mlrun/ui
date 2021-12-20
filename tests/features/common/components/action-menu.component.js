import { By } from 'selenium-webdriver'

module.exports = function(menuStructure) {
  return {
    root: By.css(menuStructure.root),
    open_button: By.css(
      `${menuStructure.root} ${menuStructure.menuElements.open_button}`
    ),
    options: By.css(
      // `${menuStructure.root} ${menuStructure.menuElements.options}`
      `${menuStructure.menuElements.options}`
    ),
    option: function(index) {
      return By.css(
        // `${menuStructure.root} ${menuStructure.menuElements.options}:nth-of-type(${index})`
        `${menuStructure.menuElements.options}:nth-of-type(${index})`
      )
    }
  }
}
