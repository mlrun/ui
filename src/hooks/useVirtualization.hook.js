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
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { isEmpty, isEqual, sum, throttle } from 'lodash'
import { MAIN_TABLE_ID, MAIN_TABLE_BODY_ID } from 'igz-controls/constants'

const HIDDEN_RENDER_ITEMS_LENGTH = 5
const virtualizationConfigInitialState = {
  startIndex: -1,
  endIndex: -1,
  tableBodyPaddingTop: 0
}

/**
 * Checks if a row is rendered based on the provided virtualization configuration and row index.
 * @param {Object} virtualizationConfig - The virtualization configuration object containing start and end indices.
 * @param {number} rowIndex - The index of the row to check.
 * @returns {boolean} True if the row is rendered, otherwise false.
 */
export const isRowRendered = (virtualizationConfig, rowIndex) => {
  return rowIndex >= virtualizationConfig.startIndex && rowIndex <= virtualizationConfig.endIndex
}

/**
 * Calculates the heights of rows based on the provided table content, selected item, row data, and row heights.
 * @param {Array} tableContent - Array containing content for each row.
 * @param {Object} selectedItem - The selected item.
 * @param {Object} expandedRowsData - Object representing currently expanded items.
 * @param {number} rowHeight - The height of a regular row.
 * @param {number} rowHeightExtended - The height of an extended row.
 * @returns {Array} An array containing the calculated heights of rows.
 */
export const getRowsSizes = (
  tableContent,
  selectedItem,
  expandedRowsData,
  rowHeight,
  rowHeightExtended
) => {
  const baseRowHeight = isEmpty(selectedItem) ? rowHeight : rowHeightExtended

  return tableContent.map(contentItem => {
    const expandedRowData = expandedRowsData?.[contentItem.data.ui.identifier]

    if (!expandedRowData) {
      return baseRowHeight
    } else if (!expandedRowData.content || expandedRowData.loading) {
      return rowHeight
    } else {
      return expandedRowData.content.reduce(accumulatedHeight => {
        return (accumulatedHeight += baseRowHeight)
      }, rowHeight)
    }
  })
}

/**
 * Hook for scrolling a table to a selected item.
 * @param {Object} options - Options object.
 * @param {React.RefObject} options.tableRef - Ref object for the table element.
 * @param {Object[]} options.content - Array containing content for each row.
 * @param {Object{}} options.selectedItem - Object representing the currently selected item.
 * @param {Object} options.expandedRowsData - Object containing data for expanded rows.
 * @param {string|number} options.rowHeight - Height of a regular row.
 * @param {string|number} options.rowHeightExtended - Height of an extended row.
 * @param {string|number} options.headerRowHeight - Height of an table header.
 * @param {boolean} options.useHook - Bool indicate if trigger the hooks logic.
 * @returns {void}
 */
