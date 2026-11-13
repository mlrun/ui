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
import RandExp from 'randexp'

// const rules = `• Valid characters: A-Z, a-z, 0-9, -, _, .\n
//                • Must begin and end with: A-Z, a-z, 0-9\n
//                // • No consecutive characters: .., .–, –.\n
//                // • Must not start with: ..\n
//                // • Must not be: ., ..\n
//                // • Max length between two periods: 63\n - TODO: no one knows what the rule means
//                • Length - max: 63`

const symbols = [
  ':',
  '_',
  '!',
  '@',
  '#',
  '$',
  '%',
  '^',
  '&',
  '*',
  '(',
  ')',
  ',',
  '[',
  ']',
  '{',
  '}',
  '.',
  ';',
  ' '
]

export const getLength = array => {
  return getRuleValue(array, 'length')
}

export const getNotToBe = (array, substring) => {
  const value = getRuleValue(array, substring)

  if (!value) return false

  return value.split(', ').map(el => {
    if (el === '.') {
      return '\\.'
    } else if (el.length > 0) {
      return el
        .split('')
        .map(char => (char === '.' ? '\\.' : char))
        .join('')
    } else {
      return el
    }
  })
}

// the characters of a rule as a RegExp character class: "a-z, A-Z, 0-9, -, _, ." -> "a-zA-Z0-9\\-_\\." (a lone "-" is
// escaped, it is not a range)
export const getRule = (array, rule) => {
  const value = getRuleValue(array, rule)

  if (!value) return false

  return value
    .split(', ')
    .map(el => (el === '-' ? '\\-' : el.replace(/\\/g, '\\\\').replace(/\./g, '\\.')))
    .join('')
}

// `rule` - a RegExp of the rule line (the label, e.g. "Must begin with" but not "Must not begin with") or a substring
const getRuleValue = (array, rule) => {
  let stringWithValue = array.find(el =>
    rule instanceof RegExp ? rule.test(el) : el.toLowerCase().includes(rule)
  )

  if (stringWithValue) {
    //TODO: Add checks for Prefix, unique, spaces rules (labels, parameters)
    if (stringWithValue.includes('[Prefix]')) {
      stringWithValue = false
    } else if (stringWithValue.includes(':')) {
      stringWithValue = stringWithValue.slice(stringWithValue.lastIndexOf(':') + 1).trim()
    } else if (stringWithValue.includes('-')) {
      stringWithValue = parseInt(stringWithValue.slice(stringWithValue.lastIndexOf('-') + 1).trim())
    }
  } else {
    stringWithValue = false
  }

  return stringWithValue
}

const setInvalidCharacters = (allCharacters, rule, invalidCharacters) => {
  const characters = allCharacters.sort(() => Math.random() - 0.5)
  let result = null

  for (let i = 0; i < characters.length; i++) {
    if (result) break

    if (!rule.includes(characters[i])) {
      result = characters[i]
    }
  }

  if (result) invalidCharacters.push(result)
}

