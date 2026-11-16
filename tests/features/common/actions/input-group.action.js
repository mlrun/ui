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
import { failAsKnownBug } from '../../common-tools/known-bugs.js'
import { parseString } from '../../common-tools/common-tools.js'
import { hoverAndReadHint } from './common.action.js'
import {
  classContaining,
  click,
  expectText,
  getAttribute,
  getText,
  normalizeWhitespace,
  pollAttribute,
  retryAssertion,
  sendKeys,
  waitForPageQuiet
} from '../../common-tools/element.js'

const verifyFormInputInvalid = (page, inputGroup) =>
  expect(page.locator(inputGroup.root).first()).toHaveClass(
    classContaining('form-field__wrapper-invalid')
  )

// retried, as the other checks: the single read right after typing could get the state of the previous value
// the negative checks first let the page finish an async validation (see verifyClassEnabled in common.action.js)
const verifyFormInputValid = async (page, inputGroup) => {
  await waitForPageQuiet(page)
  await expect(page.locator(inputGroup.root).first()).not.toHaveClass(
    classContaining('form-field__wrapper-invalid')
  )
}

export const verifyInputInvalid = async (page, inputGroup) =>
  expect(page.locator(inputGroup.inputField).first()).toHaveClass(classContaining('invalid'))

export const verifyInputValid = async (page, inputGroup) => {
  await waitForPageQuiet(page)
  await expect(page.locator(inputGroup.inputField).first()).not.toHaveClass(
    classContaining('invalid')
  )
}

export const clearManually = async inputField => {
  const existValue = await getAttribute(inputField, 'value')

  for (let i = 0; i <= existValue.length; i++) {
    await inputField.press('Backspace')
    await inputField.press('Delete')
  }
}

export const getInputValue = async (page, inputGroup) => {
  const inputField = page.locator(inputGroup.inputField).first()

  return getAttribute(inputField, 'value')
}

// the page can be re-rendering after the previous action, the typed value would be lost
const typeIntoField = async (page, inputField, value) => {
  await waitForPageQuiet(page)
  await clearManually(inputField)

  return sendKeys(inputField, value)
}

export const typeValue = async (page, inputGroup, value) =>
  typeIntoField(page, page.locator(inputGroup.inputField).first(), value)

export const typeValueWithoutInputgroup = async (page, input, value) =>
  typeIntoField(page, page.locator(input).first(), value)

// the hint is rendered (and its text is filled) after the click, so the read is retried
const expectHintText = (hint, text) =>
  expectText(hint, text, { normalize: true, message: 'Hint text' })

export const checkHintText = async (page, inputGroup, hintComponent, text) => {
  const hintButton = page.locator(inputGroup.hintButton).first()
  await click(hintButton)
  await expectHintText(page.locator(hintComponent).first(), text)
}

export const checkHintTextWithHover = async (page, inputGroup, hintComponent, text) => {
  const hintText = await hoverAndReadHint(
    page,
    page.locator(inputGroup.hintButton).first(),
    hintComponent,
    text
  )

  expect(normalizeWhitespace(hintText)).toBe(normalizeWhitespace(text))
}

// the typed value can differ from the expected one (a lost or a left character): the failure tells what the field has
const withTypedValueDetails = async (input, expected, check) => {
  try {
    await check()
  } catch (error) {
    const actual = await getAttribute(input, 'value').catch(() => '<not readable>')

    error.message += `\nTyped string: "${expected}" (${expected.length}), the field has: "${actual}" (${actual.length})`

    throw error
  }
}

// BUG-001 (tests/KNOWN_BUGS.md), it shows up only sometimes: the editing of a label chip ends by itself while a long key
// is typed, the rest of the key is lost - the field has a beginning of the typed key, or the chip input is gone
const recognizeLabelKeyCut = async (testInfo, input, typed, error) => {
  const value = await getAttribute(input, 'value', { timeout: readTimeout }).catch(() => null)
  const isCut = value === null || (value.length < typed.length && typed.startsWith(value))

  if (testInfo && isCut) {
    failAsKnownBug(
      testInfo,
      'BUG-001',
      `the label key was cut while typed: "${typed}" (${typed.length}) -> ` +
        (value === null ? 'the chip input is gone' : `"${value}" (${value.length})`)
    )
  }

  throw error
}

