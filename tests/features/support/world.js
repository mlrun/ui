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

    if (browser === 'chrome') {
      if (headless) {
        browseConfigs = new chrome.Options()
          .headless()
          .addArguments('no-sandbox')
          .addArguments('disable-gpu')
          .windowSize(screen_size)
      } else browseConfigs = new chrome.Options().windowSize(screen_size)
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
