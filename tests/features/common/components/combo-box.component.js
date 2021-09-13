import { By } from 'selenium-webdriver'
import dropdownComponent from './dropdown.component'

module.exports = function(comboBoxStructure) {
  // console.log('debug: ', inputStructure.elements.dropdown)
  const element = {}
  element.root = By.css(comboBoxStructure.root)

  let dd = { ...comboBoxStructure.elements.dropdown }
  dd.root = `${comboBoxStructure.root} ${dd.root}`
  element.dropdown = dropdownComponent(dd)

  let cdd = { ...comboBoxStructure.elements.comboDropdown.dropdown }
  cdd.root = `${comboBoxStructure.root} ${cdd.root}`
  element.comboDropdown = dropdownComponent(cdd)

  let inputStructure = {
    ...comboBoxStructure.elements.comboDropdown.searchInput
  }
  inputStructure.root = `${comboBoxStructure.root} ${inputStructure.root}`
  element.comboSearch = By.css(inputStructure)

  return element
}
