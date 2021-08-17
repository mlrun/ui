import { expect } from 'chai'
import { Key } from 'selenium-webdriver'

async function clearManualy(inputField) {
  const existValue = await inputField.getAttribute('value')
  for (let i = 0; i <= existValue.length; i++) {
    await inputField.sendKeys(Key.BACK_SPACE, Key.DELETE)
  }
}

const action = {
  clearManualy: clearManualy,
  typeValue: async function(driver, inputGroup, value) {
    // console.log('debug: ', inputGroup.inputField)
    const inputField = await driver.findElement(inputGroup.inputField)
    await clearManualy(inputField)
    return await inputField.sendKeys(value)
  },
  checkHintText: async function(driver, inputGroup, hintComponent, text) {
    // console.log('debug: ', inputGroup.hintButton)
    const hintButton = await driver.findElement(inputGroup.hintButton)
    await hintButton.click()
    await driver.sleep(250)
    const hint = await driver.findElement(hintComponent)
    const hintText = await hint.getText()
    expect(hintText).equal(text)
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
    const inputField = await driver.findElement(inputGroup.inputField)
    const txt = await inputField.getAttribute('value')
    expect(txt).equal(value)
  }
}

module.exports = action
