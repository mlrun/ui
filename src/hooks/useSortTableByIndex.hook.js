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
import { orderBy } from 'lodash'

export const useSortTableByIndex = (tableContent, defaultIndex) => {
  const [direction, setDirection] = useState('desc')
  const [selectedColumnIndex, setSelectedColumnIndex] = useState(null)
  const [sortedTableContent, setSortedTableContent] = useState(tableContent)

  const handleSorting = (columnIdx, sortDirection) => {
    if (columnIdx !== null) {
      const sorted = orderBy(sortedTableContent, rowData => rowData[columnIdx], sortDirection)

      setSortedTableContent(sorted)
    }
  }

  const handleSortingChange = columnIdx => {
    const sortDirection = columnIdx === selectedColumnIndex && direction === 'desc' ? 'asc' : 'desc'

    setSelectedColumnIndex(columnIdx)
    setDirection(sortDirection)
    handleSorting(columnIdx, sortDirection)
  }

  useEffect(() => {
    if (defaultIndex !== null) handleSortingChange(defaultIndex)
  }, [])

  return [direction, handleSortingChange, selectedColumnIndex, sortedTableContent]
}
