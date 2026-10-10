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
import seleniumWebdriver from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome'
import firefox from 'selenium-webdriver/firefox'
import { setWorldConstructor, setDefaultTimeout } from '@cucumber/cucumber'
import { timeout, browser, headless, screen_size, delay_factor } from '../../config'

import 'chromedriver'
import 'geckodriver'

// expected dates in the feature files are in UTC, the browser spawned by the driver takes the timezone from TZ
export const E2E_TIMEZONE = process.env.E2E_TZ || 'UTC'
process.env.TZ = E2E_TIMEZONE

class World {
  constructor({ attach, log, parameters }) {
    this.attach = attach
    this.log = log
    this.parameters = parameters
  }
}

// only one browser may be open at a time: the previous one is always quit before a new one is built
let activeDriver = null

export const quitActiveDriver = async () => {
  const driver = activeDriver

  activeDriver = null

  if (driver) {
    try {
      await driver.quit()
    } catch {
      // the session is already gone, nothing to close
    }
  }
}

export const buildDriver = () => {
  if (activeDriver) {
    throw new Error('A browser is already open, call quitActiveDriver() first')
  }

  let browseConfigs

  //browseConfigs = new chrome.Options().windowSize(screen_size) - can be used to define a specific screen size
  if (browser === 'chrome') {
    if (headless) {
      browseConfigs = new chrome.Options()
        .addArguments('headless=new')
        .addArguments('no-sandbox')
        .addArguments('disable-gpu')
        .windowSize(screen_size)
    } else browseConfigs = new chrome.Options()
        .addArguments('start-maximized')
        .excludeSwitches('disable-popup-blocking', 'enable-automation')
  }
  if (browser === 'firefox') {
    if (headless) {
      browseConfigs = new firefox.Options().headless().windowSize(screen_size)
    } else browseConfigs = new firefox.Options().windowSize(screen_size)
  }

  const driver = new seleniumWebdriver.Builder()
    .forBrowser(browser)
    .setChromeOptions(browseConfigs)
    .setFirefoxOptions(browseConfigs)
    .build()

  // a failed session start is reported by the first command (`Before` hook), don't crash the process on it
  driver.catch(() => {})
  activeDriver = driver

  if (delay_factor !== 1) {
    const sleep = driver.sleep.bind(driver)

    driver.sleep = ms => sleep(Math.round(ms * delay_factor))
  }

  return driver
}

// starts the browser and waits for its session. chromedriver can exit right after the start
// ("Server terminated early with status 1"), e.g. when the free port picked by selenium was taken in between,
// then it's retried once with a new driver service (a new port).
// The driver is returned wrapped: it's a thenable, `await` would unwrap it
export const startDriver = async () => {
  let driver = buildDriver()

  try {
    await driver.getSession()
  } catch (error) {
    if (!/Server terminated early/.test(error?.message ?? '')) throw error

    await quitActiveDriver()
    await new Promise(resolve => setTimeout(resolve, 1000))
    driver = buildDriver()
    await driver.getSession()
  }

  return { driver }
}

const quitOnSignal = signal => {
  quitActiveDriver().finally(() => process.exit(signal === 'SIGINT' ? 130 : 143))
}

process.once('SIGINT', quitOnSignal)
process.once('SIGTERM', quitOnSignal)

class CustomWorld extends World {}

setDefaultTimeout(timeout)
setWorldConstructor(CustomWorld)
