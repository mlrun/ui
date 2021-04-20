import { expect } from 'chai'

const action = {
  openDropdown: async function(driver, dropdown) {
    const element = await driver.findElement(dropdown.open_button)
    if (element) {
      element.click()
    }
    await driver.sleep(500)
    const elements = await driver.findElements(dropdown.options)
    expect(elements.length > 0).equal(true)
  },
  selectOptionInDropdown: async function(driver, dropdown, option) {
    const elements = await driver.findElements(dropdown.options)
    for (const element of elements) {
      const txt = await element.getText()
      if (txt === option) {
        await element.click()
        await driver.sleep(500)
      }
    }
    const selectedElement = await driver.findElement(dropdown.open_button)
    const txt = await selectedElement.getText()
    expect(txt).equal(option)
  },
  checkDropdownSelectedOption: async function(driver, dropdown, option) {
    const element = await driver.findElement(dropdown.open_button)
    const txt = await element.getText()
    expect(txt).equal(option)
  }
}

module.exports = action
