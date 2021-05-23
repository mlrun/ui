const action = {
  openActionMenu: async function(driver, actionMenu) {
    const elements = await driver.findElements(actionMenu.options)
    if (elements.length === 0) {
      const element = await driver.findElement(actionMenu.open_button)
      if (element) {
        element.click()
      }
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
  }
}

module.exports = action
