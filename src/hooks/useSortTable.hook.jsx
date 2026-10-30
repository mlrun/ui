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
import { useCallback, useEffect, useMemo, useState } from 'react'
import { isEmpty, isEqual, isNumber, orderBy } from 'lodash-es'

import ArrowIcon from 'igz-controls/images/back-arrow.svg?react'

const defaultSortConfig = {}

export const useSortTable = ({ headers, content, sortConfig = defaultSortConfig }) => {
  const [direction, setDirection] = useState('')
  const [selectedColumnName, setSelectedColumnName] = useState('')
  const [config, setConfig] = useState(sortConfig)

  // As before: callers pass `sortConfig` inline, keep it stable while its values don't change
  if (!isEqual(config, sortConfig)) {
    setConfig(sortConfig)
  }

  const {
    allowSortBy = null,
    excludeSortBy = null,
    defaultSortBy = null,
    defaultDirection = null
  } = config

  const isDateValid = date => {
    const dateString = String(date)

    if (Date.parse(dateString)) {
      return !(dateString.match(/-/g) && !dateString.split('-').every(char => isNumber(char)))
    }

    return false
  }

  const getValueByType = useCallback(
    columnIndex => rowData => {
      const rowDataContent = rowData.content ? rowData.content : rowData

      if (
        rowDataContent[columnIndex] instanceof Object &&
        Object.keys(rowDataContent[columnIndex]).length
      ) {
        let valueToTest = rowDataContent[columnIndex].value

        if (!isEmpty(valueToTest) || isNumber(valueToTest)) {
          if (valueToTest instanceof Array && valueToTest.length > 0) {
            if (valueToTest[0].match(/:/g)) {
              return valueToTest[0].split(':')[0].trim()
            }

            return valueToTest[0]
          } else if (typeof valueToTest === 'string' && isDateValid(valueToTest)) {
            return new Date(valueToTest)
          } else {
            return valueToTest
          }
        }
      }

      return isNumber(parseFloat(rowData[columnIndex]))
        ? parseFloat(rowData[columnIndex])
        : isDateValid(rowData[columnIndex])
          ? new Date(rowData[columnIndex])
          : rowData[columnIndex]
    },
    []
  )

  const isSortableByIndex = useCallback(() => {
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

      if (!item) return false

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
    const isSortByIndex = isSortableByIndex()

    return headers.map((headerItem, idx) => {
      const clearHeaderPrefix = String(headerItem.headerLabel)
        .replace(/^.+\./, '')
        .toLocaleLowerCase()

      return {
        ...headerItem,
        isSortable: headerItem.headerLabel
          ? isSortable(clearHeaderPrefix, idx, isSortByIndex)
          : false
      }
    })
  }, [isSortableByIndex, headers, isSortable])

  // Default sort while the user hasn't chosen one (`null` when there is none)
  const defaultSort = useMemo(() => {
    if (defaultSortBy === null || (direction && !defaultDirection) || content.length === 0) {
      return null
    }

    const columnName = selectedColumnName
      ? selectedColumnName
      : isNumber(defaultSortBy)
        ? headers[defaultSortBy]?.headerId
        : defaultSortBy

    return columnName ? { columnName, sortDirection: defaultDirection || 'asc' } : null
  }, [content.length, defaultDirection, defaultSortBy, direction, headers, selectedColumnName])

  const { columnName: activeColumnName, sortDirection: activeSortDirection } =
    direction && selectedColumnName
      ? { columnName: selectedColumnName, sortDirection: direction }
      : (defaultSort ?? { columnName: '', sortDirection: '' })

  // Store the default sort as the selected one, so the next click on its header toggles the direction
  useEffect(() => {
    if ((direction && selectedColumnName) || !defaultSort) {
      return
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- keeps the header toggle in sync with the default sort
    setSelectedColumnName(defaultSort.columnName)
    setDirection(defaultSort.sortDirection)
  }, [defaultSort, direction, selectedColumnName])

  const sortedTableContent = useMemo(() => {
    if (!activeColumnName || !activeSortDirection) {
      return content
    }

    const columnIndex = headers?.findIndex(header => header.headerId === activeColumnName)

    if (columnIndex === -1) {
      return content
    }

    return orderBy(content, getValueByType(columnIndex), activeSortDirection)
  }, [activeColumnName, activeSortDirection, content, getValueByType, headers])

  const sortedTableHeaders = useMemo(() => {
    if (headers?.length > 0 && (excludeSortBy || allowSortBy)) {
      return getSortableHeaders()
    }

    return headers
  }, [allowSortBy, excludeSortBy, getSortableHeaders, headers])

  const sortTable = useCallback(
    (columnName, existingDirection) => {
      const sortDirection = existingDirection
        ? existingDirection
        : columnName === selectedColumnName && direction === 'asc'
          ? 'desc'
          : 'asc'

      setSelectedColumnName(columnName)
      setDirection(sortDirection)
    },
    [direction, selectedColumnName]
  )

  const getSortingIcon = headerId => {
    return (
      <ArrowIcon
        className={`sort-icon ${
          selectedColumnName === headerId && direction === 'asc' ? 'sort-icon_up' : 'sort-icon_down'
        }`}
      />
    )
  }

  return { sortTable, selectedColumnName, getSortingIcon, sortedTableContent, sortedTableHeaders }
}
