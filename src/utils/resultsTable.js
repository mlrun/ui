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
import { capitalize, isEmpty, isNumber } from 'lodash'

const checkSortByIndex = ({ allowSortBy, excludeSortBy }) => {
  // let isSortByIndex = false

  // if (isNumber(allowSortBy) || isNumber(excludeSortBy)) {
  //   isSortByIndex = true
  // }

  // if (Array.isArray(allowSortBy)) {
  //   isSortByIndex = allowSortBy.every(allowedIndex => isNumber(allowedIndex))
  // } else if (Array.isArray(excludeSortBy)) {
  //   isSortByIndex = excludeSortBy.every(allowedIndex => isNumber(allowedIndex))
  // }

  let isSortByIndex =
    isNumber(allowSortBy) || isNumber(excludeSortBy)
      ? true
      : Array.isArray(allowSortBy)
      ? allowSortBy.every(allowedIndex => isNumber(allowedIndex))
      : Array.isArray(excludeSortBy)
      ? excludeSortBy.every(allowedIndex => isNumber(allowedIndex))
      : false

  return isSortByIndex
}

const isSortable = (item, itemIdx, { allowSortBy, excludeSortBy, defaultSortBy, sortByIndex }) => {
  let isSortable = false

  if (item === defaultSortBy || itemIdx === defaultSortBy) {
    return true
  }

  if (sortByIndex) {
    if (!isEmpty(allowSortBy) || isNumber(allowSortBy)) {
      if (Array.isArray(allowSortBy)) {
        isSortable = allowSortBy.includes(itemIdx)
      } else {
        isSortable = itemIdx === allowSortBy
      }
    }

    if (!isEmpty(excludeSortBy) || isNumber(excludeSortBy)) {
      if (Array.isArray(excludeSortBy)) {
        isSortable = !excludeSortBy.includes(itemIdx)
      } else {
        isSortable = itemIdx !== excludeSortBy
      }
    }
  } else {
    if (!allowSortBy && !excludeSortBy) return true

    if (allowSortBy) {
      if (Array.isArray(allowSortBy)) {
        isSortable = allowSortBy.includes(item)
      } else {
        isSortable = item === allowSortBy
      }
    }

    if (excludeSortBy) {
      if (Array.isArray(excludeSortBy)) {
        isSortable = !excludeSortBy.includes(item)
      } else {
        isSortable = item !== excludeSortBy
      }
    }
  }

  return isSortable
}

export const resultsTableHeaders = (array, sortConfig) => {
  const [headers] = (array.iterationStats ?? []).slice(0, 1).map(item => {
    return [item[1], item[0]].concat(item.slice(2)).map((header, idx) => {
      const clearHeaderPrefix = String(header).replace(/^.+\./, '')
      sortConfig.sortByIndex = checkSortByIndex(sortConfig)

      return {
        id: clearHeaderPrefix,
        label: capitalize(clearHeaderPrefix),
        isSortable: isSortable(clearHeaderPrefix, idx, sortConfig)
      }
    })
  })

  return headers
}

export const resultsTableContent = array => {
  return (array.iterationStats ?? []).slice(1).map(contentItem => {
    return [contentItem[1], contentItem[0]].concat(contentItem.slice(2)).map(item => item ?? '')
  })
}
