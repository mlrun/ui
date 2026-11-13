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
import {
  getAttribute,
  getTexts,
  pollAttribute,
  retryAssertion,
  sendKeys,
  waitForPageQuiet
} from '../../common-tools/element.js'

export const clearManually = async inputField => {
  const existValue = await getAttribute(inputField, 'value')
  for (let i = 0; i <= existValue.length; i++) {
    await inputField.press('Backspace')
    await inputField.press('Delete')
  }
}

export const getOptionValues = async (page, options) => {
  // an option is read once, also when the locator matches its label and the nested tooltip wrapper
  return getTexts(page.locator(options), { outermost: true })
}

export const typeSearchableValue = async (page, inputGroup, value) => {
  const inputField = page.locator(inputGroup.inputField).first()
  // the previous suggestion is being handled (e.g. its data is fetched), the typed value would be lost
  await waitForPageQuiet(page)
  await clearManually(inputField)
  return await sendKeys(inputField, value)
}

// retried: the single read right after typing could get the value before the typed one was handled
export const verifyTypedValue = async (page, inputGroup, value) =>
  pollAttribute(page.locator(inputGroup.inputField).first(), 'value', {
    message: 'Input value'
  }).toBe(value)

// retried: the suggestions are rendered after the typed value is handled and they can be fetched (e.g. the artifacts
// of the typed project). EVERY suggestion must contain the fragment (the steps say "every"): one was enough before, so a
// list that was not filtered at all passed
export const isContainsSubstringInSuggestedOptions = async (
  page,
  inputGroup,
  value,
  ignoreCase = false
) =>
  retryAssertion(async () => {
    let arr = await getOptionValues(page, inputGroup.options)
    let tmpValue = value

    if (ignoreCase) {
      arr = arr.map(item => item.toLowerCase())
      tmpValue = value.toLowerCase()
    }

    const notMatching = arr.filter(item => !item.includes(tmpValue))

    expect(arr.length > 0, `No suggestions are shown for "${value}"`).toBe(true)
    expect(
      notMatching,
      `Suggestions without "${tmpValue}": [${notMatching}], all suggestions: [${arr}]`
    ).toEqual([])
  })
