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
import { Before, After, AfterAll, Status } from '@cucumber/cucumber'
import wd from 'selenium-webdriver'
import { browser } from '../../config.js'
import { clearBackendAfterTest, resetMockState, setRequestsFailureCondition } from '../common-tools/common-tools.js'
import { startDriver, quitActiveDriver, E2E_TIMEZONE } from './world.js'

// the first page load after the dev server start is slow: Vite pre-bundles the dependencies (`optimizeDeps.force`)
// and may reload the page, so without waiting the first scenarios get a blank page
let isAppWarmedUp = false

Before({ timeout: 5 * 60 * 1000 }, async function () {
  await resetMockState()
  await quitActiveDriver()
  const { driver } = await startDriver()
  this.driver = driver
  if (browser === 'chrome') {
    // TZ isn't honored by every Chrome build, override the timezone of the tab as well
    await this.driver.sendDevToolsCommand('Emulation.setTimezoneOverride', { timezoneId: E2E_TIMEZONE })
  }
  await this.driver.manage().window()
  this.createdItems = []
  this.testContext = {}
  await this.driver.get('http://localhost:3000')
  if (!isAppWarmedUp) {
    await this.driver.wait(wd.until.elementLocated(wd.By.css('.projects__wrapper')), 4 * 60 * 1000)
    isAppWarmedUp = true
  }
  await this.driver.executeScript(function() {
    localStorage.setItem('igzFullVersion', '3.5.5')
  })
})

After(async function () {
  try {
    await clearBackendAfterTest(this.driver, this.createdItems)
  } finally {
    await quitActiveDriver()
  }
})

// Failure evidence: screenshot, page URL and browser console log (for passed scenarios - only console errors).
// The hook name makes allure-cucumberjs attach them to the test itself instead of a "tear down" fixture.
// After hooks run in the reverse order of definition, so this one runs before the browser is closed above
After({ name: 'ALLURE_FIXTURE_IGNORE' }, async function (testCase) {
  if (!this.driver) return

  const isFailed = testCase.result.status === Status.FAILED

  try {
    if (isFailed) {
      const screenshot = await this.driver.takeScreenshot()

      await this.attach(Buffer.from(screenshot, 'base64'), {
        mediaType: 'image/png',
        fileName: 'Screenshot on failure.png'
      })
      await this.attach(await this.driver.getCurrentUrl(), {
        mediaType: 'text/plain',
        fileName: 'Page URL.txt'
      })
    }

    if (browser === 'chrome') {
      const logs = await this.driver.manage().logs().get(wd.logging.Type.BROWSER)

      if (isFailed ? logs.length > 0 : logs.some(log => log.level.name === 'SEVERE')) {
        await this.attach(logs.map(log => `${log.level.name} ${log.message}`).join('\n'), {
          mediaType: 'text/plain',
          fileName: 'Browser console.log'
        })
      }
    }
  } catch (error) {
    // the browser session can already be broken, the evidence is optional
    console.warn(`Failed to collect the failure evidence: ${error.message}`)
  }
})

AfterAll(async function () {
  await quitActiveDriver()
})

Before('@mlrunUnhealthyTest', async function () {
  await setRequestsFailureCondition(true)
})

After('@mlrunUnhealthyTest', async function () {
  await setRequestsFailureCondition(false)
})
