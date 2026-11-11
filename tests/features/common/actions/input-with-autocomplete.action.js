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
import { getAttribute, getTexts, retryAssertion, sendKeys } from '../../common-tools/element.js'

export const clearManually = async inputField => {
  const existValue = await getAttribute(inputField, 'value')
  for (let i = 0; i <= existValue.length; i++) {
    await inputField.press('Backspace')
    await inputField.press('Delete')
  }
}

export const getOptionValues = async (page, options) => {
  return getTexts(page.locator(options))
}

export const typeSearchableValue = async (page, inputGroup, value) => {
  const inputField = page.locator(inputGroup.inputField).first()
  await clearManually(inputField)
  return await sendKeys(inputField, value)
}

export const verifyTypedValue = async (page, inputGroup, value) => {
  const inputField = page.locator(inputGroup.inputField).first()
  const txt = await getAttribute(inputField, 'value')
  expect(txt).toBe(value)
}

// retried: the suggestions are rendered after the typed value is handled and they can be fetched (e.g. the artifacts
// of the typed project)
export const isContainsSubstringInSuggestedOptions = async (
  page,
  inputGroup,
  value,
  caseSensitive = false
) =>
  retryAssertion(async () => {
    let arr = await getOptionValues(page, inputGroup.options)
    let tmpValue = value

    if (caseSensitive) {
      arr = arr.map(item => item.toLowerCase())
      tmpValue = value.toLowerCase()
    }

    expect(arr.length > 0, `Elements not found: [${arr}]`).toBe(true)
    expect(
      arr.some(item => item.includes(tmpValue)),
      `Searcheble string "${tmpValue}" do not find in all values of: [${arr}]`
    ).toBe(true)
  })
