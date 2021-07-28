import { Before, After, Status } from '@cucumber/cucumber'

Before(async function() {
  await this.driver
    .manage()
    .window()
    .maximize()
})

After(async function(testCase) {
  if (testCase.result.status === Status.FAILED) {
    var stream = await this.driver.takeScreenshot()
    await this.attach(stream, 'base64:image/png')
  }
  await this.driver.quit()
})