export const generateRegEx = (
  beginRule,
  endRule,
  lengthRule,
  validCharactersRule,
  notToBe,
  notStartWith,
  notConsecutiveCharacters
) => {
  let beginRegular = ''
  let endRegular = ''
  let validRegular = ''
  let lengthRegular = ''
  let notToBeRegular = ''
  let notStartWithRegular = ''
  let notConsecutiveCharactersRegular = ''
  const validStrings = []
  const invalidStrings = []
  const invalidStringBeginSymbols = []
  const invalidStringBodySymbols = []
  const invalidStringEndSymbols = []

  // the invalid first/last character breaks the begin/end rule only: a character valid inside the value (e.g. "-", "_",
  // ".") that is not allowed at the begin/end. A random symbol (e.g. "$") broke the valid characters rule as well, so a
  // broken begin/end check of the app was not noticed: the field was invalid anyway
  const validInsideOnly = (edgeRule, invalidCharacters) => {
    const candidates = ['-', '_', '.'].filter(
      character =>
        validCharactersRule &&
        new RegExp(`[${validCharactersRule}]`).test(character) &&
        !new RegExp(`[${edgeRule}]`).test(character)
    )

    if (candidates.length) {
      invalidCharacters.push(candidates[Math.floor(Math.random() * candidates.length)])
    } else {
      setInvalidCharacters(symbols, edgeRule, invalidCharacters)
    }
  }

  if (beginRule) {
    beginRegular = `^[${beginRule}]`
    validInsideOnly(beginRule, invalidStringBeginSymbols)
  }

  if (endRule) {
    endRegular = `[${endRule}]$`
    validInsideOnly(endRule, invalidStringEndSymbols)
  }

  if (validCharactersRule) {
    validRegular = `[${validCharactersRule}]`

    let allSymbolsValid = '\\'
    allSymbolsValid = `${allSymbolsValid.charAt(0)}.`

    if (
      (validCharactersRule.includes('.') && validCharactersRule.includes(allSymbolsValid)) ||
      !validCharactersRule.includes('.')
    ) {
      setInvalidCharacters(symbols, validCharactersRule, invalidStringBodySymbols)
    }
  }

  if (lengthRule) {
    lengthRegular = `{1,${lengthRule}}`
    validStrings.push('a')
    validStrings.push(Array(Number(lengthRule)).fill('a').join(''))
    // TODO: needs to implement paste functionality
    // invalidStrings.push(
    //   Array(Number(lengthRule) + 1)
    //     .fill('a')
    //     .join('')
    // )
  } else {
    lengthRegular = '*'
  }

  if (notToBe) {
    notToBeRegular = notToBe.map(el => `(?!${el}$)`).join('')
    notToBe.forEach(el => {
      invalidStrings.push(el.startsWith('\\') ? el.replace(/\\/g, '') : el)
    })
  }

  if (notStartWith) {
    notStartWithRegular = `(?!${notStartWith})`
    invalidStrings.push(new RandExp(new RegExp(`^(${notStartWith})[a-z]+`)).gen())
  }

  if (notConsecutiveCharacters) {
    notConsecutiveCharactersRegular = notConsecutiveCharacters.map(el => `(?!${el})`).join('')
  }

  const regular = new RegExp(
    `${beginRegular}${notStartWithRegular}(${validRegular}${lengthRegular})${notConsecutiveCharactersRegular}${notToBeRegular}${endRegular}`
  )

  // RandExp ignores the lookaheads (not start with, not consecutive, not to be), so a generated string can break the
  // rules, e.g. a "valid" string with two dots in a row is rejected by the app: such strings are generated again
  // the length rule limits the whole string, but the generated one is the body plus the begin and the end characters
  const breaksRules = value =>
    Boolean(lengthRule && value.length > Number(lengthRule)) ||
    Boolean(notStartWith && new RegExp(`^(${notStartWith})`).test(value)) ||
    (Array.isArray(notConsecutiveCharacters) &&
      notConsecutiveCharacters.some(el => new RegExp(el).test(value))) ||
    (Array.isArray(notToBe) && notToBe.some(el => new RegExp(`^${el}$`).test(value)))
  const generateValidString = () => {
    let value = new RandExp(regular).gen()

    for (let attempt = 0; attempt < 200 && breaksRules(value); attempt++) {
      value = new RandExp(regular).gen()
    }

    return value
  }

  // the longest valid value is made of the widest character the field allows: the value of the max length of narrow
  // characters ("a") fit in the input, its text never scrolled, so BUG-001 (tests/KNOWN_BUGS.md: the label chip editing
  // ends on the scroll of its text, the rest is lost) was hit only when a random string happened to be wide enough
  if (lengthRule) {
    const widest = ['W', 'M', 'm', 'w', 'a']
      .map(character => character.repeat(Number(lengthRule)))
      .find(value => regular.test(value) && !breaksRules(value))

    if (widest) validStrings.splice(1, 1, widest)
  }

  validStrings.push(generateValidString())

  if (invalidStringEndSymbols) {
    invalidStringBeginSymbols.forEach(symbol => {
      invalidStrings.push(`${symbol}${generateValidString()}`)
    })
    // the field cuts the typed value at the max length (`maxlength`): the end symbol typed after a valid string of the
    // max length was cut off and the field had a valid value (MLPH005: 64 characters typed, 63 kept, "...00{" -> "...00"),
    // so the valid part leaves room for the symbol
    invalidStringEndSymbols.forEach(symbol => {
      const string = generateValidString()
      const maxBodyLength = lengthRule
        ? Math.max(1, Number(lengthRule) - symbol.length)
        : string.length

      invalidStrings.push(`${string.slice(0, maxBodyLength)}${symbol}`)
    })
    invalidStringBodySymbols.forEach(symbol => {
      const string = generateValidString()

      invalidStrings.push(`${string.slice(0, 1)}${symbol}${string.slice(1)}`)
    })
  }
  if (notConsecutiveCharacters) {
    notConsecutiveCharacters.forEach(item => {
      const regular = new RegExp(`(^\\w*$)(${item})`)

      invalidStrings.push(new RandExp(regular).gen())
    })
  }

  // one character more than the max length: the field must reject it (or not take it, `maxlength`)
  const tooLongString = lengthRule
    ? `${validStrings[1] ?? Array(Number(lengthRule)).fill('a').join('')}${validStrings[1]?.slice(-1) ?? 'a'}`
    : null

  return { validStrings, invalidStrings, tooLongString }
}
