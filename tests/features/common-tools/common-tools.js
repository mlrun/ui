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
import axios from 'axios'
import { mock_server_url, workerHeaders } from '../../config.js'
import { generateRegEx, getLength, getNotToBe, getRule } from './utils.js'

export function locatorBuilder(strings, ...keys) {
  return function (...values) {
    const dict = values[values.length - 1] || {}
    const result = [strings[0]]
    keys.forEach(function (key, i) {
      const value = Number.isInteger(key) ? values[key] : dict[key]
      result.push(value, strings[i + 1])
    })
    return result.join('')
  }
}

export function generateInputGroup(
  root,
  label = false,
  hint = false,
  warning = false,
  input = 'input'
) {
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
}

export function generateNumberInputGroup(
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
}

export function generateLabelGroup(root, label = false, hintButton = false, hint = false) {
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
}

export function generateDropdownGroup(
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
}

export function generateCheckboxGroup(root, checkbox, name, icon) {
  const structure = { root, elements: {} }

  structure.elements.checkbox = checkbox ? 'svg[class]' : ''

  structure.elements.name = name || ''

  structure.elements.icon = icon ? 'svg:not([class])' : ''

  return structure
}

export function generateTextAreaGroup(root, counter = '.form-field__counter') {
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
}

// the rules of the app's validation hint. The app writes the ranges with en dashes ("a–z", convertToLabel in
// src/igz-controls/utils/validation.util.js): taken as they are, "[a–z]" was the 3 characters a, –, z, so the generated
// values used only a, z, A, Z, 0, 9, _, . and the other valid characters were never checked
export function parseString(string) {
  const rulesArray = string.replace(/\u2013/g, '-').split('\n')
  const lengthRule = getLength(rulesArray)
  const validCharactersRule = getRule(rulesArray, 'valid characters')
  const beginRule = getRule(rulesArray, /\bmust begin (and end )?with\b/i)
  const endRule = getRule(rulesArray, /\bmust (begin and )?end with\b/i)
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
}

// of the mock server instance of this worker only: the other workers' scenarios go on. A failure fails the scenario:
// without the failure condition it would run against a healthy mock and fail later for an unrelated-looking reason
export async function setRequestsFailureCondition(shouldFail) {
  try {
    await axios.post(
      `${mock_server_url}/set-failure-condition`,
      { shouldFail },
      { headers: workerHeaders() }
    )
  } catch (error) {
    throw new Error(
      `The mock server didn't set the failure condition (shouldFail: ${shouldFail}): ${error.response?.status ?? ''} ` +
        `${JSON.stringify(error.response?.data ?? error.message)}`
    )
  }
}

// a fresh mock backend for the scenario: the mock server instance of this worker is replaced by a new one
// (scripts/mockServer.js), so a scenario doesn't depend on the previous ones, and the other workers' instances are not
// touched. The answer comes once the new instance listens. `generatedData` - with the big "auto-generated-data" project
// (the scenarios tagged `@generatedData`).
// A failure fails the scenario, e.g. a reused older mock server without the instances per worker: it would run the
// scenario on the state left by the previous ones (of every worker)
export async function resetMockState({ generatedData = false } = {}) {
  const headers = workerHeaders()
  const { data: reset } = await axios.post(
    `${mock_server_url}/reset-mock-state`,
    { generatedData },
    { headers }
  )
  // the new instance answers for this worker
  const { data: current } = await axios.get(`${mock_server_url}/mock-instance`, { headers })

  if (
    String(reset.worker) !== Object.values(headers)[0] ||
    !reset.instance ||
    reset.instance === reset.previous ||
    current.instance !== reset.instance ||
    current.generatedData !== generatedData
  ) {
    throw new Error(
      `The mock server didn't give this worker a fresh instance (is it started by \`npm run mock-server\` of this ` +
        `version?): reset ${JSON.stringify(reset)}, current ${JSON.stringify(current)}`
    )
  }
}
