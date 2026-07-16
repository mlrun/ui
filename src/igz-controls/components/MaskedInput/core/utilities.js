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

import { placeholderChar as defaultPlaceholderChar } from './constants'

const emptyArray = []

export function convertMaskToPlaceholder(
  mask = emptyArray,
  placeholderChar = defaultPlaceholderChar
) {
  if (!isArray(mask)) {
    throw new Error('Text-mask:convertMaskToPlaceholder; The mask property must be an array.')
  }

  if (mask.indexOf(placeholderChar) !== -1) {
    throw new Error(
      'Placeholder character must not be used as part of the mask. Please specify a character ' +
        'that is not present in your mask as your placeholder character.\n\n' +
        `The placeholder character that was received is: ${JSON.stringify(placeholderChar)}\n\n` +
        `The mask that was received is: ${JSON.stringify(mask)}`
    )
  }

  return mask
    .map(char => {
      return char instanceof RegExp ? placeholderChar : char
    })
    .join('')
}

const strCaretTrap = '[]'
export function processCaretTraps(mask) {
  const indexes = []

  let indexOfCaretTrap
  while (((indexOfCaretTrap = mask.indexOf(strCaretTrap)), indexOfCaretTrap !== -1)) {
    indexes.push(indexOfCaretTrap)

    mask.splice(indexOfCaretTrap, 1)
  }

  return { maskWithoutCaretTraps: mask, indexes }
}
