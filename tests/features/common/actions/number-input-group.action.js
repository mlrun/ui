const action = {
  incrementValue: async function(driver, inputGroup, value) {
    const inc_btn = await driver.findElement(inputGroup.inc_btn)
    for (let i = 0; i < value; i++) {
      await inc_btn.click()
      await driver.sleep(100)
    }
  },
  decrementValue: async function(driver, inputGroup, value) {
    const dec_btn = await driver.findElement(inputGroup.dec_btn)
    for (let i = 0; i < value; i++) {
      await dec_btn.click()
      await driver.sleep(100)
    }
  }
}

module.exports = action
