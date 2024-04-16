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
import { generateRegEx, getLength, getNotToBe, getRule } from './utils'
import {
  deleteAPIArtifact,
  deleteAPIFeatureSet,
  deleteAPIFeatureVector,
  deleteAPIFunction,
  deleteAPIMLProject,
  deleteAPISchedule
} from '../common/actions/api.actions'

module.exports = {
  locatorBuilder: function (strings, ...keys) {
    return function (...values) {
      const dict = values[values.length - 1] || {}
      const result = [strings[0]]
      keys.forEach(function (key, i) {
        const value = Number.isInteger(key) ? values[key] : dict[key]
        result.push(value, strings[i + 1])
      })
      return result.join('')
    }
  },
  generateInputGroup: function (root, label = false, hint = false, warning = false, input = 'input') {
    const structure = { root, elements: {} }
    structure.elements.input = input
    
    if (label) {
      structure.elements.label = 'label'
    }
    if (hint) {
      structure.elements.hint = typeof hint === 'string' ? hint : '.tip-container svg'
    }
    if (warning) {
      structure.elements.warningHint = typeof warning === 'string' ? warning : '.input__warning svg'
      structure.elements.warningText = '.tooltip .tooltip__text'
    }

    return structure
  },
  generateNumberInputGroup: function (
    root,
    incDecBtn = false,
    label = false,
    hint = false,
    warning = false
  ) {
    const structure = { root, elements: {} }
    structure.elements.input = 'input'
    if (incDecBtn) {
      structure.elements.inc_btn = incDecBtn.inc_btn
      structure.elements.dec_btn = incDecBtn.dec_btn
    } else {
      structure.elements.inc_btn = '.range__buttons button[class*=increase]'
      structure.elements.dec_btn = '.range__buttons button[class*=decrease]'
    }

    structure.elements.label = label || '.data-ellipsis'

    if (hint) {
      structure.elements.hint = typeof hint === 'string' ? hint : '.tip-container svg'
    }
    if (warning) {
      structure.elements.warningHint = typeof warning === 'string' ? warning : '.range__warning svg'
      structure.elements.warningText = '.tooltip .tooltip__text'
    } 

    return structure
  },
  generateLabelGroup: function (root, label = false, hintButton = false, hint = false) {
    const structure = { elements: {} }
    structure.root = root

    structure.elements.label = label || '.data-ellipsis'

    if (hintButton) {
      structure.elements.hintButton =
        typeof hintButton === 'string' ? hintButton : '.tip-container svg'
    }

    if (hint) {
      structure.elements.hint = hint
    }

    return structure
  },
  generateDropdownGroup: function (
    root,
    open_button = false,
    options = false,
    option_name = false,
    options_in_root = false
  ) {
    const structure = { dropdownElements: {} }
    structure.root = root
    structure.dropdownElements.label = '.data-ellipsis'

    structure.dropdownElements.open_button = open_button || '.select__value'

    structure.dropdownElements.options = options || '.select__body .select__item'

    structure.dropdownElements.option_name = option_name || ''

    structure.optionsInRoot = options_in_root

    return structure
  },
  generateCheckboxGroup: function (root, checkbox, name, icon) {
    const structure = { root, elements: {} }

    structure.elements.checkbox = checkbox ? 'svg[class]' : ''

    structure.elements.name = name || ''

    structure.elements.icon = icon ? 'svg:not([class])' : ''

    return structure
  },
  generateTextAreaGroup: function (root, counter = '.form-field__counter') {
    return {
      root,
      elements: {
        input: 'textarea',
        label: 'label',
        warningHint: '.form-field__warning',
        warningText: '.tooltip__warning',
        counter
      }
    }
  },
  parseString: function (string) {
    const rulesArray = string.split('\n')
    const lengthRule = getLength(rulesArray)
    const validCharactersRule = getRule(rulesArray, 'valid characters')
    const beginRule = getRule(rulesArray, 'begin')
    const endRule = getRule(rulesArray, 'end')
    const notToBe = getNotToBe(rulesArray, 'not be')
    const notStartWith = getRule(rulesArray, 'not start')
    const notConsecutiveCharacters = getNotToBe(rulesArray, 'consecutive characters')

    return generateRegEx(
      beginRule,
      endRule,
      lengthRule,
      validCharactersRule,
      notToBe,
      notStartWith,
      notConsecutiveCharacters
    )
  },
  clearBackendAfterTest: function (driver, items) {
    items.forEach(item => {
      switch (item.type) {
        case 'project':
          return deleteAPIMLProject(driver, item.name, 204)
        case 'featureSet':
          return deleteAPIFeatureSet(item.project, item.name, 204)
        case 'featureVector':
          return deleteAPIFeatureVector(item.project, item.name, 204)
        case 'function':
          return deleteAPIFunction(item.project, item.name, 204)
        case 'schedule':
          return deleteAPISchedule(item.project, item.name, 204)
        case 'dataset':
        case 'file':
        case 'model':
          return deleteAPIArtifact(item.project, item.name, 200)
        default:
          return null
      }
    })
  }
}
