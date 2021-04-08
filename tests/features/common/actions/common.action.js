import { timeout, test_url, test_port } from '../../../config'
import { until } from 'selenium-webdriver'
import { expect } from 'chai'
import http from 'http'

const action = {
  navigateToPage: async function(driver, baseURL) {
    await driver.get(baseURL)
    await driver.sleep(1000)
  },
  waitPageLoad: async function(driver, loader) {
    await driver.wait(async function(driver) {
      let found = await driver.findElements(loader)
      return found.length === 0
    })
  },
  waiteUntilComponent: async function(driver, component) {
    await driver.wait(until.elementLocated(component), timeout)
  },
  clickOnComponent: async function(driver, component) {
    await driver.findElement(component).then(element => element.click())
  },
  componentIsPresent: async function(driver, component) {
    await driver
      .findElements(component)
      .then(elements => expect(elements.length).above(0))
  },
  componentIsNotPresent: async function(driver, component) {
    await driver
      .findElements(component)
      .then(elements => expect(elements.length).equal(0))
  },
  componentIsVisible: async function(driver, component) {
    await driver
      .findElement(component)
      .then(element => {
        return element.isDisplayed()
      })
      .then(flag => {
        expect(flag).equal(true)
      })
  },
  componentIsNotVisible: async function(driver, component) {
    await driver
      .findElement(component)
      .then(element => {
        return element.isDisplayed()
      })
      .then(flag => {
        expect(flag).equal(false)
      })
  },
  typeIntoInputField: async function(driver, component, value) {
    await driver.findElement(component).then(element => {
      element.sendKeys(value)
    })
  },
  verifyTypedText: async function(driver, component, value) {
    await driver
      .findElement(component)
      .then(element => {
        return element.getAttribute('value')
      })
      .then(txt => {
        expect(txt).equal(value)
      })
  },
  deleteAPIMLProject: async function(mlProjectName, expectedStatusCode) {
    const options = {
      host: test_url,
      port: test_port,
      path: '/api/projects/' + mlProjectName,
      method: 'DELETE'
    }

    const req = http.get(options)
    req.end()

    req.once('response', async function(res) {
      await expect(res.statusCode).equal(expectedStatusCode)
    })
  },
  createAPIMLProject: async function(mlProjectName, expectedStatusCode) {
    let project_data = JSON.stringify({
      metadata: {
        name: mlProjectName
      },
      spec: {
        description: 'automation test description'
      }
    })
    const options = {
      host: test_url,
      port: test_port,
      path: '/api/projects',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Content-Length': project_data.length
      }
    }

    const req = await http.request(options)
    await req.write(project_data)
    await req.end()

    await req.once('response', async function(res) {
      expect(res.statusCode).equal(expectedStatusCode)
    })
  }
}

module.exports = action
