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
import { Given, When, Then } from '@cucumber/cucumber'
import pageObjects from '../common/page-objects'
import pageObjectsConsts from '../common-tools/common-consts'
import { test_url, test_port } from '../../config'
import {
  clickNearComponent,
  clickOnComponent,
  collapseAccordionSection,
  componentIsNotPresent,
  componentIsNotVisible,
  componentIsPresent,
  componentIsVisible,
  expandAccordionSection,
  hoverComponent,
  isAccordionSectionCollapsed,
  isComponentContainsAttributeValue,
  navigateBack,
  navigateForward,
  navigateToPage,
  refreshPage,
  verifyComponentContainsAttributeValue,
  verifyComponentNotContainsAttributeValue,
  verifyElementDisabled,
  verifyElementEnabled,
  verifyText,
  verifyTextRegExp,
  waitPageLoad,
  waiteUntilComponent,
  verifyElementActive,
  verifyElementNotActive,
  generatePath,
  determineFileAccess,
  verifyClassDisabled
} from '../common/actions/common.action'
import {
  checkTableColumnValues,
  findRowIndexesByColumnValue,
  isTableColumnSorted
} from '../common/actions/table.action'
import {
  checkDropdownContainsOptions,
  checkDropdownOptions,
  checkDropdownSelectedOption,
  openDropdown,
  selectOptionInDropdown,
  selectOptionInDropdownWithoutCheck
} from '../common/actions/dropdown.action'
import { isTabActive } from '../common/actions/tab-selector.action'
import {
  checkHintText,
  checkInputAccordingHintText,
  checkWarningHintText,
  checkWarningText,
  getInputValue,
  typeValue,
  typeValueWithoutInputgroup,
  verifyInputDisabled,
  verifyInputClassDisabled,
  verifyInputEnabled,
  verifyInputClassEnabled,
  verifyTypedValue,
  verifyTypedValueWithoutInputgroup,
  verifyTextAreaCounter
} from '../common/actions/input-group.action'
import { incrementValue, decrementValue } from '../common/actions/number-input-group.action'
import {
  checkCheckbox,
  isCheckboxChecked,
  isCheckboxUnchecked,
  uncheckCheckbox,
  verifyCheckboxEnabled,
  verifyCheckboxDisabled
} from '../common/actions/checkbox.action'
import {
  applyDatetimePickerRange,
  pickUpCustomDatetimeRange,
  verifyTimeFilterBand
} from '../common/actions/date-picker.action'
import {
  isContainsSubstringInSuggestedOptions,
  typeSearchableValue
} from '../common/actions/input-with-autocomplete.action'
import { checkNodesConnectionsNPandas } from '../common/actions/graph.action'
import {
  isRadioButtonSelected,
  isRadioButtonUnselected,
  selectRadiobutton
} from '../common/actions/radio-button.action'
import { 
  openActionMenu, 
  selectOptionInActionMenu,
  verifyOptionInActionMenuEnabled,
  verifyOptionInActionMenuDisabled 
} from '../common/actions/action-menu.action'
import { expect } from 'chai'

Given('open url', async function() {
  await navigateToPage(this.driver, `http://${test_url}:${test_port}`)
})

/*
   Changes Log:
  turning on demo mode by URL param check of `demo=true` has been deprecated.

  Now: `demo` flag replaced with `mode` flag that can be set with either 2 modes
  - `mode=demo` = Not ready for production or testing (Missing UI or BE). shows all the code for staging + demo
  - `mode=staging` = When ready for testing but not for production. Specific for staging
  once `mode` flag (URL param) is passed, it is saved to localStorage and check is done NOW by localStorage `mode` value

  ** TODO **
  1. Change `demo=true` to `mode=demo` in 'turn on demo mode' test case and adjust test cases
  2. Create another test cases for "turn on staging mode" with `mode=staging`

*/

When('turn on demo mode', async function() {
  const url = await this.driver.getCurrentUrl()
  await navigateToPage(this.driver, `${url}?mode=demo`)
})

When('turn on staging mode', async function() {
  const url = await this.driver.getCurrentUrl()
  await navigateToPage(this.driver, `${url}?mode=staging`)
})

Then('additionally redirect by INVALID-TAB', async function() {
  const beforeURL = await this.driver.getCurrentUrl()
  const urlNodesArr = beforeURL.split('/')
  const invalidTab = beforeURL.replace(
    urlNodesArr[urlNodesArr.length - 1],
    'INVALID-TAB'
  )
  await navigateToPage(this.driver, `${invalidTab}`)
  const afterURL = await this.driver.getCurrentUrl()
  expect(beforeURL).equal(
    afterURL,
    `Redirection from "${beforeURL}/INVALID-TAB"\nshould be "${beforeURL}"\nbut is "${afterURL}"`
  )
})

Then(
  'verify redirection from {string} to {string}',
  async function (invalidPath, expectedPath) {
    const invalidUrl = `http://${test_url}:${test_port}/${invalidPath}`
    const expectedUrl = `http://${test_url}:${test_port}/${expectedPath}`

    await navigateToPage(this.driver, invalidUrl)
    await this.driver.sleep(250)
    const afterURL = await this.driver.getCurrentUrl()

    expect(expectedUrl).equal(
      afterURL,
      `Redirection from "${invalidUrl}"\nshould be "${expectedUrl}"\nbut is "${afterURL}"`
    )
  }
)

