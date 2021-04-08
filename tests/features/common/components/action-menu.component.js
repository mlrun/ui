import { By } from 'selenium-webdriver'

module.exports = function(rootLocator) {
  return {
    open_button: By.css(rootLocator + ' button'),
    options: By.css(
      rootLocator + ' div.actions-menu__container div.actions-menu__option'
    ),
    option: function(index) {
      return By.css(
        rootLocator +
          ' div.actions-menu__container div.actions-menu__option:nth-of-type(' +
          index +
          ')'
      )
    }
  }
}
