const RandExp = require('randexp')

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
  return getValueFromArray(array, 'length')
}

export const getNotToBe = (array, substring) => {
  const value = getValueFromArray(array, substring)

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

export const getRule = (array, substring) => {
  const value = getValueFromArray(array, substring)

  if (!value) return false

  return value
    .split(', ')
    .map(el => el.replace(/\./g, '\\.'))
    .join('')
}

const getValueFromArray = (array, substring) => {
  const stringWithValue = array.find(el => el.toLowerCase().includes(substring))

  return stringWithValue
    ? stringWithValue.slice(stringWithValue.lastIndexOf(':') + 1).trim()
    : false
}

const setInvalidCharacters = (
  allCharacters,
  rule,
  invalidCharacters
) => {
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

  if (beginRule) {
    beginRegular = `^[${beginRule}]`
    setInvalidCharacters(symbols, beginRule, invalidStringBeginSymbols)
  }

  if (endRule) {
    endRegular = `[${endRule}]$`
    setInvalidCharacters(symbols, endRule, invalidStringEndSymbols)
  }

  if (validCharactersRule) {
    validRegular = `[${validCharactersRule}]`

    let allSymbolsValid = '\\'
    allSymbolsValid = `${allSymbolsValid.charAt(0)}.`

    if (
      (validCharactersRule.includes('.') &&
        validCharactersRule.includes(allSymbolsValid)) ||
      !validCharactersRule.includes('.')
    ) {
      setInvalidCharacters(
        symbols,
        validCharactersRule,
        invalidStringBodySymbols
      )
    }
  }

  if (lengthRule) {
    lengthRegular = `{1,${lengthRule}}`
    validStrings.push('a')
    validStrings.push(
      Array(Number(lengthRule))
        .fill('a')
        .join('')
    )
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
    invalidStrings.push(
      new RandExp(new RegExp(`^(${notStartWith})[a-z]+`)).gen()
    )
  }

  if (notConsecutiveCharacters) {
    notConsecutiveCharactersRegular = notConsecutiveCharacters.map(
      el => `(?!${el})`
    )
  }

  const regular = new RegExp(
    `${beginRegular}${notStartWithRegular}(${validRegular}${lengthRegular})${notConsecutiveCharactersRegular}${notToBeRegular}${endRegular}`
  )

  validStrings.push(new RandExp(regular).gen())

  if (invalidStringEndSymbols) {
    invalidStringBeginSymbols.forEach(symbol => {
      invalidStrings.push(`${symbol}${new RandExp(regular).gen()}`)
    })
    invalidStringEndSymbols.forEach(symbol => {
      invalidStrings.push(`${new RandExp(regular).gen()}${symbol}`)
    })
    invalidStringBodySymbols.forEach(symbol => {
      const string = `${new RandExp(regular).gen()}`

      invalidStrings.push(`${string.slice(0, 1)}${symbol}${string.slice(1)}`)
    })
  }
  if (notConsecutiveCharacters) {
    notConsecutiveCharacters.forEach(item => {
      const regular = new RegExp(`(^\\w*$)(${item})`)

      invalidStrings.push(new RandExp(regular).gen())
    })
  }

  return { validStrings, invalidStrings }
}