Then(
  'verify redirection to {string}',
  async function (expectedPath) {
    const expectedUrl = `http://${test_url}:${test_port}/${expectedPath}`
    const afterURL = await this.driver.getCurrentUrl()

    expect(expectedUrl).equal(
      afterURL,
      `Redirection should be "${expectedUrl}"\nbut is "${afterURL}"`
    )
  }
)

Then('wait load page', async function() {
  await waitPageLoad(this.driver, pageObjects['commonPagesHeader']['loader'])
  await this.driver.sleep(500)
})

Then('navigate forward', async function() {
  await navigateForward(this.driver)
  await waitPageLoad(this.driver, pageObjects['commonPagesHeader']['loader'])
  await this.driver.sleep(500)
})

Then('navigate back', async function() {
  await navigateBack(this.driver)
  await waitPageLoad(this.driver, pageObjects['commonPagesHeader']['loader'])
  await this.driver.sleep(500)
})

Then('refresh a page', async function() {
  await refreshPage(this.driver)
  await waitPageLoad(this.driver, pageObjects['commonPagesHeader']['loader'])
  await this.driver.sleep(250)
})

Then('click on {string} element on {string} wizard', async function(
  component,
  wizard
) {
  await waiteUntilComponent(this.driver, pageObjects[wizard][component])
  await clickOnComponent(this.driver, pageObjects[wizard][component])
  await this.driver.sleep(250)
})

Then('click on breadcrumbs {string} label on {string} wizard', async function(
  labelType,
  wizard
) {
  await waiteUntilComponent(this.driver, pageObjects[wizard]['Breadcrumbs'][`${labelType}Label`])
  await clickOnComponent(this.driver, pageObjects[wizard]['Breadcrumbs'][`${labelType}Label`])
  await this.driver.sleep(250)
})

Then('verify if {string} popup dialog appears', async function(popup) {
  await waiteUntilComponent(this.driver, pageObjects[popup]['Title'])
  await this.driver.sleep(500)
  await componentIsPresent(this.driver, pageObjects[popup]['Title'])
  await this.driver.sleep(500)
  await componentIsVisible(this.driver, pageObjects[popup]['Title'])
})

Then(
  'type into {string} on {string} popup dialog {string} value',
  async function(component, wizard, value) {
    await typeValue(this.driver, pageObjects[wizard][component], value)
    await verifyTypedValue(this.driver, pageObjects[wizard][component], value)
  }
)

Then('type value {string} to {string} field on {string} wizard', async function(
  value,
  inputField,
  wizard
) {
  await typeValue(this.driver, pageObjects[wizard][inputField], value)
  await this.driver.sleep(250)
  await verifyTypedValue(this.driver, pageObjects[wizard][inputField], value)
  await this.driver.sleep(250)
})

Then('type value {string} to {string} field on {string} wizard without inputgroup', async function(
  value,
  inputField,
  wizard
) {
  await typeValueWithoutInputgroup(this.driver, pageObjects[wizard][inputField], value)
  await this.driver.sleep(250)
  await verifyTypedValueWithoutInputgroup(this.driver, pageObjects[wizard][inputField], value)
  await this.driver.sleep(250)
})

Then(
  'verify {string} element on {string} wizard is enabled',
  async function (elementName, wizardName) {
    await verifyElementEnabled(this.driver, pageObjects[wizardName][elementName])
  }
)

Then(
  'verify {string} not input element in {string} on {string} wizard is enabled',
  async function (elementName, accordionName, wizardName) {
    await verifyElementEnabled(this.driver, pageObjects[wizardName][accordionName][elementName])
  }
)

Then(
  'verify {string} not input element on {string} wizard is active',
  async function (elementName, wizardName) {
    await verifyElementActive(this.driver, pageObjects[wizardName][elementName])
  }
)

Then(
  'verify {string} not input element on {string} wizard is NOT active',
  async function (elementName, wizardName) {
    await verifyElementNotActive(this.driver, pageObjects[wizardName][elementName])
  }
)

Then(
  'verify {string} not input element in {string} on {string} wizard is active',
  async function (elementName, accordionName, wizardName) {
    await verifyElementActive(this.driver, pageObjects[wizardName][accordionName][elementName])
  }
)

Then(
  'verify {string} not input element in {string} on {string} wizard is NOT active',
  async function (elementName, accordionName, wizardName) {
    await verifyElementNotActive(this.driver, pageObjects[wizardName][accordionName][elementName])
  }
)

Then(
  'verify {string} element on {string} wizard is disabled',
  async function (elementName, wizardName) {
    await verifyElementDisabled(this.driver, pageObjects[wizardName][elementName])
  }
)

Then(
  'verify {string} not input element in {string} on {string} wizard is disabled',
  async function (elementName, accordionName, wizardName) {
    await verifyElementDisabled(this.driver, pageObjects[wizardName][accordionName][elementName])
  }
)

Then(
  'verify checkbox {string} element on {string} wizard is enabled',
  async function (elementName, wizardName) {
    await verifyCheckboxEnabled(this.driver, pageObjects[wizardName][elementName])
  }
)

