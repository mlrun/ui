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

import { expectTimeout, readTimeout } from '../../config.js'

// Element reads with the semantics the scenarios check, where they differ from Playwright's defaults: the text is the
// rendered text of a displayed element only, attributes are read from DOM properties first, and an element with
// `opacity: 0` (e.g. a notification in its enter transition) is not displayed

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

// the attribute (or the property, e.g. the current `value` of an input) of all the matched elements at once: a list
// being re-rendered can't be read element by element (`locator.all()` is a snapshot of positions, the elements shift)
export const getAttributes = (locator, name) =>
  locator.evaluateAll(
    (elements, name) =>
      elements.map(element => {
        if (name === 'class') return element.getAttribute('class') ?? ''

        const property = element[name]

        return property !== undefined &&
          property !== null &&
          !['object', 'function'].includes(typeof property)
          ? String(property)
          : element.getAttribute(name)
      }),
    name
  )

// the elements of `locator` whose whole text is `text`: `hasText` matches the textContent, while the steps compare the
// rendered (inner) text, e.g. a chip is "key\n:\nvalue" there and "key:value" in the textContent, so any whitespace is
// matched loosely. Found by the text at the action, not by a position: a list can change after it was read
export const withExactText = (locator, text) =>
  locator.filter({
    hasText: new RegExp(
      `^\\s*${String(text)
        .trim()
        .split(/\s+/)
        // between two words the whitespace is required ("my project" must not match "myproject"), next to a
        // punctuation mark it is optional (the chip "key : value" is "key:value" in the textContent)
        .reduce(
          (pattern, word, index, words) =>
            `${pattern}${index && /\w$/.test(words[index - 1]) && /^\w/.test(word) ? '\\s+' : index ? '\\s*' : ''}` +
            word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
          ''
        )}\\s*$`
    )
  })

export const getText = (locator, options) => locator.evaluate(getElementText, undefined, options)