// `testInfo` - for the label fields: a known bug of them is recognized (see `recognizeLabelKeyCut`)
export const checkInputAccordingHintText = async (
  page,
  attach,
  inputGroup,
  hintComponent,
  isForm = false,
  isLabel = false,
  testInfo = null
) => {
  if (!isLabel) {
    const hintButton = page.locator(inputGroup.hintButton).first()
    await click(hintButton)
  }
  const hint = page.locator(hintComponent).first()
  // the hint is rendered after the click
  const hintText = await retryAssertion(async () => {
    const text = await getText(hint, { timeout: 1000 })

    expect(text, 'The hint has no text').not.toBe('')

    return text
  })
  const { validStrings, invalidStrings, tooLongString } = parseString(hintText)
  const input = page.locator(inputGroup.inputField).first()

  await attach(JSON.stringify({ validStrings, invalidStrings }))

  for (let string of validStrings) {
    // the field must keep the whole valid value: a field that drops a part of it can still be valid, so the validity
    // check alone passed (a cut label key, BUG-001). The invalid ones are not checked: the field can cut them by design
    // (`maxlength`)
    try {
      await typeValue(page, inputGroup, string)
      await pollAttribute(input, 'value', {
        message: 'The field keeps the typed valid value'
      }).toBe(string)
    } catch (error) {
      if (isLabel) await recognizeLabelKeyCut(testInfo, input, string, error)

      throw error
    }

    await withTypedValueDetails(input, string, async () => {
      if (isForm) {
        await verifyFormInputValid(page, inputGroup)
      } else {
        await verifyInputValid(page, inputGroup)
      }
    })

    await clearManually(input)
  }

  const maxLength = await getAttribute(input, 'maxlength')

  // an invalid value must make the field invalid. In a label field the editing can end by itself meanwhile (BUG-001):
  // the field is cut or gone, that is recognized as the known bug. The field must have the typed value (only its
  // `maxlength` can cut it): a leftover of the previous value made the field invalid for another reason, and passed
  const expectInvalid = async string => {
    try {
      await typeValue(page, inputGroup, string)
      await pollAttribute(input, 'value', {
        message: 'The field keeps the typed invalid value'
      }).toBe(maxLength ? string.slice(0, Number(maxLength)) : string)
      await waitForPageQuiet(page)
      await withTypedValueDetails(input, string, async () => {
        if (isForm) {
          await verifyFormInputInvalid(page, inputGroup)
        } else {
          await verifyInputInvalid(page, inputGroup)
        }
      })
    } catch (error) {
      if (isLabel) await recognizeLabelKeyCut(testInfo, input, string, error)

      throw error
    }

    await clearManually(input)
  }

  for (let string of invalidStrings) {
    await expectInvalid(string)
  }

  // the length rule: a field with `maxlength` doesn't take more (its limit must be the rule's one), a field without it
  // must reject the value one character longer. It was not checked at all
  if (tooLongString) {
    if (maxLength !== null && maxLength !== '') {
      expect(
        Number(maxLength),
        'The max length of the field (maxlength) differs from the rule'
      ).toBe(tooLongString.length - 1)
    } else {
      await expectInvalid(tooLongString)
    }
  }
}

export const checkWarningHintText = async (page, inputGroup, hintComponent, text) => {
  const hintButton = page.locator(inputGroup.warningHint).first()
  await click(hintButton)
  await expectHintText(page.locator(hintComponent).first(), text)
}

export const checkWarningHintTextWithHover = async (page, inputGroup, hintComponent, text) => {
  const hintText = await hoverAndReadHint(
    page,
    page.locator(inputGroup.warningHint).first(),
    hintComponent,
    text
  )

  expect(normalizeWhitespace(hintText)).toBe(normalizeWhitespace(text))
}

export const checkWarningText = async (page, hintComponent, text) =>
  expectText(page.locator(hintComponent).first(), text, {
    normalize: true,
    message: 'Warning text'
  })

// the current value (the property, `toHaveValue` fails on an element that is not an input)
export const verifyTypedValue = async (page, inputGroup, value) =>
  pollAttribute(page.locator(inputGroup.inputField).first(), 'value', {
    message: 'Input value'
  }).toBe(value)

export const verifyPlaceholder = async (page, inputGroup, value) =>
  pollAttribute(page.locator(inputGroup.inputField).first(), 'placeholder', {
    message: 'Input placeholder'
  }).toBe(value)

export const verifyTypedValueWithoutInputgroup = async (page, input, value) =>
  pollAttribute(page.locator(input).first(), 'value', { message: 'Input value' }).toBe(value)

// the `disabled` attribute, as the previous read: `toBeDisabled` doesn't count it on a non-form element
export const verifyInputDisabled = async (page, inputGroup) =>
  expect(page.locator(inputGroup.inputField).first()).toHaveAttribute('disabled')

export const verifyInputClassDisabled = async (page, inputGroup) =>
  expect(page.locator(inputGroup.root).first()).toHaveClass(
    classContaining('form-field__wrapper-disabled')
  )

// the class is set on the wrapper (`inputGroup.root`), as in `verifyInputClassDisabled`: the <input> never has it
export const verifyInputClassEnabled = async (page, inputGroup) => {
  await waitForPageQuiet(page)
  await expect(page.locator(inputGroup.root).first()).not.toHaveClass(
    classContaining('form-field__wrapper-disabled')
  )
}

export const verifyInputEnabled = async (page, inputGroup) => {
  await waitForPageQuiet(page)
  await expect(page.locator(inputGroup.inputField).first()).not.toHaveAttribute('disabled')
}

export const verifyTextAreaCounter = async (page, textAreaGroup) =>
  retryAssertion(async () => {
    const textAreaField = page.locator(textAreaGroup.inputField).first()
    const textAreaText = await getText(textAreaField)
    const textAreaCounter = page.locator(textAreaGroup.counter).first()
    const counterValue = await getText(textAreaCounter)
    const maxLength = await getAttribute(textAreaField, 'maxlength')

    expect(+counterValue.split(' ')[0]).toBe(maxLength - textAreaText.length)
  })
