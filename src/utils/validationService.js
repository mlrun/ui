import lodash from 'lodash'

import { validation as ValidationConstants } from '../constants'

////// PRIVATE METHODS ///////

/**
 * Converts characters string to readable format
 * Note: converts Hyphens to En Dashes, replaces one space with comma and space,
 *       replaces letter `s` with `spaces` word
 * @param {string} chars - characters to convert
 * @returns {string} - converted string
 * @example
 * convertToLabel('a-z A-Z - _ *');
 * // => 'a–z, A–Z, –, _, *'
 */
const convertToLabel = chars => {
  return chars
    .replace(/-/g, '–')
    .replace(/\s/g, ', ')
    .replace(/\bs\b/)
}

/**
 * Converts characters string to valid RegExp string that will be placed into RegExp pattern
 * @param {string} chars - characters to convert
 * @returns {string} - converted string
 * @example
 * convertToPattern('a-z A-Z - _ *');
 * // => 'a-zA-Z\-\_\*'
 */
const convertToPattern = chars => {
  return chars
    .split(' ')
    .map(patternItem =>
      patternItem.length === 1 ? '\\' + patternItem : patternItem
    )
    .join('')
}

/**
 * Checks whether there is at least one failed validation rule.
 * @returns {boolean} `true` in case there is at least one failed validation rule, or `false` otherwise.
 */
const hasInvalidRule = newRules => {
  return lodash.some(newRules, ['isValid', false])
}

////// PUBLIC METHODS ///////

/**
 * validate required field value
 * @param {string} validationMsg Custom validationMsg. Defualt to "Required"
 * @returns {function}  Function that accepts a value and return an array [isFieldValid, validationMsg]
 */

export const required = (validationMsg = 'Required') => value => {
  let isValid = value.trim() !== '' && typeof value === 'string'
  return [isValid, validationMsg]
}

/**
 * Checks whether there is at least one failed validation rule.
 * @function checkPatternsValidity
 * @param {Array} validationRules Array of Validation Rule Objects {name: "", lable: "", pattren: [Function || Regex]}
 * @param {string} value Field value to check validity
 * @returns {Array} [validationRules, isFieldValid] New validationRules With `isValid` property, `true` in case there is at least one failed validation rule, or `false` otherwise.
 */
export const checkPatternsValidity = (validationRules, value) => {
  const newRules = validationRules.map(rule => ({
    ...rule,
    isValid: lodash.isFunction(rule.pattern)
      ? rule.pattern(value)
      : /* else, it is a RegExp */ rule.pattern.test(value)
  }))

  return [newRules, !hasInvalidRule(newRules)]
}