// texts of all the matched elements at once: a list being re-rendered can't be read element by element.
// `outermost` - an element inside another matched one is skipped: the option locators match the label and its nested
// tooltip wrapper (both `.data-ellipsis`), every option was read twice
export const getTexts = (locator, { outermost = false } = {}) =>
  locator.evaluateAll(
    (elements, outermost) =>
      elements
        .filter(
          element =>
            !outermost || !elements.some(other => other !== element && other.contains(element))
        )
        .map(element =>
          element.checkVisibility({ opacityProperty: true, visibilityProperty: true })
            ? (element.tagName === 'TEXTAREA'
                ? element.value
                : (element.innerText ?? element.textContent)
              )
                .replace(/\u00a0/g, ' ')
                .trim()
            : ''
        ),
    outermost
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
// polls the read until two consecutive results are equal (a transition or a layout has settled, e.g. after a scroll),
// the last result is returned when it doesn't settle in time. Errors of the read are not caught
export const waitUntilStable = async (read, { timeout = 3000, interval = 100 } = {}) => {
  const deadline = Date.now() + timeout
  let value = await read()

  while (Date.now() < deadline) {
    await new Promise(resolve => setTimeout(resolve, interval))

    const next = await read()

    if (JSON.stringify(next) === JSON.stringify(value)) return next
    value = next
  }

  return value
}

const pendingRequests = new WeakMap()
const lastDownloadRequestEnd = new WeakMap()

// the app keeps a finished download in its notification list for 5 s (DownloadItem), the list is keyed by the file path:
// the same file downloaded again meanwhile is rendered twice and the notification flickers
const DOWNLOAD_ITEM_LIFETIME = 5200

// waits until the downloads finished so far are removed from the app's notification list
export const waitForDownloadItemsRemoved = async page => {
  const remaining = (lastDownloadRequestEnd.get(page) ?? 0) + DOWNLOAD_ITEM_LIFETIME - Date.now()

  if (remaining > 0) await new Promise(resolve => setTimeout(resolve, remaining))
}

// tracks the API requests (fetch/xhr) of the page that are still in flight, see `waitForNetworkQuiet`
export const trackRequests = page => {
  const pending = new Set()
  const finish = request => {
    pending.delete(request)

    // the chunks of a download are requested from the files endpoint
    if (/\/projects\/[^/]+\/files\?/.test(request.url()))
      lastDownloadRequestEnd.set(page, Date.now())
  }

  pendingRequests.set(page, pending)
  page.on('request', request => {
    if (['fetch', 'xhr'].includes(request.resourceType())) pending.add(request)
  })
  page.on('requestfinished', finish)
  page.on('requestfailed', finish)
}

// the page remembers when it changed last (see `waitForPageActivityQuiet`): scrolled (any element, the scroll events
// don't bubble so they are captured), re-rendered (the notifications animate, they are not a state the next action
// depends on), the URL changed, a loader disappeared. A wait for a quiet period then costs only the rest of the period
// (nothing when the page is idle for a while) instead of a whole fixed pause
export const trackPageActivity = page =>
  page.addInitScript(() => {
    const now = () => performance.now()
    const activity = { scroll: -Infinity, dom: -Infinity, url: now(), loaderGone: -Infinity }
    const isNotification = node =>
      Boolean(
        (node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement)?.closest(
          '[class*="notification"], [data-testid="download-container"]'
        )
      )
    const markUrlChange = () => (activity.url = now())

    window.__pageActivity = activity
    window.addEventListener('scroll', () => (activity.scroll = now()), true)
    window.addEventListener('popstate', markUrlChange)
    window.addEventListener('hashchange', markUrlChange)
    ;['pushState', 'replaceState'].forEach(method => {
      const original = history[method]

      history[method] = function (...args) {
        const before = location.href
        const result = original.apply(this, args)

        if (location.href !== before) markUrlChange()

        return result
      }
    })
    new MutationObserver(records => {
      if (!records.every(record => isNotification(record.target))) activity.dom = now()

      for (const record of records) {
        for (const node of record.removedNodes) {
          if (
            node.nodeType === Node.ELEMENT_NODE &&
            (node.matches('.loader-wrapper') || node.querySelector('.loader-wrapper'))
          ) {
            activity.loaderGone = now()
          }
        }
      }
    }).observe(document, { subtree: true, childList: true, attributes: true, characterData: true })
  })

// resolves when none of the `kinds` of the page activity (`scroll`, `dom`, `url`, `loaderGone`) happened for `quiet` ms
// or after `timeout`, immediately when the page is idle already
export const waitForPageActivityQuiet = (
  page,
  { kinds = ['dom'], quiet = 100, timeout = 1000 } = {}
) =>
  page
    .waitForFunction(
      ({ kinds, quiet }) => {
        const activity = window.__pageActivity

        return !activity || kinds.every(kind => performance.now() - activity[kind] > quiet)
      },
      { kinds, quiet },
      { timeout, polling: 25 }
    )
    .catch(() => {})

// the page DOM has not changed for `quiet` ms (it finished re-rendering) or after `timeout`: an action on an element
// that is re-rendered at that moment is lost (e.g. the click closes a popup that is being re-mounted)
export const waitForDomQuiet = (page, { quiet = 100, timeout = 1000 } = {}) =>
  waitForPageActivityQuiet(page, { kinds: ['dom'], quiet, timeout })

// nothing was scrolled for `quiet` ms or after `timeout`. The app reacts on the scrolling with a delay (e.g. the
// filter popup is closed by a throttled scroll handler, up to 500 ms after the last scroll), so an action made right
// after the scroll ends can be affected by it
export const waitForScrollQuiet = (page, { quiet = 700, timeout = 3000 } = {}) =>
  waitForPageActivityQuiet(page, { kinds: ['scroll'], quiet, timeout })

// the URL was not changed for `quiet` ms (the app completes it with the missing parameters after a page is loaded)
export const waitForUrlQuiet = (page, { quiet = 300, timeout = 3000 } = {}) =>
  waitForPageActivityQuiet(page, { kinds: ['url'], quiet, timeout })

// resolves when the API requests that are in flight now are finished (the response is rendered by the app a moment
// later, see `waitForDomQuiet`) or after `timeout`. The requests started later are not waited for: a chain of requests
// (e.g. the chunks of a download) would never end
export const waitForNetworkQuiet = async (page, { timeout = 3000 } = {}) => {
  const pending = pendingRequests.get(page)
  const inFlight = [...(pending ?? [])]
  const deadline = Date.now() + timeout

  while (inFlight.some(request => pending.has(request)) && Date.now() < deadline) {
    await new Promise(resolve => setTimeout(resolve, 50))
  }
}

// the modals opened by the previous action finished their enter transition (300 ms, `modal-transition` of the Modal
// component). The DOM is quiet in the middle of it (the classes change at its start and end only), and an action made
// during it is lost: the opened dropdown closes (MLA006: "Path Scheme" of the just opened "Register Artifact" modal), the
// navigation is not handled by the modal (MLM009: the modal stayed open over the previous page)
export const waitForModalsOpened = page =>
  page
    .waitForFunction(
      () => !document.querySelector('.modal-transition-enter, .modal-transition-enter-active'),
      undefined,
      { timeout: 2000, polling: 25 }
    )
    .catch(() => {})

// the page finished loading and rendering what was requested by the previous action: an action on it is not lost
// in a re-render (a click closes a popup that is being re-mounted, a typed value is dropped)
export const waitForPageQuiet = async (page, options) => {
  await waitForNetworkQuiet(page)
  await waitForDomQuiet(page, options)
  await waitForModalsOpened(page)
  await waitForScrollQuiet(page)
}

// the box of the element once it stopped moving (scrolling, transitions)
export const getRect = locator =>
  waitUntilStable(
    async () => {
      const box = await locator.boundingBox()

      if (!box) throw new Error(`Element is not displayed: ${locator}`)

      return box
    },
    { timeout: 2000, interval: 50 }
  )

export const scrollIntoView = (locator, options = { block: 'center', inline: 'nearest' }) =>
  locator.evaluate((element, options) => element.scrollIntoView(options), options)

// types at the end of the current value when the element isn't focused yet: the scenarios append to the value
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

// a disabled element is clicked as well (the browser ignores the click), Playwright would wait for it to be enabled:
// the scenarios click disabled buttons to check that nothing happens
// `options.timeout` - for all the waits of the click, not only for the click itself: a caller that retries the click
// (e.g. an option of a menu that a re-render closes, MLF021) passes a short one, an element gone after it became
// visible waited the whole action timeout in `isDisabled` (15 s, longer than the caller's retries)
export const click = async (locator, options = {}) => {
  const { timeout } = options

  await locator.waitFor({ state: 'visible', timeout })
  await expect(locator)
    .toBeEnabled({ timeout: Math.min(2000, timeout ?? 2000) })
    .catch(() => {})

  return locator.click({ ...options, force: await locator.isDisabled({ timeout }) })
}

// the tooltips keep the line breaks of the text (`white-space: pre-line`), so the rendered text differs
// from the expected one only by the whitespace
export const normalizeWhitespace = text => text.replace(/\s+/g, ' ').trim()

// web-first assertion: re-runs the read-and-check until it passes, the last error is thrown after the timeout
// (e.g. a table is re-rendered after filtering, so the first read can get the previous rows or no rows).
// When the element is gone by the last attempt (e.g. a notification hid itself while its wrong text was being
// re-checked), the last mismatch is thrown instead of the timeout of the read: it is the actual reason of the failure
export const retryAssertion = async (assertion, timeout = expectTimeout) => {
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

    await new Promise(resolve => setTimeout(resolve, 100))
  }
}

