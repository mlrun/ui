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
import { timeout, browser, headless, screen_size } from '../../config'

require('chromedriver')
require('geckodriver')

class World {
  constructor({ attach, log, parameters }) {
    this.attach = attach
    this.log = log
    this.parameters = parameters
  }
}

class CustomWorld extends World {
  constructor(options) {
    super(options)

    let browseConfigs

    //browseConfigs = new chrome.Options().windowSize(screen_size) - can be used to define a specific screen size
    if (browser === 'chrome') {
      if (headless) {
        browseConfigs = new chrome.Options()
          .headless()
          .addArguments('no-sandbox')
          .addArguments("start-maximized")
          .addArguments('disable-gpu')
      } else browseConfigs = new chrome.Options().addArguments("start-maximized")
    }
    if (browser === 'firefox') {
      if (headless) {
        browseConfigs = new firefox.Options().headless().windowSize(screen_size)
      } else browseConfigs = new firefox.Options().windowSize(screen_size)
    }

    this.driver = new seleniumWebdriver.Builder()
      .forBrowser(browser)
      .setChromeOptions(browseConfigs)
      .setFirefoxOptions(browseConfigs)
      .build()
  }
}

setDefaultTimeout(timeout)
setWorldConstructor(CustomWorld)
