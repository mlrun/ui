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

const action = {
  isTabActive: async function(driver, component, indx) {
    const element1 = await driver.findElement(component.rowRoot(indx))
    const element2 = await driver.findElement(
      component.tableFields['key'](indx)
    )
    const attributes1 = await element1.getAttribute('class')
    const attributes2 = await element2.getAttribute('class')
    const flag =
      attributes1.includes('content-menu__item_active') ||
      attributes2.includes('details-menu__tab_active') ||
      attributes2.includes('active-tab')
    expect(flag).equal(true)
  }
}

module.exports = action
