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
import { useCallback, useState, useLayoutEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { GROUP_BY_NAME, GROUP_BY_NONE } from '../constants'
import { PARENT_ROW_EXPANDED_CLASS } from '../utils/tableRows.util'
import { generateGroupLatestItem } from '../utils/generateGroupLatestItem'
import { getPaginatedContent } from './usePagination.hook'

export const useGroupContent = (
  content,
  getIdentifier,
  collapseRowCallback,
  expandRowCallback,
  selectedItem,
  page,
  pageTab,
  toggleAllRowsCallback,
  paginationConfig = null
) => {
  const [groupedContent, setGroupedContent] = useState({})
  const [latestItems, setLatestItems] = useState([])
  const [expandedRowsCount, setExpandedRowsCount] = useState(0)
  const [allRowsAreExpanded, setAllRowsAreExpanded] = useState(false)
  const params = useParams()
  const filtersStore = useSelector(store => store.filtersStore)

  const toggleAllRowsByContent = useCallback(
    (collapseRows, groupedContentLocal) => {
      if (filtersStore.groupBy !== GROUP_BY_NONE) {
        const rows = [...document.getElementsByClassName('parent-row')]

        if (collapseRows) {
          rows.forEach(row => row.classList.remove(PARENT_ROW_EXPANDED_CLASS))

          setExpandedRowsCount(0)
          toggleAllRowsCallback && toggleAllRowsCallback(true)
        } else {
          rows.forEach(row => row.classList.add(PARENT_ROW_EXPANDED_CLASS))

          setExpandedRowsCount(Object.keys(groupedContentLocal).length)
          toggleAllRowsCallback && toggleAllRowsCallback(false, groupedContentLocal)
        }
      }
    },
    [filtersStore.groupBy, toggleAllRowsCallback]
  )

  const toggleAllRows = useCallback(
    collapseRows => {
      toggleAllRowsByContent(collapseRows, groupedContent)
    },
    [groupedContent, toggleAllRowsByContent]
  )

  const handleGroupByName = useCallback(() => {
    const groupedItems = {}

    if (paginationConfig && paginationConfig.isNewResponse) {
      const pageContent = getPaginatedContent(content, paginationConfig)

      pageContent.forEach(contentItem => {
        const identifier = getIdentifier(contentItem)

        groupedItems[identifier] ??= []
        groupedItems[identifier].push(contentItem)
      })

      setGroupedContent(groupedItems)
      setLatestItems(generateGroupLatestItem(groupedItems, getIdentifier, selectedItem))
      toggleAllRowsByContent(false, groupedItems)
    } else if (!paginationConfig) {
      content.forEach(contentItem => {
        const identifier = getIdentifier(contentItem)

        groupedItems[identifier] ??= []
        groupedItems[identifier].push(contentItem)
      })

      setGroupedContent(groupedItems)
      setLatestItems(generateGroupLatestItem(groupedItems, getIdentifier, selectedItem))
    }
  }, [content, getIdentifier, paginationConfig, selectedItem, toggleAllRowsByContent])

  const handleGroupByNone = useCallback(() => {
    const rows = [...document.getElementsByClassName('parent-row')]

    rows.forEach(row => row.classList.remove(PARENT_ROW_EXPANDED_CLASS))

    setAllRowsAreExpanded(false)
    setGroupedContent({})
  }, [])

  const toggleRow = (e, item) => {
    const parentRow = e.target.closest('.parent-row')

    if (parentRow.classList.contains(PARENT_ROW_EXPANDED_CLASS)) {
      parentRow.classList.remove(PARENT_ROW_EXPANDED_CLASS)
      collapseRowCallback && collapseRowCallback(item)

      setExpandedRowsCount(prev => --prev)
    } else {
      parentRow.classList.remove('table-row_active')
      parentRow.classList.add(PARENT_ROW_EXPANDED_CLASS)
      expandRowCallback && expandRowCallback(item, groupedContent)

      setExpandedRowsCount(prev => ++prev)
    }
  }

  useLayoutEffect(() => {
    return () => {
      setExpandedRowsCount(0)
    }
  }, [params.jobId, params.pipelineId, content])

  useLayoutEffect(() => {
    if (Object.keys(groupedContent).length > 0) {
      setAllRowsAreExpanded(expandedRowsCount === Object.keys(groupedContent).length)
    }
  }, [expandedRowsCount, groupedContent])

  useLayoutEffect(() => {
    if (filtersStore.groupBy === GROUP_BY_NAME) {
      handleGroupByName()
    } else if (filtersStore.groupBy === GROUP_BY_NONE) {
      handleGroupByNone()
    }

    return () => {
      setGroupedContent({})
    }
  }, [handleGroupByName, handleGroupByNone, filtersStore.groupBy])

  return {
    allRowsAreExpanded,
    groupedContent,
    toggleAllRows,
    latestItems,
    toggleRow
  }
}
