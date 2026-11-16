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
import { Given, When, Then } from '../support/world.js'
import pageObjects from '../common/page-objects.js'
import pageObjectsConsts from '../common-tools/common-consts.js'
import { expectTimeout, test_url, test_port } from '../../config.js'
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
  navigateBack,
  navigateForward,
  navigateToPage,
  refreshPage,
  verifyComponentAttributeValue,
  verifyComponentContainsAttributeValue,
  verifyComponentNotContainsAttributeValue,
  verifyElementDisabled,
  verifyElementEnabled,
  verifyText,
  fillPatternGroups,
  verifyNotificationText,
  verifyTextRegExp,
  waitPageLoad,
  waitForComponentAttached,
  verifyElementActive,
  verifyElementNotActive,
  generatePath,
  determineFileAccess,
  verifyClassDisabled,
  verifyClassEnabled,
  checkComponentHintTextWithHover,
  putToTestContextElementValue
} from '../common/actions/common.action.js'
import {
  checkTableColumnValues,
  waitForRowIndexesByColumnValue,
  isTableColumnSorted
} from '../common/actions/table.action.js'
import {
  checkDropdownContainsOptions,
  checkDropdownOptions,
  checkDropdownSelectedOption,
  checkDropdownSelectedOptionWithAttribute,
  getOptionValues,
  openDropdown,
  selectOptionInDropdown,
  selectOptionInDropdownWithoutCheck
} from '../common/actions/dropdown.action.js'
import { isTabActive } from '../common/actions/tab-selector.action.js'
import {
  checkHintText,
  checkHintTextWithHover,
  checkInputAccordingHintText,
  checkWarningHintText,
  checkWarningHintTextWithHover,
  checkWarningText,
  getInputValue,
  typeValue,
  typeValueWithoutInputgroup,
  verifyInputDisabled,
  verifyInputClassDisabled,
  verifyInputEnabled,
  verifyInputClassEnabled,
  verifyTypedValue,
  verifyPlaceholder,
  verifyTypedValueWithoutInputgroup,
  verifyTextAreaCounter
} from '../common/actions/input-group.action.js'
import { incrementValue, decrementValue } from '../common/actions/number-input-group.action.js'
import {
  checkCheckbox,
  isCheckboxChecked,
  isCheckboxUnchecked,
  uncheckCheckbox,
  verifyCheckboxEnabled,
  verifyCheckboxDisabled
} from '../common/actions/checkbox.action.js'
import {
  applyDatetimePickerRange,
  pickUpCustomDatetimeRange,
  verifyTimeFilterBand,
  setPickerTime
} from '../common/actions/date-picker.action.js'
import {
  isContainsSubstringInSuggestedOptions,
  typeSearchableValue
} from '../common/actions/input-with-autocomplete.action.js'
import { checkWorkflowGraphConnections, panGraphToElement } from '../common/actions/graph.action.js'
import {
  isRadioButtonSelected,
  isRadioButtonUnselected,
  selectRadiobutton
} from '../common/actions/radio-button.action.js'
import {
  openActionMenu,
  selectOptionInActionMenu,
  verifyOptionInActionMenuEnabled,
  openActionMenuIfClosed,
  verifyOptionInActionMenuDisabled
} from '../common/actions/action-menu.action.js'
import { selectSidebarItem, selectSidebarProject } from '../common/actions/sidebar.action.js'
import { expect } from '@playwright/test'
import {
  expectText,
  getAttribute,
  getText,
  pollOptions,
  retryAssertion,
  waitForPageQuiet,
  waitUntilStable
} from '../common-tools/element.js'
import { getProjects } from '../common/actions/api.actions.js'

Given('open url', async function () {
  await navigateToPage(this.page, `http://${test_url}:${test_port}`)
})

When('turn on demo mode with query params {string}', async function (state) {
  const url = this.page.url()

  await navigateToPage(this.page, `${url}${state === 'true' ? '&' : '?'}mode=demo`)
})

When('turn on staging mode with query params {string}', async function (state) {
  const url = this.page.url()

  await navigateToPage(this.page, `${url}${state === 'true' ? '&' : '?'}mode=staging`)
})

Then('verify redirection from {string} to {string}', async function (invalidPath, expectedPath) {
  const invalidUrl = `http://${test_url}:${test_port}/${invalidPath}`
  const expectedUrl = `http://${test_url}:${test_port}/${expectedPath}`

  await navigateToPage(this.page, invalidUrl)
  // the redirection can depend on a request (e.g. the functions list), wait for it instead of a fixed delay
  await expect(this.page)
    .toHaveURL(expectedUrl)
    .catch(() => {})
  // make sure there is no further redirection: the URL stays the same for a while
  await waitUntilStable(() => this.page.url(), { timeout: 3000, interval: 500 })
  const afterURL = this.page.url()

  expect(
    afterURL,
    `Redirection from "${invalidUrl}"\nshould be "${expectedUrl}"\nbut is "${afterURL}"`
  ).toBe(expectedUrl)
})

Then('verify redirection to {string}', async function (expectedPath) {
  const expectedUrl = `http://${test_url}:${test_port}/${expectedPath}`

  // the app completes the URL (e.g. the pagination params) after the page is loaded
  await expect(this.page, `Redirection should be "${expectedUrl}"`).toHaveURL(expectedUrl)
})

Then('wait load page', async function () {
  await waitPageLoad(this.page, pageObjects['commonPagesHeader']['loader'])
})

// the browser clock must be fake (`page.clock.install()`, e.g. the `@mlrunUnhealthyTest` hook): the timers due by then
// fire, the app sees the time passed
Then('move the browser time forward by {int} seconds', async function (seconds) {
  await this.page.clock.fastForward(seconds * 1000)
})

Then('wait for {int} seconds', { timeout: 10 * 60 * 1000 }, async function (seconds) {
  const milliseconds = seconds * 1000

  await new Promise(resolve => setTimeout(resolve, milliseconds))
})

Then('navigate forward', async function () {
  await navigateForward(this.page)
  await waitPageLoad(this.page, pageObjects['commonPagesHeader']['loader'])
})

