/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import { By } from 'selenium-webdriver'
import dropdownComponent from './dropdown.component'
import { generateDropdownGroup } from '../../common-tools/common-tools'

module.exports = function(comboBoxRoot, newClassLocator = false) {
  const element = {}
  element.root = By.css(comboBoxRoot)

  if (newClassLocator){
    element.dropdown = dropdownComponent(
      generateDropdownGroup(
        `${comboBoxRoot} .form-field-combobox__select`,
        '.form-field-combobox__select-header',
        '.form-field-combobox__dropdown .form-field-combobox__dropdown-list-option',
        '',
        false
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

    element.inputField = By.css(`${comboBoxRoot} .form-field-combobox__input`)
    element.warningHint = By.css(`${comboBoxRoot} .form-field__warning`)
    element.warningText = By.css('.tooltip__warning')
  }
  else{
    element.dropdown = dropdownComponent(
      generateDropdownGroup(
        `${comboBoxRoot} .combobox-select`,
        '.combobox-select__header',
        '.combobox-select__body .combobox-list .combobox-list__option',
        false,
        false
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
  }

  return element
}
