import { Given, When, Then } from '@cucumber/cucumber'
import pageObjects from '../common/page-objects'
import pageObjectsConsts from '../common-tools/common-consts'
import { test_url, test_port } from '../../config'
import {
  navigateToPage,
  waiteUntilComponent,
  clickOnComponent,
  componentIsPresent,
  componentIsVisible,
  verifyText,
  waitPageLoad,
  deleteAPIMLProject,
  createAPIMLProject,
  isComponentContainsAttributeValue,
  collapseAccorditionSection,
  expandAccorditionSection,
  isAccorditionSectionCollapsed,
  clickNearComponent,
  verifyElementDisabled,
  verifyElementEnabled
} from '../common/actions/common.action'
import {
  findRowIndexesByColumnValue,
  isTableColumnSorted,
  checkTableColumnValues
} from '../common/actions/table.action'
import {
  openDropdown,
  selectOptionInDropdown,
  selectOptionInDropdownWithoutCheck,
  checkDropdownSelectedOption,
  checkDropdownOptions
} from '../common/actions/dropdown.action'
import { isTabActive } from '../common/actions/tab-selector.action'
import {
  typeValue,
  getInputValue,
  checkHintText,
  checkInputAccordingHintText,
  verifyTypedValue,
  checkWarningHintText,
  verifyInputDisabled,
  verifyInputEnabled
} from '../common/actions/input-group.action'
import {
  incrementValue,
  decrementValue
} from '../common/actions/number-input-group.action'
import {
  checkCheckbox,
  uncheckCheckbox,
  isCheckboxUnchecked,
  isCheckboxChecked
} from '../common/actions/checkbox.action'
import {
  verifyTimeFilterBand,
  pickUpCustomDatetimeRange,
  applyDatetimePickerRange
} from '../common/actions/date-picker.action'
import {
  typeSearchebleValue,
  isContainsSubstringInSuggestedOptions
} from '../common/actions/input-with-autocomplete.action'

import {
  isRadioButtonSelected,
  isRadioButtonUnselected,
  selectRadiobutton
} from '../common/actions/radio-button.action'
import {
  openActionMenu,
  selectOptionInActionMenu
} from '../common/actions/action-menu.action'

Given('open url', async function() {
  await navigateToPage(this.driver, `http://${test_url}:${test_port}`)
})

When('turn on demo mode', async function() {
  const url = await this.driver.getCurrentUrl()
  await navigateToPage(this.driver, `${url}?demo=true`)
})

Then('wait load page', async function() {
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

Then('verify if {string} popup dialog appears', async function(popup) {
  await waiteUntilComponent(this.driver, pageObjects[popup]['Title'])
  await this.driver.sleep(250)
  await componentIsPresent(this.driver, pageObjects[popup]['Title'])
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
  await verifyTypedValue(this.driver, pageObjects[wizard][inputField], value)
})

Then('verify {string} element on {string} wizard is enabled', async function(
  elementName,
  wizardName
) {
  await verifyElementEnabled(this.driver, pageObjects[wizardName][elementName])
})

Then('verify {string} element on {string} wizard is disabled', async function(
  elementName,
  wizardName
) {
  await verifyElementDisabled(this.driver, pageObjects[wizardName][elementName])
})

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
  'verify {string} element in {string} on {string} wizard is disabled',
  async function(inputField, accordionName, wizardName) {
    await verifyInputDisabled(
      this.driver,
      pageObjects[wizardName][accordionName][inputField]
    )
  }
)

When(
  'type searchable fragment {string} into {string} on {string} wizard',
  async function(subName, inputGroup, wizard) {
    await typeSearchebleValue(
      this.driver,
      pageObjects[wizard][inputGroup],
      subName
    )
  }
)

Then(
  'searchable fragment {string} should be in every sugested option into {string} on {string} wizard',
  async function(subName, inputGroup, wizard) {
    await isContainsSubstringInSuggestedOptions(
      this.driver,
      pageObjects[wizard][inputGroup],
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
  'verify error mesege in {string} on {string} wizard with value {string}.{string}',
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
  async function(dropdown, wizard, constStorage, constValue) {
    await openDropdown(this.driver, pageObjects[wizard][dropdown])
    await checkDropdownOptions(
      this.driver,
      pageObjects[wizard][dropdown],
      pageObjectsConsts[constStorage][constValue]
    )
    await clickNearComponent(
      this.driver,
      pageObjects[wizard][dropdown]['open_button']
    )
  }
)

Then('verify {string} element visibility on {string} wizard', async function(
  component,
  wizard
) {
  await componentIsVisible(this.driver, pageObjects[wizard][component])
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

When('collapse {string} on {string} wizard', async function(accordion, wizard) {
  collapseAccorditionSection(
    this.driver,
    pageObjects[wizard][accordion]['Collapse_Button']
  )
  await this.driver.sleep(100)
})

When('expand {string} on {string} wizard', async function(accordion, wizard) {
  expandAccorditionSection(
    this.driver,
    pageObjects[wizard][accordion]['Collapse_Button']
  )
  await this.driver.sleep(100)
})

Then('verify {string} is collapsed on {string} wizard', async function(
  accordion,
  wizard
) {
  await isAccorditionSectionCollapsed(
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
    clickOnComponent(this.driver, pageObjects['Projects']['Projects_Sorter'])
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
      'tab',
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
      'tab',
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
    'tab',
    tabName
  )
  const indx = arr[0]
  await clickOnComponent(
    this.driver,
    pageObjects[wizard][tabSelector]['tableFields']['tab'](indx)
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
    await clickNearComponent(
      this.driver,
      pageObjects[wizard][input]['inputField']
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

Then(
  '{string} element should be unchecked in {string} on {string} wizard',
  async function(checkbox, accordion, wizard) {
    await isCheckboxUnchecked(
      this.driver,
      pageObjects[wizard][accordion][checkbox]
    )
  }
)

Then(
  '{string} element should be checked in {string} on {string} wizard',
  async function(checkbox, accordion, wizard) {
    await isCheckboxChecked(
      this.driver,
      pageObjects[wizard][accordion][checkbox]
    )
  }
)

When('click on {string} element in {string} on {string} wizard', async function(
  component,
  accordion,
  wizardName
) {
  await clickOnComponent(
    this.driver,
    pageObjects[wizardName][accordion][component]
  )
})

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
  }
)

Then('remove {string} MLRun Project with code {int}', async function(
  nameProject,
  status
) {
  await deleteAPIMLProject(nameProject, status)
})

When('create {string} MLRun Project with code {int}', async function(
  nameProject,
  status
) {
  await createAPIMLProject(nameProject, status)
  await this.driver.sleep(2000)
})

Then('select {string} option in action menu on {string} wizard', async function(
  option,
  wizard
) {
  const actionMenu = pageObjects[wizard]['Action_Menu']
  await openActionMenu(this.driver, actionMenu)
  await this.driver.sleep(500)
  await selectOptionInActionMenu(this.driver, actionMenu, option)
})

Then('verify {string} according hint rules on {string} wizard', async function(
  inputField,
  wizardName
) {
  await checkInputAccordingHintText(
    this.driver,
    pageObjects[wizardName][inputField],
    pageObjects['commonPagesHeader']['Common_Hint']
  )
})