const useTableScroll = ({
  rowHeight,
  rowHeightExtended,
  headerRowHeight,
  selectedItem,
  expandedRowsData,
  content,
  activateHook
}) => {
  const lastSelectedItemDataRef = useRef(null)

  const getSpaceToSelectedItem = useCallback(
    (lastSelectedItemData, tableElement) => {
      const baseRowHeight = isEmpty(selectedItem) ? rowHeight : rowHeightExtended
      const tableHeight = tableElement?.offsetHeight
      const rowsSizes = getRowsSizes(
        content,
        selectedItem,
        expandedRowsData,
        rowHeight,
        rowHeightExtended
      )
      let spaceToSelectedItem =
        sum(rowsSizes.slice(0, lastSelectedItemData.index)) -
        (tableHeight ? (tableHeight - headerRowHeight) / 2 - baseRowHeight / 2 : 0)

      if (!isEmpty(lastSelectedItemData?.expandedRowData?.content)) {
        const selectedChildItemPosition =
          lastSelectedItemData?.expandedRowData?.content.findIndex(
            item => item.data.ui.identifierUnique === lastSelectedItemData.identifierUnique
          ) + 1

        if (selectedChildItemPosition > 0) {
          const diffBetweenParentRowAndOtherMainRows = baseRowHeight - rowHeight
          spaceToSelectedItem +=
            baseRowHeight * selectedChildItemPosition - diffBetweenParentRowAndOtherMainRows
        }
      }

      return spaceToSelectedItem
    },
    [content, expandedRowsData, headerRowHeight, rowHeight, rowHeightExtended, selectedItem]
  )

  const handleSelectItemChanges = useCallback(
    (identifier, content, getSpaceToSelectedItem, async = false) => {
      const selectedItemIndex = content.findIndex(item => item.data.ui.identifier === identifier)
      const triggerScroll = () => {
        const tableElement = document.getElementById(MAIN_TABLE_ID)

        tableElement?.scroll({
          top: getSpaceToSelectedItem(
            {
              ...lastSelectedItemDataRef.current,
              index: selectedItemIndex
            },
            tableElement
          )
        })
      }

      if (selectedItemIndex >= 0) {
        if (async) {
          requestAnimationFrame(() => {
            triggerScroll()
          })
        } else {
          triggerScroll()
        }
      }
    },
    []
  )

  useEffect(() => {
    if (!activateHook) return

    try {
      if (!isEmpty(selectedItem)) {
        if (!lastSelectedItemDataRef.current) {
          lastSelectedItemDataRef.current = {
            ...selectedItem?.ui,
            expandedRowData: expandedRowsData[selectedItem?.ui?.identifier]
          }
          handleSelectItemChanges(
            selectedItem?.ui?.identifier,
            content,
            getSpaceToSelectedItem,
            true
          )
        } else {
          lastSelectedItemDataRef.current = {
            ...selectedItem?.ui,
            expandedRowData: expandedRowsData[selectedItem?.ui?.identifier]
          }
        }
      } else if (lastSelectedItemDataRef.current && isEmpty(selectedItem)) {
        handleSelectItemChanges(
          lastSelectedItemDataRef.current?.identifier,
          content,
          getSpaceToSelectedItem
        )

        lastSelectedItemDataRef.current = null
      }
    } catch {
      lastSelectedItemDataRef.current = null
    }
  }, [
    content,
    getSpaceToSelectedItem,
    selectedItem,
    expandedRowsData,
    activateHook,
    handleSelectItemChanges
  ])
}

/**
 * Hook for virtualizing a table.
 * @param {Object} options - Options object.
 * @param {any} [options.renderTriggerItem] - item that will trigger calculation of the virtualization config.
 * @param {number[]} [options.rowsSizes=[]] - Array containing the heights of each row.
 * @param {Object} [options.rowsData={}] - Object containing data related to rows.
 * @param {Object[]} options.rowsData.content - Array containing content for each row.
 * @param {Object} options.rowsData.selectedItem - Object representing the currently selected item.
 * @param {Object} options.rowsData.expandedRowsData - Object containing data for expanded rows.
 * @param {Object} options.heightData - Object containing height-related data.
 * @param {string|number} options.heightData.rowHeight - Height of a regular row.
 * @param {string|number} options.heightData.rowHeightExtended - Height of an extended row.
 * @param {string|number} options.heightData.headerRowHeight - Height of the table header row.
 * @param {boolean} options.activateTableScroll - Boolean indicator for useTableScroll hook.
 * @param {string|number} options.tableId - Custom table ID.
 * @param {string|number} options.tableBodyId - Custom table body ID.
 * @param {boolean} options.ignoreHorizontalScroll - Boolean indicator for ignoring horizontal scroll event
 * @returns {Object} - Object containing virtualization configuration.
 */
const rowsDataDefault = {
  content: []
}
const rowsSizesDefault = []