Then('navigate back', async function () {
  await navigateBack(this.page)
  await waitPageLoad(this.page, pageObjects['commonPagesHeader']['loader'])
})

Then('refresh a page', async function () {
  await refreshPage(this.page)
  await waitPageLoad(this.page, pageObjects['commonPagesHeader']['loader'])
})

Then('click on {string} element on {string} wizard', async function (component, wizard) {
  await waitForComponentAttached(this.page, pageObjects[wizard][component])
  await clickOnComponent(this.page, pageObjects[wizard][component])
  await waitForPageQuiet(this.page)
})

Then('click on breadcrumbs {string} label on {string} wizard', async function (labelType, wizard) {
  await waitForComponentAttached(this.page, pageObjects[wizard]['Breadcrumbs'][`${labelType}Label`])
  await clickOnComponent(this.page, pageObjects[wizard]['Breadcrumbs'][`${labelType}Label`])
  await waitForPageQuiet(this.page)
})

Then('verify if {string} popup dialog appears', async function (popup) {
  await waitForComponentAttached(this.page, pageObjects[popup]['Title'])
  await componentIsPresent(this.page, pageObjects[popup]['Title'])
  await componentIsVisible(this.page, pageObjects[popup]['Title'])
})

Then(
  'type into {string} on {string} popup dialog {string} value',
  async function (component, wizard, value) {
    await typeValue(this.page, pageObjects[wizard][component], value)
    await verifyTypedValue(this.page, pageObjects[wizard][component], value)
  }
)

Then(
  'type value {string} to {string} field on {string} wizard',
  async function (value, inputField, wizard) {
    await typeValue(this.page, pageObjects[wizard][inputField], value)
    await verifyTypedValue(this.page, pageObjects[wizard][inputField], value)
    await waitForPageQuiet(this.page)
  }
)

Then(
  'type value {string} to {string} field on {string} wizard without inputgroup',
  async function (value, inputField, wizard) {
    await typeValueWithoutInputgroup(this.page, pageObjects[wizard][inputField], value)
    await verifyTypedValueWithoutInputgroup(this.page, pageObjects[wizard][inputField], value)
    await waitForPageQuiet(this.page)
  }
)

Then(
  'verify {string} element on {string} wizard is enabled',
  async function (elementName, wizardName) {
    await verifyElementEnabled(this.page, pageObjects[wizardName][elementName])
  }
)

Then(
  'verify {string} not input element in {string} on {string} wizard is enabled',
  async function (elementName, accordionName, wizardName) {
    await verifyElementEnabled(this.page, pageObjects[wizardName][accordionName][elementName])
  }
)

Then(
  'verify {string} not input element in {string} on {string} wizard is active',
  async function (elementName, accordionName, wizardName) {
    await verifyElementActive(this.page, pageObjects[wizardName][accordionName][elementName])
  }
)

Then(
  'verify {string} not input element in {string} on {string} wizard is NOT active',
  async function (elementName, accordionName, wizardName) {
    await verifyElementNotActive(this.page, pageObjects[wizardName][accordionName][elementName])
  }
)

Then(
  'verify {string} element on {string} wizard is disabled',
  async function (elementName, wizardName) {
    await verifyElementDisabled(this.page, pageObjects[wizardName][elementName])
  }
)

Then(
  'verify {string} not input element in {string} on {string} wizard is disabled',
  async function (elementName, accordionName, wizardName) {
    await verifyElementDisabled(this.page, pageObjects[wizardName][accordionName][elementName])
  }
)

Then(
  'verify checkbox {string} element on {string} wizard is enabled',
  async function (elementName, wizardName) {
    await verifyCheckboxEnabled(this.page, pageObjects[wizardName][elementName])
  }
)

Then(
  'verify checkbox {string} element in {string} on {string} wizard is enabled',
  async function (elementName, accordionName, wizardName) {
    await verifyCheckboxEnabled(this.page, pageObjects[wizardName][accordionName][elementName].root)
  }
)

Then(
  'verify checkbox {string} element on {string} wizard is disabled',
  async function (elementName, wizardName) {
    await verifyCheckboxDisabled(this.page, pageObjects[wizardName][elementName])
  }
)

Then(
  'verify checkbox {string} element in {string} on {string} wizard is disabled',
  async function (elementName, accordionName, wizardName) {
    await verifyCheckboxDisabled(
      this.page,
      pageObjects[wizardName][accordionName][elementName].root
    )
  }
)

Then(
  'verify {string} element in {string} on {string} wizard is enabled',
  async function (inputField, accordionName, wizardName) {
    await verifyInputEnabled(this.page, pageObjects[wizardName][accordionName][inputField])
  }
)

Then(
  'verify {string} element in {string} on {string} wizard is enabled by class name',
  async function (inputField, accordionName, wizardName) {
    await verifyInputClassEnabled(this.page, pageObjects[wizardName][accordionName][inputField])
  }
)

Then(
  'verify {string} element in {string} on {string} wizard is disabled',
  async function (inputField, accordionName, wizardName) {
    await verifyInputDisabled(this.page, pageObjects[wizardName][accordionName][inputField])
  }
)

Then(
  'verify {string} element in {string} on {string} wizard is disabled by class name',
  async function (inputField, accordionName, wizardName) {
    await verifyInputClassDisabled(this.page, pageObjects[wizardName][accordionName][inputField])
  }
)

Then(
  'verify {string} element on {string} wizard is disabled by class name',
  async function (inputField, wizardName) {
    await verifyClassDisabled(this.page, pageObjects[wizardName][inputField])
  }
)

Then(
  'verify {string} element on {string} wizard is enabled by class name',
  async function (inputField, wizardName) {
    await verifyClassEnabled(this.page, pageObjects[wizardName][inputField])
  }
)

When(
  'type searchable fragment {string} into {string} on {string} wizard',
  async function (subName, inputGroup, wizard) {
    await typeSearchableValue(this.page, pageObjects[wizard][inputGroup], subName)
  }
)

