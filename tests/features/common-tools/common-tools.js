import { generateRegEx, getLength, getNotToBe, getRule } from './utils'

module.exports = {
  locatorBuilder: function(strings, ...keys) {
    return function(...values) {
      const dict = values[values.length - 1] || {}
      const result = [strings[0]]
      keys.forEach(function(key, i) {
        const value = Number.isInteger(key) ? values[key] : dict[key]
        result.push(value, strings[i + 1])
      })
      return result.join('')
    }
  },
  generateInputGroup: function(
    root,
    label = false,
    hint = false,
    warning = false
  ) {
    const structure = { root, elements: {} }
    structure.elements.input = 'input'
    if (label) {
      structure.elements.label = 'label'
    }
    if (hint) {
      typeof hint === 'string'
        ? (structure.elements.hint = hint)
        : (structure.elements.hint = 'div.tip-container svg')
    }
    if (warning) {
      structure.elements.warningHint = 'div.input__warning svg'
      structure.elements.warningText = 'div.tooltip div.tooltip__text'
    }

    return structure
  },
  generateNumberInputGroup: function(
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

    label
      ? (structure.elements.label = label)
      : (structure.elements.label = '.data-ellipsis')

    if (hint) {
      typeof hint === 'string'
        ? (structure.elements.hint = hint)
        : (structure.elements.hint = 'div.tip-container svg')
    }
    if (warning) {
      structure.elements.warningHint = '.range__warning svg'
      structure.elements.warningText = 'div.tooltip div.tooltip__text'
    }

    return structure
  },
  generateLabelGroup: function(
    root,
    label = false,
    hintButton = false,
    hint = false
  ) {
    const structure = { elements: {} }
    structure.root = root

    label
      ? (structure.elements.label = label)
      : (structure.elements.label = '.data-ellipsis')

    if (hintButton) {
      typeof hintButton === 'string'
        ? (structure.elements.hintButton = hintButton)
        : (structure.elements.hintButton = 'div.tip-container svg')
    }

    if (hint) {
      structure.elements.hint = hint
    }

    return structure
  },
  generateDropdownGroup: function(
    root,
    open_button = false,
    options = false,
    option_name = false
  ) {
    const structure = { dropdownElements: {} }
    structure.root = root
    structure.dropdownElements.label = '.data-ellipsis'

    open_button
      ? (structure.dropdownElements.open_button = open_button)
      : (structure.dropdownElements.open_button = '.select__value')

    options
      ? (structure.dropdownElements.options = options)
      : (structure.dropdownElements.options = '.select__body .select__item')

    option_name
      ? (structure.dropdownElements.option_name = option_name)
      : (structure.dropdownElements.option_name = '')

    return structure
  },
  generateCheckboxGroup: function(root, checkbox, name, icon) {
    const structure = { root, elements: {} }

    checkbox
      ? (structure.elements.checkbox = 'svg[class]')
      : (structure.elements.checkbox = '')

    name ? (structure.elements.name = name) : (structure.elements.name = '')

    icon
      ? (structure.elements.icon = 'svg:not([class])')
      : (structure.elements.icon = '')

    return structure
  },
  parseString: function(string) {
    const rulesArray = string.split('\n')
    const lengthRule = getLength(rulesArray)
    const validCharactersRule = getRule(rulesArray, 'valid characters')
    const beginRule = getRule(rulesArray, 'begin')
    const endRule = getRule(rulesArray, 'end')
    const notToBe = getNotToBe(rulesArray, 'not be')
    const notStartWith = getRule(rulesArray, 'not start')
    const notConsecutiveCharacters = getNotToBe(
      rulesArray,
      'consecutive characters'
    )

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
}
