import { By } from 'selenium-webdriver'
import { locatorBuilder } from '../../common-tools/common-tools'

module.exports = function(inputStructure) {
  const options = locatorBuilder`${0} ${1} ${2}`
  const option = locatorBuilder`${0} ${1}:nth-of-type(${2}) ${3}`

  const element = {}

  element.root = By.css(inputStructure.root)

  element.inputField = By.css(
    `${inputStructure.root} ${inputStructure.elements.input}`
  )

  element.options = By.css(
    options(
      inputStructure.elements.options,
      inputStructure.elements.option_name
    )
  )

  element.option = function(index) {
    return By.css(
      option(
        inputStructure.elements.options,
        index,
        inputStructure.elements.option_name
      )
    )
  }

  return element
}
