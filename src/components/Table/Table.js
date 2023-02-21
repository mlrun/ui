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
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { connect, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'
import { useParams } from 'react-router-dom'

import TableView from './TableView'

import { useMode } from '../../hooks/mode.hook'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import { generateTableContent } from '../../utils/generateTableContent'
import { generateGroupLatestItem } from '../../utils/generateGroupLatestItem'
import { ACTIONS_MENU } from '../../types'
import { GROUP_BY_NAME, GROUP_BY_NONE, MONITOR_JOBS_TAB, SCHEDULE_TAB } from '../../constants'

import './table.scss'

const Table = ({
  actionsMenu,
  applyDetailsChanges,
  applyDetailsChangesCallback,
  children,
  content,
  detailsFormInitialValues,
  filtersStore,
  getCloseDetailsLink,
  groupedContent,
  handleCancel,
  handleExpandRow,
  handleSelectItem,
  pageData,
  retryRequest,
  selectedItem,
  tab,
  tableHeaders
}) => {
  const [tableContent, setTableContent] = useState({
    groupLatestItem: [],
    groupWorkflowItems: [],
    content: [],
    mainRowItemsCount: 1
  })
  const tableContentRef = useRef(null)
  const tablePanelRef = useRef(null)
  const tableHeadRef = useRef(null)
  const { isStagingMode } = useMode()
  const params = useParams()
  const tableStore = useSelector(store => store.tableStore)

  useEffect(() => {
    const calculatePanelHeight = () => {
      if (tableHeadRef && tableContentRef && tablePanelRef.current) {
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

  useLayoutEffect(() => {
    const generatedTableContent = generateTableContent(
      content,
      groupedContent,
      filtersStore.groupBy,
      pageData.page,
      tableStore.isTablePanelOpen,
      params,
      isStagingMode,
      !isEveryObjectValueEmpty(selectedItem)
    )

    if (filtersStore.groupBy === GROUP_BY_NAME) {
      setTableContent({
        content: generatedTableContent,
        groupLatestItem: generateGroupLatestItem(
          pageData.page,
          generatedTableContent,
          params.pageTab
        ),
        groupWorkflowItems: [],
        mainRowItemsCount: pageData.mainRowItemsCount ?? 1
      })
    } else if (filtersStore.groupBy === GROUP_BY_NONE) {
      setTableContent(state => ({
        ...state,
        groupLatestItem: [],
        groupWorkflowItems: [],
        content: generatedTableContent
      }))
    }
  }, [
    content,
    filtersStore.groupBy,
    groupedContent,
    isStagingMode,
    params,
    pageData.mainRowItemsCount,
    pageData.page,
    selectedItem,
    tableStore.isTablePanelOpen
  ])

  return (
    <TableView
      actionsMenu={actionsMenu}
      applyDetailsChanges={applyDetailsChanges}
      applyDetailsChangesCallback={applyDetailsChangesCallback}
      content={content}
      detailsFormInitialValues={detailsFormInitialValues}
      getCloseDetailsLink={getCloseDetailsLink}
      groupFilter={filtersStore.groupBy}
      groupLatestItem={
        isEmpty(tableContent.groupLatestItem)
          ? tableContent.groupWorkflowItems
          : tableContent.groupLatestItem
      }
      groupedContent={groupedContent}
      handleCancel={handleCancel}
      handleExpandRow={handleExpandRow}
      handleSelectItem={handleSelectItem}
      isTablePanelOpen={tableStore.isTablePanelOpen}
      mainRowItemsCount={tableContent.mainRowItemsCount}
      pageData={pageData}
      params={params}
      retryRequest={retryRequest}
      selectedItem={selectedItem}
      tableContent={
        tab === MONITOR_JOBS_TAB || tab === SCHEDULE_TAB ? content : tableContent.content
      }
      tab={tab}
      tableContentRef={tableContentRef}
      tableHeaders={tableHeaders}
      tableHeadRef={tableHeadRef}
      tablePanelRef={tablePanelRef}
    >
      {children}
    </TableView>
  )
}

Table.defaultProps = {
  applyDetailsChanges: () => {},
  applyDetailsChangesCallback: () => {},
  detailsFormInitialValues: {},
  getCloseDetailsLink: null,
  groupedContent: {},
  handleCancel: () => {},
  handleExpandRow: () => {},
  handleSelectItem: () => {},
  retryRequest: () => {},
  selectedItem: {},
  tab: '',
  tableHeaders: []
}

Table.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  applyDetailsChanges: PropTypes.func,
  applyDetailsChangesCallback: PropTypes.func,
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  detailsFormInitialValues: PropTypes.object,
  getCloseDetailsLink: PropTypes.func,
  groupedContent: PropTypes.shape({}),
  handleCancel: PropTypes.func,
  handleExpandRow: PropTypes.func,
  handleSelectItem: PropTypes.func,
  pageData: PropTypes.shape({}).isRequired,
  retryRequest: PropTypes.func,
  selectedItem: PropTypes.shape({}),
  tab: PropTypes.string,
  tableHeaders: PropTypes.array
}

export default connect(
  ({ filtersStore }) => ({
    filtersStore
  }),
  {}
)(Table)
