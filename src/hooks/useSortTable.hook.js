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
import { isNumber, orderBy } from 'lodash'

import { ReactComponent as ArrowIcon } from 'igz-controls/images/back-arrow.svg'

export const useSortTable = (tableHeaders, tableContent, defaultSortBy) => {
  const [direction, setDirection] = useState(null)
  const [selectedColumnName, setSelectedColumnName] = useState(null)
  const [sortedTableContent, setSortedTableContent] = useState(tableContent)

  const handleTableSorting = useCallback(
    (columnName, sortDirection) => {
      const columnIndex = tableHeaders.findIndex(header => header.id === columnName)

      if (columnName) {
        const sorted = orderBy(
          tableContent,
          rowData =>
            isNumber(parseFloat(rowData[columnIndex]))
              ? parseFloat(rowData[columnIndex])
              : rowData[columnIndex],
          sortDirection
        )

        setSortedTableContent(sorted)
      }
    },
    [tableContent, tableHeaders]
  )

  const handleSortingChange = useCallback(
    columnName => {
      const sortDirection =
        columnName === selectedColumnName && direction === 'desc' ? 'asc' : 'desc'

      setSelectedColumnName(columnName)
      setDirection(sortDirection)
      handleTableSorting(columnName, sortDirection)
    },
    [direction, handleTableSorting, selectedColumnName]
  )

  const getSortingIcon = id => {
    return (
      <ArrowIcon
        className={`sort-icon ${
          selectedColumnName === id && direction === 'asc' ? 'sort-icon_up' : 'sort-icon_down'
        }`}
      />
    )
  }

  useEffect(() => {
    if (defaultSortBy !== null && !direction) {
      handleSortingChange(isNumber(defaultSortBy) ? tableHeaders[defaultSortBy].id : defaultSortBy)
    }
  }, [defaultSortBy, direction, handleSortingChange, tableHeaders])

  return [handleSortingChange, selectedColumnName, getSortingIcon, sortedTableContent]
}
