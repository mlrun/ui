/*
Copyright 2022 Iguazio Systems Ltd.
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
import lodash, { isEmpty } from 'lodash'

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
  return chars.replace(/-/g, '–').replace(/\s/g, ', ').replace(/\bs\b/, 'spaces')
}

/**
 * Converts characters string to valid RegExp string that will be placed into RegExp pattern
 * @param {string} chars - characters to convert
 * @returns {string} - converted string
 * @example
 * convertToPattern('a-z A-Z - _ *') => 'a-zA-Z\-\_\*'
 */
const convertToPattern = chars => {
  return chars
    .split(' ')
    .map(patternItem => (patternItem.length === 1 ? '\\' + patternItem : patternItem))
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

export const required =
  (validationMsg = 'Required') =>
  value => {
    let isValid = value.trim() !== '' && typeof value === 'string'
    return [isValid, validationMsg]
  }

/**
 * Checks whether there is at least one failed validation rule.
 * @function checkPatternsValidity
 * @param {Array} validationRules Array of Validation Rule Objects {name: "", lable: "", pattren: [Function || Regex]}
 * @param {string} value Field value to check validity
 * @param {boolean} required Specified if the value should be validated
 * @returns {Array} [validationRules, isFieldValid] New validationRules With `isValid` property, `true` in case there is at least one failed validation rule, or `false` otherwise.
 */

export const checkPatternsValidity = (validationRules, value = '', required = true) => {
  const newRules =
    !required && isEmpty(value)
      ? validationRules
      : validationRules
          .filter(rule => !rule.async)
          .map(rule => {
            return {
              ...rule,
              isValid: lodash.isFunction(rule.pattern)
                ? rule.pattern(value)
                : /* else, it is a RegExp */ rule.pattern.test(value)
            }
          })

  return [newRules, !hasInvalidRule(newRules)]
}

export const checkPatternsValidityAsync = async (validationRules, value) => {
  const [newRules] = checkPatternsValidity(validationRules, value)
  const asyncRules = await Promise.all(
    validationRules
      .filter(rule => rule.async)
      .map(async rule => ({
        ...rule,
        isValid: await rule.pattern(value)
      }))
  )

  const allRules = newRules.concat(asyncRules)

  return [allRules, !hasInvalidRule(allRules)]
}

const generateRule = {
  beginWith: chars => {
    return {
      name: ValidationConstants.BEGIN_WITH.NAME,
      label: ValidationConstants.BEGIN_WITH.LABEL + ': ' + convertToLabel(chars),
      pattern: new RegExp('^[' + convertToPattern(chars) + ']')
    }
  },
  beginNotWith: chars => {
    return {
      name: ValidationConstants.BEGIN_NOT_WITH.NAME,
      label: ValidationConstants.BEGIN_NOT_WITH.LABEL + ': ' + convertToLabel(chars),
      pattern: new RegExp('^[^' + convertToPattern(chars) + ']')
    }
  },
  endWith: chars => {
    return {
      name: ValidationConstants.END_WITH.NAME,
      label: ValidationConstants.END_WITH.LABEL + ': ' + convertToLabel(chars),
      pattern: new RegExp('[' + convertToPattern(chars) + ']$')
    }
  },
  endNotWith: chars => {
    return {
      name: ValidationConstants.END_NOT_WITH.NAME,
      label: ValidationConstants.END_NOT_WITH.LABEL + ': ' + convertToLabel(chars),
      pattern: new RegExp('[^' + convertToPattern(chars) + ']$')
    }
  },
  beginEndWith: (chars, labelPrefix = '') => {
    const convertedPattern = convertToPattern(chars)

    return {
      name: ValidationConstants.BEGIN_END_WITH.NAME,
      label: labelPrefix + ValidationConstants.BEGIN_END_WITH.LABEL + ': ' + convertToLabel(chars),
      pattern: new RegExp('^([' + convertedPattern + '].*)?[' + convertedPattern + ']$')
    }
  },
  beginEndNotWith: chars => {
    const convertedPattern = convertToPattern(chars)

    return {
      name: ValidationConstants.BEGIN_END_NOT_WITH.NAME,
      label: ValidationConstants.BEGIN_END_NOT_WITH.LABEL + ': ' + convertToLabel(chars),
      pattern: new RegExp('^([^' + convertedPattern + '].*)?[^' + convertedPattern + ']$')
    }
  },
  onlyAtTheBeginning: chars => {
    const convertedPattern = convertToPattern(chars)

    return {
      name: ValidationConstants.ONLY_AT_THE_BEGINNING.NAME,
      label: ValidationConstants.ONLY_AT_THE_BEGINNING.LABEL + ': ' + convertToLabel(chars),
      pattern: new RegExp('^([' + convertedPattern + '])?[^' + convertedPattern + ']+$')
    }
  },
  validCharacters: (chars, labelPrefix = '') => {
    return {
      name: ValidationConstants.VALID_CHARACTERS.NAME,
      label:
        labelPrefix + ValidationConstants.VALID_CHARACTERS.LABEL + ': ' + convertToLabel(chars),
      pattern: new RegExp('^[' + convertToPattern(chars) + ']+$')
    }
  },
  validCharactersWithPrefix: chars => {
    return {
      name: ValidationConstants.VALID_CHARACTERS_WITH_REFIX.NAME,
      label: ValidationConstants.VALID_CHARACTERS_WITH_REFIX.LABEL + ': ' + convertToLabel(chars),
      pattern: new RegExp(
        '^([' + convertToPattern(chars) + ']+/)?[' + convertToPattern(chars) + ']+$'
      )
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
      name: ValidationConstants.NO_CONSECUTIVE_CHARACTER.NAME,
      label: ValidationConstants.NO_CONSECUTIVE_CHARACTER.LABEL + ': ' + convertToLabel(chars),
      pattern: new RegExp('^' + convertedPattern)
    }
  },
  notContainCharacters: chars => {
    return {
      name: ValidationConstants.NOT_CONTAIN.NAME,
      label: ValidationConstants.NOT_CONTAIN.LABEL + ': ' + convertToLabel(chars),
      pattern: new RegExp('^[^' + convertToPattern(chars) + ']+$')
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
      name: ValidationConstants.MUST_NOT_BE.NAME,
      label: ValidationConstants.MUST_NOT_BE.LABEL + ': ' + convertToLabel(words),
      pattern: function (value) {
        return !lodash.includes(wordsArray, value)
      }
    }
  },
  length: (options, labelPrefix = '') => {
    const min = Number.isSafeInteger(options.min) ? options.min : 0
    const max = Number.isSafeInteger(options.max) ? options.max : ''

    if (min || max) {
      const label =
        'Length – ' +
        (min ? 'min: ' + options.min + '\xa0\xa0' : '') +
        (max ? 'max: ' + options.max : '')

      return {
        name: 'length',
        label: labelPrefix + label,
        pattern: new RegExp('^[\\S\\s]{' + min + ',' + max + '}$')
      }
    }
  },
  required: () => {
    return {
      name: ValidationConstants.REQUIRED.NAME,
      label: ValidationConstants.REQUIRED.LABEL,
      pattern: new RegExp('\\S')
    }
  }
}

const commonRules = {
  prefixedQualifiedName: [
    {
      name: 'nameValidCharacters',
      label: `[Name] ${ValidationConstants.VALID_CHARACTERS.LABEL} : a–z, A–Z, 0–9, –, _, .`,
      pattern: /^([^/]+\/)?[\w.-]+$/
    },
    {
      name: 'nameBeginEnd',
      label: `[Name] ${ValidationConstants.BEGIN_END_WITH.LABEL}: a–z, A–Z, 0–9`,
      pattern: /^([^/]+\/)?([A-Za-z0-9][^/]*)?[A-Za-z0-9]$/
    },
    {
      name: 'nameMaxLength',
      label: '[Name] Max length - 63 characters',
      pattern: /^([^/]+\/)?[^/]{1,63}$/
    },
    {
      name: 'prefixValidCharacters',
      label: `[Prefix] ${ValidationConstants.VALID_CHARACTERS.LABEL}: a–z, 0–9, –, .`,
      pattern: /^([a-z0-9.-]+\/)?[^/]+$/
    },
    {
      name: 'prefixBeginEnd',
      label: `[Prefix] ${ValidationConstants.BEGIN_END_WITH.LABEL}: a–z, 0–9`,
      pattern: /^([a-z0-9]([^/]*[a-z0-9])?\/)?[^/]+$/
    },
    {
      name: 'prefixMaxLength',
      label: '[Prefix] Max length - 253 characters',
      pattern: /^(?![^/]{254,}\/)/
    }
  ],
  k8sLabels: {
    getValue: (withPrefix = false) => {
      let labelPrefix = withPrefix ? '[Value] ' : ''

      return [
        generateRule.beginEndWith('a-z A-Z 0-9', labelPrefix),
        generateRule.length({ max: 63 }, labelPrefix),
        generateRule.validCharacters('a-z A-Z 0-9 - _ .', labelPrefix)
      ]
    }
  }
  // email: [
  //   generateRule.beginEndNotWith('@ .'),
  //   {
  //     name: ValidationConstants.MUST_CONTAIN_EXACTLY_ONE.NAME,
  //     label: ValidationConstants.MUST_CONTAIN_EXACTLY_ONE.LABEL + ': @',
  //     pattern: /^[^@]+@[^@]+$/
  //   },
  //   {
  //     name: ValidationConstants.MUST_HAVE_DOT_AFTER_AT.NAME,
  //     label: ValidationConstants.MUST_HAVE_DOT_AFTER_AT.LABEL,
  //     pattern: /@.+\..+$/
  //   }
  // ]
}

commonRules.k8sLabels.key = commonRules.prefixedQualifiedName.concat({
  name: 'prefixNotStart',
  label: "[Prefix] Must not start with 'kubernetes.io', 'k8s.io'",
  pattern: /^(?!kubernetes\.io\/)(?!k8s\.io\/)/
})

const validationRules = {
  artifact: {
    name: [
      generateRule.validCharacters('a-z A-Z 0-9 - _ .'),
      generateRule.beginEndWith('a-z A-Z 0-9'),
      generateRule.length({ max: 253 }),
      generateRule.required()
    ],
    labels: {
      key: [
        generateRule.notContainCharacters(':'),
        generateRule.beginEndWith('a-z A-Z 0-9'),
        generateRule.length({ max: 255 })
      ],
      value: [generateRule.beginEndWith('a-z A-Z 0-9'), generateRule.length({ max: 255 })]
    }
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
  function: {
    name: [
      generateRule.validCharacters('a-z 0-9 - .'),
      generateRule.beginEndWith('a-z 0-9'),
      generateRule.length({ max: 63 }),
      generateRule.required()
    ]
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
    ],
    combobox: [generateRule.required()]
  },
  project: {
    name: [
      generateRule.validCharacters('a-z 0-9 -'),
      generateRule.beginWith('a-z'),
      generateRule.endWith('a-z 0-9'),
      generateRule.length({ max: 63 }),
      generateRule.required()
    ],
    labels: {
      key: commonRules.k8sLabels.key,
      value: commonRules.k8sLabels.getValue(true)
    },
    params: {
      key: [generateRule.notContainCharacters('s')],
      value: [generateRule.beginEndNotWith('s')]
    },
    secrets: {
      key: [generateRule.validCharacters('a-z A-Z 0-9 - _ .')]
    }
  },
  nodeSelectors: {
    key: commonRules.prefixedQualifiedName,
    value: commonRules.k8sLabels.getValue(false)
  },
  environmentVariables: {
    secretName: [
      generateRule.validCharacters('a-z A-Z 0-9 - _ .'),
      generateRule.beginEndWith('a-z A-Z 0-9'),
      generateRule.noConsecutiveCharacters('.., .–, –.'),
      generateRule.maxLengthBetweenDelimiters(/[.\-_]/, 63, 'periods'),
      generateRule.length({ max: 253 }),
      generateRule.required()
    ],
    secretKey: [
      generateRule.validCharacters('a-z A-Z 0-9 - _ .'),
      generateRule.beginNotWith('.'),
      generateRule.length({ max: 253 })
    ]
  },
  job: {
    label: {
      key: [
        generateRule.validCharactersWithPrefix('a-z A-Z 0-9 - _ .'),
        generateRule.beginEndWith('a-z A-Z 0-9'),
        generateRule.length({ max: 75 })
      ],
      value: generateRule.length({ max: 255 })
    }
  }
}

/**
 * Returns the list of validation rules for `type`, optionally appending provided additional rules.
 * @function getValidationRules
 * @param {string} type - The property path to the list of validation rules.
 * @param {Array.<Object> | Object} [additionalRules] - Additional rules or rule to append.
 * @returns {Array.<Object>} The rule list of type `type` with `additionalRules` appended to it if provided.
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

/**
 * Creates a validation rule to ensure system-defined labels cannot be modified.
 * @function getInternalLabelsValidationRule
 * @param {string} internalLabels - An array of defined labels that should not be modified.
 * @returns {Object} The rule that checks if a value is not in the internal labels.
 */
export const getInternalLabelsValidationRule = (internalLabels = []) => {
  return {
    name: 'customLabels',
    label: 'System-defined labels cannot be modified.',
    pattern: value => {
      return !internalLabels.includes(value)
    }
  }
}
