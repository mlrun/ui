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
import { isEqual } from 'lodash-es'
import {
  click,
  getAttribute,
  getText,
  getTexts,
  retryAssertion,
  waitUntil
} from '../../common-tools/element.js'

async function getOptionValues(page, options) {
  return getTexts(page.locator(options))
}

export const openActionMenu = async (page, actionMenu) => {
  const element = page.locator(actionMenu.open_button).first()
  if (element) {
    await click(element)
  }
}

// opens the menu unless it is open already: the open button toggles the menu, so a step that clicks it after a
// previous step opened the menu (e.g. "dropdown element should contains" + "option is enabled") closes it
export const openActionMenuIfClosed = async (page, actionMenu) => {
  const isOpen = async () =>
    (await getTexts(page.locator(actionMenu.options))).some(text => text !== '')

  if (await isOpen()) return

  await openActionMenu(page, actionMenu)
  await waitUntil(isOpen, 5000, `The action menu is not open: ${actionMenu.open_button}`)
}

export const selectOptionInActionMenu = async (page, actionMenu, option) => {
  const elements = await page.locator(actionMenu.options).all()
  for (const element of elements) {
    if ((await getText(element)) === option) {
      await click(element)

      return
    }
  }

  throw new Error(`"${option}" option is not found in the action menu`)
}

export const checkActionMenuOptions = async (page, actionMenu, values) => {
  const options = await getOptionValues(page, actionMenu.options)

  if (options.length === values.length) {
    const diff = options.every((elem, index) => isEqual(elem, values[index]))
    expect(
      diff,
      `Actual options in action menu [${options}] don't match with expected values [${values}]`
    ).toBe(true)
  } else {
    expect(
      options.length,
      `Actual options in action menu [${options}] don't match with expected values [${values}]`
    ).toBe(values.length)
  }
}

// the option must be in the (open) menu: the previous version asserted only inside the loop over the found options,
// so an absent option, or a menu that wasn't open (hidden options have no text), passed
const verifyOptionInActionMenuState = (page, actionMenu, option, isDisabled) =>
  retryAssertion(async () => {
    const options = page.locator(actionMenu.options)
    const texts = await getTexts(options)
    const index = texts.indexOf(option)

    expect(
      index,
      `"${option}" option is not found in the action menu, options: [${texts}]`
    ).not.toBe(-1)

    const attributes = await getAttribute(options.nth(index), 'class')

    expect(
      attributes.includes('actions-menu__option_disabled'),
      `"${option}" option is expected to be ${isDisabled ? 'disabled' : 'enabled'}`
    ).toBe(isDisabled)
  })

export const verifyOptionInActionMenuEnabled = (page, actionMenu, option) =>
  verifyOptionInActionMenuState(page, actionMenu, option, false)

export const verifyOptionInActionMenuDisabled = (page, actionMenu, option) =>
  verifyOptionInActionMenuState(page, actionMenu, option, true)