// Web-first assertions. A native locator assertion is used where its semantics are the ones the scenarios check
// (class, attribute presence, count, URL). A read with the semantics described at the top of this file (the rendered
// text of a displayed element, a textarea value, the property-first attribute, `opacity: 0` is not displayed) is
// retried with `expect.poll`: Playwright's `toHaveText` reads the text of a hidden element, the default text of a
// textarea and normalizes the whitespace, `toBeVisible` treats `opacity: 0` as visible - each would pass a check the
// scenario must fail

const escapeRegExp = text => String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// for `toHaveClass`: the class attribute contains `className` as a substring, e.g. "invalid" of
// "form-field__wrapper-invalid" (the scenarios check substrings, not whole class names)
export const classContaining = className => new RegExp(escapeRegExp(className))

// `expect.poll` options: the configured expect timeout, polled every 100 ms (the default intervals grow to 1 s, a check
// that passes right after a re-render would wait up to 1 s more)
export const pollOptions = (message, timeout = expectTimeout) => ({
  message,
  timeout,
  intervals: [100]
})

// a read for `expect.poll` must not throw: a thrown read ends the poll at once, so an element being re-rendered would
// fail the check. A failed read (the element is not found within `readTimeout`) gives `null`: no expected value matches
// it, `toContain`/`toMatch` reject it (also with `.not`), so a missing element fails the check as before. Never use
// `.not.toBe(...)` with it: `null` passes that
export const readOrNull = read => () => read().catch(() => null)

