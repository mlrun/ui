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
import { expect } from 'chai'
import { Key } from 'selenium-webdriver'
import { parseString } from '../../common-tools/common-tools'

async function verifyFormInputInvalid(driver, inputGroup) {
  const inputField = await driver.findElement(inputGroup.root)
  await driver.sleep(500)
  const flag = await inputField.getAttribute('class')

  expect(flag.includes('form-field__wrapper-invalid')).equal(true)
}

async function verifyFormInputValid(driver, inputGroup) {
  const inputField = await driver.findElement(inputGroup.root)
  const flag = await inputField.getAttribute('class')

  expect(flag.includes('form-field__wrapper-invalid')).equal(false)
}

async function getInputPlaceholder(driver, inputGroup) {
  const inputField = await driver.findElement(inputGroup.inputField)

  return inputField.getAttribute('placeholder')
}


export const verifyInputInvalid = async (driver, inputGroup) => {
  const inputField = await driver.findElement(inputGroup.inputField)
  const flag = await inputField.getAttribute('class')

  await driver.sleep(500)
  expect(flag.includes('invalid')).equal(true)
}

export const verifyInputValid = async (driver, inputGroup) => {
  const inputField = await driver.findElement(inputGroup.inputField)
  const flag = await inputField.getAttribute('class')

  expect(flag.includes('invalid')).equal(false)
}

export const clearManually = async (inputField) => {
  const existValue = await inputField.getAttribute('value')

  for (let i = 0; i <= existValue.length; i++) {
    await inputField.sendKeys(Key.BACK_SPACE, Key.DELETE)
  }
}

export const getInputValue = async (driver, inputGroup) => {
  const inputField = await driver.findElement(inputGroup.inputField)

  return inputField.getAttribute('value')
}

export const getInputValueWithoutInputgroup = async (driver, input) => {
  const inputField = await driver.findElement(input)

  return inputField.getAttribute('value')
}

export const typeValue = async (driver, inputGroup, value) => {
  const inputField = await driver.findElement(inputGroup.inputField)
  await clearManually(inputField)

  return inputField.sendKeys(value)
}

export const typeValueWithoutInputgroup = async (driver, input, value) => {
  const inputField = await driver.findElement(input)
  await clearManually(inputField)
  
  return inputField.sendKeys(value)
}

export const checkHintText = async (driver, inputGroup, hintComponent, text) => {
    const hintButton = await driver.findElement(inputGroup.hintButton)
    await hintButton.click()
    await driver.sleep(250)
    const hint = await driver.findElement(hintComponent)
    const hintText = await hint.getText()

    expect(hintText).equal(text)
  }

export const checkHintTextWithHover = async (driver, inputGroup, hintComponent, text) => {
    const hintButton = await driver.findElement(inputGroup.hintButton)
    const coordinates = await hintButton.getRect()
    const actions = driver.actions({ async: true })
    await actions
      .move({ x: parseInt(coordinates.x), y: parseInt(coordinates.y) })
      .perform()
    await driver.sleep(250)
    const hint = await driver.findElement(hintComponent)
    const hintText = await hint.getText()

    expect(hintText).equal(text)
  }

export const checkInputAccordingHintText = async (
    driver,
    attach,
    inputGroup,
    hintComponent,
    isForm = false,
    isLabel = false
  ) => {

    if (!isLabel){
      const hintButton = await driver.findElement(inputGroup.hintButton)
      await hintButton.click()
      await driver.sleep(500)
    }
    const hint = await driver.findElement(hintComponent)
    await driver.sleep(500)
    const hintText = await hint.getText()
    await driver.sleep(500)
    const { validStrings, invalidStrings } = parseString(hintText)
    const input = await driver.findElement(inputGroup.inputField)

    await attach(JSON.stringify({ validStrings, invalidStrings }))

    for (let string of validStrings) {
      await typeValue(driver, inputGroup, string)

      if (isForm) {
        await verifyFormInputValid(driver, inputGroup)
      } else {
        await verifyInputValid(driver, inputGroup)
      }

      await clearManually(input)
    }

    for (let string of invalidStrings) {
      await typeValue(driver, inputGroup, string)
      await driver.sleep(250)

      if (isForm) {
        await verifyFormInputInvalid(driver, inputGroup)
      } else {
        await verifyInputInvalid(driver, inputGroup)
      }

      await clearManually(input)
    }
  }

export const checkWarningHintText = async (driver, inputGroup, hintComponent, text) => {
    const hintButton = await driver.findElement(inputGroup.warningHint)
    await driver.sleep(250)
    await hintButton.click()
    await driver.sleep(250)
    const hint = await driver.findElement(hintComponent)
    await driver.sleep(250)
    const hintText = await hint.getText()

    expect(hintText).equal(text)
  }

export const checkWarningHintTextWithHover = async (driver, inputGroup, hintComponent, text) => {
    const hintButton = await driver.findElement(inputGroup.warningHint)
    await driver.sleep(250)
    const coordinates = await hintButton.getRect()
    const actions = driver.actions({ async: true })
    await actions
      .move({ x: parseInt(coordinates.x), y: parseInt(coordinates.y) })
      .perform()
    await driver.sleep(500)
    const hint = await driver.findElement(hintComponent)
    await driver.sleep(250)
    const hintText = await hint.getText()

    expect(hintText).equal(text)
  }

export const checkWarningText = async (driver, hintComponent, text) => {
    const hint = await driver.findElement(hintComponent)
    await driver.sleep(250)
    const hintText = await hint.getText()

    expect(hintText).equal(text)
  }

export const verifyTypedValue = async (driver, inputGroup, value) => {
    const txt = await getInputValue(driver, inputGroup)

    expect(txt).equal(value)
  }

export const verifyPlaceholder = async (driver, inputGroup, value) => {
    const txt = await getInputPlaceholder(driver, inputGroup)

    expect(txt).equal(value)
  }

export const verifyTypedValueWithoutInputgroup = async (driver, input, value) => {
    const txt = await getInputValueWithoutInputgroup(driver, input)

    expect(txt).equal(value)
  }

export const verifyInputDisabled = async (driver, inputGroup) => {
    const inputField = await driver.findElement(inputGroup.inputField)
    const flag = await inputField.getAttribute('disabled')

    expect(flag).equal('true')
  }

export const verifyInputClassDisabled = async (driver, inputGroup) => {
    const inputField = await driver.findElement(inputGroup.root)
    const attributes = await inputField.getAttribute('class')
    const flag = attributes.includes('form-field__wrapper-disabled')

    expect(flag).equal(true)
  }

export const verifyInputClassEnabled = async (driver, inputGroup) => {
    const inputField = await driver.findElement(inputGroup.inputField)
    const attributes = await inputField.getAttribute('class')
    const flag = attributes.includes('form-field__wrapper-disabled')

    expect(flag).equal(false)
  }

export const verifyInputEnabled = async (driver, inputGroup) => {
    const inputField = await driver.findElement(inputGroup.inputField)
    const flag = await inputField.getAttribute('disabled')
    
    expect(flag).equal(null)
  }

export const verifyTextAreaCounter = async (driver, textAreaGroup) => {
    const textAreaField = await driver.findElement(textAreaGroup.inputField)
    const textAreaText = await textAreaField.getText()
    const textAreaCounter = await driver.findElement(textAreaGroup.counter)
    const counterValue = await textAreaCounter.getText()
    const maxLength = await textAreaField.getAttribute('maxlength')

    expect(+counterValue.split(' ')[0]).equal(maxLength - textAreaText.length)
  }
