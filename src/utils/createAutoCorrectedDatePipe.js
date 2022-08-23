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
const maxValueMonth = [31, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const formatOrder = ['yyyy', 'yy', 'mm', 'dd', 'HH', 'MM', 'SS']

export const createAutoCorrectedDatePipe = (
  dateFormat = 'mm dd yyyy',
  { minYear = 1, maxYear = 9999 } = {},
  datesDivider = ' - '
) => {
  const dateFormats = dateFormat.split(datesDivider)
  const dateFormatArray = dateFormats.map(date => {
    return date
      .split(/[^dmyHMS]+/)
      .sort((a, b) => formatOrder.indexOf(a) - formatOrder.indexOf(b))
  })
  return function(conformedValue) {
    const indexesOfPipedChars = []
    const maxValue = {
      dd: 31,
      mm: 12,
      yy: 99,
      yyyy: maxYear,
      HH: 23,
      MM: 59,
      SS: 59
    }
    const minValue = { dd: 1, mm: 1, yy: 0, yyyy: minYear, HH: 0, MM: 0, SS: 0 }
    let conformedValueStrings = conformedValue.split(datesDivider)
    const conformedValueArr = conformedValueStrings.map(item => item.split(''))

    // Check first digit
    conformedValueArr.forEach((conformedValueItem, index) => {
      checkFirstDigit(
        conformedValueItem,
        dateFormats[index],
        dateFormatArray[index],
        indexesOfPipedChars,
        maxValue
      )

      conformedValueStrings[index] = conformedValueItem.join('')
    })

    // Check for invalid date
    let validityArray = conformedValueStrings.map(
      (conformedValueItem, index) => {
        return checkValidity(
          conformedValueItem,
          dateFormats[index],
          dateFormatArray[index],
          minValue,
          maxValue,
          minYear,
          maxYear
        )
      }
    )
    if (validityArray.some(isInvalid => isInvalid)) {
      return false
    }

    return {
      value: datesDivider
        ? `${conformedValueStrings[0]}${datesDivider}${conformedValueStrings[1]}`
        : conformedValueStrings[0],
      indexesOfPipedChars: datesDivider
        ? indexesOfPipedChars[0].concat(
            ...indexesOfPipedChars[1].map(
              index =>
                index +
                conformedValueStrings[0].length -
                1 +
                datesDivider.length
            )
          )
        : indexesOfPipedChars[0]
    }
  }
}

const checkFirstDigit = (
  conformedValueItem,
  dateFormat,
  dateFormatArray,
  indexesArray,
  maxValue
) => {
  let indexes = []
  dateFormatArray.forEach(format => {
    const position = dateFormat.indexOf(format)
    const maxFirstDigit = parseInt(maxValue[format].toString().substr(0, 1), 10)

    if (parseInt(conformedValueItem[position], 10) > maxFirstDigit) {
      conformedValueItem[position + 1] = conformedValueItem[position]
      conformedValueItem[position] = 0
      indexes.push(position)
    }
  })

  indexesArray.push(indexes)
}

const checkValidity = (
  conformedValueItem,
  dateFormat,
  dateFormatArray,
  minValue,
  maxValue,
  minYear,
  maxYear
) => {
  let month = 0
  return dateFormatArray.some(format => {
    const position = dateFormat.indexOf(format)
    const length = format.length
    const textValue = conformedValueItem
      .substr(position, length)
      .replace(/\D/g, '')
    const value = parseInt(textValue, 10)

    if (format === 'mm') {
      month = value || 0
    }
    const maxValueForFormat =
      format === 'dd' ? maxValueMonth[month] : maxValue[format]

    if (format === 'yyyy' && (minYear !== 1 || maxYear !== 9999)) {
      const scopedMaxValue = parseInt(
        maxValue[format].toString().substring(0, textValue.length),
        10
      )
      const scopedMinValue = parseInt(
        minValue[format].toString().substring(0, textValue.length),
        10
      )

      return value < scopedMinValue || value > scopedMaxValue
    }

    return (
      value > maxValueForFormat ||
      (textValue.length === length && value < minValue[format])
    )
  })
}
