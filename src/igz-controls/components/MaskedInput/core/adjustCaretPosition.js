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

const defaultArray = []
const emptyString = ''

export default function adjustCaretPosition({
  previousConformedValue = emptyString,
  previousPlaceholder = emptyString,
  currentCaretPosition = 0,
  conformedValue,
  rawValue,
  placeholderChar,
  placeholder,
  indexesOfPipedChars = defaultArray,
  caretTrapIndexes = defaultArray
}) {
  if (currentCaretPosition === 0 || !rawValue.length) { return 0 }

  const rawValueLength = rawValue.length
  const previousConformedValueLength = previousConformedValue.length
  const placeholderLength = placeholder.length
  const conformedValueLength = conformedValue.length

  const editLength = rawValueLength - previousConformedValueLength
  const isAddition = editLength > 0
  const isFirstRawValue = previousConformedValueLength === 0
  const isPartialMultiCharEdit = editLength > 1 && !isAddition && !isFirstRawValue

  if (isPartialMultiCharEdit) { return currentCaretPosition }

  const possiblyHasRejectedChar = isAddition && (
    previousConformedValue === conformedValue ||
    conformedValue === placeholder
  )

  let startingSearchIndex = 0
  let trackRightCharacter
  let targetChar

  if (possiblyHasRejectedChar) {
    startingSearchIndex = currentCaretPosition - editLength
  } else {
    const normalizedConformedValue = conformedValue.toLowerCase()
    const normalizedRawValue = rawValue.toLowerCase()

    const leftHalfChars = normalizedRawValue.substr(0, currentCaretPosition).split(emptyString)

    const intersection = leftHalfChars.filter((char) => normalizedConformedValue.indexOf(char) !== -1)

    targetChar = intersection[intersection.length - 1]

    const previousLeftMaskChars = previousPlaceholder
      .substr(0, intersection.length)
      .split(emptyString)
      .filter(char => char !== placeholderChar)
      .length

    const leftMaskChars = placeholder
      .substr(0, intersection.length)
      .split(emptyString)
      .filter(char => char !== placeholderChar)
      .length

    const masklengthChanged = leftMaskChars !== previousLeftMaskChars

    const targetIsMaskMovingLeft = (
      previousPlaceholder[intersection.length - 1] !== undefined &&
      placeholder[intersection.length - 2] !== undefined &&
      previousPlaceholder[intersection.length - 1] !== placeholderChar &&
      previousPlaceholder[intersection.length - 1] !== placeholder[intersection.length - 1] &&
      previousPlaceholder[intersection.length - 1] === placeholder[intersection.length - 2]
    )

    if (
      !isAddition &&
      (masklengthChanged || targetIsMaskMovingLeft) &&
      previousLeftMaskChars > 0 &&
      placeholder.indexOf(targetChar) > -1 &&
      rawValue[currentCaretPosition] !== undefined
    ) {
      trackRightCharacter = true
      targetChar = rawValue[currentCaretPosition]
    }

    const pipedChars = indexesOfPipedChars.map((index) => normalizedConformedValue[index])
    const countTargetCharInPipedChars = pipedChars.filter((char) => char === targetChar).length
    const countTargetCharInIntersection = intersection.filter((char) => char === targetChar).length

    const countTargetCharInPlaceholder = placeholder
      .substr(0, placeholder.indexOf(placeholderChar))
      .split(emptyString)
      .filter((char, index) => (
        char === targetChar &&
        rawValue[index] !== char
      ))
      .length

    const requiredNumberOfMatches = (
      countTargetCharInPlaceholder +
      countTargetCharInIntersection +
      countTargetCharInPipedChars +
      (trackRightCharacter ? 1 : 0)
    )

    let numberOfEncounteredMatches = 0
    for (let i = 0; i < conformedValueLength; i++) {
      const conformedValueChar = normalizedConformedValue[i]

      startingSearchIndex = i + 1

      if (conformedValueChar === targetChar) {
        numberOfEncounteredMatches++
      }

      if (numberOfEncounteredMatches >= requiredNumberOfMatches) {
        break
      }
    }
  }

  if (isAddition) {
    let lastPlaceholderChar = startingSearchIndex

    for (let i = startingSearchIndex; i <= placeholderLength; i++) {
      if (placeholder[i] === placeholderChar) {
        lastPlaceholderChar = i
      }

      if (
        placeholder[i] === placeholderChar ||
        caretTrapIndexes.indexOf(i) !== -1 ||
        i === placeholderLength
      ) {
        return lastPlaceholderChar
      }
    }
  } else {
    if (trackRightCharacter) {
      for (let i = startingSearchIndex - 1; i >= 0; i--) {
        if (
          conformedValue[i] === targetChar ||
          caretTrapIndexes.indexOf(i) !== -1 ||
          i === 0
        ) {
          return i
        }
      }
    } else {
      for (let i = startingSearchIndex; i >= 0; i--) {
        if (
          placeholder[i - 1] === placeholderChar ||
          caretTrapIndexes.indexOf(i) !== -1 ||
          i === 0
        ) {
          return i
        }
      }
    }
  }
}
