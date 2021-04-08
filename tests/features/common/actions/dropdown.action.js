import { expect } from 'chai'

const action = {
  openDropdown: async function(driver, dropdown) {
    await driver
      .findElement(dropdown.open_button)
      .then(element => {
        if (element) {
          element.click()
        }
      })
      .then(() => driver.sleep(500))
    await driver
      .findElements(dropdown.options)
      .then(elements => expect(elements.length > 0).equal(true))
  },
  selectOptionInDropdown: async function(driver, dropdown, option) {
    await driver.findElements(dropdown.options).then(elements => {
      if (elements.length > 0) {
        for (let indx in elements) {
          elements[indx].getText().then(txt => {
            if (txt === option) {
              elements[indx].click().then(() => driver.sleep(500))
            }
          })
        }
      }
    })
    // await driver.findElement(dropdown.open_button)
    //     .then(element => { return element.getText() })
    //     .then(txt => expect(txt).equal(option));
  },
  checkDropdownSelectedOption: async function(driver, dropdown, option) {
    await driver
      .findElement(dropdown.open_button)
      .then(element => {
        return element.getText()
      })
      .then(txt => expect(txt).equal(option))
  }
}

module.exports = action