When(
  'type searchable fragment {string} into {string} combobox input in {string} on {string} wizard',
  async function (subName, combobox, accordion, wizard) {
    await typeSearchableValue(
      this.page,
      pageObjects[wizard][accordion][combobox]['comboDropdown'],
      subName
    )
  }
)

Then(
  'searchable case {string} fragment {string} should be in every suggested option into {string} on {string} wizard',
  async function (textCase, subName, inputGroup, wizard) {
    await isContainsSubstringInSuggestedOptions(
      this.page,
      pageObjects[wizard][inputGroup],
      subName,
      textCase === 'insensitive'
    )
  }
)

// an option is offered: one of the suggestions is exactly it (the "every suggested option" step needs a typed fragment)
Then(
  'verify {string} is in suggested options of {string} combobox input in {string} on {string} wizard',
  async function (option, combobox, accordion, wizard) {
    await expect
      .poll(
        () =>
          getOptionValues(
            this.page,
            pageObjects[wizard][accordion][combobox]['comboDropdown'].options
          ),
        pollOptions(`Suggestions of "${combobox}"`)
      )
      .toContain(option)
  }
)

Then(
  'searchable fragment {string} should be in every suggested option into {string} combobox input in {string} on {string} wizard',
  async function (subName, combobox, accordion, wizard) {
    await isContainsSubstringInSuggestedOptions(
      this.page,
      pageObjects[wizard][accordion][combobox]['comboDropdown'],
      subName
    )
  }
)

Then(
  'increase value on {int} points in {string} field on {string} on {string} wizard',
  async function (value, inputField, accordion, wizard) {
    const txt = await getInputValue(this.page, pageObjects[wizard][accordion][inputField])
    const result = Number.parseInt(txt) + value

    await incrementValue(this.page, pageObjects[wizard][accordion][inputField], value)
    await verifyTypedValue(this.page, pageObjects[wizard][accordion][inputField], result.toString())
  }
)

Then(
  'increase value on {int} points in {string} field on {string} wizard',
  async function (value, inputField, wizard) {
    const txt = await getInputValue(this.page, pageObjects[wizard][inputField])
    const result = Number.parseInt(txt) + value

    await incrementValue(this.page, pageObjects[wizard][inputField], value)
    await verifyTypedValue(this.page, pageObjects[wizard][inputField], result.toString())
  }
)

// the "cpu" unit steps by 0.001: the value is compared with 3 decimals (the input can show e.g. "0.011000000000000001").
// The "cpu" steps used to return before clicking, so they verified nothing
const verifyNumberInputValue = (page, inputGroup, expected, unit) =>
  retryAssertion(async () => {
    const actual = await getInputValue(page, inputGroup)

    if (unit === 'cpu') {
      expect(Number.parseFloat(actual).toFixed(3), `the input value is "${actual}"`).toBe(
        expected.toFixed(3)
      )
    } else {
      expect(actual).toBe(expected.toString())
    }
  })

Then(
  'increase value on {int} points in {string} field with {string} on {string} on {string} wizard',
  async function (value, inputField, unit, accordion, wizard) {
    const txt = await getInputValue(this.page, pageObjects[wizard][accordion][inputField])
    const unitValue = unit === 'cpu' ? value / 1000 : unit === 'millicpu' ? value * 100 : value
    let result = Number.parseFloat(txt || '0') + unitValue

    await incrementValue(this.page, pageObjects[wizard][accordion][inputField], value)
    await verifyNumberInputValue(
      this.page,
      pageObjects[wizard][accordion][inputField],
      result,
      unit
    )
  }
)

Then(
  'decrease value on {int} points in {string} field on {string} on {string} wizard',
  async function (value, inputField, accordion, wizard) {
    const txt = await getInputValue(this.page, pageObjects[wizard][accordion][inputField])
    const result = Number.parseInt(txt) - value

    await decrementValue(this.page, pageObjects[wizard][accordion][inputField], value)
    await verifyTypedValue(this.page, pageObjects[wizard][accordion][inputField], result.toString())
  }
)

Then(
  'decrease value on {int} points in {string} field on {string} wizard',
  async function (value, inputField, wizard) {
    const txt = await getInputValue(this.page, pageObjects[wizard][inputField])
    const result = Number.parseInt(txt) - value

    await decrementValue(this.page, pageObjects[wizard][inputField], value)
    await verifyTypedValue(this.page, pageObjects[wizard][inputField], result.toString())
  }
)

Then(
  'decrease value on {int} points in {string} field with {string} on {string} on {string} wizard',
  async function (value, inputField, unit, accordion, wizard) {
    const txt = await getInputValue(this.page, pageObjects[wizard][accordion][inputField])
    const unitValue = unit === 'cpu' ? value / 1000 : unit === 'millicpu' ? value * 100 : value
    let result = Number.parseFloat(txt) - unitValue

    // the minimal values of the units (selectUnitOptions in src/elements/FormResourcesUnits/formResourcesUnits.util.js)
    result = Math.max(result, unit === 'cpu' ? 0.001 : 1)

    await decrementValue(this.page, pageObjects[wizard][accordion][inputField], value)
    await verifyNumberInputValue(
      this.page,
      pageObjects[wizard][accordion][inputField],
      result,
      unit
    )
  }
)

Then(
  'type value {string} to {string} field on {string} on {string} wizard',
  async function (value, inputField, accordion, wizard) {
    await typeValue(this.page, pageObjects[wizard][accordion][inputField], value)
    await verifyTypedValue(this.page, pageObjects[wizard][accordion][inputField], value)
  }
)

Then(
  '{string} component on {string} should contains {string}.{string}',
  async function (component, wizard, constStorage, constValue) {
    await waitForComponentAttached(this.page, pageObjects[wizard][component])
    await verifyText(
      this.page,
      pageObjects[wizard][component],
      pageObjectsConsts[constStorage][constValue]
    )
  }
)

// the notifications are looked for among all the shown ones, see `verifyNotificationText`
const isNotification = selector =>
  selector === pageObjects['Notification_Popup']['Notification_Pop_Up']

