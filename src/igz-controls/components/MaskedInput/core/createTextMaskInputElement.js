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

import { isString, isNumber } from 'lodash'

import adjustCaretPosition from './adjustCaretPosition'
import conformToMask from './conformToMask'
import { convertMaskToPlaceholder, processCaretTraps } from './utilities'
import { placeholderChar as defaultPlaceholderChar, strFunction } from './constants'

const emptyString = ''
const strNone = 'none'
const strObject = 'object'
const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent)
const defer = typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame : setTimeout

export default function createTextMaskInputElement(config) {
  const state = { previousConformedValue: undefined, previousPlaceholder: undefined }

  return {
    state,

    update(
      rawValue,
      {
        inputElement,
        mask: providedMask,
        guide,
        pipe,
        placeholderChar = defaultPlaceholderChar,
        keepCharPositions = false,
        showMask = false
      } = config
    ) {
      if (typeof rawValue === 'undefined') {
        rawValue = inputElement.value
      }

      if (rawValue === state.previousConformedValue) {
        return
      }

      if (
        typeof providedMask === strObject &&
        providedMask.pipe !== undefined &&
        providedMask.mask !== undefined
      ) {
        pipe = providedMask.pipe
        providedMask = providedMask.mask
      }

      let placeholder
      let mask

      if (providedMask instanceof Array) {
        placeholder = convertMaskToPlaceholder(providedMask, placeholderChar)
      }

      if (providedMask === false) {
        return
      }

      const safeRawValue = getSafeRawValue(rawValue)
      const { selectionEnd: currentCaretPosition } = inputElement
      const { previousConformedValue, previousPlaceholder } = state

      let caretTrapIndexes

      if (typeof providedMask === strFunction) {
        mask = providedMask(safeRawValue, {
          currentCaretPosition,
          previousConformedValue,
          placeholderChar
        })

        if (mask === false) {
          return
        }

        const { maskWithoutCaretTraps, indexes } = processCaretTraps(mask)

        mask = maskWithoutCaretTraps
        caretTrapIndexes = indexes

        placeholder = convertMaskToPlaceholder(mask, placeholderChar)
      } else {
        mask = providedMask
      }

      const conformToMaskConfig = {
        previousConformedValue,
        guide,
        placeholderChar,
        pipe,
        placeholder,
        currentCaretPosition,
        keepCharPositions
      }

      const { conformedValue } = conformToMask(safeRawValue, mask, conformToMaskConfig)

      const piped = typeof pipe === strFunction

      let pipeResults = {}

      if (piped) {
        pipeResults = pipe(conformedValue, { rawValue: safeRawValue, ...conformToMaskConfig })

        if (pipeResults === false) {
          pipeResults = { value: previousConformedValue, rejected: true }
        } else if (isString(pipeResults)) {
          pipeResults = { value: pipeResults }
        }
      }

      const finalConformedValue = piped ? pipeResults.value : conformedValue

      const adjustedCaretPosition = adjustCaretPosition({
        previousConformedValue,
        previousPlaceholder,
        conformedValue: finalConformedValue,
        placeholder,
        rawValue: safeRawValue,
        currentCaretPosition,
        placeholderChar,
        indexesOfPipedChars: pipeResults.indexesOfPipedChars,
        caretTrapIndexes
      })

      const inputValueShouldBeEmpty =
        finalConformedValue === placeholder && adjustedCaretPosition === 0
      const emptyValue = showMask ? placeholder : emptyString
      const inputElementValue = inputValueShouldBeEmpty ? emptyValue : finalConformedValue

      state.previousConformedValue = inputElementValue
      state.previousPlaceholder = placeholder

      if (inputElement.value === inputElementValue) {
        return
      }

      inputElement.value = inputElementValue
      safeSetSelection(inputElement, adjustedCaretPosition)
    }
  }
}

function safeSetSelection(element, selectionPosition) {
  if (document.activeElement === element) {
    if (isAndroid) {
      defer(() => element.setSelectionRange(selectionPosition, selectionPosition, strNone), 0)
    } else {
      element.setSelectionRange(selectionPosition, selectionPosition, strNone)
    }
  }
}

function getSafeRawValue(inputValue) {
  if (isString(inputValue)) {
    return inputValue
  } else if (isNumber(inputValue)) {
    return String(inputValue)
  } else if (inputValue === undefined || inputValue === null) {
    return emptyString
  } else {
    throw new Error(
      "The 'value' provided to Text Mask needs to be a string or a number. The value " +
        `received was:\n\n ${JSON.stringify(inputValue)}`
    )
  }
}
