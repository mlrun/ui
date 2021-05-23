import { expect } from 'chai'
import { differenceWith, isEqual } from 'lodash'

async function getOptionValues(driver, options) {
  return await driver.findElements(options).then(function(elements) {
    return Promise.all(elements.map(element => element.getText()))
  })
}

const action = {
  openDropdown: async function(driver, dropdown) {
    const element = await driver.findElement(dropdown.open_button)
    if (element) {
      await element.click()
    }
    await driver.sleep(500)
    const elements = await driver.findElements(dropdown.options)
    expect(elements.length > 0).equal(true)
  },
  selectOptionInDropdown: async function(driver, dropdown, option) {
    const selectedElement = await driver.findElement(dropdown.open_button)
    const selectedText = await selectedElement.getText()
    if (selectedText !== option) {
      const elements = await driver.findElements(dropdown.options)
      for (const element of elements) {
        const txt = await element.getText()
        if (txt === option) {
          await element.click()
          await driver.sleep(500)
        }
      }
    } else {
      selectedElement.click()
      await driver.sleep(500)
    }
  },
  checkDropdownSelectedOption: async function(driver, dropdown, option) {
    const element = await driver.findElement(dropdown.open_button)
    const txt = await element.getText()
    expect(txt).equal(option)
  },
  checkDropdownOptions: async function(driver, dropdown, values) {
    const options = await getOptionValues(driver, dropdown.options)
    expect(differenceWith(options, values, isEqual).length).equal(0)
  }
}

module.exports = action
