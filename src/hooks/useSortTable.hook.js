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
import { useCallback, useEffect, useState } from 'react'
import { isEmpty, isNumber, orderBy } from 'lodash'

import { ReactComponent as ArrowIcon } from 'igz-controls/images/back-arrow.svg'

export const useSortTable = ({
  headers,
  content,
  sortConfig: { allowSortBy, excludeSortBy, defaultSortBy }
}) => {
  const [direction, setDirection] = useState(null)
  const [selectedColumnName, setSelectedColumnName] = useState(null)
  const [sortedTableContent, setSortedTableContent] = useState(content)
  const [sortedTableHeaers, setSortedTableHeader] = useState(headers)

  const checkSortByIndex = useCallback(() => {
    let isSortByIndex =
      isNumber(allowSortBy) || isNumber(excludeSortBy)
        ? true
        : Array.isArray(allowSortBy)
        ? allowSortBy.every(allowedIndex => isNumber(allowedIndex))
        : Array.isArray(excludeSortBy)
        ? excludeSortBy.every(allowedIndex => isNumber(allowedIndex))
        : false

    return isSortByIndex
  }, [allowSortBy, excludeSortBy])

  const isSortable = useCallback(
    (item, itemIdx, sortByIndex) => {
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
    },
    [allowSortBy, defaultSortBy, excludeSortBy]
  )

  const getSortableHeaders = useCallback(() => {
    const isSortByIndex = checkSortByIndex()

    return headers.map((header, idx) => {
      const clearHeaderPrefix = String(header.selector).replace(/^.+\./, '')

      return {
        ...header,
        isSortable: isSortable(clearHeaderPrefix, idx, isSortByIndex)
      }
    })
  }, [checkSortByIndex, headers, isSortable])

  const sortTable = useCallback(
    columnName => {
      const sortDirection =
        columnName === selectedColumnName && direction === 'desc' ? 'asc' : 'desc'

      const columnIndex = headers.findIndex(header => header.selector === columnName)

      if (columnName) {
        const sorted = orderBy(
          content,
          rowData =>
            isNumber(parseFloat(rowData[columnIndex]))
              ? parseFloat(rowData[columnIndex])
              : rowData[columnIndex],
          sortDirection
        )

        setSortedTableContent(sorted)
      }

      setSelectedColumnName(columnName)
      setDirection(sortDirection)
    },
    [content, direction, headers, selectedColumnName]
  )

  const getSortingIcon = selector => {
    return (
      <ArrowIcon
        className={`sort-icon ${
          selectedColumnName === selector && direction === 'asc' ? 'sort-icon_up' : 'sort-icon_down'
        }`}
      />
    )
  }

  useEffect(() => {
    if (defaultSortBy !== null && !direction) {
      sortTable(isNumber(defaultSortBy) ? headers[defaultSortBy].selector : defaultSortBy)
    }
  }, [defaultSortBy, direction, headers, sortTable])

  useEffect(() => {
    const header = getSortableHeaders()

    setSortedTableHeader(header)
  }, [getSortableHeaders])

  return [sortTable, selectedColumnName, getSortingIcon, sortedTableContent, sortedTableHeaers]
}
