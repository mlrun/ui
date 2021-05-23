import { expect } from 'chai'

const action = {
  isTabActive: async function(driver, component, indx) {
    const element1 = await driver.findElement(component.rowRoot(indx))
    const element2 = await driver.findElement(
      component.tableFields['tab'](indx)
    )
    const attributes1 = await element1.getAttribute('class')
    const attributes2 = await element2.getAttribute('class')
    const flag =
      attributes1.includes('content-menu__item_active') ||
      attributes2.includes('active-tab')
    expect(flag).equal(true)
  }
}

module.exports = action
