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
import { getAttribute, retryAssertion } from '../../common-tools/element.js'

export const isTabActive = async (page, component, indx) =>
  retryAssertion(async () => {
    const element1 = page.locator(component.rowRoot(indx)).first()
    const element2 = page.locator(component.tableFields['key'](indx)).first()
    const attributes1 = await getAttribute(element1, 'class')
    const attributes2 = await getAttribute(element2, 'class')
    const flag =
      attributes1.includes('content-menu__item_active') ||
      attributes2.includes('details-menu__tab_active') ||
      attributes2.includes('active-tab') ||
      attributes2.includes('tabs-slider__tab_active') ||
      attributes2.includes('content-menu__tab_active')
    expect(flag).toBe(true)
  })

// `isActive` - the expected state: the "is active" and "is NOT active" steps check the opposite states
// (the previous version accepted both states, so both steps passed for any row)
export const isRowActive = async (page, component, indx, isActive = true) =>
  retryAssertion(async () => {
    const element = page.locator(component.rowRoot(indx)).first()
    const attributes = await getAttribute(element, 'class')

    expect(
      attributes.includes('row_active'),
      `Row ${indx} is expected to be ${isActive ? 'active' : 'NOT active'}, its classes: "${attributes}"`
    ).toBe(isActive)
  })
