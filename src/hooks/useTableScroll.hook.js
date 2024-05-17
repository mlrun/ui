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
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { isEmpty, sum } from 'lodash'

import { getRowsSizes } from './useVirtualization.hook'

/**
 * Hook for scrolling a table to a selected item.
 * @param {Object} options - Options object.
 * @param {React.RefObject} options.tableRef - Ref object for the table element.
 * @param {Object[]} options.content - Array containing content for each row.
 * @param {Object{}} options.selectedItem - Object representing the currently selected item.
 * @param {Object} options.expandedRowsData - Object containing data for expanded rows.
 * @param {string|number} options.rowHeight - Height of a regular row.
 * @param {string|number} options.rowHeightExtended - Height of an extended row.
 * @returns {void}
 */
export const useTableScroll = ({
  rowHeight,
  rowHeightExtended,
  selectedItem,
  expandedRowsData,
  content,
  tableRef
}) => {
  const lastSelectedItemDataRef = useRef(null)
  const selectedItemTopPositionBeforeRerender = useRef(null)
  const rowHeightLocal = useMemo(() => parseInt(rowHeight), [rowHeight])
  const extendedRowHeightLocal = useMemo(() => parseInt(rowHeightExtended), [rowHeightExtended])

  const getSpaceToTableTop = useCallback(
    lastSelectedItemData => {
      const rowsSizes = getRowsSizes(
        content,
        selectedItem,
        expandedRowsData,
        rowHeightLocal,
        extendedRowHeightLocal
      )
      let spaceFromSelectedItemToHeader = 0

      if (selectedItemTopPositionBeforeRerender.current) {
        const headerBottomPosition = tableRef.current
          .querySelector('thead')
          ?.getBoundingClientRect().bottom

        if (headerBottomPosition) {
          spaceFromSelectedItemToHeader =
            selectedItemTopPositionBeforeRerender.current - headerBottomPosition
        }
      }

      let spaceToRow =
        sum(rowsSizes.slice(0, lastSelectedItemData.index)) - spaceFromSelectedItemToHeader

      if (!isEmpty(lastSelectedItemData?.expandedRowData?.content)) {
        const selectedItemPosition =
          lastSelectedItemData?.expandedRowData?.content.findIndex(
            item => item.data.ui.identifierUnique === lastSelectedItemData.identifierUnique
          ) + 1

        if (selectedItemPosition > 0) {
          const baseRowHeight = isEmpty(selectedItem) ? rowHeightLocal : extendedRowHeightLocal
          const diffBetweenParentRowAndOtherMainRows = baseRowHeight - rowHeightLocal
          spaceToRow += baseRowHeight * selectedItemPosition - diffBetweenParentRowAndOtherMainRows
        }
      }

      return spaceToRow
    },
    [content, expandedRowsData, extendedRowHeightLocal, rowHeightLocal, selectedItem, tableRef]
  )

  useEffect(() => {
    const itemSelectHandler = event => {
      selectedItemTopPositionBeforeRerender.current = event.detail?.top
    }
    window.addEventListener('selectedTableRow', itemSelectHandler)

    return () => {
      window.removeEventListener('selectedTableRow', itemSelectHandler)
    }
  }, [selectedItem])

  useEffect(() => {
    try {
      if (!lastSelectedItemDataRef.current && !isEmpty(selectedItem)) {
        const selectedItemIndex = content.findIndex(
          item => item.data.ui.identifier === selectedItem?.ui?.identifier
        )

        const lastSelectedItemData = {
          ...selectedItem?.ui,
          index: selectedItemIndex,
          expandedRowData: expandedRowsData[selectedItem?.ui?.identifier]
        }

        if (selectedItemIndex >= 0) {
          requestAnimationFrame(() => {
            tableRef.current?.scroll({ top: getSpaceToTableTop(lastSelectedItemData) })
          })
          lastSelectedItemDataRef.current = lastSelectedItemData
        }
      } else if (lastSelectedItemDataRef.current && isEmpty(selectedItem)) {
        tableRef.current?.scroll({ top: getSpaceToTableTop(lastSelectedItemDataRef.current) })
        lastSelectedItemDataRef.current = null
      }
    } catch (e) {
      console.warn('useTableScrollHook:: Error during table scroll attempt', e)
    }
  }, [content, getSpaceToTableTop, selectedItem, tableRef, expandedRowsData])
}

/**
 * Function that dispatches custom event with selected table row position
 * @param {Object}  - Event object.
 * @returns {void}
 */
export const dispatchItemSelectEvent = event => {
  const selectedItemRect = event.target?.closest('tr')?.getBoundingClientRect()
  window.dispatchEvent(new CustomEvent('selectedTableRow', { detail: selectedItemRect }))
}
