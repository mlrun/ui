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
import { access, constants } from 'fs/promises'
import path from 'path'
import {
  classContaining,
  click,
  expectText,
  getAttribute,
  getRect,
  getText,
  getTexts,
  isDisplayed,
  normalizeWhitespace,
  pollAttribute,
  pollOptions,
  pollText,
  readOrNull,
  retryAssertion,
  scrollIntoView,
  sendKeys,
  waitForPageActivityQuiet,
  waitForDomQuiet,
  waitForPageQuiet,
  waitForUrlQuiet
} from '../../common-tools/element.js'

// the downloads of the scenario are saved to its output directory (`downloads` fixture), not to the user's folder
export const generatePath = async (file, downloads) => {
  await Promise.all(downloads.pending)

  return path.join(downloads.dir, file)
}

export const determineFileAccess = async (finalPath, file) => {
  const result = await access(finalPath, constants.F_OK).then(
    () => true,
    () => `${file} doesn't exist`
  )

  expect(result).toBe(true)
}

export const navigateToPage = async (page, baseURL) => {
  await page.goto(baseURL)
  // the app can redirect and complete the URL after the load
  await waitForUrlQuiet(page, { quiet: 300, timeout: 3000 })
}

export const navigateForward = async page => {
  await page.goForward()
}

export const navigateBack = async page => {
  // the previous click can push the history entry (e.g. opens a modal) a moment later
  await waitForUrlQuiet(page, { quiet: 200, timeout: 1500 })
  // the previous click can open a modal a moment later, with nothing on the page meanwhile (the app handles the click
  // asynchronously, ~0.25 s): gone back before it was rendered, the modal opened over the previous page and stayed
  // there (MLM009). A longer quiet period than before the other actions: the opened modal (and its transition) resets it
  await waitForDomQuiet(page, { quiet: 500, timeout: 3000 })
  await page.goBack()
}

export const refreshPage = async page => {
  await page.reload()
}

// the page is loaded when the loader is gone and the app stopped changing the URL: after the first load the app
// completes the URL (e.g. the pagination params) and re-renders the page, which closes the popups and the menus
// opened in the meantime and drops the typed values
export const waitPageLoad = async (page, loader) => {
  await page.locator(loader).first().waitFor({ state: 'detached', timeout })
  // the app completes the URL (and re-renders) a moment after the loader disappears: the quiet period is counted
  // from the last URL change and from the moment the loader disappeared, so nothing is waited when they are long ago
  await waitForPageActivityQuiet(page, { kinds: ['url', 'loaderGone'], quiet: 250, timeout: 3000 })
  await waitForPageQuiet(page)
  await page.locator(loader).first().waitFor({ state: 'detached', timeout })
}

export const waiteUntilComponent = async (page, component) => {
  await page.locator(component).first().waitFor({ state: 'attached', timeout })
}

export const clickOnComponent = async (page, component) => {
  const element = page.locator(component).first()
  // the page can be re-rendering after the previous action
  await waitForPageQuiet(page)
  await click(element)
}

export const clickNearComponent = async (page, component) => {
  const element = page.locator(component).first()
  // the element can be partly scrolled out of the viewport (e.g. inputs at the top of a side panel),
  // then its corner is outside of the viewport and the click misses it.
  // Scroll only in that case: any scroll closes an open FormSelect / chip editor (capture-phase `scroll`
  // listeners in dashboard-react-controls), and the click itself would then re-open the dropdown
  const isCornerInViewport = await element.evaluate(node => {
    const rect = node.getBoundingClientRect()

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.top + 1 < window.innerHeight &&
      rect.left + 1 < window.innerWidth
    )
  })
  if (!isCornerInViewport) {
    await scrollIntoView(element)
  }
  const coordinates = await getRect(element)
  const x = parseInt(coordinates.x) + 1
  const y = parseInt(coordinates.y) + 1
  // an open options list can be positioned over its own select header (when there is not enough space
  // below it, e.g. on short headed windows), then the click would select the option under the pointer
  const isCoveredByOptionsList = await element.evaluate(
    (node, { x, y }) => {
      const hit = document.elementFromPoint(x, y)

      return Boolean(
        hit &&
        !node.contains(hit) &&
        hit.closest('[data-testid="select-body"], .options-list__body')
      )
    },
    { x, y }
  )
  if (isCoveredByOptionsList) {
    await element.evaluate(node => node.click())
    return
  }
  await page.mouse.click(x, y)
}

