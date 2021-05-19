import { expect } from 'chai'

const action = {
  isCheckboxChecked: async function(driver, checkbox) {
    const checkboxElement = await driver.findElement(checkbox['checkbox'])
    const classes = await checkboxElement.getAttribute('class')
    expect(classes.includes('unchecked')).equal(false)
  },
  isCheckboxUnchecked: async function(driver, checkbox) {
    const checkboxElement = await driver.findElement(checkbox['checkbox'])
    const classes = await checkboxElement.getAttribute('class')
    expect(classes.includes('unchecked')).equal(true)
  },
  checkCheckbox: async function(driver, checkbox) {
    const checkboxElement = await driver.findElement(checkbox['checkbox'])
    const classes = await checkboxElement.getAttribute('class')
    if (classes.includes('unchecked')) {
      await checkboxElement.click()
    }
  },
  uncheckCheckbox: async function(driver, checkbox) {
    const checkboxElement = await driver.findElement(checkbox['checkbox'])
    const classes = await checkboxElement.getAttribute('class')
    if (!classes.includes('unchecked')) {
      await checkboxElement.click()
    }
  }
}

module.exports = action
