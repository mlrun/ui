import { By } from 'selenium-webdriver'
import { locatorBuilder } from '../../common-tools/common-tools'

module.exports = function(dropdownStructure) {
  let open_button = locatorBuilder`${0} ${1}`
  let options = locatorBuilder`${0} ${1}:nth-of-type(${2})`
  return {
    open_button: By.css(
      open_button(
        dropdownStructure.root,
        dropdownStructure.dropdownElements.open_button
      )
    ),
    options: By.css(
      open_button(
        dropdownStructure.root,
        dropdownStructure.dropdownElements.options
      )
    ),
    option: function(index) {
      return By.css(
        options(
          dropdownStructure.root,
          dropdownStructure.dropdownElements.options,
          index
        )
      )
    }
  }
}
