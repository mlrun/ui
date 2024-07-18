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
import { timeout } from '../../../config'
import { until } from 'selenium-webdriver'
import { expect } from 'chai'
import { access, constants } from 'fs'
const path = require('path')
const os = require('os')

async function scrollToWebElement(driver, element) {
  await driver.executeScript('arguments[0].scrollIntoView()', element)
  await driver.sleep(250)
}

const action = {
  generatePath: async function(file, downloadsFolder){
    const homeDirectory = os.homedir()

    // Define the path to the Downloads folder
    const downloadsFolderPath = path.join(homeDirectory, downloadsFolder)

    // Specify the full path to the file
    return path.join(downloadsFolderPath, file) 
  },
  determineFileAccess: async function(finalPath, file){
    access(finalPath, constants.F_OK, (err) => {
      const result = err ? `${file} doesn't exist` : true
      expect(result).equal(true)
    })
  },
  navigateToPage: async function(driver, baseURL) {
    await driver.get(baseURL)
    await driver.sleep(1000)
  },
  navigateForward: async function(driver) {
    await driver.navigate().forward()
  },
  navigateBack: async function(driver) {
    await driver.navigate().back()
  },
  refreshPage: async function(driver) {
    await driver.navigate().refresh()
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
    await driver.sleep(250)
    await element.click()
  },
  clickNearComponent: async function(driver, component) {
    const element = await driver.findElement(component)
    const coordinates = await element.getRect()
    const actions = driver.actions({ async: true })
    await actions
      .move({ x: parseInt(coordinates.x) + 1, y: parseInt(coordinates.y) + 1 })
      .click()
      .perform()
  },
  hoverComponent: async function(driver, component, scroll = true) {
    const baseComponent = component.root ? component.root : component
    const element = await driver.findElement(baseComponent)
    if (scroll) {
      await scrollToWebElement(driver, element)
    }
    const coordinates = await element.getRect()
    const actions = driver.actions({ async: true })
    await actions
      .move({ x: parseInt(coordinates.x), y: parseInt(coordinates.y) })
      .perform()
    await driver.sleep(250)
  },
  verifyClassDisabled: async function (driver, component) {
    const inputField = await driver.findElement(component)
    const attributes = await inputField.getAttribute('class')
    const flag = attributes.includes('form-field__wrapper-disabled')
    expect(flag).equal(true)
  },
  verifyElementDisabled: async function(driver, component) {
    const element = await driver.findElement(component)
    const flag = await element.getAttribute('disabled')
    expect(flag).equal('true')
  },
  verifyElementEnabled: async function(driver, component) {
    const element = await driver.findElement(component)
    const flag = await element.getAttribute('disabled')
    expect(flag).equal(null)
  },
  verifyElementActive: async function(driver, component) {
    const element = await driver.findElement(component)
    const flag = await element.getAttribute('class')
    expect(flag.includes('active')).equal(true)
  },
  verifyElementNotActive: async function(driver, component) {
    const element = await driver.findElement(component)
    const flag = await element.getAttribute('class')
    expect(flag.includes('false')).equal(true)
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
    await driver.sleep(250)
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
    const arr = txt.split()
    if (arr.length > 1) {
      expect(arr.some(item => item.includes(value))).equal(
        true,
        `should be expected "${value}" but actual value [${arr}]`
      )
    }
    else {
      expect(txt).equal(
        value,
        `should be expected "${value}" but actual value "${txt}"`
      )
    }  
  },
  verifyTextRegExp: async function(driver, component, regexp) {
    const element = await driver.findElement(component)
    const txt = await element.getText('value')
    expect(true).equal(regexp.test(txt))
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
  isComponentContainsClass: async function(
    driver,
    component,
    className
  ) {
    const element = await driver.findElement(component)
    const classes = await element.getAttribute('class')
    expect(classes.includes(className)).equal(true)
  },
  verifyComponentContainsAttributeValue: async function(
    driver,
    component,
    attribute,
    value
  ) {
    const element = await driver.findElement(component)
    const attributes = await element.getAttribute(attribute)
    expect(attributes.includes(value)).equal(
      true,
      `Attribute "${value}" does not present in "${attribute}" values list "${attributes}"`
    )
  },
  verifyComponentNotContainsAttributeValue: async function(
    driver,
    component,
    attribute,
    value
  ) {
    const element = await driver.findElement(component)
    const attributes = await element.getAttribute(attribute)
    expect(attributes.includes(value)).equal(
      false,
      `Attribute "${value}" does present in "${attribute}" values list "${attributes}"`
    )
  },
  collapseAccordionSection: async function(driver, collapseComponent) {
    const element = await driver.findElement(collapseComponent)
    const attributes = await element.getAttribute('class')
    const flag = attributes.includes('open')
    if (flag) {
      await element.click()
    }
  },
  expandAccordionSection: async function(driver, collapseComponent) {
    const element = await driver.findElement(collapseComponent)
    const attributes = await element.getAttribute('class')
    const flag = attributes.includes('open')
    if (!flag) {
      await element.click()
    }
  },
  isAccordionSectionExpanded: async function(driver, collapseComponent) {
    const element = await driver.findElement(collapseComponent)
    const attributes = await element.getAttribute('class')
    const flag = attributes.includes('open')
    expect(flag).equal(true)
  },
  isAccordionSectionCollapsed: async function(driver, collapseComponent) {
    const element = await driver.findElement(collapseComponent)
    const attributes = await element.getAttribute('class')
    const flag = attributes.includes('open')
    expect(flag).equal(false)
  },
  getElementText: async function(driver, component) {
    const element = await driver.findElement(component)
    return await element.getText('value')
  },
  scrollToElement: async function(driver, component) {
    const element = await driver.findElement(component)
    await driver.executeScript('arguments[0].scrollIntoView()', element)
    await driver.sleep(250)
  },
  scrollToWebElement
}

module.exports = action
