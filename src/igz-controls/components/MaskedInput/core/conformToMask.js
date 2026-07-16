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

import { isArray } from 'lodash'

import { convertMaskToPlaceholder, processCaretTraps } from './utilities'
import { placeholderChar as defaultPlaceholderChar, strFunction } from './constants'

const emptyArray = []
const emptyString = ''

export default function conformToMask(rawValue = emptyString, mask = emptyArray, config = {}) {
  if (!isArray(mask)) {
    if (typeof mask === strFunction) {
      mask = mask(rawValue, config)
      mask = processCaretTraps(mask).maskWithoutCaretTraps
    } else {
      throw new Error('Text-mask:conformToMask; The mask property must be an array.')
    }
  }

  const {
    guide = true,
    previousConformedValue = emptyString,
    placeholderChar = defaultPlaceholderChar,
    placeholder = convertMaskToPlaceholder(mask, placeholderChar),
    currentCaretPosition,
    keepCharPositions
  } = config

  const suppressGuide = guide === false && previousConformedValue !== undefined

  const rawValueLength = rawValue.length
  const previousConformedValueLength = previousConformedValue.length
  const placeholderLength = placeholder.length
  const maskLength = mask.length

  const editDistance = rawValueLength - previousConformedValueLength
  const isAddition = editDistance > 0
  const indexOfFirstChange = currentCaretPosition + (isAddition ? -editDistance : 0)
  const indexOfLastChange = indexOfFirstChange + Math.abs(editDistance)

  if (keepCharPositions === true && !isAddition) {
    let compensatingPlaceholderChars = emptyString

    for (let i = indexOfFirstChange; i < indexOfLastChange; i++) {
      if (placeholder[i] === placeholderChar) {
        compensatingPlaceholderChars += placeholderChar
      }
    }

    rawValue =
      rawValue.slice(0, indexOfFirstChange) +
      compensatingPlaceholderChars +
      rawValue.slice(indexOfFirstChange, rawValueLength)
  }

  const rawValueArr = rawValue
    .split(emptyString)
    .map((char, i) => ({ char, isNew: i >= indexOfFirstChange && i < indexOfLastChange }))

  for (let i = rawValueLength - 1; i >= 0; i--) {
    const { char } = rawValueArr[i]

    if (char !== placeholderChar) {
      const shouldOffset = i >= indexOfFirstChange && previousConformedValueLength === maskLength

      if (char === placeholder[shouldOffset ? i - editDistance : i]) {
        rawValueArr.splice(i, 1)
      }
    }
  }

  let conformedValue = emptyString
  let someCharsRejected = false

  placeholderLoop: for (let i = 0; i < placeholderLength; i++) {
    const charInPlaceholder = placeholder[i]

    if (charInPlaceholder === placeholderChar) {
      if (rawValueArr.length > 0) {
        while (rawValueArr.length > 0) {
          const { char: rawValueChar, isNew } = rawValueArr.shift()

          if (rawValueChar === placeholderChar && suppressGuide !== true) {
            conformedValue += placeholderChar
            continue placeholderLoop
          } else if (mask[i].test(rawValueChar)) {
            if (
              keepCharPositions !== true ||
              isNew === false ||
              previousConformedValue === emptyString ||
              guide === false ||
              !isAddition
            ) {
              conformedValue += rawValueChar
            } else {
              const rawValueArrLength = rawValueArr.length
              let indexOfNextAvailablePlaceholderChar = null

              for (let i = 0; i < rawValueArrLength; i++) {
                const charData = rawValueArr[i]

                if (charData.char !== placeholderChar && charData.isNew === false) {
                  break
                }

                if (charData.char === placeholderChar) {
                  indexOfNextAvailablePlaceholderChar = i
                  break
                }
              }

              if (indexOfNextAvailablePlaceholderChar !== null) {
                conformedValue += rawValueChar
                rawValueArr.splice(indexOfNextAvailablePlaceholderChar, 1)
              } else {
                i--
              }
            }

            continue placeholderLoop
          } else {
            someCharsRejected = true
          }
        }
      }

      if (suppressGuide === false) {
        conformedValue += placeholder.substr(i, placeholderLength)
      }

      break
    } else {
      conformedValue += charInPlaceholder
    }
  }

  if (suppressGuide && isAddition === false) {
    let indexOfLastFilledPlaceholderChar = null

    for (let i = 0; i < conformedValue.length; i++) {
      if (placeholder[i] === placeholderChar) {
        indexOfLastFilledPlaceholderChar = i
      }
    }

    if (indexOfLastFilledPlaceholderChar !== null) {
      conformedValue = conformedValue.substr(0, indexOfLastFilledPlaceholderChar + 1)
    } else {
      conformedValue = emptyString
    }
  }

  return { conformedValue, meta: { someCharsRejected } }
}
