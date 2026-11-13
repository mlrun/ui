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
import { expectTimeout, readTimeout, timeout } from '../../../config.js'
import { expect } from '@playwright/test'
import sidebar from '../components/sidebar.component.js'
import { hoverElementCenter, scrollToWebElement } from './common.action.js'
import {
  click,
  getAttribute,
  getRect,
  isDisplayed,
  waitForPageQuiet
} from '../../common-tools/element.js'

const isSidebarPinned = async page => {
  const element = page.locator(sidebar.root).first()

  return (await getAttribute(element, 'data-pinned')) === 'true'
}

// the sidebar expands/collapses on hover, a few seconds are enough (shorter than the step timeout, so it can be retried)
const SIDEBAR_STATE_TIMEOUT = 5000
const SIDEBAR_HOVER_ATTEMPTS = 3

const waitSidebarState = async (page, state, waitTimeout = expectTimeout) => {
  await expect
    .poll(() => getAttribute(page.locator(sidebar.root).first(), 'data-state'), {
      timeout: waitTimeout,
      message: `Sidebar is not ${state}`
    })
    .toBe(state)
  // wait for the width transition to finish: the box of the sidebar stops changing
  await getRect(page.locator(sidebar.root).first())
}

const movePointerOutOfSidebar = async page => {
  const { width, height } = page.viewportSize()

  await page.mouse.move(width - 5, Math.floor(height / 2))
}

export const openSidebar = async page => {
  await page.locator(sidebar.root).first().waitFor({ state: 'attached', timeout })
  const element = page.locator(sidebar.root).first()

  if ((await getAttribute(element, 'data-state')) !== 'expanded') {
    // if the pointer is already over the sidebar, moving it there doesn't fire `mouseenter`,
    // so move it out of the sidebar and back on retry
    for (let attempt = 1; attempt <= SIDEBAR_HOVER_ATTEMPTS; attempt++) {
      try {
        const body = page.locator(sidebar.body).first()
        await hoverElementCenter(page, body)
        await waitSidebarState(page, 'expanded', SIDEBAR_STATE_TIMEOUT)

        return
      } catch (error) {
        if (attempt === SIDEBAR_HOVER_ATTEMPTS) throw error

        await movePointerOutOfSidebar(page)
        await waitForPageQuiet(page)
      }
    }
  }
}

export const closeSidebar = async page => {
  if (!(await isSidebarPinned(page))) {
    // <Suspense> hides #main (display: none) while a lazy route chunk is loading,
    // an element without size has no point to move the pointer to
    await expect
      .poll(
        async () => {
          try {
            return await isDisplayed(page.locator('#main').first(), { timeout: readTimeout })
          } catch {
            return false
          }
        },
        { timeout: expectTimeout, message: 'Page content (#main) is not displayed' }
      )
      .toBeTruthy()
    const main = page.locator('#main').first()
    await hoverElementCenter(page, main)
    await waitSidebarState(page, 'collapsed')
  }
}

export const selectSidebarItem = async (page, label) => {
  await openSidebar(page)

  const links = page.locator(sidebar.link(label))

  // nested items are rendered only when their collapsible group is expanded
  if ((await links.count()) === 0) {
    // the nested items are menu buttons as well, so `groupButtons` matches them once a group is expanded:
    // the groups are taken by their test ids, not by their (shifting) positions in `groupButtons`
    const groupTestIds = await page
      .locator(sidebar.groupButtons)
      .evaluateAll(buttons =>
        buttons.map(
          button => button.closest('[data-testid^="sidebar-collapsible-menu-item-"]').dataset.testid
        )
      )

    for (const groupTestId of groupTestIds) {
      const groupButton = page
        .locator(`[data-testid="${groupTestId}"] [data-sidebar="menu-button"]`)
        .first()

      if ((await getAttribute(groupButton, 'data-state')) !== 'open') {
        await scrollToWebElement(page, groupButton)
        await click(groupButton)
        await waitForPageQuiet(page)
        if ((await links.count()) > 0) break
      }
    }
  }

  expect(await links.count(), `Sidebar item "${label}" was not found`).toBe(1)

  await scrollToWebElement(page, links.first())
  await click(links.first())
  await waitForPageQuiet(page)
  await closeSidebar(page)
}

export const selectSidebarProject = async (page, projectName) => {
  await openSidebar(page)

  const trigger = page.locator(sidebar.projectDropdown.open_button).first()
  await click(trigger)
  await page
    .locator(sidebar.projectDropdown.content)
    .first()
    .waitFor({ state: 'attached', timeout })
  await waitForPageQuiet(page)

  const option = page.locator(sidebar.projectDropdown.option(projectName)).first()
  await scrollToWebElement(page, option)
  await click(option)
  await waitForPageQuiet(page)
  await closeSidebar(page)
}
