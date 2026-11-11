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
  getAttribute,
  getText,
  getTexts,
  retryAssertion
} from '../../common-tools/element.js'

export const getOptionValues = async (page, options) => {
  return getTexts(page.locator(options))
}

export const openDropdown = async (page, dropdown, scroll = true) => {
  const element = page.locator(dropdown.open_button).first()
  if (scroll) {
    await scrollToWebElement(page, element)
  }
  if (element) {
    await click(element)
  }
  await page.waitForTimeout(1500)
}

export const collapseDropdown = async (page, dropdown) => {
  await clickNearComponent(page, dropdown.root)
  await page.waitForTimeout(100)
}

export const selectOptionInDropdown = async (page, dropdown, option) => {
  const selectedElement = page.locator(dropdown.open_button).first()
  const selectedText = await getText(selectedElement)
  if (selectedText !== option) {
    const elements = await page.locator(dropdown.options).all()
    for (const element of elements) {
      await scrollToWebElement(page, element)
      const txt = await getText(element)
      if (txt === option) {
        await click(element)
        await page.waitForTimeout(250)
        return
      }
    }
    // nothing was selected: the scenario must not go on as if it was (e.g. an outdated options locator)
    throw new Error(
      `"${option}" option is not found in the dropdown, options: [${await getOptionValues(page, dropdown.options)}]`
    )
  } else {
    await click(selectedElement)
    await page.waitForTimeout(500)
  }
}

export const selectOptionInDropdownWithoutCheck = async (page, dropdown, option) => {
  const elements = await page.locator(dropdown.options).all()
  for (const element of elements) {
    const txt = await getText(element)
    if (txt === option) {
      await click(element)
      await page.waitForTimeout(500)
      return
    }
  }
  throw new Error(
    `"${option}" option is not found in the dropdown, options: [${await getOptionValues(page, dropdown.options)}]`
  )
}

export const checkDropdownSelectedOption = async (page, dropdown, option) =>
  retryAssertion(async () => {
    const element = page.locator(dropdown.open_button).first()
    const txt = await getText(element)
    expect(txt).toBe(option)
  })

export const checkDropdownSelectedOptionWithAttribute = async (page, dropdown, option) =>
  retryAssertion(async () => {
    const element = page.locator(dropdown.open_button).first()
    const attributeTxt = await getAttribute(element, 'value')
    expect(attributeTxt).toBe(option)
  })

// the options must be exactly the expected ones: the previous check (actual options minus expected ones is empty)
// passed when the dropdown didn't open (no options) and when expected options were missing
export const checkDropdownOptions = (page, dropdown, values) =>
  checkDropdownContainsOptions(page, dropdown, values)

export const checkDropdownContainsOptions = async (page, dropdown, values) =>
  retryAssertion(async () => {
    const options = await getOptionValues(page, dropdown.options)
    let notPresent = []
    for (let option of values) {
      if (options.every(item => item !== option)) {
        notPresent.push(option)
      }
    }

    let extraPresent = []
    for (let option of options) {
      if (values.every(item => item !== option)) {
        extraPresent.push(option)
      }
    }

    expect(
      notPresent.length,
      '\nOptions not present: ' +
        notPresent +
        '\noptions: ' +
        options +
        '\nexpected: ' +
        values +
        '\n'
    ).toBe(0)

    expect(
      extraPresent.length,
      '\nExtra unexpected options: ' +
        extraPresent +
        '\noptions: ' +
        options +
        '\nexpected: ' +
        values +
        '\n'
    ).toBe(0)
  })
