import { expect } from 'chai'
import { differenceWith, isEqual } from 'lodash'

async function getOptionValues(driver, options) {
  return await driver.findElements(options).then(function(elements) {
    return Promise.all(elements.map(element => element.getText()))
  })
}

const action = {
  openActionMenu: async function(driver, actionMenu) {
    const element = await driver.findElement(actionMenu.open_button)
    if (element) {
      element.click()
    }
  },
  selectOptionInActionMenu: async function(driver, actionMenu, option) {
    const elements = await driver.findElements(actionMenu.options)
    for (const element of elements) {
      element.getText().then(txt => {
        if (txt === option) {
          element.click()
        }
      })
    }
  },
  checkActionMenuOptions: async function(driver, actionMenu, values) {
    const options = await getOptionValues(driver, actionMenu.options)
    expect(differenceWith(options, values, isEqual).length).equal(0)
  }
}

module.exports = action
