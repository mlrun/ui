import { expect } from 'chai'

const action = {
  isRadioButtonSelected: async function(driver, radiobutton) {
    const element = await driver.findElement(radiobutton['radiobutton'])
    const selected = await element.isSelected()
    expect(selected).equal(true)
  },
  isRadioButtonUnselected: async function(driver, radiobutton) {
    const element = await driver.findElement(radiobutton['radiobutton'])
    const selected = await element.isSelected()
    expect(selected).equal(false)
  },
  selectRadiobutton: async function(driver, radiobutton) {
    const element = await driver.findElement(radiobutton['radiobutton'])
    const elementName = await driver.findElement(radiobutton['name'])
    const selected = await element.isSelected()
    if (!selected) {
      await elementName.click()
    }
  }
}

module.exports = action