Then(
  '{string} element on {string} should contains {string} value',
  async function (component, wizard, value) {
    await waitForComponentAttached(this.page, pageObjects[wizard][component])

    if (isNotification(pageObjects[wizard][component])) {
      await verifyNotificationText(this.page, pageObjects[wizard][component], value)
    } else {
      await verifyText(this.page, pageObjects[wizard][component], value)
    }
  }
)

// for a text that comes later than the default timeout allows (e.g. a background task that ends after a random time)
Then(
  '{string} element on {string} should contains {string} value within {int} seconds',
  async function (component, wizard, value, seconds) {
    if (isNotification(pageObjects[wizard][component])) {
      // a wait: the scenarios check the notification after it (`mark: false`)
      await verifyNotificationText(this.page, pageObjects[wizard][component], value, {
        timeout: seconds * 1000,
        mark: false
      })
    } else {
      await expectText(this.page.locator(pageObjects[wizard][component]).first(), value, {
        message: `Text of ${pageObjects[wizard][component]} within ${seconds} s`,
        timeout: seconds * 1000
      })
    }
  }
)

Then(
  '{string} element in {string} on {string} should contains {string} value',
  async function (component, accordion, wizard, value) {
    await verifyText(this.page, pageObjects[wizard][accordion][component], value)
  }
)

Then(
  '{string} element in {string} on {string} should contains {string} attribute value',
  async function (component, accordion, wizard, value) {
    await verifyComponentContainsAttributeValue(
      this.page,
      pageObjects[wizard][accordion][component]['inputField'],
      'value',
      value
    )
  }
)

Then(
  '{string} element on {string} should contains {string} attribute value',
  async function (component, wizard, value) {
    await verifyComponentContainsAttributeValue(
      this.page,
      pageObjects[wizard][component]['inputField'],
      'value',
      value
    )
  }
)

// the whole value (the step above checks a substring: a filter that kept "latest123456" passed for "latest")
Then(
  '{string} element on {string} should be equal {string} attribute value',
  async function (component, wizard, value) {
    await verifyComponentAttributeValue(
      this.page,
      pageObjects[wizard][component]['inputField'],
      'value',
      value
    )
  }
)

When(
  'save to context {string} page value from {string} element on {string} wizard',
  async function (pageValue, elementName, wizardName) {
    await putToTestContextElementValue(
      this.page,
      this.testContext,
      pageObjects[wizardName][elementName],
      pageValue
    )
  }
)

Then(
  '{string} component on {string} should be equal {string}.{string}',
  async function (component, wizard, constStorage, constValue) {
    await verifyTextRegExp(
      this.page,
      pageObjects[wizard][component],
      pageObjectsConsts[constStorage][constValue]
    )
  }
)

// the variable parts of the message (the capturing groups of the pattern, in order) are the values of the scenario
// (e.g. the name of the deleted job): the pattern alone passes any value there
const verifyTextWithValues = (page, component, pattern, values) =>
  verifyTextRegExp(page, component, fillPatternGroups(pattern, values))

Then(
  '{string} component on {string} should be equal {string}.{string} with {string}',
  async function (component, wizard, constStorage, constValue, value) {
    await verifyTextWithValues(
      this.page,
      pageObjects[wizard][component],
      pageObjectsConsts[constStorage][constValue],
      [value]
    )
  }
)

Then(
  '{string} component on {string} should be equal {string}.{string} with {string} and {string}',
  async function (component, wizard, constStorage, constValue, value1, value2) {
    await verifyTextWithValues(
      this.page,
      pageObjects[wizard][component],
      pageObjectsConsts[constStorage][constValue],
      [value1, value2]
    )
  }
)

Then(
  '{string} component on {string} should be equal {string}.{string} with {string}, {string} and {string}',
  async function (component, wizard, constStorage, constValue, value1, value2, value3) {
    await verifyTextWithValues(
      this.page,
      pageObjects[wizard][component],
      pageObjectsConsts[constStorage][constValue],
      [value1, value2, value3]
    )
  }
)

Then(
  '{string} component in {string} on {string} should contains {string}.{string}',
  async function (component, accordion, wizard, constStorage, constValue) {
    await waitForComponentAttached(this.page, pageObjects[wizard][accordion][component])
    await verifyText(
      this.page,
      pageObjects[wizard][accordion][component],
      pageObjectsConsts[constStorage][constValue]
    )
  }
)

When(
  'select {string} option in {string} dropdown on {string} wizard',
  async function (optionValue, dropdownName, wizardName) {
    await openDropdown(this.page, pageObjects[wizardName][dropdownName])
    await selectOptionInDropdown(this.page, pageObjects[wizardName][dropdownName], optionValue)
    await waitForPageQuiet(this.page)
  }
)

When(
  'select {string} option in {string} dropdown on {string} on {string} wizard',
  async function (optionValue, dropdownName, accordionName, wizardName) {
    await openDropdown(this.page, pageObjects[wizardName][accordionName][dropdownName])
    await selectOptionInDropdown(
      this.page,
      pageObjects[wizardName][accordionName][dropdownName],
      optionValue
    )
    await checkDropdownSelectedOption(
      this.page,
      pageObjects[wizardName][accordionName][dropdownName],
      optionValue
    )
  }
)

Then(
  'verify {string} dropdown on {string} wizard selected attribute option value {string}',
  async function (dropdownName, wizardName, optionValue) {
    await checkDropdownSelectedOptionWithAttribute(
      this.page,
      pageObjects[wizardName][dropdownName],
      optionValue
    )
  }
)

Then(
  'verify {string} dropdown on {string} wizard selected option value {string}',
  async function (dropdownName, wizardName, optionValue) {
    await checkDropdownSelectedOption(this.page, pageObjects[wizardName][dropdownName], optionValue)
  }
)

Then(
  'verify {string} dropdown in {string} on {string} wizard selected option value {string}',
  async function (dropdownName, accordionName, wizardName, optionValue) {
    await checkDropdownSelectedOption(
      this.page,
      pageObjects[wizardName][accordionName][dropdownName],
      optionValue
    )
  }
)