// the matchers of `expect.poll` (also after `.not`), a failure gets `note()` appended to its message
const withFailureNote = (matchers, note) =>
  new Proxy(matchers, {
    get(target, property) {
      const value = Reflect.get(target, property)

      if (property === 'not') return withFailureNote(value, note)
      if (typeof value !== 'function') return value

      return (...args) =>
        value.apply(target, args).catch(error => {
          error.message += note()
          throw error
        })
    }
  })

// the rendered text of a displayed element ("" when it is not displayed), `normalize` - compare with the whitespace
// collapsed (the tooltips keep the line breaks of the text).
// When the element is gone by the end of the poll (e.g. a notification hid itself while its wrong text was being
// re-checked), the failure shows only `Received: null`: the last text read before is added to the message, it is the
// actual reason of the failure (as in `retryAssertion`)
export const pollText = (locator, { message, normalize = false, timeout } = {}) => {
  let received = null
  let lastText = null
  const read = readOrNull(async () => {
    const text = await getText(locator, { timeout: readTimeout })

    return normalize ? normalizeWhitespace(text) : text
  })
  const matchers = expect.poll(
    async () => {
      received = await read()
      if (received !== null) lastText = received

      return received
    },
    pollOptions(message, timeout)
  )

  return withFailureNote(matchers, () =>
    received === null && lastText !== null
      ? `\n(the last text read before the element was gone: "${lastText}")`
      : ''
  )
}

export const expectText = (locator, expected, options = {}) =>
  pollText(locator, options).toBe(options.normalize ? normalizeWhitespace(expected) : expected)

// the attribute, or the property first (e.g. the current `value` of an input), see `getAttribute`
export const pollAttribute = (locator, name, { message, timeout } = {}) =>
  expect.poll(
    readOrNull(() => getAttribute(locator, name, { timeout: readTimeout })),
    pollOptions(message, timeout)
  )

// a list as a JS array literal, to paste into common-consts.js when the expected list is outdated
const formatList = items =>
  `[${items.map(item => (String(item).includes("'") ? JSON.stringify(item) : `'${item}'`)).join(', ')}]`

// marks an expected list (in common-consts.js) whose order the app doesn't fix, e.g. the items come from the API in
// the order of its response: it is compared by `expectListItems` without the order. Not enumerable: `toEqual` and the
// spreading ignore it
export const unordered = items => Object.defineProperty([...items], 'unordered', { value: true })

// the same items, each as many times as expected (the order is not checked): the missing, extra and duplicated ones are
// listed. A set comparison (every/difference) passed an item rendered twice
export const expectSameItems = (actual, expected, what) => {
  const remaining = [...actual]
  const missing = []

  for (const item of expected) {
    const index = remaining.indexOf(item)

    if (index === -1) missing.push(item)
    else remaining.splice(index, 1)
  }

  expect(
    { missing, extra: remaining },
    `${what} differ from the expected ones, actual: ${formatList(actual)}, expected: ${formatList(expected)}`
  ).toEqual({ missing: [], extra: [] })
}

// the same items in the same order: a tab, a header or an option in a wrong place passed the check without the order.
// The actual items are printed in the app's order, ready to be pasted into common-consts.js
export const expectSameList = (actual, expected, what) =>
  expect(
    actual,
    `${what} differ from the expected ones, actual (in the app's order): ${formatList(actual)}, ` +
      `expected: ${formatList(expected)}`
  ).toEqual([...expected])

// in order, unless the expected list is marked `unordered`
export const expectListItems = (actual, expected, what) =>
  expected.unordered
    ? expectSameItems(actual, expected, what)
    : expectSameList(actual, expected, what)
