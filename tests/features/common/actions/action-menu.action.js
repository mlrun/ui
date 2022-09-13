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

async function getOptionValues(driver, options) {
  return await driver.findElements(options).then(function(elements) {
    return Promise.all(elements.map(element => element.getText()))
  })
}

const action = {
  openActionMenu: async function(driver, actionMenu) {
    const element = await driver.findElement(actionMenu.open_button)
    if (element) {
      element.click()
    }
  },
  selectOptionInActionMenu: async function(driver, actionMenu, option) {
    const elements = await driver.findElements(actionMenu.options)
    for (const element of elements) {
      element.getText().then(txt => {
        if (txt === option) {
          element.click()
        }
      })
    }
  },
  checkActionMenuOptions: async function(driver, actionMenu, values) {
    const options = await getOptionValues(driver, actionMenu.options)
    expect(differenceWith(options, values, isEqual).length).equal(0)
  }
}

module.exports = action
