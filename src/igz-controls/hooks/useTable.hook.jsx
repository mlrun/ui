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
import classnames from 'classnames'
import { useSelector } from 'react-redux'
import { isEmpty } from 'lodash-es'

import { MAIN_TABLE_ID } from '../constants'

import TableContainer from './TableContainer'

export const useTable = ({ ref, selectedItem, skipTableWrapper = false, tableClassName = '' }) => {
  const tableRefLocal = useRef(null)
  const tableBodyRefLocal = useRef(null)
  const tableRef = ref?.tableRef ?? tableRefLocal
  const tableBodyRef = ref?.tableBodyRef ?? tableBodyRefLocal
  const tableContentRef = useRef(null)
  const tablePanelRef = useRef(null)
  const tableHeadRef = useRef(null)
  const tableStore = useSelector(store => store.tableStore) ?? {}

  const tableClass = classnames(
    'table',
    'table-main',
    !isEmpty(selectedItem) && 'table-with-details',
    tableClassName && tableClassName
  )
  const tableWrapperClass = classnames(!skipTableWrapper && 'table__wrapper')

  useEffect(() => {
    const calculatePanelHeight = () => {
      if (tableHeadRef?.current && tableContentRef?.current && tablePanelRef?.current) {
        const tableContentHeight = tableContentRef.current.getBoundingClientRect().height
        const tableHeadCords = tableHeadRef.current.getBoundingClientRect()
        const panelHeight = window.innerHeight - tableHeadCords.top

        tablePanelRef.current.style.height =
          tableContentHeight > panelHeight
            ? `${panelHeight}px`
            : `${panelHeight - (panelHeight - tableContentHeight)}px`
      }
    }

    if (tableStore.isTablePanelOpen && tablePanelRef.current) {
      calculatePanelHeight()

      document.getElementById('main-wrapper').addEventListener('scroll', calculatePanelHeight)
      window.addEventListener('resize', calculatePanelHeight)
    }
    return () => {
      window.removeEventListener('scroll', calculatePanelHeight)
      window.removeEventListener('resize', calculatePanelHeight)
    }
  }, [tableStore.isTablePanelOpen])

  const handleTableHScroll = useCallback(
    e => {
      if (tableRef.current) {
        const tableScrollPosition = e.target.scrollLeft

        if (tableScrollPosition > 0) {
          tableRef.current.classList.add('table__scrolled')
        } else {
          tableRef.current.classList.remove('table__scrolled')
        }
      }
    },
    [tableRef]
  )

  useEffect(() => {
    window.addEventListener('scroll', handleTableHScroll, true)

    return () => window.removeEventListener('scroll', handleTableHScroll, true)
  }, [handleTableHScroll])

  return {
    TableContainer,
    tableBodyRef,
    tableClass,
    tableContentRef,
    tableHeadRef,
    tablePanelRef,
    tableRef,
    tableStore,
    tableWrapperClass
  }
}

export const useTableScroll = ({
  content,
  selectedItem,
  isAllVersions,
  tableId = MAIN_TABLE_ID
}) => {
  const lastSelectedItemDataRef = useRef(null)
  const itemIdentifierKey = useMemo(
    () => (isAllVersions ? 'identifierUnique' : 'identifier'),
    [isAllVersions]
  )

  const handleSelectItemChanges = useCallback(
    (identifier, content, async = false) => {
      const selectedItemIndex = content?.findIndex(
        item => item?.ui?.[itemIdentifierKey] === identifier
      )

      const triggerScroll = () => {
        const tableElement = document.getElementById(tableId)

        if (selectedItemIndex && tableElement) {
          const rows = tableElement.getElementsByTagName('tr')

          if (selectedItemIndex <= rows.length) {
            const theadHeight =
              tableElement.querySelector('thead')?.getBoundingClientRect().height ?? 0
            const rowRect = rows[selectedItemIndex].getBoundingClientRect()
            const tableRect = tableElement.getBoundingClientRect()
            const rowCenterY = rowRect.height / 2
            const tableCenterY = (tableRect.height - theadHeight) / 2
            const heightToRow = rowRect.height * (selectedItemIndex + 1)
            const scrollY = heightToRow - rowCenterY - tableCenterY

            tableElement.scrollTo({
              top: scrollY
            })
          }
        }
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
    [itemIdentifierKey, tableId]
  )

  useEffect(() => {
    try {
      if (!isEmpty(selectedItem)) {
        if (!lastSelectedItemDataRef.current) {
          lastSelectedItemDataRef.current = selectedItem.ui
          handleSelectItemChanges(selectedItem?.ui?.[itemIdentifierKey], content, true)
        } else {
          lastSelectedItemDataRef.current = selectedItem.ui
        }
      } else if (lastSelectedItemDataRef.current) {
        handleSelectItemChanges(lastSelectedItemDataRef.current?.[itemIdentifierKey], content)

        lastSelectedItemDataRef.current = null
      }
    } catch {
      lastSelectedItemDataRef.current = null
    }
  }, [selectedItem, content, handleSelectItemChanges, itemIdentifierKey])

  useEffect(() => {
    return () => {
      lastSelectedItemDataRef.current = null
    }
  }, [content])
}
