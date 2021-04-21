import actionMenu from '../components/action-menu.component'

const action = {
  openActionMenu: async function(driver, selector) {
    const action_menu = actionMenu(selector.value)
    const elements = await driver.findElements(action_menu.options)
    if (elements.length === 0) {
      const element = await driver.findElement(action_menu.open_button)
      if (element) {
        element.click()
      }
    }
  },
  selectOptionInActionMenu: async function(driver, selector, option) {
    const action_menu = actionMenu(selector.value)
    const elements = await driver.findElements(action_menu.options)
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
