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
import { parseString } from '../../common-tools/common-tools.js'
import { getHoverHintText, hoverElementCenter } from './common.action.js'
import {
  click,
  getAttribute,
  getText,
  normalizeWhitespace,
  retryAssertion,
  sendKeys
} from '../../common-tools/element.js'

async function verifyFormInputInvalid(page, inputGroup) {
  const inputField = page.locator(inputGroup.root).first()
  await page.waitForTimeout(500)
  const flag = await getAttribute(inputField, 'class')

  expect(flag.includes('form-field__wrapper-invalid')).toBe(true)
}

async function verifyFormInputValid(page, inputGroup) {
  const inputField = page.locator(inputGroup.root).first()
  const flag = await getAttribute(inputField, 'class')

  expect(flag.includes('form-field__wrapper-invalid')).toBe(false)
}

async function getInputPlaceholder(page, inputGroup) {
  const inputField = page.locator(inputGroup.inputField).first()

  return getAttribute(inputField, 'placeholder')
}

export const verifyInputInvalid = async (page, inputGroup) =>
  retryAssertion(async () => {
    const inputField = page.locator(inputGroup.inputField).first()
    const flag = await getAttribute(inputField, 'class')

    await page.waitForTimeout(500)
    expect(flag.includes('invalid')).toBe(true)
  })

export const verifyInputValid = async (page, inputGroup) =>
  retryAssertion(async () => {
    const inputField = page.locator(inputGroup.inputField).first()
    const flag = await getAttribute(inputField, 'class')

    expect(flag.includes('invalid')).toBe(false)
  })

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

export const getInputValueWithoutInputgroup = async (page, input) => {
  const inputField = page.locator(input).first()

  return getAttribute(inputField, 'value')
}

export const typeValue = async (page, inputGroup, value) => {
  const inputField = page.locator(inputGroup.inputField).first()
  await clearManually(inputField)

  return sendKeys(inputField, value)
}

export const typeValueWithoutInputgroup = async (page, input, value) => {
  const inputField = page.locator(input).first()
  await clearManually(inputField)

  return sendKeys(inputField, value)
}

export const checkHintText = async (page, inputGroup, hintComponent, text) => {
  const hintButton = page.locator(inputGroup.hintButton).first()
  await click(hintButton)
  await page.waitForTimeout(250)
  const hint = page.locator(hintComponent).first()
  const hintText = await getText(hint)

  expect(normalizeWhitespace(hintText)).toBe(normalizeWhitespace(text))
}

export const checkHintTextWithHover = async (page, inputGroup, hintComponent, text) => {
  const hintButton = page.locator(inputGroup.hintButton).first()
  await hoverElementCenter(page, hintButton)
  const hintText = await getHoverHintText(page, hintComponent, text)

  expect(normalizeWhitespace(hintText)).toBe(normalizeWhitespace(text))
}

export const checkInputAccordingHintText = async (
  page,
  attach,
  inputGroup,
  hintComponent,
  isForm = false,
  isLabel = false
) => {
  if (!isLabel) {
    const hintButton = page.locator(inputGroup.hintButton).first()
    await click(hintButton)
    await page.waitForTimeout(500)
  }
  const hint = page.locator(hintComponent).first()
  await page.waitForTimeout(500)
  const hintText = await getText(hint)
  await page.waitForTimeout(500)
  const { validStrings, invalidStrings } = parseString(hintText)
  const input = page.locator(inputGroup.inputField).first()

  await attach(JSON.stringify({ validStrings, invalidStrings }))

  for (let string of validStrings) {
    await typeValue(page, inputGroup, string)

    if (isForm) {
      await verifyFormInputValid(page, inputGroup)
    } else {
      await verifyInputValid(page, inputGroup)
    }

    await clearManually(input)
  }

  for (let string of invalidStrings) {
    await typeValue(page, inputGroup, string)
    await page.waitForTimeout(250)

    if (isForm) {
      await verifyFormInputInvalid(page, inputGroup)
    } else {
      await verifyInputInvalid(page, inputGroup)
    }

    await clearManually(input)
  }
}

export const checkWarningHintText = async (page, inputGroup, hintComponent, text) => {
  const hintButton = page.locator(inputGroup.warningHint).first()
  await page.waitForTimeout(250)
  await click(hintButton)
  await page.waitForTimeout(250)
  const hint = page.locator(hintComponent).first()
  await page.waitForTimeout(250)
  const hintText = await getText(hint)

  expect(normalizeWhitespace(hintText)).toBe(normalizeWhitespace(text))
}

export const checkWarningHintTextWithHover = async (page, inputGroup, hintComponent, text) => {
  const hintButton = page.locator(inputGroup.warningHint).first()
  await page.waitForTimeout(250)
  await hoverElementCenter(page, hintButton)
  const hintText = await getHoverHintText(page, hintComponent, text)

  expect(normalizeWhitespace(hintText)).toBe(normalizeWhitespace(text))
}

export const checkWarningText = async (page, hintComponent, text) =>
  retryAssertion(async () => {
    const hint = page.locator(hintComponent).first()
    await page.waitForTimeout(250)
    const hintText = await getText(hint)

    expect(normalizeWhitespace(hintText)).toBe(normalizeWhitespace(text))
  })

export const verifyTypedValue = async (page, inputGroup, value) =>
  retryAssertion(async () => {
    const txt = await getInputValue(page, inputGroup)

    expect(txt).toBe(value)
  })

export const verifyPlaceholder = async (page, inputGroup, value) =>
  retryAssertion(async () => {
    const txt = await getInputPlaceholder(page, inputGroup)

    expect(txt).toBe(value)
  })

export const verifyTypedValueWithoutInputgroup = async (page, input, value) =>
  retryAssertion(async () => {
    const txt = await getInputValueWithoutInputgroup(page, input)

    expect(txt).toBe(value)
  })

export const verifyInputDisabled = async (page, inputGroup) =>
  retryAssertion(async () => {
    const inputField = page.locator(inputGroup.inputField).first()
    const flag = await getAttribute(inputField, 'disabled')

    expect(flag).toBe('true')
  })

export const verifyInputClassDisabled = async (page, inputGroup) =>
  retryAssertion(async () => {
    const inputField = page.locator(inputGroup.root).first()
    const attributes = await getAttribute(inputField, 'class')
    const flag = attributes.includes('form-field__wrapper-disabled')

    expect(flag).toBe(true)
  })

// the class is set on the wrapper (`inputGroup.root`), as in `verifyInputClassDisabled`: the <input> never has it
export const verifyInputClassEnabled = async (page, inputGroup) =>
  retryAssertion(async () => {
    const inputField = page.locator(inputGroup.root).first()
    const attributes = await getAttribute(inputField, 'class')
    const flag = attributes.includes('form-field__wrapper-disabled')

    expect(flag).toBe(false)
  })

export const verifyInputEnabled = async (page, inputGroup) =>
  retryAssertion(async () => {
    const inputField = page.locator(inputGroup.inputField).first()
    const flag = await getAttribute(inputField, 'disabled')

    expect(flag).toBe(null)
  })

export const verifyTextAreaCounter = async (page, textAreaGroup) =>
  retryAssertion(async () => {
    const textAreaField = page.locator(textAreaGroup.inputField).first()
    const textAreaText = await getText(textAreaField)
    const textAreaCounter = page.locator(textAreaGroup.counter).first()
    const counterValue = await getText(textAreaCounter)
    const maxLength = await getAttribute(textAreaField, 'maxlength')

    expect(+counterValue.split(' ')[0]).toBe(maxLength - textAreaText.length)
  })
