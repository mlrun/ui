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

import { expectTimeout } from '../../../config.js'
import {
  click,
  getAttribute,
  getTexts,
  pollOptions,
  readOrNull,
  retryAssertion,
  waitForDownloadItemsRemoved,
  withExactText
} from '../../common-tools/element.js'

async function getOptionValues(page, options) {
  return getTexts(page.locator(options))
}

// the menu body is rendered only while the menu is open (ActionsMenu), so the options in the DOM mean it is open: the
// text of the options is empty while they fade in, and the open button toggles, so an open menu must not be clicked
const isActionMenuOpen = async (page, actionMenu) =>
  (await page.locator(actionMenu.options).count()) > 0

// the open button toggles the menu. The row (its buttons) can be re-rendered right after the hover and the menu closes
// with it, so the click is repeated until the menu is open. The options are read as a snapshot by the selecting
// helpers, so wait until their text is rendered
export const openActionMenu = async (page, actionMenu) => {
  await retryAssertion(async () => {
    if (await isActionMenuOpen(page, actionMenu)) return

    await click(page.locator(actionMenu.open_button).first())
    await expect.poll(() => isActionMenuOpen(page, actionMenu), { timeout: 1500 }).toBe(true)
  }, 8000).catch(() => {})
}

// opens the menu unless it is open already: the open button toggles the menu, so a step that clicks it after a
// previous step opened the menu (e.g. "dropdown element should contains" + "option is enabled") closes it
export const openActionMenuIfClosed = async (page, actionMenu) => {
  const isOpen = () => isActionMenuOpen(page, actionMenu)

  if (await isOpen()) return

  await openActionMenu(page, actionMenu)
  await expect
    .poll(isOpen, {
      timeout: expectTimeout,
      message: `The action menu is not open: ${actionMenu.open_button}`
    })
    .toBe(true)
}

// the options are rendered after the menu is opened, so the search is retried
export const selectOptionInActionMenu = async (page, actionMenu, option) => {
  // the same file downloaded again while the previous download is still in the notification list is rendered twice
  // (duplicate keys) and the notification flickers, so it can't be clicked
  if (option === 'Download') await waitForDownloadItemsRemoved(page)

  return selectOption(page, actionMenu, option)
}

const selectOption = (page, actionMenu, option) =>
  retryAssertion(async () => {
    // the menu is closed by a re-render of the row
    if (!(await isActionMenuOpen(page, actionMenu))) await openActionMenu(page, actionMenu)

    const options = page.locator(actionMenu.options)

    if (!(await getTexts(options)).includes(option)) {
      throw new Error(`"${option}" option is not found in the action menu`)
    }

    await click(withExactText(options, option).first(), { timeout: 2000 })
  }, 10000)

// the same options in the same order (the previous check: the same length and every option equal by index)
export const checkActionMenuOptions = async (page, actionMenu, values, timeout) =>
  expect
    .poll(
      readOrNull(() => getOptionValues(page, actionMenu.options)),
      pollOptions('Options of the action menu', timeout)
    )
    .toEqual(values)

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
