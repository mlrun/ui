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
import { readTimeout } from '../../../config.js'
import { click, isSelected, pollOptions, readOrNull } from '../../common-tools/element.js'

// retried: the single read right after the click could get the previous state. `isSelected` (`checked` or
// `selected`), not `toBeChecked`: it fails on an element that is not a checkbox or a radio input
const pollSelected = (page, radiobutton) => {
  const element = page.locator(radiobutton['radiobutton']).first()

  return expect.poll(
    readOrNull(() => isSelected(element, { timeout: readTimeout })),
    pollOptions('Radio button is selected')
  )
}

export const isRadioButtonSelected = async (page, radiobutton) =>
  pollSelected(page, radiobutton).toBe(true)

export const isRadioButtonUnselected = async (page, radiobutton) =>
  pollSelected(page, radiobutton).toBe(false)

export const selectRadiobutton = async (page, radiobutton) => {
  const element = page.locator(radiobutton['radiobutton']).first()
  const elementName = page.locator(radiobutton['name']).first()
  const selected = await isSelected(element)
  if (!selected) {
    await click(elementName)
  }
}
