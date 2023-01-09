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
import { useEffect, useState } from 'react'
import { isNumber, orderBy } from 'lodash'
import { useCallback } from 'react'

export const useSortTable = (tableHeaders, tableContent, defaultSortBy) => {
  const [direction, setDirection] = useState('desc')
  const [selectedColumnName, setSelectedColumnName] = useState(null)
  const [sortedTableContent, setSortedTableContent] = useState(tableContent)

  const handleTableSorting = useCallback(
    (columnName, sortDirection) => {
      const columnIndex = tableHeaders.findIndex(header => header.id === columnName)

      if (columnName && columnName !== null) {
        const sorted = orderBy(
          sortedTableContent,
          rowData =>
            isNumber(parseFloat(rowData[columnIndex]))
              ? parseFloat(rowData[columnIndex])
              : rowData[columnIndex],
          sortDirection
        )

        setSortedTableContent(sorted || sortedTableContent)
      }
    },
    [sortedTableContent, tableHeaders]
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

  useEffect(() => {
    if (defaultSortBy !== null) {
      handleSortingChange(isNumber(defaultSortBy) ? tableHeaders[defaultSortBy].id : defaultSortBy)
    }
  }, [defaultSortBy])

  return [direction, handleSortingChange, selectedColumnName, sortedTableContent]
}