When(
  'select {string} option in {string} filter dropdown on {string} wizard',
  async function (optionValue, dropdownName, wizardName) {
    await openDropdown(this.page, pageObjects[wizardName][dropdownName])
    await selectOptionInDropdownWithoutCheck(
      this.page,
      pageObjects[wizardName][dropdownName],
      optionValue
    )
  }
)

When(
  'select {string} option at {string} dropdown options in {string} on {string} wizard',
  async function (optionValue, dropdownName, accordionName, wizardName) {
    await openDropdown(this.page, pageObjects[wizardName][accordionName][dropdownName])
    await selectOptionInDropdownWithoutCheck(
      this.page,
      pageObjects[wizardName][accordionName][dropdownName],
      optionValue
    )
  }
)

When(
  'pick up {string} from {string} to {string} in {string} via {string} with from {string} to {string} time dropdown on {string} wizard',
  async function (
    optionValue,
    fromDatetime,
    toDatetime,
    datetimePicker,
    dropdownName,
    fromTimeDropdown,
    toTimeDropdown,
    wizardName
  ) {
    await openDropdown(this.page, pageObjects[wizardName][dropdownName])
    await selectOptionInDropdownWithoutCheck(
      this.page,
      pageObjects[wizardName][dropdownName],
      optionValue
    )
    await waitForPageQuiet(this.page)
    await pickUpCustomDatetimeRange(
      this.page,
      pageObjects[wizardName][datetimePicker],
      fromDatetime,
      toDatetime
    )
    await setPickerTime(this.page, pageObjects[wizardName][fromTimeDropdown], fromDatetime)
    await setPickerTime(this.page, pageObjects[wizardName][toTimeDropdown], toDatetime)
    await waitForPageQuiet(this.page)
    await applyDatetimePickerRange(this.page, pageObjects[wizardName][datetimePicker])
  }
)

Then(
  'verify from {string} to {string} filter band in {string} filter dropdown on {string} wizard',
  async function (fromDatetime, toDatetime, dropdownName, wizardName) {
    await verifyTimeFilterBand(this.page, pageObjects[wizardName][dropdownName], {
      from: fromDatetime,
      to: toDatetime
    })
  }
)

Then(
  'verify error message in {string} on {string} wizard with value {string}.{string}',
  async function (datetimePicker, wizard, constStorage, constValue) {
    await verifyText(
      this.page,
      pageObjects[wizard][datetimePicker].errorMessage,
      pageObjectsConsts[constStorage][constValue]
    )
  }
)

Then(
  'verify {string} element in {string} on {string} wizard should contains {string}.{string}',
  async function (dropdown, accordion, wizard, constStorage, constValue) {
    await openDropdown(this.page, pageObjects[wizard][accordion][dropdown])
    await checkDropdownOptions(
      this.page,
      pageObjects[wizard][accordion][dropdown],
      pageObjectsConsts[constStorage][constValue]
    )
    // close dropdown options
    await clickNearComponent(this.page, pageObjects[wizard][accordion][dropdown]['open_button'])
  }
)

Then(
  'verify {string} dropdown element on {string} wizard should contains {string}.{string}',
  async function (dropdownName, wizardName, constStorage, constValue) {
    await openDropdown(this.page, pageObjects[wizardName][dropdownName])
    await checkDropdownContainsOptions(
      this.page,
      pageObjects[wizardName][dropdownName],
      pageObjectsConsts[constStorage][constValue]
    )
    await clickNearComponent(this.page, pageObjects[wizardName][dropdownName]['open_button'])
  }
)

Then(
  'verify visibility of header column {string} in {string} table on {string} wizard',
  async function (columnName, tableName, wizardName) {
    const locator = pageObjects[wizardName][tableName]['headerSorters'][columnName]
    await componentIsVisible(this.page, locator)
  }
)

Then('verify {string} element visibility on {string} wizard', async function (component, wizard) {
  await componentIsVisible(this.page, pageObjects[wizard][component])
})

Then('verify {string} element invisibility on {string} wizard', async function (component, wizard) {
  await componentIsNotVisible(this.page, pageObjects[wizard][component])
})

Then(
  'verify {string} element visibility in {string} on {string} wizard',
  async function (component, accordion, wizard) {
    await componentIsVisible(this.page, pageObjects[wizard][accordion][component])
  }
)

Then('verify {string} element not exists on {string} wizard', async function (component, wizard) {
  await componentIsNotPresent(this.page, pageObjects[wizard][component])
})

Then(
  'verify {string} element not exists in {string} on {string} wizard',
  async function (component, accordion, wizard) {
    await componentIsNotPresent(this.page, pageObjects[wizard][accordion][component])
  }
)

When('collapse {string} on {string} wizard', async function (accordion, wizard) {
  await collapseAccordionSection(this.page, pageObjects[wizard][accordion]['Collapse_Button'])
  await waitForPageQuiet(this.page)
})

When('expand {string} on {string} wizard', async function (accordion, wizard) {
  await expandAccordionSection(this.page, pageObjects[wizard][accordion]['Collapse_Button'])
  await waitForPageQuiet(this.page)
})

Then('verify {string} is collapsed on {string} wizard', async function (accordion, wizard) {
  await isAccordionSectionCollapsed(this.page, pageObjects[wizard][accordion]['Collapse_Button'])
})

