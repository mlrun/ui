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
      const found = await driver.findElements(loader)
      return found.length === 0
    })
  },
  waiteUntilComponent: async function(driver, component) {
    await driver.wait(until.elementLocated(component), timeout)
  },
  clickOnComponent: async function(driver, component) {
    const element = await driver.findElement(component)
    await element.click()
  },
  clickNearComponent: async function(driver, component) {
    const element = await driver.findElement(component)
    const coordinates = await element.getRect()
    const actions = driver.actions({ async: true })
    await actions
      .move({ x: parseInt(coordinates.x) - 5, y: parseInt(coordinates.y) - 5 })
      .click()
      .perform()
  },
  componentIsPresent: async function(driver, component) {
    const _component = component.root ?? component
    const elements = await driver.findElements(_component)
    expect(elements.length).above(0)
  },
  componentIsNotPresent: async function(driver, component) {
    const _component = component.root ?? component
    const elements = await driver.findElements(_component)
    expect(elements.length).equal(0)
  },
  componentIsVisible: async function(driver, component) {
    const _component = component.root ?? component
    const element = await driver.findElement(_component)
    const displayed = await element.isDisplayed()
    expect(displayed).equal(true)
  },
  componentIsNotVisible: async function(driver, component) {
    const _component = component.root ?? component
    const element = await driver.findElement(_component)
    const displayed = await element.isDisplayed()
    expect(displayed).equal(false)
  },
  typeIntoInputField: async function(driver, component, value) {
    const element = await driver.findElement(component)
    return element.sendKeys(value)
  },
  verifyTypedText: async function(driver, component, value) {
    const element = await driver.findElement(component)
    const txt = await element.getAttribute('value')
    expect(txt).equal(value)
  },
  verifyText: async function(driver, component, value) {
    const element = await driver.findElement(component)
    const txt = await element.getText('value')
    expect(txt).equal(value)
  },
  isComponentContainsAttributeValue: async function(
    driver,
    component,
    attribute,
    value
  ) {
    const element = await driver.findElement(component)
    return (await element.getAttribute(attribute)) === value
  },
  collapseAccorditionSection: async function(driver, collapseComponet) {
    const element = await driver.findElement(collapseComponet)
    const attributes = await element.getAttribute('class')
    const flag = attributes.includes('open')
    if (flag) {
      await element.click()
    }
  },
  isAccorditionSectionExpanded: async function(driver, collapseComponet) {
    const element = await driver.findElement(collapseComponet)
    const attributes = await element.getAttribute('class')
    const flag = attributes.includes('open')
    expect(flag).equal(true)
  },
  isAccorditionSectionCollapsed: async function(driver, collapseComponet) {
    const element = await driver.findElement(collapseComponet)
    const attributes = await element.getAttribute('class')
    const flag = attributes.includes('open')
    expect(flag).equal(false)
  },
  deleteAPIMLProject: async function(mlProjectName, expectedStatusCode) {
    const options = {
      host: test_url,
      port: test_port,
      path: `/api/projects/${mlProjectName}`,
      method: 'DELETE'
    }

    const req = http.get(options)
    req.end()

    req.once('response', async function(res) {
      await expect(res.statusCode).equal(expectedStatusCode)
    })
  },
  createAPIMLProject: async function(mlProjectName, expectedStatusCode) {
    const project_data = JSON.stringify({
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
