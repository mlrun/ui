/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
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