Then(
  'verify checkbox {string} element on {string} wizard is disabled',
  async function (elementName, wizardName) {
    await verifyCheckboxDisabled(this.driver, pageObjects[wizardName][elementName])
  }
)

Then(
  'verify {string} element in {string} on {string} wizard is enabled',
  async function(inputField, accordionName, wizardName) {
    await verifyInputEnabled(
      this.driver,
      pageObjects[wizardName][accordionName][inputField]
    )
  }
)

Then(
  'verify {string} element in {string} on {string} wizard is enabled by class name',
  async function(inputField, accordionName, wizardName) {
    await verifyInputClassEnabled(
      this.driver,
      pageObjects[wizardName][accordionName][inputField]
    )
  }
)

Then(
  'verify {string} element in {string} on {string} wizard is disabled',
  async function(inputField, accordionName, wizardName) {
    await verifyInputDisabled(
      this.driver,
      pageObjects[wizardName][accordionName][inputField]
    )
  }
)

Then(
  'verify {string} element in {string} on {string} wizard is disabled by class name',
  async function(inputField, accordionName, wizardName) {
    await verifyInputClassDisabled(
      this.driver,
      pageObjects[wizardName][accordionName][inputField]
    )
  }
)

Then(
  'verify {string} element on {string} wizard is disabled by class name',
  async function(inputField, wizardName) {
    await verifyClassDisabled(
      this.driver,
      pageObjects[wizardName][inputField]
    )
  }
)

When(
  'type searchable fragment {string} into {string} on {string} wizard',
  async function(subName, inputGroup, wizard) {
    await typeSearchableValue(
      this.driver,
      pageObjects[wizard][inputGroup],
      subName
    )
  }
)

When(
  'type searchable fragment {string} into {string} combobox input in {string} on {string} wizard',
  async function(subName, combobox, accordion, wizard) {
    await typeSearchableValue(
      this.driver,
      pageObjects[wizard][accordion][combobox]['comboDropdown'],
      subName
    )
  }
)

Then(
  'searchable case {string} fragment {string} should be in every suggested option into {string} on {string} wizard',
  async function(textCase, subName, inputGroup, wizard) {
    await this.driver.sleep(1000)
    await isContainsSubstringInSuggestedOptions(
      this.driver,
      pageObjects[wizard][inputGroup],
      subName,
      textCase === 'insensitive'
    )
  }
)

Then(
  'searchable fragment {string} should be in every suggested option into {string} combobox input in {string} on {string} wizard',
  async function(subName, combobox, accordion, wizard) {
    await this.driver.sleep(200)
    await isContainsSubstringInSuggestedOptions(
      this.driver,
      pageObjects[wizard][accordion][combobox]['comboDropdown'],
      subName
    )
  }
)

Then(
  'increase value on {int} points in {string} field on {string} on {string} wizard',
  async function(value, inputField, accordion, wizard) {
    const txt = await getInputValue(
      this.driver,
      pageObjects[wizard][accordion][inputField]
    )
    const result = Number.parseInt(txt) + value
    await incrementValue(
      this.driver,
      pageObjects[wizard][accordion][inputField],
      value
    )
    await verifyTypedValue(
      this.driver,
      pageObjects[wizard][accordion][inputField],
      result.toString()
    )
  }
)

Then(
  'increase value on {int} points in {string} field on {string} wizard',
  async function(value, inputField, wizard) {
    const txt = await getInputValue(
      this.driver,
      pageObjects[wizard][inputField]
    )
    const result = Number.parseInt(txt) + value
    await incrementValue(
      this.driver,
      pageObjects[wizard][inputField],
      value
    )
    await verifyTypedValue(
      this.driver,
      pageObjects[wizard][inputField],
      result.toString()
    )
  }
)

Then(
    'increase value on {int} points in {string} field with {string} on {string} on {string} wizard',
    async function(value, inputField, unit, accordion, wizard) {
        const txt = await getInputValue(
            this.driver,
            pageObjects[wizard][accordion][inputField]
        )
        const unitValue = unit === 'cpu' ? value / 1000 : unit === 'millicpu' ? value * 100 : value
        let result = Number.parseFloat(txt || '0') + unitValue
        if (unit === 'cpu') {
          return result.toFixed(3)
        }
        await incrementValue(
            this.driver,
            pageObjects[wizard][accordion][inputField],
            value
        )
        await verifyTypedValue(
            this.driver,
            pageObjects[wizard][accordion][inputField],
            result.toString()
        )
    }
)

Then(
  'decrease value on {int} points in {string} field on {string} on {string} wizard',
  async function(value, inputField, accordion, wizard) {
    const txt = await getInputValue(
      this.driver,
      pageObjects[wizard][accordion][inputField]
    )
    const result = Number.parseInt(txt) - value
    await decrementValue(
      this.driver,
      pageObjects[wizard][accordion][inputField],
      value
    )
    await verifyTypedValue(
      this.driver,
      pageObjects[wizard][accordion][inputField],
      result.toString()
    )
  }
)

Then(
  'decrease value on {int} points in {string} field on {string} wizard',
  async function(value, inputField, wizard) {
    const txt = await getInputValue(
      this.driver,
      pageObjects[wizard][inputField]
    )
    const result = Number.parseInt(txt) - value
    await decrementValue(
      this.driver,
      pageObjects[wizard][inputField],
      value
    )
    await verifyTypedValue(
      this.driver,
      pageObjects[wizard][inputField],
      result.toString()
    )
  }
)

