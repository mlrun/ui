import { By } from 'selenium-webdriver'
import dropdownComponent from './dropdown.component'
import { generateDropdownGroup } from '../../common-tools/common-tools'

module.exports = function(comboBoxRoot) {
  const element = {}
  element.root = By.css(comboBoxRoot)

  element.dropdown = dropdownComponent(
    generateDropdownGroup(
      `${comboBoxRoot} .combobox-select`,
      '.combobox-select__header',
      '.combobox-select__body .combobox-list .combobox-list__option',
      '',
      true
    )
  )

  element.comboDropdown = dropdownComponent(
    generateDropdownGroup(
      `${comboBoxRoot} .combobox-dropdown`,
      '.combobox-input',
      '.combobox-dropdown__list .combobox-list__option',
      '',
      true
    )
  )
  element.comboDropdown.inputField = By.css(
    `${comboBoxRoot} .combobox-dropdown__search-input`
  )

  element.inputField = By.css(`${comboBoxRoot} .combobox-input`)
  element.warningHint = By.css(`${comboBoxRoot} .combobox-warning`)
  element.warningText = By.css('.tooltip__warning')

  return element
}
