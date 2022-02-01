import { expect } from 'chai'
import { Key } from 'selenium-webdriver'

async function clearManually(inputField) {
  const existValue = await inputField.getAttribute('value')
  for (let i = 0; i <= existValue.length; i++) {
    await inputField.sendKeys(Key.BACK_SPACE, Key.DELETE)
  }
}

async function getOptionValues(driver, options) {
  return await driver.findElements(options).then(function(elements) {
    return Promise.all(elements.map(element => element.getText()))
  })
}

const action = {
  clearManually,
  getOptionValues: getOptionValues,
  typeSearchableValue: async function(driver, inputGroup, value) {
    const inputField = await driver.findElement(inputGroup.inputField)
    await clearManually(inputField)
    return await inputField.sendKeys(value)
  },
  verifyTypedValue: async function(driver, inputGroup, value) {
    const inputField = await driver.findElement(inputGroup.inputField)
    const txt = await inputField.getAttribute('value')
    expect(txt).equal(value)
  },
  isContainsSubstringInSuggestedOptions: async function(
    driver,
    inputGroup,
    value,
    caseSensitive = false
  ) {
    let arr = await getOptionValues(driver, inputGroup.options, value)
    let tmpValue = value

    if (caseSensitive) {
      arr = arr.map(item => item.toLowerCase())
      tmpValue = value.toLowerCase()
    }

    expect(arr.length > 0).equal(true, `Elements not found: [${arr}]`)
    expect(arr.every(item => item.includes(tmpValue))).equal(
      true,
      `Searcheble string "${tmpValue}" do not find in all values of: [${arr}]`
    )
  }
}

module.exports = action