Then(
  'decrease value on {int} points in {string} field with {string} on {string} on {string} wizard',
  async function (value, inputField, unit, accordion, wizard) {
    const txt = await getInputValue(this.driver, pageObjects[wizard][accordion][inputField])
    const unitValue = unit === 'cpu' ? value / 1000 : unit === 'millicpu' ? value * 100 : value
    let result = Number.parseFloat(txt) - unitValue
    if (unit === 'cpu') {
      return result.toFixed(3)
    }
    else if (unit !== 'cpu' && result < 1) {
      result = 1
    }
    await decrementValue(this.driver, pageObjects[wizard][accordion][inputField], value)
    await verifyTypedValue(
      this.driver,
      pageObjects[wizard][accordion][inputField],
      result.toString()
    )
  }
)

Then(
  'type value {string} to {string} field on {string} on {string} wizard',
  async function(value, inputField, accordion, wizard) {
    await typeValue(
      this.driver,
      pageObjects[wizard][accordion][inputField],
      value
    )
    await verifyTypedValue(
      this.driver,
      pageObjects[wizard][accordion][inputField],
      value
    )
  }
)

Then(
  '{string} component on {string} should contains {string}.{string}',
  async function(component, wizard, constStorage, constValue) {
    await waiteUntilComponent(this.driver, pageObjects[wizard][component])
    await verifyText(
      this.driver,
      pageObjects[wizard][component],
      pageObjectsConsts[constStorage][constValue]
    )
  }
)

Then(
  '{string} element on {string} should contains {string} value',
  async function(component, wizard, value) {
    await verifyText(this.driver, pageObjects[wizard][component], value)
  }
)

Then(
  '{string} element in {string} on {string} should contains {string} value',
  async function(component, accordion, wizard, value) {
    await verifyText(
      this.driver,
      pageObjects[wizard][accordion][component],
      value
    )
  }
)

Then(
  '{string} element in {string} on {string} should contains {string} attribute value',
  async function (component, accordion, wizard, value) {
    await verifyComponentContainsAttributeValue(
      this.driver,
      pageObjects[wizard][accordion][component]['inputField'],
      'value',
      value
    )
  }
)

Then(
  '{string} component on {string} should be equal {string}.{string}',
  async function(component, wizard, constStorage, constValue) {
    await verifyTextRegExp(
      this.driver,
      pageObjects[wizard][component],
      pageObjectsConsts[constStorage][constValue]
    )
  }
)

Then(
  '{string} component in {string} on {string} should contains {string}.{string}',
  async function(component, accordion, wizard, constStorage, constValue) {
    await waiteUntilComponent(
      this.driver,
      pageObjects[wizard][accordion][component]
    )
    await verifyText(
      this.driver,
      pageObjects[wizard][accordion][component],
      pageObjectsConsts[constStorage][constValue]
    )
  }
)

When(
  'select {string} option in {string} dropdown on {string} wizard',
  async function(optionValue, dropdownName, wizardName) {
    await openDropdown(this.driver, pageObjects[wizardName][dropdownName])
    await selectOptionInDropdown(
      this.driver,
      pageObjects[wizardName][dropdownName],
      optionValue
    )
    await this.driver.sleep(500)
  }
)

When(
  'select {string} option in {string} dropdown on {string} on {string} wizard',
  async function(optionValue, dropdownName, accordionName, wizardName) {
    await openDropdown(
      this.driver,
      pageObjects[wizardName][accordionName][dropdownName]
    )
    await selectOptionInDropdown(
      this.driver,
      pageObjects[wizardName][accordionName][dropdownName],
      optionValue
    )
    await this.driver.sleep(500)
    await checkDropdownSelectedOption(
      this.driver,
      pageObjects[wizardName][accordionName][dropdownName],
      optionValue
    )
  }
)

Then(
  'verify {string} dropdown on {string} wizard selected option value {string}',
  async function(dropdownName, wizardName, optionValue) {
    await checkDropdownSelectedOption(
      this.driver,
      pageObjects[wizardName][dropdownName],
      optionValue
    )
  }
)

Then(
  'verify {string} dropdown in {string} on {string} wizard selected option value {string}',
  async function(dropdownName, accordionName, wizardName, optionValue) {
    await checkDropdownSelectedOption(
      this.driver,
      pageObjects[wizardName][accordionName][dropdownName],
      optionValue
    )
  }
)

When(
  'select {string} option in {string} filter dropdown on {string} wizard',
  async function(optionValue, dropdownName, wizardName) {
    await openDropdown(this.driver, pageObjects[wizardName][dropdownName])
    await selectOptionInDropdownWithoutCheck(
      this.driver,
      pageObjects[wizardName][dropdownName],
      optionValue
    )
  }
)

Then(
  'verify {string} filter band in {string} filter dropdown on {string} wizard',
  async function(optionValue, dropdownName, wizardName) {
    await verifyTimeFilterBand(
      this.driver,
      pageObjects[wizardName][dropdownName],
      pageObjectsConsts[wizardName][optionValue]
    )
  }
)