export const useVirtualization = ({
  renderTriggerItem,
  rowsSizes = rowsSizesDefault,
  rowsData = rowsDataDefault,
  heightData: { rowHeight = 0, rowHeightExtended = 0, headerRowHeight = 0 },
  activateTableScroll = false,
  tableId = null,
  tableBodyId = null,
  ignoreHorizontalScroll = false
}) => {
  const [virtualizationConfig, setVirtualizationConfig] = useState(virtualizationConfigInitialState)
  const [rowsSizesLocal, setRowsSizesLocal] = useState(rowsSizes)
  const rowHeightLocal = useMemo(() => parseInt(rowHeight), [rowHeight])
  const extendedRowHeightLocal = useMemo(() => parseInt(rowHeightExtended), [rowHeightExtended])
  const headerRowHeightLocal = useMemo(() => parseInt(headerRowHeight), [headerRowHeight])
  const prevScrollTop = useRef(null)

  useLayoutEffect(() => {
    if (isEmpty(rowsData.content) && !isEqual(rowsSizes, rowsSizesLocal)) {
      queueMicrotask(() => {
        setRowsSizesLocal(rowsSizes)
      })
    }
  }, [rowsSizesLocal, rowsData, rowsSizes])

  useLayoutEffect(() => {
    if (!isEmpty(rowsData.content)) {
      const newRowsSizes = getRowsSizes(
        rowsData.content,
        rowsData.selectedItem,
        rowsData.expandedRowsData,
        rowHeightLocal,
        extendedRowHeightLocal
      )

      if (!isEqual(rowsSizesLocal, newRowsSizes)) {
        queueMicrotask(() => {
          setRowsSizesLocal(newRowsSizes)
        })
      }
    }
  }, [
    extendedRowHeightLocal,
    rowsSizesLocal,
    rowHeightLocal,
    rowsData.content,
    rowsData.selectedItem,
    rowsData.expandedRowsData
  ])

  useLayoutEffect(() => {
    const tableElement = document.getElementById(tableId || MAIN_TABLE_ID)
    const tableBodyElement = document.getElementById(tableBodyId || MAIN_TABLE_BODY_ID)
    const elementsHeight = sum(rowsSizesLocal)

    const calculateVirtualizationConfig = throttle(event => {
      if (ignoreHorizontalScroll && event?.type === 'scroll') {
        if (tableElement.scrollTop === prevScrollTop.current) return
        prevScrollTop.current = tableElement.scrollTop
      }
      const scrollClientHeight = parseInt(
        tableElement.scrollTop + tableElement.clientHeight - headerRowHeightLocal
      )
      let firstVisibleItemIndex = 0
      let heightToFirstVisibleItem = 0
      let lastVisibleItemIndex = 0
      let heightToLastVisibleItem = 0

      rowsSizesLocal.some((nextElementHeight, index) => {
        heightToFirstVisibleItem += nextElementHeight

        if (heightToFirstVisibleItem > tableElement.scrollTop) {
          firstVisibleItemIndex = index
          lastVisibleItemIndex = firstVisibleItemIndex
          heightToLastVisibleItem = heightToFirstVisibleItem

          return true
        }

        return false
      })

      const lastRowExceedsScrollHeight = rowsSizesLocal
        .slice(firstVisibleItemIndex + 1)
        .some((nextElementHeight, index) => {
          if (heightToLastVisibleItem >= scrollClientHeight) return true

          heightToLastVisibleItem += nextElementHeight

          if (heightToLastVisibleItem >= scrollClientHeight) {
            lastVisibleItemIndex = index + firstVisibleItemIndex

            return true
          }

          return false
        })

      if (!lastRowExceedsScrollHeight) {
        lastVisibleItemIndex = rowsSizesLocal.length - 1
      }

      const firstRenderIndex = Math.max(firstVisibleItemIndex - HIDDEN_RENDER_ITEMS_LENGTH, 0)
      const lastRenderIndex = Math.min(
        lastVisibleItemIndex + HIDDEN_RENDER_ITEMS_LENGTH,
        rowsSizesLocal.length - 1
      )
      const tableBodyPaddingTop = Math.max(
        Math.min(
          sum(rowsSizesLocal.slice(0, firstRenderIndex)),
          elementsHeight - tableElement.clientHeight
        ),
        0
      )

      setVirtualizationConfig(() => {
        return {
          startIndex: firstRenderIndex,
          endIndex: lastRenderIndex,
          tableBodyPaddingTop
        }
      })
    }, 150)

    if (!isEmpty(tableElement) && !isEmpty(tableBodyElement)) {
      tableBodyElement.style.minHeight = `${elementsHeight}px`
      tableBodyElement.style.maxHeight = `${elementsHeight}px`

      calculateVirtualizationConfig()

      tableElement.addEventListener('scroll', calculateVirtualizationConfig)
      window.addEventListener('resize', calculateVirtualizationConfig)
    } else {
      queueMicrotask(() => {
        setVirtualizationConfig(virtualizationConfigInitialState)
      })
    }

    return () => {
      if (tableElement) {
        tableElement.removeEventListener('scroll', calculateVirtualizationConfig)
        window.removeEventListener('resize', calculateVirtualizationConfig)
      }
    }
  }, [
    renderTriggerItem,
    headerRowHeightLocal,
    rowsSizesLocal,
    rowsData.content,
    tableId,
    tableBodyId,
    ignoreHorizontalScroll
  ])

  useTableScroll({
    rowHeight: rowHeightLocal,
    rowHeightExtended: extendedRowHeightLocal,
    headerRowHeight: headerRowHeightLocal,
    selectedItem: rowsData.selectedItem,
    expandedRowsData: rowsData.expandedRowsData,
    content: rowsData.content,
    activateHook: activateTableScroll
  })

  return virtualizationConfig
}
