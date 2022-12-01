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
import { useCallback, useState, useEffect } from 'react'
import { GROUP_BY_NAME, GROUP_BY_NONE } from '../constants'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { generateGroupLatestItem } from '../utils/generateGroupLatestItem'

export const useGroupContent = (
  content,
  getIdentifier,
  handleRemoveRequestData,
  handleRequestOnExpand,
  page,
  pageTab,
  handleExpandAllCallback
) => {
  const [groupedContent, setGroupedContent] = useState({})
  const [latestItems, setLatestItems] = useState([])
  const [expandedItems, setExpandedItems] = useState(0)
  const [expand, setExpand] = useState(false)
  const params = useParams()
  const filtersStore = useSelector(store => store.filtersStore)

  const handleGroupByName = useCallback(() => {
    const groupedItems = {}

    content.forEach(contentItem => {
      const identifier = getIdentifier(contentItem)

      groupedItems[identifier] ??= []
      groupedItems[identifier].push(contentItem)
    })

    setGroupedContent(groupedItems)
    setLatestItems(generateGroupLatestItem(page, Object.values(groupedItems), pageTab))
  }, [content, getIdentifier, page, pageTab])

  const handleGroupByNone = useCallback(() => {
    const rows = [...document.getElementsByClassName('parent-row')]

    rows.forEach(row => row.classList.remove('parent-row-expanded'))

    setExpand(false)
    setGroupedContent({})
  }, [])

  const handleExpandRow = (e, item) => {
    const parentRow = e.target.closest('.parent-row')

    if (parentRow.classList.contains('parent-row-expanded')) {
      parentRow.classList.remove('parent-row-expanded')
      handleRemoveRequestData && handleRemoveRequestData(item)

      setExpandedItems(prev => --prev)
    } else {
      parentRow.classList.remove('row_active')
      parentRow.classList.add('parent-row-expanded')
      handleRequestOnExpand && handleRequestOnExpand(item, groupedContent)

      setExpandedItems(prev => ++prev)
    }
  }

  const handleExpandAll = useCallback(
    collapseRows => {
      if (filtersStore.groupBy !== GROUP_BY_NONE) {
        const rows = [...document.getElementsByClassName('parent-row')]

        if (collapseRows || expand) {
          rows.forEach(row => row.classList.remove('parent-row-expanded'))

          setExpandedItems(0)
          handleExpandAllCallback && handleExpandAllCallback(true)
        } else {
          rows.forEach(row => row.classList.add('parent-row-expanded'))

          setExpandedItems(Object.keys(groupedContent).length)
          handleExpandAllCallback && handleExpandAllCallback(false, groupedContent)
        }
      }
    },
    [expand, filtersStore.groupBy, groupedContent, handleExpandAllCallback]
  )

  useEffect(() => {
    return () => {
      setExpandedItems(0)
    }
  }, [params.jobId, params.pipelineId, groupedContent])

  useEffect(() => {
    if (filtersStore.groupBy === GROUP_BY_NAME) {
      handleGroupByName()
    } else if (filtersStore.groupBy === GROUP_BY_NONE) {
      handleGroupByNone()
    }

    return () => {
      setGroupedContent({})
    }
  }, [handleGroupByName, handleGroupByNone, filtersStore.groupBy])

  useEffect(() => {
    if (Object.keys(groupedContent).length > 0) {
      setExpand(expandedItems === Object.keys(groupedContent).length)
    }
  }, [expandedItems, groupedContent])

  return {
    groupedContent,
    latestItems,
    expand,
    expandedItems,
    handleExpandRow,
    handleExpandAll
  }
}