// sets the order with the arrow button (if it is not set yet) and verifies the order of the project cards by the selected
// sort option. The previous steps compared the class with 'sort_up'/'sort_down' (the classes are `sort-icon_up/_down`
// now) and the check compared the names with themselves
const sortProjects = async (page, order) => {
  const sorter = pageObjects['Projects']['Projects_Sorter']
  const iconClass = `sort-icon_${order === 'desc' ? 'down' : 'up'}`
  const isOrderSet = async () =>
    (await getAttribute(page.locator(`${sorter} .sort-icon`).first(), 'class'))?.includes(iconClass)

  if (!(await isOrderSet())) {
    await clickOnComponent(page, sorter)
  }

  await expect
    .poll(isOrderSet, {
      timeout: expectTimeout,
      message: `The "${iconClass}" sort icon is not displayed`
    })
    .toBeTruthy()

  const sortOption = await getText(page.locator(sorter).first())
  let sortKey = name => name

  if (sortOption === 'By created date') {
    const createdByName = Object.fromEntries(
      (await getProjects()).map(project => [project.metadata.name, project.metadata.created])
    )

    sortKey = name => {
      expect(typeof createdByName[name], `"${name}" project has no created date`).toBe('string')

      return createdByName[name]
    }
  } else {
    expect(sortOption).toBe('By name')
  }

  await isTableColumnSorted(page, pageObjects['Projects']['Projects_Table'], 'name', order, sortKey)
}

Then('sort projects in ascending order', async function () {
  await sortProjects(this.page, 'asc')
})

Then('sort projects in descending order', async function () {
  await sortProjects(this.page, 'desc')
})

Then(
  'verify {string} tab is active in {string} on {string} wizard',
  async function (tabName, tabSelector, wizard) {
    const arr = await waitForRowIndexesByColumnValue(
      this.page,
      pageObjects[wizard][tabSelector],
      'key',
      tabName
    )
    const indx = arr[0]

    await isTabActive(this.page, pageObjects[wizard][tabSelector], indx)
  }
)

Then(
  'verify {string} on {string} wizard should contains {string}.{string}',
  async function (tabSelector, wizard, constWizard, constValue) {
    const compareResult = await checkTableColumnValues(
      this.page,
      pageObjects[wizard][tabSelector],
      'key',
      pageObjectsConsts[constWizard][constValue]
    )

    expect(compareResult).toBe(true)
  }
)

When(
  'select {string} tab in {string} on {string} wizard',
  async function (tabName, tabSelector, wizard) {
    const arr = await waitForRowIndexesByColumnValue(
      this.page,
      pageObjects[wizard][tabSelector],
      'key',
      tabName
    )
    const indx = arr[0]

    await clickOnComponent(this.page, pageObjects[wizard][tabSelector]['tableFields']['key'](indx))
  }
)

Then(
  'verify {string} on {string} wizard should display {string}.{string}',
  async function (inputField, wizard, constStorage, constValue) {
    await checkHintText(
      this.page,
      pageObjects[wizard][inputField],
      pageObjects['commonPagesHeader']['Common_Hint'],
      pageObjectsConsts[constStorage][constValue]
    )
  }
)

Then(
  'verify {string} in {string} on {string} wizard should display {string}.{string}',
  async function (inputField, accordion, wizard, constStorage, constValue) {
    await checkHintTextWithHover(
      this.page,
      pageObjects[wizard][accordion][inputField],
      pageObjects['commonPagesHeader']['Common_Tolltip'],
      pageObjectsConsts[constStorage][constValue]
    )
  }
)

Then(
  'verify {string} element on {string} wizard should display hover tooltip {string}.{string}',
  async function (inputField, wizard, constStorage, constValue) {
    await checkComponentHintTextWithHover(
      this.page,
      pageObjects[wizard][inputField],
      pageObjects['commonPagesHeader']['Common_Tolltip'],
      pageObjectsConsts[constStorage][constValue]
    )
  }
)

Then(
  'verify {string} element on {string} wizard should display hover hint {string}.{string}',
  async function (inputField, wizard, constStorage, constValue) {
    await checkComponentHintTextWithHover(
      this.page,
      pageObjects[wizard][inputField],
      pageObjects['commonPagesHeader']['Common_Hint'],
      pageObjectsConsts[constStorage][constValue]
    )
  }
)

Then(
  'verify {string} element in {string} on {string} wizard should display hover tooltip {string}.{string}',
  async function (inputField, accordion, wizard, constStorage, constValue) {
    await checkComponentHintTextWithHover(
      this.page,
      pageObjects[wizard][accordion][inputField],
      pageObjects['commonPagesHeader']['Common_Tolltip'],
      pageObjectsConsts[constStorage][constValue]
    )
  }
)

Then(
  'verify {string} element in {string} on {string} wizard should display hover hint {string}.{string}',
  async function (inputField, accordion, wizard, constStorage, constValue) {
    await checkComponentHintTextWithHover(
      this.page,
      pageObjects[wizard][accordion][inputField],
      pageObjects['commonPagesHeader']['Common_Hint'],
      pageObjectsConsts[constStorage][constValue]
    )
  }
)

Then(
  'verify {string} on {string} wizard should display options {string}.{string}',
  async function (inputField, wizard, constStorage, constValue) {
    await checkWarningHintText(
      this.page,
      pageObjects[wizard][inputField],
      pageObjects['commonPagesHeader']['Common_Options'],
      pageObjectsConsts[constStorage][constValue]
    )
  }
)

Then(
  'verify labels warning should display options {string}.{string}',
  async function (constStorage, constValue) {
    await checkWarningText(
      this.page,
      pageObjects['commonPagesHeader']['Common_Options'],
      pageObjectsConsts[constStorage][constValue]
    )
  }
)

Then(
  'verify {string} in {string} on {string} wizard should display options {string}.{string}',
  async function (inputField, accordion, wizard, constStorage, constValue) {
    await checkWarningHintText(
      this.page,
      pageObjects[wizard][accordion][inputField],
      pageObjects['commonPagesHeader']['Common_Options'],
      pageObjectsConsts[constStorage][constValue]
    )
  }
)

Then(
  'verify {string} element in {string} on {string} wizard should display hint {string}.{string}',
  async function (inputField, accordion, wizard, constStorage, constValue) {
    await checkHintText(
      this.page,
      pageObjects[wizard][accordion][inputField],
      pageObjects['commonPagesHeader']['Common_Hint'],
      pageObjectsConsts[constStorage][constValue]
    )
  }
)

