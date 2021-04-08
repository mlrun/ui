import actionMenu from '../components/action-menu.component'

const action = {
  openActionMenu: async function(driver, selector) {
    let action_menu = actionMenu(selector.value)
    await driver
      .findElements(action_menu.options)
      .then(elements => {
        if (elements.length === 0) {
          return driver.findElement(action_menu.open_button)
        }
      })
      .then(element => {
        if (element) {
          element.click()
        }
      })
  },
  selectOptionInActionMenu: async function(driver, selector, option) {
    let action_menu = actionMenu(selector.value)
    await driver.findElements(action_menu.options).then(elements => {
      if (elements.length > 0) {
        for (let indx in elements) {
          elements[indx].getText().then(txt => {
            if (txt === option) {
              elements[indx].click()
            }
          })
        }
      }
    })
  }
}

module.exports = action