When(
  'pick up {string} from {string} to {string} in {string} via {string} on {string} wizard',
  async function(
    optionValue,
    fromDatetime,
    toDatetime,
    datetimePicker,
    dropdownName,
    wizardName
  ) {
    await openDropdown(this.driver, pageObjects[wizardName][dropdownName])
    await selectOptionInDropdownWithoutCheck(
      this.driver,
      pageObjects[wizardName][dropdownName],
      optionValue
    )
    await this.driver.sleep(100)
    await pickUpCustomDatetimeRange(
      this.driver,
      pageObjects[wizardName][datetimePicker],
      fromDatetime,
      toDatetime
    )
    await applyDatetimePickerRange(
      this.driver,
      pageObjects[wizardName][datetimePicker]
    )
  }
)

Then(
  'verify from {string} to {string} filter band in {string} filter dropdown on {string} wizard',
  async function(fromDatetime, toDatetime, dropdownName, wizardName) {
    await verifyTimeFilterBand(
      this.driver,
      pageObjects[wizardName][dropdownName],
      Date.parse(toDatetime) - Date.parse(fromDatetime)
    )
  }
)

Then(
  'verify error message in {string} on {string} wizard with value {string}.{string}',
  async function(datetimePicker, wizard, constStorage, constValue) {
    await verifyText(
      this.driver,
      pageObjects[wizard][datetimePicker].errorMessage,
      pageObjectsConsts[constStorage][constValue]
    )
  }
)

Then(
  'verify {string} element in {string} on {string} wizard should contains {string}.{string}',
  async function(dropdown, accordion, wizard, constStorage, constValue) {
    await openDropdown(this.driver, pageObjects[wizard][accordion][dropdown])
    await checkDropdownOptions(
      this.driver,
      pageObjects[wizard][accordion][dropdown],
      pageObjectsConsts[constStorage][constValue]
    )
    // close dropdown options
    await clickNearComponent(
      this.driver,
      pageObjects[wizard][accordion][dropdown]['open_button']
    )
  }
)

Then(
  'verify {string} dropdown element on {string} wizard should contains {string}.{string}',
  async function(dropdownName, wizardName, constStorage, constValue) {
    await openDropdown(this.driver, pageObjects[wizardName][dropdownName])
    await checkDropdownContainsOptions(
      this.driver,
      pageObjects[wizardName][dropdownName],
      pageObjectsConsts[constStorage][constValue]
    )
    await clickNearComponent(
      this.driver,
      pageObjects[wizardName][dropdownName]['open_button']
    )
  }
)

Then('verify {string} element visibility on {string} wizard', async function(
  component,
  wizard
) {
  await componentIsVisible(this.driver, pageObjects[wizard][component])
})

Then('verify {string} element invisibility on {string} wizard', async function(
  component,
  wizard
) {
  await componentIsNotVisible(this.driver, pageObjects[wizard][component])
})

Then(
  'verify {string} element visibility in {string} on {string} wizard',
  async function(component, accordion, wizard) {
    await componentIsVisible(
      this.driver,
      pageObjects[wizard][accordion][component]
    )
  }
)

Then('verify {string} element not exists on {string} wizard', async function(
  component,
  wizard
) {
  await componentIsNotPresent(this.driver, pageObjects[wizard][component])
})

Then('verify {string} element not exists in {string} on {string} wizard', async function(
  component,
  accordion,
  wizard
) {
  await componentIsNotPresent(this.driver, pageObjects[wizard][accordion][component])
})

When('collapse {string} on {string} wizard', async function(accordion, wizard) {
  await collapseAccordionSection(
    this.driver,
    pageObjects[wizard][accordion]['Collapse_Button']
  )
  await this.driver.sleep(100)
})

When('expand {string} on {string} wizard', async function(accordion, wizard) {
  await expandAccordionSection(
    this.driver,
    pageObjects[wizard][accordion]['Collapse_Button']
  )
  await this.driver.sleep(100)
})

Then('verify {string} is collapsed on {string} wizard', async function(
  accordion,
  wizard
) {
  await isAccordionSectionCollapsed(
    this.driver,
    pageObjects[wizard][accordion]['Collapse_Button']
  )
})

Then('sort projects in ascending order', async function() {
  const upSorted = await isComponentContainsAttributeValue(
    this.driver,
    pageObjects['Projects']['Projects_Sorter'],
    'class',
    'sort_up'
  )
  if (!upSorted) {
        await clickOnComponent(
            this.driver,
            pageObjects['Projects']['Projects_Sorter']
        )
  }
  if (upSorted) {
    await isTableColumnSorted(
      this.driver,
      pageObjects['Projects']['Projects_Table'],
      'name'
    )
  }
})

Then('sort projects in descending order', async function() {
  const downSorted = await isComponentContainsAttributeValue(
    this.driver,
    pageObjects['Projects']['Projects_Sorter'],
    'class',
    'sort_down'
  )
  if (!downSorted) {
    await clickOnComponent(
      this.driver,
      pageObjects['Projects']['Projects_Sorter']
    )
  }
  await isTableColumnSorted(
    this.driver,
    pageObjects['Projects']['Projects_Table'],
    'name',
    'desc'
  )
})

