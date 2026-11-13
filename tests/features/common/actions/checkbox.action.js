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
  classContaining,
  click,
  getAttribute,
  waitForPageQuiet
} from '../../common-tools/element.js'

// a negative check: first let the page finish what the previous action started (see verifyClassEnabled)
export const isCheckboxChecked = async (page, checkbox) => {
  await waitForPageQuiet(page)
  await expect(page.locator(checkbox['checkbox']).first()).not.toHaveClass(
    classContaining('unchecked')
  )
}

export const isCheckboxUnchecked = async (page, checkbox) =>
  expect(page.locator(checkbox['checkbox']).first()).toHaveClass(classContaining('unchecked'))

export const checkCheckbox = async (page, checkbox) => {
  const checkboxElement = page.locator(checkbox['checkbox']).first()
  const classes = await getAttribute(checkboxElement, 'class')
  if (classes.includes('unchecked')) {
    await click(checkboxElement)
  }
}

export const uncheckCheckbox = async (page, checkbox) => {
  const checkboxElement = page.locator(checkbox['checkbox']).first()
  const classes = await getAttribute(checkboxElement, 'class')
  if (!classes.includes('unchecked')) {
    await click(checkboxElement)
  }
}

// a string - the whole class attribute, as the previous check
export const verifyCheckboxEnabled = async (page, component) =>
  expect(page.locator(component).first()).toHaveClass('checkbox')

export const verifyCheckboxDisabled = async (page, component) =>
  expect(page.locator(component).first()).toHaveClass('checkbox checkbox_disabled')
