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
import { expect } from 'chai'
import { Key } from 'selenium-webdriver'

export const clearManually = async (inputField) => {
  const existValue = await inputField.getAttribute('value')
  for (let i = 0; i <= existValue.length; i++) {
    await inputField.sendKeys(Key.BACK_SPACE, Key.DELETE)
  }
}

export const getOptionValues = async (driver, options) => {
  return await driver.findElements(options).then(function(elements) {
    return Promise.all(elements.map(element => element.getText()))
  })
}

export const typeSearchableValue = async (driver, inputGroup, value) => {
    const inputField = await driver.findElement(inputGroup.inputField)
    await clearManually(inputField)
    return await inputField.sendKeys(value)
  }

export const verifyTypedValue = async (driver, inputGroup, value) => {
    const inputField = await driver.findElement(inputGroup.inputField)
    const txt = await inputField.getAttribute('value')
    expect(txt).equal(value)
  }

export const isContainsSubstringInSuggestedOptions = async (
    driver,
    inputGroup,
    value,
    caseSensitive = false
  ) => {
    let arr = await getOptionValues(driver, inputGroup.options)
    let tmpValue = value

    if (caseSensitive) {
      arr = arr.map(item => item.toLowerCase())
      tmpValue = value.toLowerCase()
    }

    expect(arr.length > 0).equal(true, `Elements not found: [${arr}]`)
    expect(arr.some(item => item.includes(tmpValue))).equal(
      true,
      `Searcheble string "${tmpValue}" do not find in all values of: [${arr}]`
    )
  }
