import { timeout } from '../../../config'
import { until } from 'selenium-webdriver'
import { expect } from 'chai'

async function scrollToWebElement(driver, element) {
  await driver.executeScript('arguments[0].scrollIntoView()', element)
  await driver.sleep(250)
}

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
    expect(txt).equal(
      value,
      `should be expected "${value}" but actual value "${txt}"`
    )
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
