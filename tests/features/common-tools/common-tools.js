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
    const structure = { elements: {} }
    structure.root = root
    structure.elements.input = 'input'
    if (label) {
      structure.elements.label = 'label'
    }
    if (hint) {
      if (typeof hint === 'string') {
        structure.elements.hint = hint
      } else {
        structure.elements.hint = 'div.tip-container svg'
      }
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
    hint = false
  ) {
    const structure = { elements: {} }
    structure.root = root
    structure.elements.input = 'input'
    if (incDecBtn) {
      structure.elements.inc_btn = incDecBtn.inc_btn
      structure.elements.dec_btn = incDecBtn.dec_btn
    } else {
      structure.elements.inc_btn = '.range__buttons button[class*=increase]'
      structure.elements.dec_btn = '.range__buttons button[class*=decrease]'
    }
    if (label) {
      structure.elements.label = label
    } else {
      structure.elements.label = '.data-ellipsis'
    }
    if (hint) {
      if (typeof hint === 'string') {
        structure.elements.hint = hint
      } else {
        structure.elements.hint = 'div.tip-container svg'
      }
    }

    return structure
  },
  generateLabelGroup: function(root, label = false, hint = false) {
    const structure = { elements: {} }
    structure.root = root

    if (label) {
      structure.elements.label = label
    } else {
      structure.elements.label = '.data-ellipsis'
    }

    if (hint) {
      if (typeof hint === 'string') {
        structure.elements.hint = hint
      } else {
        structure.elements.hint = 'div.tip-container svg'
      }
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

    if (open_button) {
      structure.dropdownElements.open_button = open_button
    } else {
      structure.dropdownElements.open_button = '.select__value'
    }

    if (options) {
      structure.dropdownElements.options = options
    } else {
      structure.dropdownElements.options = '.select__body .select__item'
    }

    if (option_name) {
      structure.dropdownElements.option_name = option_name
    } else {
      structure.dropdownElements.option_name = ''
    }

    return structure
  }
}
