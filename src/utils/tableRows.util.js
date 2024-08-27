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

import { sortListByDate } from './datetime'

export const PARENT_ROW_EXPANDED_CLASS = 'parent-row_expanded'

/**
 * Checks if a row is expanded.
 * @param {React.RefObject} parentRef - Reference to the parent element.
 * @param {Object} expandedRowsData - Data of expanded rows.
 * @param {Object} rowItem - Data of the row item.
 * @returns {boolean} - True if the row is expanded, false otherwise.
 */
export const isRowExpanded = (parentRef, expandedRowsData, rowItem) => {
  return (
    parentRef.current?.classList.value.includes(PARENT_ROW_EXPANDED_CLASS) ||
    (expandedRowsData && rowItem.data.ui.identifier in expandedRowsData)
  )
}

/**
 * Auto expand table row.
 * @param {string} name - Row name.
 * @param {Array} itemsList - List of table items.
 * @param {string} projectName - Project name.
 * @param {function} setExpandedRowsData - Function that set expanded data in state.
 * @param {function} createRowData - Function that create parsed row data.
 * @param {string} sortBy - Field by witch we will sort items
 * @returns {void}
 */
export const expandRowByName = (
  name,
  itemsList,
  projectName,
  setExpandedRowsData,
  createRowData,
  sortListBy
) => {
  if (name) {
    const filteredItems = itemsList.filter(
      artifact => artifact?.db_key === name || artifact.name === name
    )

    if (filteredItems.length) {
      setExpandedRowsData(state => ({
        ...state,
        [filteredItems[0]?.ui?.identifier || name]: {
          content: (sortListBy ? sortListByDate(filteredItems, sortListBy, false) : filteredItems).map(artifact =>
            createRowData(artifact, projectName)
          )
        },
        error: null,
        loading: false
      }))
    }
  }
}
