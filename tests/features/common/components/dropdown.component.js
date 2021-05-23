import { By } from 'selenium-webdriver'
import { locatorBuilder } from '../../common-tools/common-tools'

module.exports = function(dropdownStructure) {
  const open_button = locatorBuilder`${0} ${1}`
  const options = locatorBuilder`${0} ${1} ${2}`
  const option = locatorBuilder`${0} ${1}:nth-of-type(${2}) ${3}`
  return {
    root: By.css(dropdownStructure.root),
    open_button: By.css(
      open_button(
        dropdownStructure.root,
        dropdownStructure.dropdownElements.open_button
      )
    ),
    options: By.css(
      options(
        dropdownStructure.root,
        dropdownStructure.dropdownElements.options,
        dropdownStructure.dropdownElements.option_name
      )
    ),
    option: function(index) {
      return By.css(
        option(
          dropdownStructure.root,
          dropdownStructure.dropdownElements.options,
          index,
          dropdownStructure.dropdownElements.option_name
        )
      )
    }
  }
}
