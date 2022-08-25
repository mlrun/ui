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
import { differenceWith, isEqual } from 'lodash'
import { clickNearComponent, scrollToWebElement } from './common.action'

async function getOptionValues(driver, options) {
  return await driver.findElements(options).then(function(elements) {
    return Promise.all(elements.map(element => element.getText()))
  })
}

const action = {
  getOptionValues: getOptionValues,
  openDropdown: async function(driver, dropdown, scroll = true) {
    const element = await driver.findElement(dropdown.open_button)
    if (scroll) {
      await scrollToWebElement(driver, element)
    }
    if (element) {
      await element.click()
    }
    await driver.sleep(500)
  },
  collapseDropdown: async function(driver, dropdown) {
    // const element = await driver.findElement(dropdown.root)
    await clickNearComponent(dropdown.root)
    await driver.sleep(100)
  },
  selectOptionInDropdown: async function(driver, dropdown, option) {
    const selectedElement = await driver.findElement(dropdown.open_button)
    const selectedText = await selectedElement.getText()
    if (selectedText !== option) {
      const elements = await driver.findElements(dropdown.options)
      for (const element of elements) {
        await scrollToWebElement(driver, element)
        const txt = await element.getText()
        if (txt === option) {
          await element.click()
          await driver.sleep(250)
          break
        }
      }
    } else {
      selectedElement.click()
      await driver.sleep(500)
    }
  },
  selectOptionInDropdownWithoutCheck: async function(driver, dropdown, option) {
    const elements = await driver.findElements(dropdown.options)
    for (const element of elements) {
      const txt = await element.getText()
      if (txt === option) {
        await element.click()
        await driver.sleep(500)
        break
      }
    }
  },
  checkDropdownSelectedOption: async function(driver, dropdown, option) {
    const element = await driver.findElement(dropdown.open_button)
    const txt = await element.getText()
    expect(txt).equal(option)
  },
  checkDropdownOptions: async function(driver, dropdown, values) {
    const options = await getOptionValues(driver, dropdown.options)
    const diff = differenceWith(options, values, isEqual)
    expect(diff.length).equal(0, `Options difference: "${diff}"`)
  },
  checkDropdownContainsOptions: async function(driver, dropdown, values) {
    const options = await getOptionValues(driver, dropdown.options)
    let notPresent = []
    for (let option of values) {
      if (options.every(item => item !== option)) {
        notPresent.push(option)
      }
    }
    expect(notPresent.length).equal(
      0,
      '\nOptions not present: ' +
        notPresent +
        '\noptions: ' +
        options +
        '\nconst: ' +
        values +
        '\n'
    )
  }
}

module.exports = action
