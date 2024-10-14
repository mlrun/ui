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
import { useCallback, useEffect, useState, useMemo } from 'react'
import { isEmpty, isNumber, orderBy, isEqual } from 'lodash'

import { ReactComponent as ArrowIcon } from 'igz-controls/images/back-arrow.svg'

export const useSortTable = ({ headers, content, sortConfig = {} }) => {
  const [direction, setDirection] = useState('')
  const [selectedColumnName, setSelectedColumnName] = useState('')
  const [sortedTableContent, setSortedTableContent] = useState(content)
  const [sortedTableHeaders, setSortedTableHeaders] = useState(headers)
  const [config, setConfig] = useState(sortConfig)

  const {
    allowSortBy = null,
    excludeSortBy = null,
    defaultSortBy = null,
    defaultDirection = null
  } = useMemo(() => config, [config])

  useEffect(() => {
    if(!isEqual(config, sortConfig)) {
      setConfig(sortConfig)
    }
  }, [sortConfig, config])

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

  const sortTable = useCallback(
    (columnName, existingDirection) => {
      const sortDirection = existingDirection
        ? existingDirection
        : columnName === selectedColumnName && direction === 'asc'
        ? 'desc'
        : 'asc'

      const columnIndex = headers && headers.findIndex(header => header.headerId === columnName)

      if (columnName) {
        const sorted = orderBy(content, getValueByType(columnIndex), sortDirection)

        setSortedTableContent(prevState => {
          return isEqual(prevState, sorted) ? prevState : sorted
        })
      }

      setSelectedColumnName(columnName)
      setDirection(sortDirection)
    },
    [content, direction, headers, selectedColumnName, getValueByType]
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

  useEffect(() => {
    if (direction && selectedColumnName) {
      sortTable(selectedColumnName, direction)
    } else if (defaultSortBy !== null && (!direction || defaultDirection) && content.length > 0) {
      sortTable(
        selectedColumnName
          ? selectedColumnName
          : isNumber(defaultSortBy)
          ? headers[defaultSortBy].headerId
          : defaultSortBy,
        defaultDirection
      )
    } else {
      setSortedTableContent(content)
    }
  }, [content, defaultDirection, defaultSortBy, direction, headers, selectedColumnName, sortTable])

  useEffect(() => {
    if (headers && headers.length > 0 && (excludeSortBy || allowSortBy)) {
      const header = getSortableHeaders()

      setSortedTableHeaders(header)
    }
  }, [allowSortBy, excludeSortBy, getSortableHeaders, headers])

  return { sortTable, selectedColumnName, getSortingIcon, sortedTableContent, sortedTableHeaders }
}