Then(
  'verify {string} tab is active in {string} on {string} wizard',
  async function(tabName, tabSelector, wizard) {
    const arr = await findRowIndexesByColumnValue(
      this.driver,
      pageObjects[wizard][tabSelector],
      'key',
      tabName
    )
    const indx = arr[0]
    
    await isTabActive(this.driver, pageObjects[wizard][tabSelector], indx)
  }
)

Then(
  'verify {string} on {string} wizard should contains {string}.{string}',
  async function(tabSelector, wizard, constWizard, constValue) {
    await checkTableColumnValues(
      this.driver,
      pageObjects[wizard][tabSelector],
      'key',
      pageObjectsConsts[constWizard][constValue]
    )
  }
)

When('select {string} tab in {string} on {string} wizard', async function(
  tabName,
  tabSelector,
  wizard
) {
  const arr = await findRowIndexesByColumnValue(
    this.driver,
    pageObjects[wizard][tabSelector],
    'key',
    tabName
  )
  const indx = arr[0]
  await clickOnComponent(
    this.driver,
    pageObjects[wizard][tabSelector]['tableFields']['key'](indx)
  )
})

Then(
  'verify {string} on {string} wizard should display {string}.{string}',
  async function(inputField, wizard, constStorage, constValue) {
    await checkHintText(
      this.driver,
      pageObjects[wizard][inputField],
      pageObjects['commonPagesHeader']['Common_Hint'],
      pageObjectsConsts[constStorage][constValue]
    )
  }
)

Then(
  'verify {string} on {string} wizard should display {string}.{string} in {string}',
  async function(inputField, wizard, constStorage, constValue, commonTipType) {
    await checkHintText(
      this.driver,
      pageObjects[wizard][inputField],
      pageObjects['commonPagesHeader'][commonTipType],
      pageObjectsConsts[constStorage][constValue]
    )
  }
)

Then(
  'verify {string} on {string} wizard should display options {string}.{string}',
  async function(inputField, wizard, constStorage, constValue) {
    await checkWarningHintText(
      this.driver,
      pageObjects[wizard][inputField],
      pageObjects['commonPagesHeader']['Common_Options'],
      pageObjectsConsts[constStorage][constValue]
    )
  }
)

Then(
  'verify labels warning should display options {string}.{string}',
  async function(constStorage, constValue) {
    await checkWarningText(
      this.driver,
      pageObjects['commonPagesHeader']['Common_Options'],
      pageObjectsConsts[constStorage][constValue]
    )
  }
)

Then(
    'verify {string} in {string} on {string} wizard should display options {string}.{string}',
    async function(inputField, accordion, wizard, constStorage, constValue) {
        await checkWarningHintText(
            this.driver,
            pageObjects[wizard][accordion][inputField],
            pageObjects['commonPagesHeader']['Common_Options'],
            pageObjectsConsts[constStorage][constValue]
        )
    }
)

Then(
  'verify {string} element in {string} on {string} wizard should display hint {string}.{string}',
  async function(inputField, accordion, wizard, constStorage, constValue) {
    await checkHintText(
      this.driver,
      pageObjects[wizard][accordion][inputField],
      pageObjects['commonPagesHeader']['Common_Hint'],
      pageObjectsConsts[constStorage][constValue]
    )
  }
)

Then(
  'verify {string} on {string} wizard should display warning {string}.{string}',
  async function(input, wizard, constStorage, constValue) {
    await clickOnComponent(
      this.driver,
      pageObjects[wizard][input]['inputField']
    )
    await this.driver.sleep(100)
    await hoverComponent(
      this.driver,
      pageObjects[wizard][input]['inputField'],
      false
    )
    await checkWarningHintText(
      this.driver,
      pageObjects[wizard][input],
      pageObjects[wizard][input]['warningText'],
      pageObjectsConsts[constStorage][constValue]
    )
  }
)

Then(
  'verify {string} element in {string} on {string} wizard should display warning {string}.{string}',
  async function(input, accordion, wizard, constStorage, constValue) {
    await clickOnComponent(
      this.driver,
      pageObjects[wizard][accordion][input]['inputField']
    )
    await this.driver.sleep(100)
    await clickNearComponent(
      this.driver,
      pageObjects[wizard][accordion][input]['inputField']
    )
    await checkWarningHintText(
      this.driver,
      pageObjects[wizard][accordion][input],
      pageObjects[wizard][accordion][input]['warningText'],
      pageObjectsConsts[constStorage][constValue]
    )
  }
)

When('check {string} element on {string} wizard', async function(
  checkbox,
  wizard
) {
  await checkCheckbox(this.driver, pageObjects[wizard][checkbox])
})

When('check {string} element in {string} on {string} wizard', async function(
  checkbox,
  accordion,
  wizard
) {
  await checkCheckbox(this.driver, pageObjects[wizard][accordion][checkbox])
})

When('uncheck {string} element in {string} on {string} wizard', async function(
  checkbox,
  accordion,
  wizard
) {
  await uncheckCheckbox(this.driver, pageObjects[wizard][accordion][checkbox])
})

When('uncheck {string} element on {string} wizard', async function(
  checkbox,
  wizard
) {
  await uncheckCheckbox(this.driver, pageObjects[wizard][checkbox])
})

Then('{string} element should be unchecked on {string} wizard', async function(
  checkbox,
  wizard
) {
  await isCheckboxUnchecked(this.driver, pageObjects[wizard][checkbox])
})

