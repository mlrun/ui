import { expect } from 'chai'
import { differenceWith, isEqual } from 'lodash'
import { clickNearComponent, scrollToWebElement } from './common.action'

async function getOptionValues(driver, options) {
  return await driver.findElements(options).then(function(elements) {
    return Promise.all(elements.map(element => element.getText()))
  })
}

const action = {
  getOptionValues: getOptionValues,
  openDropdown: async function(driver, dropdown, scroll = true) {
    const element = await driver.findElement(dropdown.open_button)
    if (scroll) {
      await scrollToWebElement(driver, element)
    }
    if (element) {
      await element.click()
    }
    await driver.sleep(500)
  },
  collapseDropdown: async function(driver, dropdown) {
    // const element = await driver.findElement(dropdown.root)
    await clickNearComponent(dropdown.root)
    await driver.sleep(100)
  },
  selectOptionInDropdown: async function(driver, dropdown, option) {
    const selectedElement = await driver.findElement(dropdown.open_button)
    const selectedText = await selectedElement.getText()
    if (selectedText !== option) {
      const elements = await driver.findElements(dropdown.options)
      for (const element of elements) {
        await scrollToWebElement(driver, element)
        const txt = await element.getText()
        if (txt === option) {
          await element.click()
          await driver.sleep(250)
          break
        }
      }
    } else {
      selectedElement.click()
      await driver.sleep(500)
    }
  },
  selectOptionInDropdownWithoutCheck: async function(driver, dropdown, option) {
    const elements = await driver.findElements(dropdown.options)
    for (const element of elements) {
      const txt = await element.getText()
      if (txt === option) {
        await element.click()
        await driver.sleep(500)
        break
      }
    }
  },
  checkDropdownSelectedOption: async function(driver, dropdown, option) {
    const element = await driver.findElement(dropdown.open_button)
    const txt = await element.getText()
    expect(txt).equal(option)
  },
  checkDropdownOptions: async function(driver, dropdown, values) {
    const options = await getOptionValues(driver, dropdown.options)
    const diff = differenceWith(options, values, isEqual)
    expect(diff.length).equal(0, 'Options difference: ' + diff)
  },
  checkDropdownContainsOptions: async function(driver, dropdown, values) {
    const options = await getOptionValues(driver, dropdown.options)
    let notPresent = []
    for (let option of values) {
      if (options.every(item => item !== option)) {
        notPresent.push(option)
      }
    }
    expect(notPresent.length).equal(
      0,
      '\nOptions not present: ' +
        notPresent +
        '\noptions: ' +
        options +
        '\nconst: ' +
        values +
        '\n'
    )
  }
}

module.exports = action
