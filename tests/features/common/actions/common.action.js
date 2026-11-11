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
import { access, constants } from 'fs/promises'
import path from 'path'
import {
  click,
  getAttribute,
  getRect,
  getText,
  isDisplayed,
  normalizeWhitespace,
  retryAssertion,
  scrollIntoView,
  sendKeys,
  waitUntil
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
  await page.waitForTimeout(1000)
}

export const navigateForward = async page => {
  await page.goForward()
}

export const navigateBack = async page => {
  await page.goBack()
}

export const refreshPage = async page => {
  await page.reload()
}

export const waitPageLoad = async (page, loader) => {
  await page.locator(loader).first().waitFor({ state: 'detached', timeout })
}

export const waiteUntilComponent = async (page, component) => {
  await page.locator(component).first().waitFor({ state: 'attached', timeout })
}

export const clickOnComponent = async (page, component) => {
  const element = page.locator(component).first()
  await page.waitForTimeout(250)
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
    await page.waitForTimeout(250)
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
    await page.waitForTimeout(250)
  }
  const coordinates = await getRect(element)
  // `parseInt` truncates fractional coordinates, so the pointer could land 1px outside the element
  await page.mouse.move(Math.ceil(coordinates.x) + 1, Math.ceil(coordinates.y) + 1)
  await page.waitForTimeout(250)
}

export const verifyClassDisabled = async (page, component) =>
  retryAssertion(async () => {
    const inputField = page.locator(component).first()
    const attributes = await getAttribute(inputField, 'class')
    const flag = attributes.includes('form-field__wrapper-disabled')
    expect(flag).toBe(true)
  })

export const verifyClassEnabled = async (page, component) =>
  retryAssertion(async () => {
    const inputField = page.locator(component).first()
    const attributes = await getAttribute(inputField, 'class')
    const flag = attributes.includes('form-field__wrapper-disabled')
    expect(flag).toBe(false)
  })

export const verifyElementDisabled = async (page, component) =>
  retryAssertion(async () => {
    const element = page.locator(component).first()
    const flag = await getAttribute(element, 'disabled')
    expect(flag).toBe('true')
  })

export const verifyElementEnabled = async (page, component) =>
  retryAssertion(async () => {
    const element = page.locator(component).first()
    const flag = await getAttribute(element, 'disabled')
    expect(flag).toBe(null)
  })

export const verifyElementActive = async (page, component) =>
  retryAssertion(async () => {
    const element = page.locator(component).first()
    const flag = await getAttribute(element, 'class')
    expect(flag.includes('active')).toBe(true)
  })

export const verifyElementNotActive = async (page, component) =>
  retryAssertion(async () => {
    const element = page.locator(component).first()
    const flag = await getAttribute(element, 'class')
    expect(flag.includes('false')).toBe(true)
  })

export const componentIsPresent = async (page, component) => {
  const _component = component.root ?? component
  await expect(page.locator(_component).first()).toBeAttached()
}

export const componentIsNotPresent = async (page, component) => {
  const _component = component.root ?? component
  await expect(page.locator(_component)).toHaveCount(0)
}

export const componentIsVisible = async (page, component) => {
  const _component = component.root ?? component
  const element = page.locator(_component).first()
  // content may still be loading (tab switch, details fetch) - wait for it to be attached
  await element.waitFor({ state: 'attached', timeout: 5000 })
  // element may still be in its enter transition (notifications have opacity: 0 for 500ms)
  const displayed = await waitUntil(() => isDisplayed(element), 3000).then(
    () => true,
    () => false
  )
  expect(displayed).toBe(true)
}

export const componentIsNotVisible = async (page, component) =>
  retryAssertion(async () => {
    const _component = component.root ?? component
    const element = page.locator(_component).first()
    await page.waitForTimeout(250)
    const displayed = await isDisplayed(element)
    expect(displayed).toBe(false)
  })

export const typeIntoInputField = async (page, component, value) => {
  const element = page.locator(component).first()
  return sendKeys(element, value)
}

