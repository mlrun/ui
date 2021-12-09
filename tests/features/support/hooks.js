import { Before, After, Status } from '@cucumber/cucumber'
import wd from 'selenium-webdriver'

Before(async function() {
  await this.driver.manage().window()
})

After(async function(testCase) {
  if (testCase.result.status === Status.FAILED) {
    var stream = await this.driver.takeScreenshot()
    await this.attach(stream, 'base64:image/png')
  }
  const logs = await this.driver
    .then(() =>
      this.driver
        .manage()
        .logs()
        .get(wd.logging.Type.BROWSER)
    )
    .then(result => {
      return result
    })
  await this.driver.quit()
  if (logs.some(log => log.level.name_ === 'SEVERE')) {
    await logs.forEach(log =>
      this.attach(`${log.level.name} ${log.message}`, 'text/plain')
    )
    throw new Error('There are some errors in console')
  }
})
