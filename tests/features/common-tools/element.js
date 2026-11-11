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
// Element reads with the semantics the scenarios were written for (WebDriver), where they differ from Playwright:
// the text is the rendered text of a displayed element only, attributes are read from DOM properties first,
// and an element with `opacity: 0` (e.g. a notification in its enter transition) is not displayed

const BOOLEAN_ATTRIBUTES = [
  'async',
  'autofocus',
  'autoplay',
  'checked',
  'controls',
  'default',
  'defer',
  'disabled',
  'formnovalidate',
  'hidden',
  'indeterminate',
  'ismap',
  'loop',
  'multiple',
  'muted',
  'novalidate',
  'open',
  'readonly',
  'required',
  'reversed',
  'selected'
]

const DEFAULT_POLL_INTERVAL = 100

// runs in the browser, so it must be self-contained
function isElementDisplayed(element) {
  if (!element.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return false

  const hasSize = node => {
    const { width, height } = node.getBoundingClientRect()

    return width > 0 && height > 0
  }

  // zero-size wrappers are displayed when they have displayed content
  return hasSize(element) || [...element.querySelectorAll('*')].some(hasSize)
}

// runs in the browser, so it must be self-contained
function getElementText(element) {
  if (!element.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return ''

  // the rendered text of a textarea is its value, SVG elements have no `innerText`
  const text =
    element.tagName === 'TEXTAREA' ? element.value : (element.innerText ?? element.textContent)

  return text.replace(/\u00a0/g, ' ').trim()
}

// `options.timeout` - how long to wait for the element to be attached, the action timeout by default
export const isDisplayed = (locator, options) =>
  locator.evaluate(isElementDisplayed, undefined, options)

export const getText = (locator, options) => locator.evaluate(getElementText, undefined, options)

// texts of all the matched elements at once: a list being re-rendered can't be read element by element
export const getTexts = locator =>
  locator.evaluateAll(elements =>
    elements.map(element =>
      element.checkVisibility({ opacityProperty: true, visibilityProperty: true })
        ? (element.tagName === 'TEXTAREA'
            ? element.value
            : (element.innerText ?? element.textContent)
          )
            .replace(/\u00a0/g, ' ')
            .trim()
        : ''
    )
  )

export const getAttribute = (locator, name, options) =>
  locator.evaluate(
    (element, { name, booleanAttributes }) => {
      const attribute = name.toLowerCase()

      if (attribute === 'style') return element.style.cssText
      if (attribute === 'class') return element.getAttribute('class') ?? ''
      if (booleanAttributes.includes(attribute)) {
        const property = attribute === 'readonly' ? 'readOnly' : attribute

        return element[property] === true || element.hasAttribute(attribute) ? 'true' : null
      }

      const property = element[name]

      if (
        property !== undefined &&
        property !== null &&
        !['object', 'function'].includes(typeof property)
      ) {
        return String(property)
      }

      return element.getAttribute(name)
    },
    { name, booleanAttributes: BOOLEAN_ATTRIBUTES },
    options
  )

export const isSelected = (locator, options) =>
  locator.evaluate(element => Boolean(element.checked || element.selected), undefined, options)

// the bounding box in the viewport coordinates, the same as `page.mouse` uses
export const getRect = async locator => {
  const box = await locator.boundingBox()

  if (!box) throw new Error(`Element is not displayed: ${locator}`)

  return box
}

export const scrollIntoView = (locator, options = { block: 'center', inline: 'nearest' }) =>
  locator.evaluate((element, options) => element.scrollIntoView(options), options)

// types at the end of the current value, as WebDriver does when the element isn't focused yet
// (Playwright types at the caret, which is at the start after focusing)
export const sendKeys = async (locator, value) => {
  await locator.evaluate(element => {
    if (element.ownerDocument.activeElement === element) return

    element.focus()

    try {
      element.setSelectionRange(element.value.length, element.value.length)
    } catch {
      // not a text input (e.g. type="number"), there is no caret to move
    }
  })
  await locator.pressSequentially(String(value))
}

// a disabled element is clicked as well, as WebDriver does (the browser ignores the click):
// the scenarios click disabled buttons to check that nothing happens
export const click = async (locator, options) => {
  await locator.waitFor({ state: 'visible' })
  await waitUntil(() => locator.isEnabled(), 2000).catch(() => {})

  return locator.click({ ...options, force: await locator.isDisabled() })
}

// the tooltips keep the line breaks of the text (`white-space: pre-line`), so the rendered text differs
// from the expected one only by the whitespace
export const normalizeWhitespace = text => text.replace(/\s+/g, ' ').trim()

// web-first assertion: re-runs the read-and-check until it passes, the last error is thrown after the timeout
// (e.g. a table is re-rendered after filtering, so the first read can get the previous rows or no rows).
// When the element is gone by the last attempt (e.g. a notification hid itself while its wrong text was being
// re-checked), the last mismatch is thrown instead of the timeout of the read: it is the actual reason of the failure
export const retryAssertion = async (assertion, timeout = 10000) => {
  const deadline = Date.now() + timeout
  let lastMismatch = null

  for (;;) {
    try {
      return await assertion()
    } catch (error) {
      if (error?.name !== 'TimeoutError') lastMismatch = error
      if (Date.now() >= deadline) {
        if (lastMismatch && lastMismatch !== error) {
          lastMismatch.message += `\n(then the element was not found anymore: ${error.message.split('\n')[0]})`
          throw lastMismatch
        }

        throw error
      }
    }

    await new Promise(resolve => setTimeout(resolve, 250))
  }
}

// polls the condition until it returns a truthy value, errors of the condition are not caught
export const waitUntil = async (condition, timeout, message = 'Condition is not met') => {
  const deadline = Date.now() + timeout

  for (;;) {
    const result = await condition()

    if (result) return result
    if (Date.now() >= deadline) throw new Error(`${message} (waited ${timeout}ms)`)

    await new Promise(resolve => setTimeout(resolve, DEFAULT_POLL_INTERVAL))
  }
}