Then(
  '{string} element should be unchecked in {string} on {string} wizard',
  async function(checkbox, accordion, wizard) {
    await isCheckboxUnchecked(
      this.driver,
      pageObjects[wizard][accordion][checkbox]
    )
  }
)

Then('{string} element should be checked on {string} wizard', async function(
  checkbox,
  wizard
) {
  await isCheckboxChecked(this.driver, pageObjects[wizard][checkbox])
})

Then(
  '{string} element should be checked in {string} on {string} wizard',
  async function(checkbox, accordion, wizard) {
    await isCheckboxChecked(
      this.driver,
      pageObjects[wizard][accordion][checkbox]
    )
  }
)

When(
  'click on {string} element in {string} on {string} wizard',
  async function (component, accordion, wizardName) {
    await waiteUntilComponent(this.driver, pageObjects[wizardName][accordion][component])
    await clickOnComponent(this.driver, pageObjects[wizardName][accordion][component])
    await this.driver.sleep(250)
  }
)

Then('is {string} on {string} selected', async function(radiobutton, wizard) {
  await isRadioButtonSelected(this.driver, pageObjects[wizard][radiobutton])
})

Then('is {string} in {string} on {string} selected', async function(
  radiobutton,
  accordion,
  wizard
) {
  await isRadioButtonSelected(
    this.driver,
    pageObjects[wizard][accordion][radiobutton]
  )
})

Then('is not {string} in {string} on {string} selected', async function(
  radiobutton,
  accordion,
  wizard
) {
  await isRadioButtonUnselected(
    this.driver,
    pageObjects[wizard][accordion][radiobutton]
  )
})

When('select {string} in {string} on {string}', async function(
  radiobutton,
  accordion,
  wizard
) {
  await selectRadiobutton(
    this.driver,
    pageObjects[wizard][accordion][radiobutton]
  )
})

Then(
  'verify options in {string} combobox in {string} on {string} wizard should contains {string}.{string}',
  async function(combobox, accordion, wizard, constStorage, constValue) {
    await openDropdown(
      this.driver,
      pageObjects[wizard][accordion][combobox]['dropdown']
    )
    await checkDropdownOptions(
      this.driver,
      pageObjects[wizard][accordion][combobox]['dropdown'],
      pageObjectsConsts[constStorage][constValue]
    )
    await clickNearComponent(
      this.driver,
      pageObjects[wizard][accordion][combobox]['dropdown']['open_button']
    )
  }
)
When(
  'select {string} option in {string} combobox on {string} accordion on {string} wizard',
  async function(option, comboBox, accordion, wizardName) {
    await openDropdown(
      this.driver,
      pageObjects[wizardName][accordion][comboBox]['dropdown']
    )
    await selectOptionInDropdownWithoutCheck(
      this.driver,
      pageObjects[wizardName][accordion][comboBox]['dropdown'],
      option
    )
  }
)

When(
  'select {string} option in {string} combobox suggestion on {string} accordion on {string} wizard',
  async function(option, comboBox, accordion, wizard) {
    await selectOptionInDropdownWithoutCheck(
      this.driver,
      pageObjects[wizard][accordion][comboBox]['comboDropdown'],
      option
    )
    await this.driver.sleep(200)
  }
)

Then(
  'select {string} option in {string} suggestions dropdown on {string} wizard',
  async function(option, dropdown, wizard) {
    await selectOptionInDropdownWithoutCheck(
      this.driver,
      pageObjects[wizard][dropdown],
      option
    )
    await this.driver.sleep(200)
  }
)

Then('select {string} option in action menu on {string} wizard', async function(
  option,
  wizard
) {
  const actionMenu = pageObjects[wizard]['Action_Menu']
  await openActionMenu(this.driver, actionMenu)
  await this.driver.sleep(500)
  await selectOptionInActionMenu(this.driver, actionMenu, option)
})

Then('check that {string} option in action menu on {string} wizard is enabled', async function(
  option,
  wizard
) {
  const actionMenu = pageObjects[wizard]['Action_Menu']
  await openActionMenu(this.driver, actionMenu)
  await this.driver.sleep(500)
  await verifyOptionInActionMenuEnabled (this.driver, actionMenu, option)
})

Then('check that {string} option in action menu on {string} wizard is disabled', async function(
  option,
  wizard
) {
  const actionMenu = pageObjects[wizard]['Action_Menu']
  await openActionMenu(this.driver, actionMenu)
  await this.driver.sleep(500)
  await verifyOptionInActionMenuDisabled (this.driver, actionMenu, option)
})

Then('check that {string} file is existed on {string} directory', async function (file, filePath) {
  const path = await generatePath(file, filePath)
  await this.driver.sleep(150)
  await determineFileAccess(path, file)
  await this.driver.sleep(150)
})

Then(
  'verify {string} according hint rules on {string} wizard',
  async function (inputField, wizardName) {
    await checkInputAccordingHintText(
      this.driver,
      this.attach,
      pageObjects[wizardName][inputField],
      pageObjects['commonPagesHeader']['Common_Hint']
    )
  }
)

Then('verify {string} options rules on {string} wizard', async function(
  inputField,
  wizardName
) {
  await checkInputAccordingHintText(
    this.driver,
    this.attach,
    pageObjects[wizardName][inputField],
    pageObjects['commonPagesHeader']['Common_Options']
  )
})

