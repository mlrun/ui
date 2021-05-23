import { expect } from 'chai'

const action = {
  isRadioButtonSelected: async function(driver, radiobutton) {
    const element = await driver.findElement(radiobutton['mark'])
    const classes = await element.getAttribute('value')
    expect(classes.includes('unchecked')).equal(false)
  },
  isRadioButtonUnselected: async function(driver, radiobutton) {
    const checkboxElement = await driver.findElement(radiobutton['checkbox'])
    const classes = await checkboxElement.getAttribute('class')
    expect(classes.includes('unchecked')).equal(true)
  },
  selectRadiobutton: async function(driver, radiobutton) {
    const checkboxElement = await driver.findElement(radiobutton['checkbox'])
    const classes = await checkboxElement.getAttribute('class')
    if (classes.includes('unchecked')) {
      await checkboxElement.click()
    }
  },
  unselectRadiobutton: async function(driver, radiobutton) {
    const checkboxElement = await driver.findElement(radiobutton['checkbox'])
    const classes = await checkboxElement.getAttribute('class')
    if (!classes.includes('unchecked')) {
      await checkboxElement.click()
    }
  }
}

module.exports = action