export const verifyTypedText = async (page, component, value) =>
  retryAssertion(async () => {
    const element = page.locator(component).first()
    const txt = await getAttribute(element, 'value')
    expect(txt).toBe(value)
  })

export const verifyText = async (page, component, value) =>
  retryAssertion(async () => {
    const element = page.locator(component).first()
    const txt = await getText(element)
    const arr = txt.split()
    if (arr.length > 1) {
      expect(
        arr.some(item => item.includes(value)),
        `should be expected "${value}" but actual value [${arr}]`
      ).toBe(true)
    } else {
      expect(txt, `should be expected "${value}" but actual value "${txt}"`).toBe(value)
    }
  })

export const verifyTextRegExp = async (page, component, regexp) =>
  retryAssertion(async () => {
    const element = page.locator(component).first()
    const txt = await getText(element)
    expect(true).toBe(regexp.test(txt))
  })

export const isComponentContainsAttributeValue = async (page, component, attribute, value) => {
  const element = page.locator(component).first()
  return (await getAttribute(element, attribute)) === value
}

export const isComponentContainsClass = async (page, component, className) =>
  retryAssertion(async () => {
    const element = page.locator(component).first()
    const classes = await getAttribute(element, 'class')
    expect(classes.includes(className)).toBe(true)
  })

export const verifyComponentContainsAttributeValue = async (page, component, attribute, value) =>
  retryAssertion(async () => {
    const element = page.locator(component).first()
    const attributes = await getAttribute(element, attribute)
    expect(
      attributes.includes(value),
      `Attribute "${value}" does not present in "${attribute}" values list "${attributes}"`
    ).toBe(true)
  })

export const verifyComponentNotContainsAttributeValue = async (page, component, attribute, value) =>
  retryAssertion(async () => {
    const element = page.locator(component).first()
    const attributes = await getAttribute(element, attribute)
    expect(
      attributes.includes(value),
      `Attribute "${value}" does present in "${attribute}" values list "${attributes}"`
    ).toBe(false)
  })

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
  retryAssertion(async () => {
    const element = page.locator(collapseComponent).first()
    const attributes = await getAttribute(element, 'class')
    const flag = attributes.includes('open')
    expect(flag).toBe(true)
  })

export const isAccordionSectionCollapsed = async (page, collapseComponent) =>
  retryAssertion(async () => {
    const element = page.locator(collapseComponent).first()
    const attributes = await getAttribute(element, 'class')
    const flag = attributes.includes('open')
    expect(flag).toBe(false)
  })

export const getElementText = async (page, component) => {
  const element = page.locator(component).first()
  return await getText(element)
}

export const scrollToElement = async (page, component) => {
  const element = page.locator(component).first()
  await scrollIntoView(element, {})
  await page.waitForTimeout(250)
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

  await waitUntil(async () => {
    const hints = await page.locator(hintComponent).all()

    for (const hint of hints) {
      const text = await getText(hint, { timeout: 500 }).catch(() => '')

      if (text) hintText = text
      if (normalizeWhitespace(text) === normalizeWhitespace(expectedText)) return true
    }

    return false
  }, 3000).catch(() => {})

  return hintText
}

export const checkComponentHintTextWithHover = async (page, component, hintComponent, text) => {
  const hintButton = page.locator(component).first()
  // elements below the fold can't be hovered
  await scrollIntoView(hintButton)
  await page.waitForTimeout(250)
  await hoverElementCenter(page, hintButton)
  const hintText = await getHoverHintText(page, hintComponent, text)

  expect(normalizeWhitespace(hintText)).toBe(normalizeWhitespace(text))
}

export const putToTestContextElementValue = async (page, testContext, element, pageValue) => {
  const pageElement = page.locator(element).first()
  testContext[pageValue] = await getText(pageElement)
}

export const scrollToWebElement = async (page, element) => {
  await scrollIntoView(element, {})
  await page.waitForTimeout(250)
}