Then('verify {string} options rules on form {string} wizard', async function(
  inputField,
  wizardName
) {
  await checkInputAccordingHintText(
    this.driver,
    this.attach,
    pageObjects[wizardName][inputField],
    pageObjects['commonPagesHeader']['Common_Options'],
    true
  )
})

Then('verify {string} options rules on {string} wizard with labels', async function(
  inputField,
  wizardName
) {
  await checkInputAccordingHintText(
    this.driver,
    this.attach,
    pageObjects[wizardName][inputField],
    pageObjects['commonPagesHeader']['Common_Options'],
    false,
    true
  )
})

Then(
  'verify breadcrumbs {string} label should be equal {string} value',
  async function(labelType, value) {
    await verifyText(
      this.driver,
      pageObjects['commonPagesHeader']['Breadcrumbs'][`${labelType}Label`],
      value
    )
  }
)

Then(
  'verify value should equal {string} in {string} on {string} wizard',
  async function(value, componentName, wizardName) {
    await verifyText(
      this.driver,
      pageObjects[wizardName][componentName]['label'],
      value
    )
  }
)

Then(
    'verify {string} input should contains {string} value on {string} wizard',
    async function (component, value, wizard) {
        await verifyTypedValue(this.driver, pageObjects[wizard][component], value)
    }
)

Then(
  'verify {string} input should contains {string} value in {string} on {string} wizard',
  async function (component, value, accordion, wizard) {
    await verifyTypedValue(this.driver, pageObjects[wizard][accordion][component], value)
  }
)

Then(
  'verify value should equal {string}.{string} in {string} on {string} wizard',
  async function(constStorage, constValue, componentName, wizardName) {
    await verifyText(
      this.driver,
      pageObjects[wizardName][componentName]['label'],
      pageObjectsConsts[constStorage][constValue]
    )
  }
)

Then('select {string} with {string} value in breadcrumbs menu', async function(
  itemType,
  name
) {
  await openDropdown(
    this.driver,
    pageObjects['commonPagesHeader']['Breadcrumbs'][itemType]
  )

  await selectOptionInDropdown(
    this.driver,
    pageObjects['commonPagesHeader']['Breadcrumbs'][itemType],
    name
  )
})

Then(
  'verify arrow lines position on {string} on {string} wizard',
  async function(graphName, wizardName) {
    await checkNodesConnectionsNPandas(
      this.driver,
      pageObjects[wizardName][graphName]
    )
  }
)

When('hover {string} component on {string} wizard', async function(
  componentName,
  wizardName
) {
  await hoverComponent(
    this.driver,
    pageObjects[wizardName][componentName],
    false
  )
})

When('scroll and hover {string} component on {string} wizard', async function(
  componentName,
  wizardName
) {
  await hoverComponent(
    this.driver,
    pageObjects[wizardName][componentName],
    true
  )
})

When(
  'scroll and hover {string} component in {string} on {string} wizard',
  async function(componentName, accordionName, wizardName) {
    await hoverComponent(
      this.driver,
      pageObjects[wizardName][accordionName][componentName],
      true
    )
  }
)

When(
  'click on node with name {string} in {string} graph on {string} wizard',
  async function(nodeName, graphName, wizardName) {
    const arr = await findRowIndexesByColumnValue(
      this.driver,
      pageObjects[wizardName][graphName]['nodesTable'],
      'name',
      nodeName
    )
    const indx = arr[0]
    await clickOnComponent(
      this.driver,
      pageObjects[wizardName][graphName].nodesTable.tableFields['name'](indx)
    )
  }
)

Then('{string} on {string} wizard should be {string}', async function(
  componentName,
  wizardName,
  state
) {
  await verifyComponentContainsAttributeValue(
    this.driver,
    pageObjects[wizardName][componentName],
    'class',
    state
  )
})

Then('{string} on {string} wizard should not be {string}', async function(
  componentName,
  wizardName,
  state
) {
  await verifyComponentNotContainsAttributeValue(
    this.driver,
    pageObjects[wizardName][componentName],
    'class',
    state
  )
})

Then(
  'compare {string} element value on {string} wizard with test {string} context value',
  async function(componentName, wizardName, fieldName) {
    await verifyText(
      this.driver,
      pageObjects[wizardName][componentName],
      this.testContext[fieldName]
    )
  }
)

Then(
    'compare {string} element value in {string} on {string} wizard with test {string} context value',
    async function(componentName, accordionName, wizardName, fieldName) {
        await verifyText(
            this.driver,
            pageObjects[wizardName][accordionName][componentName],
            this.testContext[fieldName]
        )
    }
)

Then(
  'compare current browser URL with test {string} context value',
  async function(savedValue) {
    expect(await this.driver.getCurrentUrl()).equal(
      this.testContext[savedValue]
    )
  }
)

Then(
  'check {string} textarea counter on {string} wizard',
  async function (componentName, wizardName) {
    await verifyTextAreaCounter(this.driver, pageObjects[wizardName][componentName])
  }
)

Then(
  'check {string} textarea counter in {string} on {string} wizard',
  async function (componentName, accordionName, wizardName) {
    await verifyTextAreaCounter(this.driver, pageObjects[wizardName][accordionName][componentName])
  }
)
