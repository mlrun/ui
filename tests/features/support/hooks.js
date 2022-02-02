import { Before, After, Status } from '@cucumber/cucumber'
import wd from 'selenium-webdriver'
import { browser } from '../../config'
import { clearBackendAfterTest } from '../common-tools/common-tools'

Before(async function() {
  await this.driver.manage().window()
  this.createdItems = []
  this.testContext = {}
})

After(async function(testCase) {
  if (testCase.result.status === Status.FAILED) {
    var stream = await this.driver.takeScreenshot()
    await this.attach(stream, 'base64:image/png')
  }
  let logs = []
  if (browser === 'chrome') {
    await this.driver
      .then(() =>
        this.driver
          .manage()
          .logs()
          .get(wd.logging.Type.BROWSER)
      )
      .then(result => {
        logs = result
      })
  }
  await clearBackendAfterTest(this.driver, this.createdItems)
  await this.driver.quit()
  if (logs.some(log => log.level.name_ === 'SEVERE')) {
    await logs.forEach(log =>
      this.attach(`${log.level.name} ${log.message}`, 'text/plain')
    )
    // throw new Error('There are some errors in console')
  }
})
