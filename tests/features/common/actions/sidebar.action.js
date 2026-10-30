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
import { until } from 'selenium-webdriver'
import { expect } from 'chai'
import sidebar from '../components/sidebar.component.js'
import { scrollToWebElement } from './common.action.js'

const isSidebarPinned = async driver => {
  const element = await driver.findElement(sidebar.root)

  return (await element.getAttribute('data-pinned')) === 'true'
}

// the sidebar expands/collapses on hover, a few seconds are enough (shorter than the step timeout, so it can be retried)
const SIDEBAR_STATE_TIMEOUT = 5000
const SIDEBAR_HOVER_ATTEMPTS = 3

const waitSidebarState = async (driver, state, waitTimeout = timeout) => {
  await driver.wait(async () => {
    const element = await driver.findElement(sidebar.root)

    return (await element.getAttribute('data-state')) === state
  }, waitTimeout, `Sidebar is not ${state}`)
  // wait for the width transition to finish
  await driver.sleep(350)
}

const movePointerOutOfSidebar = async driver => {
  const { width, height } = await driver.executeScript(
    'return { width: window.innerWidth, height: window.innerHeight }'
  )

  await driver
    .actions({ async: true })
    .move({ origin: 'viewport', x: width - 5, y: Math.floor(height / 2) })
    .perform()
}

export const openSidebar = async driver => {
  await driver.wait(until.elementLocated(sidebar.root), timeout)
  const element = await driver.findElement(sidebar.root)

  if ((await element.getAttribute('data-state')) !== 'expanded') {
    // if the pointer is already over the sidebar, moving it there doesn't fire `mouseenter`,
    // so move it out of the sidebar and back on retry
    for (let attempt = 1; attempt <= SIDEBAR_HOVER_ATTEMPTS; attempt++) {
      try {
        const body = await driver.findElement(sidebar.body)
        await driver.actions({ async: true }).move({ origin: body }).perform()
        await waitSidebarState(driver, 'expanded', SIDEBAR_STATE_TIMEOUT)

        return
      } catch (error) {
        if (attempt === SIDEBAR_HOVER_ATTEMPTS) throw error

        await movePointerOutOfSidebar(driver)
        await driver.sleep(500)
      }
    }
  }
}

export const closeSidebar = async driver => {
  if (!(await isSidebarPinned(driver))) {
    // <Suspense> hides #main (display: none) while a lazy route chunk is loading,
    // moving the pointer to an element without size throws ElementNotInteractableError
    await driver.wait(async () => {
      try {
        return await (await driver.findElement({ css: '#main' })).isDisplayed()
      } catch {
        return false
      }
    }, timeout / 2, 'Page content (#main) is not displayed')
    const main = await driver.findElement({ css: '#main' })
    await driver.actions({ async: true }).move({ origin: main }).perform()
    await waitSidebarState(driver, 'collapsed', timeout / 4)
  }
}

export const selectSidebarItem = async (driver, label) => {
  await openSidebar(driver)

  let links = await driver.findElements(sidebar.link(label))

  // nested items are rendered only when their collapsible group is expanded
  if (links.length === 0) {
    const groupButtons = await driver.findElements(sidebar.groupButtons)

    for (const groupButton of groupButtons) {
      if ((await groupButton.getAttribute('data-state')) !== 'open') {
        await scrollToWebElement(driver, groupButton)
        await groupButton.click()
        await driver.sleep(250)
        links = await driver.findElements(sidebar.link(label))

        if (links.length > 0) break
      }
    }
  }

  expect(links.length).equal(1, `Sidebar item "${label}" was not found`)

  await scrollToWebElement(driver, links[0])
  await links[0].click()
  await driver.sleep(250)
  await closeSidebar(driver)
}

export const selectSidebarProject = async (driver, projectName) => {
  await openSidebar(driver)

  const trigger = await driver.findElement(sidebar.projectDropdown.open_button)
  await trigger.click()
  await driver.wait(until.elementLocated(sidebar.projectDropdown.content), timeout)
  await driver.sleep(250)

  const option = await driver.findElement(sidebar.projectDropdown.option(projectName))
  await scrollToWebElement(driver, option)
  await option.click()
  await driver.sleep(250)
  await closeSidebar(driver)
}