export const hoverComponent = async (page, component, scroll = true) => {
  const baseComponent = component.root ? component.root : component
  const element = page.locator(baseComponent).first()
  if (scroll) {
    // default `block: 'start'` puts the element under sticky table headers
    await scrollIntoView(element)
  }
  // the box is read once the scroll is over
  const coordinates = await getRect(element)
  // `parseInt` truncates fractional coordinates, so the pointer could land 1px outside the element
  await page.mouse.move(Math.ceil(coordinates.x) + 1, Math.ceil(coordinates.y) + 1)
  await waitForPageQuiet(page)
}

export const verifyClassDisabled = async (page, component) =>
  expect(page.locator(component).first()).toHaveClass(
    classContaining('form-field__wrapper-disabled')
  )

// the negative checks (enabled, valid, collapsed, checked = "not ...") first let the page finish what the previous action
// started: they passed at once, on the state before an async validation or request disabled the element
export const verifyClassEnabled = async (page, component) => {
  await waitForPageQuiet(page)
  await expect(page.locator(component).first()).not.toHaveClass(
    classContaining('form-field__wrapper-disabled')
  )
}

// the `disabled` attribute, as the previous read: `toBeDisabled` doesn't count it on a non-form element (e.g. a <div>)
export const verifyElementDisabled = async (page, component) =>
  expect(page.locator(component).first()).toHaveAttribute('disabled')

export const verifyElementEnabled = async (page, component) => {
  await waitForPageQuiet(page)
  await expect(page.locator(component).first()).not.toHaveAttribute('disabled')
}

export const verifyElementActive = async (page, component) =>
  expect(page.locator(component).first()).toHaveClass(classContaining('active'))

export const verifyElementNotActive = async (page, component) =>
  expect(page.locator(component).first()).toHaveClass(classContaining('false'))

export const componentIsPresent = async (page, component) => {
  const _component = component.root ?? component
  await expect(page.locator(_component).first()).toBeAttached()
}

// the page first finishes rendering what the previous action requested: a negative check passed at once, before an
// element that is rendered a moment later (e.g. a popup or an error opened by the previous click) was there
export const componentIsNotPresent = async (page, component) => {
  const _component = component.root ?? component

  await waitForPageQuiet(page)
  await expect(page.locator(_component)).toHaveCount(0)
}

export const componentIsVisible = async (page, component) => {
  const _component = component.root ?? component
  const element = page.locator(_component).first()
  // content may still be loading (tab switch, details fetch) - wait for it to be attached
  await element.waitFor({ state: 'attached', timeout: expectTimeout })
  // element may still be in its enter transition (notifications have opacity: 0 for 500ms)
  await expect
    .poll(() => isDisplayed(element), {
      timeout: expectTimeout,
      message: `Element is not displayed: ${_component}`
    })
    .toBe(true)
}

// `isDisplayed`, not `toBeHidden`: an element with `opacity: 0` is hidden here, visible for Playwright. A missing
// element fails the check (`null`), as before
export const componentIsNotVisible = async (page, component) => {
  const _component = component.root ?? component
  const element = page.locator(_component).first()

  await expect
    .poll(
      readOrNull(async () => {
        await waitForPageQuiet(page)

        return isDisplayed(element, { timeout: readTimeout })
      }),
      pollOptions(`Element is displayed (or not found): ${_component}`)
    )
    .toBe(false)
}

export const typeIntoInputField = async (page, component, value) => {
  const element = page.locator(component).first()
  return sendKeys(element, value)
}

export const verifyTypedText = async (page, component, value) =>
  pollAttribute(page.locator(component).first(), 'value').toBe(value)

// `txt.split()` (no separator) of the previous check was always one item: the text was always compared as a whole
export const verifyText = async (page, component, value) =>
  expectText(page.locator(component).first(), value, { message: `Text of ${component}` })

// the whole text must match ("should be equal"): the patterns are not anchored, so a message with extra text around it, or
// with more filters than expected ("Name: x, Status: y" for "Name: (.+?)"), matched
export const verifyTextRegExp = async (page, component, regexp) =>
  pollText(page.locator(component).first(), { message: `Text of ${component}` }).toMatch(
    new RegExp(`^(?:${regexp.source})$`, regexp.flags)
  )

export const isComponentContainsAttributeValue = async (page, component, attribute, value) => {
  const element = page.locator(component).first()
  return (await getAttribute(element, attribute)) === value
}

export const isComponentContainsClass = async (page, component, className) =>
  expect(page.locator(component).first()).toHaveClass(classContaining(className))

// any attribute (`style`, `value`... with the semantics of `getAttribute`), the value as a substring
export const verifyComponentContainsAttributeValue = async (page, component, attribute, value) =>
  pollAttribute(page.locator(component).first(), attribute, {
    message: `"${attribute}" attribute of ${component} should contain "${value}"`
  }).toContain(value)

