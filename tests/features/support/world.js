import seleniumWebdriver from 'selenium-webdriver'
import { setWorldConstructor, setDefaultTimeout } from '@cucumber/cucumber'
import { timeout, browser } from '../../config'

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
    this.driver = new seleniumWebdriver.Builder().forBrowser(browser).build()
  }
}

setDefaultTimeout(timeout)
setWorldConstructor(CustomWorld)