const generateRule = {
  beginWith: chars => {
    return {
      name: 'begin',
      label: ValidationConstants.BEGIN_WITH + ': ' + convertToLabel(chars),
      pattern: new RegExp('^[' + convertToPattern(chars) + ']')
    }
  },
  beginNotWith: chars => {
    return {
      name: 'beginNot',
      label: ValidationConstants.BEGIN_NOT_WITH + ': ' + convertToLabel(chars),
      pattern: new RegExp('^[^' + convertToPattern(chars) + ']')
    }
  },
  endWith: chars => {
    return {
      name: 'end',
      label: ValidationConstants.END_WITH + ': ' + convertToLabel(chars),
      pattern: new RegExp('[' + convertToPattern(chars) + ']$')
    }
  },
  endNotWith: chars => {
    return {
      name: 'endNot',
      label: ValidationConstants.END_NOT_WITH + ': ' + convertToLabel(chars),
      pattern: new RegExp('[^' + convertToPattern(chars) + ']$')
    }
  },
  beginEndWith: chars => {
    const convertedPattern = convertToPattern(chars)

    return {
      name: 'beginEnd',
      label: ValidationConstants.BEGIN_END_WITH + ': ' + convertToLabel(chars),
      pattern: new RegExp(
        '^([' + convertedPattern + '].*)?[' + convertedPattern + ']$'
      )
    }
  },
  beginEndNotWith: chars => {
    const convertedPattern = convertToPattern(chars)

    return {
      name: 'beginEndNot',
      label:
        ValidationConstants.BEGIN_END_NOT_WITH + ': ' + convertToLabel(chars),
      pattern: new RegExp(
        '^([^' + convertedPattern + '].*)?[^' + convertedPattern + ']$'
      )
    }
  },
  onlyAtTheBeginning: chars => {
    const convertedPattern = convertToPattern(chars)

    return {
      name: 'onlyAtTheBeginning',
      label:
        ValidationConstants.ONLY_AT_THE_BEGINNING +
        ': ' +
        convertToLabel(chars),
      pattern: new RegExp(
        '^([' + convertedPattern + '])?[^' + convertedPattern + ']+$'
      )
    }
  },
  validCharacters: chars => {
    return {
      name: 'validCharacters',
      label:
        ValidationConstants.VALID_CHARACTERS + ': ' + convertToLabel(chars),
      pattern: new RegExp('^[' + convertToPattern(chars) + ']+$')
    }
  },
  noConsecutiveCharacters: chars => {
    const convertedPattern = chars
      .split(' ')
      .map(charPair => {
        const charsPairArray = charPair.split('')

        return `(?!.*\\${charsPairArray[0]}\\${charsPairArray[1]})`
      })
      .join('')

    return {
      name: 'noConsecutiveCharacters',
      label:
        ValidationConstants.NO_CONSECUTIVE_CHARACTER +
        ': ' +
        convertToLabel(chars),
      pattern: new RegExp('^' + convertedPattern)
    }
  },
  maxLengthBetweenDelimiters: (delimiter, maxLength, delimiterDescription) => {
    return {
      name: 'labelsLength',
      label: `Max length between two ${lodash.defaultTo(
        delimiterDescription,
        delimiter
      )}: ${maxLength}`,
      pattern: value => {
        return value.split(delimiter).every(item => {
          return item.length >= 1 && item.length <= maxLength
        })
      }
    }
  },
  mustNotBe: words => {
    const wordsArray = words.split(' ')

    return {
      name: 'mustNotBe',
      label: ValidationConstants.MUST_NOT_BE + ': ' + convertToLabel(words),
      pattern: function(value) {
        return !lodash.includes(wordsArray, value)
      }
    }
  },
  length: options => {
    const min = Number.isSafeInteger(options.min) ? options.min : 0
    const max = Number.isSafeInteger(options.max) ? options.max : ''

    if (min || max) {
      const label =
        'Length – ' +
        (min ? 'min: ' + options.min + '\xa0\xa0' : '') +
        (max ? 'max: ' + options.max : '')

      return {
        name: 'length',
        label: label,
        pattern: new RegExp('^[\\S\\s]{' + min + ',' + max + '}$')
      }
    }
  },
  required: () => {
    return {
      name: 'required',
      label: ValidationConstants.REQUIRED,
      pattern: new RegExp('\\S')
    }
  }
}

//const commonRules = {
// email: [
//   generateRule.beginEndNotWith('@ .'),
//   {
//     name: 'exactlyOne',
//     label: ValidationConstants.MUST_CONTAIN_EXACTLY_ONE + ': @',
//     pattern: /^[^@]+@[^@]+$/
//   },
//   {
//     name: 'dotAfterAt',
//     label: ValidationConstants.MUST_HAVE_DOT_AFTER_AT,
//     pattern: /@.+\..+$/
//   }
// ]
//}
const validationRules = {
  artifact: {
    name: [
      generateRule.validCharacters('a-z A-Z 0-9 - _ .'),
      generateRule.beginEndWith('a-z A-Z 0-9'),
      generateRule.length({ max: 253 }),
      generateRule.required()
    ]
  },
  feature: {
    sets: {
      tag: [
        generateRule.validCharacters('a-z A-Z 0-9 - _'),
        generateRule.beginEndWith('a-z A-Z 0-9'),
        generateRule.length({ max: 56 })
      ]
    },
    vector: {
      name: [
        generateRule.validCharacters('a-z A-Z 0-9 - _ .'),
        generateRule.beginEndWith('a-z A-Z 0-9'),
        generateRule.length({ max: 56 }),
        generateRule.required()
      ]
    }
  },
  common: {
    name: [
      generateRule.validCharacters('a-z A-Z 0-9 - _ .'),
      generateRule.beginEndWith('a-z A-Z 0-9'),
      generateRule.length({ max: 63 }),
      generateRule.required()
    ],
    tag: [
      generateRule.validCharacters('a-z A-Z 0-9 - _ .'),
      generateRule.beginEndWith('a-z A-Z 0-9'),
      generateRule.length({ max: 56 })
    ]
  },
  project: {
    name: [
      generateRule.validCharacters('a-z 0-9 -'),
      generateRule.beginWith('a-z'),
      generateRule.endWith('a-z 0-9'),
      generateRule.length({ max: 63 }),
      generateRule.required()
    ]
  }
}

/**
 * Returns the list of validation rules for `type`, optionally appending provided additional rules.
 * @function getValidationRules
 * @param {string} type - The property path to the list of validation rules.
 * @param {Array.<Object>} [additionalRules] - Additional rules to append.
 * @returns {Array.<Object>} the rule list of type `type` with `additionalRules` appended to it if provided.
 */
export const getValidationRules = (type, additionalRules) => {
  return lodash
    .chain(validationRules)
    .get(type)
    .defaultTo([])
    .cloneDeep()
    .concat(lodash.defaultTo(additionalRules, []))
    .value()
}