// a missing element or attribute fails the check (`null` is rejected by `toContain`, also with `.not`), as before
export const verifyComponentNotContainsAttributeValue = async (page, component, attribute, value) =>
  pollAttribute(page.locator(component).first(), attribute, {
    message: `"${attribute}" attribute of ${component} should not contain "${value}"`
  }).not.toContain(value)

export const collapseAccordionSection = async (page, collapseComponent) => {
  const element = page.locator(collapseComponent).first()
  const attributes = await getAttribute(element, 'class')
  const flag = attributes.includes('open')
  if (flag) {
    await click(element)
  }
}

export const expandAccordionSection = async (page, collapseComponent) => {
  const element = page.locator(collapseComponent).first()
  const attributes = await getAttribute(element, 'class')
  const flag = attributes.includes('open')
  if (!flag) {
    await click(element)
  }
}

export const isAccordionSectionExpanded = async (page, collapseComponent) =>
  expect(page.locator(collapseComponent).first()).toHaveClass(classContaining('open'))

export const isAccordionSectionCollapsed = async (page, collapseComponent) => {
  await waitForPageQuiet(page)
  await expect(page.locator(collapseComponent).first()).not.toHaveClass(classContaining('open'))
}

export const getElementText = async (page, component) => {
  const element = page.locator(component).first()
  return await getText(element)
}

export const scrollToElement = async (page, component) => {
  const element = page.locator(component).first()
  await scrollIntoView(element, {})
  await waitForPageQuiet(page)
}

// hover the center of the element's part in the viewport: the top-left corner (with truncated fractional coordinates)
// can land on the element border or outside it, so `mouseenter` doesn't fire in headed mode.
// The mouse is moved by coordinates instead of `locator.hover()`: zero-size wrappers can't be hovered
export const hoverElementCenter = async (page, element) => {
  const { x, y, width, height } = await getRect(element)
  const viewport = page.viewportSize()
  const left = Math.max(x, 0)
  const top = Math.max(y, 0)
  const right = Math.min(x + width, viewport.width)
  const bottom = Math.min(y + height, viewport.height)

  await page.mouse.move(Math.floor((left + right) / 2), Math.floor((top + bottom) / 2))
}

// several hints can be in the overlay at once while the previous one fades out,
// so wait for the visible hint with the expected text instead of taking the first one found
export const getHoverHintText = async (page, hintComponent, expectedText) => {
  let hintText = ''

  await expect
    .poll(
      async () => {
        const texts = await getTexts(page.locator(hintComponent))

        hintText = texts.filter(Boolean).at(-1) ?? hintText

        return texts.some(text => normalizeWhitespace(text) === normalizeWhitespace(expectedText))
      },
      { timeout: 3000 }
    )
    .toBe(true)
    .catch(() => {})

  return hintText
}

// hovers an element and reads its tooltip (the expected one is waited for, see `getHoverHintText`). The tooltip of the
// previously hovered element can cover this one (e.g. the status counters next to each other): the pointer stays on
// that tooltip, keeps it open, and the expected one never shows (MLPM002). Then the pointer is moved away, the open
// tooltips are given time to close and the element is hovered again. Not moved away first: an element shown only
// while its row is hovered (e.g. the quick links of a table row) would be hidden
export const hoverAndReadHint = async (page, element, hintComponent, expectedText) => {
  // elements below the fold can't be hovered
  await scrollIntoView(element)
  await hoverElementCenter(page, element)

  const hintText = await getHoverHintText(page, hintComponent, expectedText)

  if (normalizeWhitespace(hintText) === normalizeWhitespace(expectedText)) return hintText

  await page.mouse.move(0, 0)
  await expect
    .poll(async () => (await getTexts(page.locator(hintComponent))).filter(Boolean).length, {
      timeout: 1500
    })
    .toBe(0)
    .catch(() => {})
  await scrollIntoView(element)
  await hoverElementCenter(page, element)

  return getHoverHintText(page, hintComponent, expectedText)
}

export const checkComponentHintTextWithHover = async (page, component, hintComponent, text) => {
  const hintText = await hoverAndReadHint(
    page,
    page.locator(component).first(),
    hintComponent,
    text
  )

  expect(normalizeWhitespace(hintText)).toBe(normalizeWhitespace(text))
}

// a saved value must not be empty: '' (a hidden or not yet rendered element) compared with another empty one passed
export const readNonEmptyText = (locator, what) =>
  retryAssertion(async () => {
    const text = await getText(locator, { timeout: readTimeout })

    expect(text, `${what} is empty, there is nothing to save`).not.toBe('')

    return text
  })

export const putToTestContextElementValue = async (page, testContext, element, pageValue) => {
  testContext[pageValue] = await readNonEmptyText(page.locator(element).first(), element)
}

export const scrollToWebElement = async (page, element) => {
  await scrollIntoView(element, {})
  await waitForPageQuiet(page)
}