Then(
  'verify {string} on {string} wizard should display hover warning {string}.{string}',
  async function (input, wizard, constStorage, constValue) {
    await clickOnComponent(this.page, pageObjects[wizard][input]['inputField'])
    await clickNearComponent(this.page, pageObjects[wizard][input]['inputField'])
    await checkWarningHintTextWithHover(
      this.page,
      pageObjects[wizard][input],
      pageObjects[wizard][input]['warningText'],
      pageObjectsConsts[constStorage][constValue]
    )
  }
)

Then(
  'verify {string} element in {string} on {string} wizard should display hover warning {string}.{string}',
  async function (input, accordion, wizard, constStorage, constValue) {
    await clickOnComponent(this.page, pageObjects[wizard][accordion][input]['inputField'])
    await clickNearComponent(this.page, pageObjects[wizard][accordion][input]['inputField'])
    await checkWarningHintTextWithHover(
      this.page,
      pageObjects[wizard][accordion][input],
      pageObjects[wizard][accordion][input]['warningText'],
      pageObjectsConsts[constStorage][constValue]
    )
  }
)

When('check {string} element on {string} wizard', async function (checkbox, wizard) {
  await checkCheckbox(this.page, pageObjects[wizard][checkbox])
})

When(
  'check {string} element in {string} on {string} wizard',
  async function (checkbox, accordion, wizard) {
    await checkCheckbox(this.page, pageObjects[wizard][accordion][checkbox])
  }
)

When(
  'uncheck {string} element in {string} on {string} wizard',
  async function (checkbox, accordion, wizard) {
    await uncheckCheckbox(this.page, pageObjects[wizard][accordion][checkbox])
  }
)

When('uncheck {string} element on {string} wizard', async function (checkbox, wizard) {
  await uncheckCheckbox(this.page, pageObjects[wizard][checkbox])
})

Then('{string} element should be unchecked on {string} wizard', async function (checkbox, wizard) {
  await isCheckboxUnchecked(this.page, pageObjects[wizard][checkbox])
})

Then(
  '{string} element should be unchecked in {string} on {string} wizard',
  async function (checkbox, accordion, wizard) {
    await isCheckboxUnchecked(this.page, pageObjects[wizard][accordion][checkbox])
  }
)

Then('{string} element should be checked on {string} wizard', async function (checkbox, wizard) {
  await isCheckboxChecked(this.page, pageObjects[wizard][checkbox])
})

Then(
  '{string} element should be checked in {string} on {string} wizard',
  async function (checkbox, accordion, wizard) {
    await isCheckboxChecked(this.page, pageObjects[wizard][accordion][checkbox])
  }
)

When(
  'click on {string} element in {string} on {string} wizard',
  async function (component, accordion, wizardName) {
    await waitForComponentAttached(this.page, pageObjects[wizardName][accordion][component])
    await clickOnComponent(this.page, pageObjects[wizardName][accordion][component])
    await waitForPageQuiet(this.page)
  }
)

Then(
  'is {string} in {string} on {string} selected',
  async function (radiobutton, accordion, wizard) {
    await isRadioButtonSelected(this.page, pageObjects[wizard][accordion][radiobutton])
  }
)

Then(
  'is not {string} in {string} on {string} selected',
  async function (radiobutton, accordion, wizard) {
    await isRadioButtonUnselected(this.page, pageObjects[wizard][accordion][radiobutton])
  }
)

When('select {string} in {string} on {string}', async function (radiobutton, accordion, wizard) {
  await selectRadiobutton(this.page, pageObjects[wizard][accordion][radiobutton])
})

Then(
  'verify options in {string} combobox in {string} on {string} wizard should contains {string}.{string}',
  async function (combobox, accordion, wizard, constStorage, constValue) {
    await openDropdown(this.page, pageObjects[wizard][accordion][combobox]['dropdown'])
    await checkDropdownOptions(
      this.page,
      pageObjects[wizard][accordion][combobox]['dropdown'],
      pageObjectsConsts[constStorage][constValue]
    )
    await clickNearComponent(
      this.page,
      pageObjects[wizard][accordion][combobox]['dropdown']['open_button']
    )
  }
)
When(
  'select {string} option in {string} combobox on {string} accordion on {string} wizard',
  async function (option, comboBox, accordion, wizardName) {
    await openDropdown(this.page, pageObjects[wizardName][accordion][comboBox]['dropdown'])
    await selectOptionInDropdownWithoutCheck(
      this.page,
      pageObjects[wizardName][accordion][comboBox]['dropdown'],
      option
    )
  }
)

When(
  'select {string} option in {string} combobox suggestion on {string} accordion on {string} wizard',
  async function (option, comboBox, accordion, wizard) {
    await selectOptionInDropdownWithoutCheck(
      this.page,
      pageObjects[wizard][accordion][comboBox]['comboDropdown'],
      option
    )
    await waitForPageQuiet(this.page)
  }
)

Then('select {string} option in action menu on {string} wizard', async function (option, wizard) {
  const actionMenu = pageObjects[wizard]['Action_Menu']

  await openActionMenu(this.page, actionMenu)
  await selectOptionInActionMenu(this.page, actionMenu, option)
})

Then(
  'select {string} option in full view action menu on {string} wizard',
  async function (option, wizard) {
    const actionMenu = pageObjects[wizard]['Action_Menu_Full_View']

    await openActionMenu(this.page, actionMenu)
    await selectOptionInActionMenu(this.page, actionMenu, option)
  }
)

Then(
  'check that {string} option in action menu on {string} wizard is enabled',
  async function (option, wizard) {
    const actionMenu = pageObjects[wizard]['Action_Menu']

    await openActionMenuIfClosed(this.page, actionMenu)
    await verifyOptionInActionMenuEnabled(this.page, actionMenu, option)
  }
)

Then(
  'check that {string} option in action menu on {string} wizard is disabled',
  async function (option, wizard) {
    const actionMenu = pageObjects[wizard]['Action_Menu']

    await openActionMenuIfClosed(this.page, actionMenu)
    await verifyOptionInActionMenuDisabled(this.page, actionMenu, option)
  }
)

