import { expect } from 'chai'
import { Key } from 'selenium-webdriver'
import { parseString } from '../../common-tools/common-tools'

async function verifyInputInvalid(driver, inputGroup) {
  const inputField = await driver.findElement(inputGroup.inputField)
  const flag = await inputField.getAttribute('class')
  expect(flag.includes('invalid')).equal(true)
}

async function verifyInputValid(driver, inputGroup) {
  const inputField = await driver.findElement(inputGroup.inputField)
  const flag = await inputField.getAttribute('class')
  expect(flag.includes('invalid')).equal(false)
}

async function clearManually(inputField) {
  const existValue = await inputField.getAttribute('value')
  for (let i = 0; i <= existValue.length; i++) {
    await inputField.sendKeys(Key.BACK_SPACE, Key.DELETE)
  }
}

async function getInputValue(driver, inputGroup) {
  const inputField = await driver.findElement(inputGroup.inputField)
  return inputField.getAttribute('value')
}

async function typeValue(driver, inputGroup, value) {
  const inputField = await driver.findElement(inputGroup.inputField)
  await clearManually(inputField)
  return inputField.sendKeys(value)
}

const action = {
  clearManually,
  getInputValue,
  typeValue,
  verifyInputValid,
  verifyInputInvalid,
  checkHintText: async function(driver, inputGroup, hintComponent, text) {
    const hintButton = await driver.findElement(inputGroup.hintButton)
    await hintButton.click()
    await driver.sleep(250)
    const hint = await driver.findElement(hintComponent)
    const hintText = await hint.getText()
    expect(hintText).equal(text)
  },
  checkInputAccordingHintText: async function(
    driver,
    inputGroup,
    hintComponent
  ) {
    const hintButton = await driver.findElement(inputGroup.hintButton)
    await hintButton.click()
    await driver.sleep(250)
    const hint = await driver.findElement(hintComponent)
    const hintText = await hint.getText()
    const { validStrings, invalidStrings } = parseString(hintText)
    const input = await driver.findElement(inputGroup.inputField)

    for (let string of validStrings) {
      await typeValue(driver, inputGroup, string)
      await driver.sleep(250)
      await verifyInputValid(driver, inputGroup)
      await clearManually(input)
    }

    for (let string of invalidStrings) {
      await typeValue(driver, inputGroup, string)
      await driver.sleep(250)
      await verifyInputInvalid(driver, inputGroup)
      await clearManually(input)
    }
  },
  checkWarningHintText: async function(
    driver,
    inputGroup,
    hintComponent,
    text
  ) {
    const hintButton = await driver.findElement(inputGroup.warningHint)
    await hintButton.click()
    const hint = await driver.findElement(hintComponent)
    await driver.sleep(250)
    const hintText = await hint.getText()
    expect(hintText).equal(text)
  },
  verifyTypedValue: async function(driver, inputGroup, value) {
    const txt = await getInputValue(driver, inputGroup)
    expect(txt).equal(value)
  },
  verifyInputDisabled: async function(driver, inputGroup) {
    const inputField = await driver.findElement(inputGroup.inputField)
    const flag = await inputField.getAttribute('disabled')
    expect(flag).equal('true')
  },
  verifyInputEnabled: async function(driver, inputGroup) {
    const inputField = await driver.findElement(inputGroup.inputField)
    const flag = await inputField.getAttribute('disabled')
    expect(flag).equal(null)
  }
}

module.exports = action
