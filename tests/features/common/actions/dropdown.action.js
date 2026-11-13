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
import { expect } from '@playwright/test'
import { clickNearComponent, scrollToWebElement } from './common.action.js'
import {
  click,
  expectSameItems,
  expectText,
  getText,
  getTexts,
  pollAttribute,
  retryAssertion,
  waitForPageQuiet,
  waitForScrollQuiet,
  waitUntilStable,
  withExactText
} from '../../common-tools/element.js'

export const getOptionValues = async (page, options) => {
  // an option is read once, also when the locator matches its label and the nested tooltip wrapper
  return getTexts(page.locator(options), { outermost: true })
}

export const openDropdown = async (page, dropdown, scroll = true) => {
  const element = page.locator(dropdown.open_button).first()
  // the page can be re-rendering after the previous action
  await waitForPageQuiet(page)
  if (scroll) {
    await scrollToWebElement(page, element)
  }
  // the button toggles the list: a list that is still open after the previous step (e.g. the click away didn't close
  // it) must not be closed by the click
  const isOpen = dropdown.options ? await page.locator(dropdown.options).first().isVisible() : false
  if (element && !isOpen) {
    await click(element)
  }
  // the options are read as a snapshot by the selecting helpers, so wait until the list settles: the texts are
  // rendered (they fade in: an option with `opacity: 0` has no text yet), the options are loaded and the list is
  // scrolled to the selected one. A click on an option made earlier hits a moving or re-created element and
  // closes the popup
  if (dropdown.options) {
    const firstOption = page.locator(dropdown.options).first()

    await expect
      .poll(async () => (await getOptionValues(page, dropdown.options)).some(text => text !== ''), {
        timeout: 3000
      })
      .toBe(true)
      .catch(() => {})
    await waitUntilStable(
      async () => ({
        texts: await getOptionValues(page, dropdown.options),
        box: await firstOption.boundingBox({ timeout: 500 }).catch(() => null)
      }),
      { timeout: 3000, interval: 80 }
    )
    await waitForScrollQuiet(page)
  }
}

export const collapseDropdown = async (page, dropdown) => {
  await clickNearComponent(page, dropdown.root)
  await waitForPageQuiet(page)
}

// the options can be still rendered (or loaded), so the search is retried. The click scrolls the option into view and
// waits until it stops moving itself: scrolling every option of a long list first leaves the list still scrolling
// when the click is made, and the click outside of the list closes the popup
const clickOptionByText = (page, dropdown, option) =>
  retryAssertion(async () => {
    const texts = await getOptionValues(page, dropdown.options)

    // nothing is selected otherwise: the scenario must not go on as if it was (e.g. an outdated options locator)
    if (!texts.includes(option)) {
      throw new Error(`"${option}" option is not found in the dropdown, options: [${texts}]`)
    }

    const optionElement = withExactText(page.locator(dropdown.options), option).first()

    await click(optionElement)
    await waitForPageQuiet(page)
  }, 5000)

export const selectOptionInDropdown = async (page, dropdown, option) => {
  const selectedElement = page.locator(dropdown.open_button).first()
  const selectedText = await getText(selectedElement)
  if (selectedText !== option) {
    // the options can be still rendered (or loaded), so the search is retried
    await clickOptionByText(page, dropdown, option)
  } else {
    await click(selectedElement)
  }
}

export const selectOptionInDropdownWithoutCheck = async (page, dropdown, option) =>
  clickOptionByText(page, dropdown, option)

export const checkDropdownSelectedOption = async (page, dropdown, option) =>
  expectText(page.locator(dropdown.open_button).first(), option, {
    message: 'Selected dropdown option'
  })

export const checkDropdownSelectedOptionWithAttribute = async (page, dropdown, option) =>
  pollAttribute(page.locator(dropdown.open_button).first(), 'value', {
    message: 'Selected dropdown option'
  }).toBe(option)

// the options must be exactly the expected ones: the previous check (actual options minus expected ones is empty)
// passed when the dropdown didn't open (no options) and when expected options were missing
export const checkDropdownOptions = (page, dropdown, values) =>
  checkDropdownContainsOptions(page, dropdown, values)

export const checkDropdownContainsOptions = async (page, dropdown, values) =>
  retryAssertion(async () => {
    const options = await getOptionValues(page, dropdown.options)

    expectSameItems(options, values, 'Options of the dropdown')
  })