Then('check that {string} file is existed on {string} directory', async function (file, filePath) {
  // `filePath` is the browser's downloads folder: the downloads of the scenario are saved to its output directory
  const path = await generatePath(file, this.downloads)

  await determineFileAccess(path, file)
})

Then('verify {string} options rules on {string} wizard', async function (inputField, wizardName) {
  await checkInputAccordingHintText(
    this.page,
    this.attach,
    pageObjects[wizardName][inputField],
    pageObjects['commonPagesHeader']['Common_Options']
  )
})

Then(
  'verify {string} options rules on form {string} wizard',
  async function (inputField, wizardName) {
    await checkInputAccordingHintText(
      this.page,
      this.attach,
      pageObjects[wizardName][inputField],
      pageObjects['commonPagesHeader']['Common_Options'],
      true
    )
  }
)

Then(
  'verify {string} options rules on {string} wizard with labels',
  async function (inputField, wizardName) {
    await checkInputAccordingHintText(
      this.page,
      this.attach,
      pageObjects[wizardName][inputField],
      pageObjects['commonPagesHeader']['Common_Options'],
      false,
      true,
      this.testInfo
    )
  }
)

Then(
  'verify breadcrumbs {string} label should be equal {string} value',
  async function (labelType, value) {
    await verifyText(
      this.page,
      pageObjects['commonPagesHeader']['Breadcrumbs'][`${labelType}Label`],
      value
    )
  }
)

Then(
  'verify value should equal {string} in {string} on {string} wizard',
  async function (value, componentName, wizardName) {
    await verifyText(this.page, pageObjects[wizardName][componentName]['label'], value)
  }
)

Then(
  'verify {string} input should contains {string} value on {string} wizard',
  async function (component, value, wizard) {
    await verifyTypedValue(this.page, pageObjects[wizard][component], value)
  }
)
Then(
  'verify {string} input should contains {string} placeholder value on {string} wizard',
  async function (component, value, wizard) {
    await verifyPlaceholder(this.page, pageObjects[wizard][component], value)
  }
)

Then(
  'verify {string} input should contains {string} value in {string} on {string} wizard',
  async function (component, value, accordion, wizard) {
    await verifyTypedValue(this.page, pageObjects[wizard][accordion][component], value)
  }
)

Then(
  'verify value should equal {string}.{string} in {string} on {string} wizard',
  async function (constStorage, constValue, componentName, wizardName) {
    await verifyText(
      this.page,
      pageObjects[wizardName][componentName]['label'],
      pageObjectsConsts[constStorage][constValue]
    )
  }
)

Then('select {string} item in sidebar menu', async function (itemLabel) {
  await selectSidebarItem(this.page, itemLabel)
})

Then('select {string} project in sidebar project dropdown', async function (projectName) {
  await selectSidebarProject(this.page, projectName)
})

// for project pages that are not available in the sidebar (e.g. "quick-actions")
Then('open {string} page of current project by url', async function (page) {
  const url = this.page.url()
  const [projectsPath, projectName] = new URL(url).pathname.split('/').slice(1, 3)

  await navigateToPage(
    this.page,
    `http://${test_url}:${test_port}/${projectsPath}/${projectName}/${page}`
  )
})

Then(
  'verify workflow graph nodes and arrows connections on {string} on {string} wizard',
  async function (graphName, wizardName) {
    await checkWorkflowGraphConnections(this.page, pageObjects[wizardName][graphName])
  }
)

When('hover {string} component on {string} wizard', async function (componentName, wizardName) {
  await hoverComponent(this.page, pageObjects[wizardName][componentName], true)
})

When(
  'pan {string} graph on {string} wizard to show {string} element',
  async function (graphName, wizardName, componentName) {
    const component = pageObjects[wizardName][componentName]

    await panGraphToElement(
      this.page,
      pageObjects[wizardName][graphName].root,
      component.root ?? component
    )
  }
)

When(
  'click on node with name {string} in {string} graph on {string} wizard',
  async function (nodeName, graphName, wizardName) {
    const arr = await waitForRowIndexesByColumnValue(
      this.page,
      pageObjects[wizardName][graphName]['nodesTable'],
      'name',
      nodeName
    )
    const indx = arr[0]

    await clickOnComponent(
      this.page,
      pageObjects[wizardName][graphName].nodesTable.tableFields['name'](indx)
    )
  }
)

// verifies the `data-{state}` attribute, e.g. `data-pinned="true"` of the sidebar
Then(
  '{string} on {string} wizard should be {string}',
  async function (componentName, wizardName, state) {
    await verifyComponentContainsAttributeValue(
      this.page,
      pageObjects[wizardName][componentName],
      `data-${state}`,
      'true'
    )
  }
)

Then(
  '{string} on {string} wizard should not be {string}',
  async function (componentName, wizardName, state) {
    await verifyComponentNotContainsAttributeValue(
      this.page,
      pageObjects[wizardName][componentName],
      `data-${state}`,
      'true'
    )
  }
)

Then(
  'compare {string} element value on {string} wizard with test {string} context value',
  async function (componentName, wizardName, fieldName) {
    await verifyText(this.page, pageObjects[wizardName][componentName], this.testContext[fieldName])
  }
)

Then(
  'compare {string} element value in {string} on {string} wizard with test {string} context value',
  async function (componentName, accordionName, wizardName, fieldName) {
    await verifyText(
      this.page,
      pageObjects[wizardName][accordionName][componentName],
      this.testContext[fieldName]
    )
  }
)

// retried: the single read could get the URL before the app completed it
Then('compare current browser URL with test {string} context value', async function (savedValue) {
  await expect(this.page).toHaveURL(this.testContext[savedValue])
})

Then(
  'check {string} textarea counter on {string} wizard',
  async function (componentName, wizardName) {
    await verifyTextAreaCounter(this.page, pageObjects[wizardName][componentName])
  }
)

Then(
  'check {string} textarea counter in {string} on {string} wizard',
  async function (componentName, accordionName, wizardName) {
    await verifyTextAreaCounter(this.page, pageObjects[wizardName][accordionName][componentName])
  }
)
