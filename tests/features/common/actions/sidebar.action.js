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
import { timeout } from '../../../config.js'
import { expect } from '@playwright/test'
import sidebar from '../components/sidebar.component.js'
import { hoverElementCenter, scrollToWebElement } from './common.action.js'
import { click, getAttribute, isDisplayed, waitUntil } from '../../common-tools/element.js'

const isSidebarPinned = async page => {
  const element = page.locator(sidebar.root).first()

  return (await getAttribute(element, 'data-pinned')) === 'true'
}

// the sidebar expands/collapses on hover, a few seconds are enough (shorter than the step timeout, so it can be retried)
const SIDEBAR_STATE_TIMEOUT = 5000
const SIDEBAR_HOVER_ATTEMPTS = 3

const waitSidebarState = async (page, state, waitTimeout = timeout) => {
  await waitUntil(
    async () => {
      const element = page.locator(sidebar.root).first()

      return (await getAttribute(element, 'data-state')) === state
    },
    waitTimeout,
    `Sidebar is not ${state}`
  )
  // wait for the width transition to finish
  await page.waitForTimeout(350)
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
        await page.waitForTimeout(500)
      }
    }
  }
}

export const closeSidebar = async page => {
  if (!(await isSidebarPinned(page))) {
    // <Suspense> hides #main (display: none) while a lazy route chunk is loading,
    // an element without size has no point to move the pointer to
    await waitUntil(
      async () => {
        try {
          return await isDisplayed(page.locator('#main').first(), { timeout: 1000 })
        } catch {
          return false
        }
      },
      timeout / 2,
      'Page content (#main) is not displayed'
    )
    const main = page.locator('#main').first()
    await hoverElementCenter(page, main)
    await waitSidebarState(page, 'collapsed', timeout / 4)
  }
}

export const selectSidebarItem = async (page, label) => {
  await openSidebar(page)

  let links = await page.locator(sidebar.link(label)).all()

  // nested items are rendered only when their collapsible group is expanded
  if (links.length === 0) {
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
        await page.waitForTimeout(250)
        links = await page.locator(sidebar.link(label)).all()

        if (links.length > 0) break
      }
    }
  }

  expect(links.length, `Sidebar item "${label}" was not found`).toBe(1)

  await scrollToWebElement(page, links[0])
  await click(links[0])
  await page.waitForTimeout(250)
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
  await page.waitForTimeout(250)

  const option = page.locator(sidebar.projectDropdown.option(projectName)).first()
  await scrollToWebElement(page, option)
  await click(option)
  await page.waitForTimeout(250)
  await closeSidebar(page)
}
