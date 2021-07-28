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
    // console.log('debug1: ', hint)
    if (hint) {
      // console.log('debug1: ', root, 'div.tip-container svg')
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
  }
}
