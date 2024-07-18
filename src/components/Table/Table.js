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
import React, { useCallback, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import TableView from './TableView'

import { ACTIONS_MENU, VIRTUALIZATION_CONFIG } from '../../types'
import { SORT_PROPS } from 'igz-controls/types'

import './table.scss'

const Table = React.forwardRef(
  (
    {
      actionsMenu,
      applyDetailsChanges,
      applyDetailsChangesCallback,
      children,
      detailsFormInitialValues,
      getCloseDetailsLink,
      handleCancel,
      hideActionsMenu,
      mainRowItemsCount,
      pageData,
      retryRequest,
      selectedItem,
      sortProps,
      tab,
      tableClassName,
      tableHeaders,
      virtualizationConfig
    },
    ref
  ) => {
    const tableRefLocal = useRef(null)
    const tableBodyRefLocal = useRef(null)
    const tableRef = ref?.tableRef ?? tableRefLocal
    const tableBodyRef = ref?.tableBodyRef ?? tableBodyRefLocal
    const tableContentRef = useRef(null)
    const tablePanelRef = useRef(null)
    const tableHeadRef = useRef(null)
    const params = useParams()
    const tableStore = useSelector(store => store.tableStore)

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

    return (
      <TableView
        actionsMenu={actionsMenu}
        applyDetailsChanges={applyDetailsChanges}
        applyDetailsChangesCallback={applyDetailsChangesCallback}
        detailsFormInitialValues={detailsFormInitialValues}
        getCloseDetailsLink={getCloseDetailsLink}
        handleCancel={handleCancel}
        hideActionsMenu={hideActionsMenu}
        isTablePanelOpen={tableStore.isTablePanelOpen}
        mainRowItemsCount={mainRowItemsCount}
        pageData={pageData}
        params={params}
        retryRequest={retryRequest}
        selectedItem={selectedItem}
        sortProps={sortProps}
        tab={tab}
        tableRef={tableRef}
        tableClassName={tableClassName}
        tableBodyRef={tableBodyRef}
        tableContentRef={tableContentRef}
        tableHeaders={tableHeaders}
        tableHeadRef={tableHeadRef}
        tablePanelRef={tablePanelRef}
        virtualizationConfig={virtualizationConfig}
      >
        {children}
      </TableView>
    )
  }
)

Table.defaultProps = {
  applyDetailsChanges: () => {},
  applyDetailsChangesCallback: () => {},
  detailsFormInitialValues: {},
  getCloseDetailsLink: null,
  groupedContent: {},
  handleCancel: () => {},
  handleExpandRow: () => {},
  handleSelectItem: () => {},
  hideActionsMenu: false,
  mainRowItemsCount: 1,
  retryRequest: () => {},
  selectedItem: {},
  sortProps: null,
  tab: '',
  tableClassName: '',
  tableHeaders: [],
  virtualizationConfig: {
    tableBodyPaddingTop: 0,
    startIndex: -1,
    endIndex: -1
  }
}

Table.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  applyDetailsChanges: PropTypes.func,
  applyDetailsChangesCallback: PropTypes.func,
  detailsFormInitialValues: PropTypes.object,
  getCloseDetailsLink: PropTypes.func,
  groupedContent: PropTypes.shape({}),
  handleCancel: PropTypes.func,
  handleExpandRow: PropTypes.func,
  handleSelectItem: PropTypes.func,
  hideActionsMenu: PropTypes.bool,
  mainRowItemsCount: PropTypes.number,
  pageData: PropTypes.shape({}).isRequired,
  retryRequest: PropTypes.func,
  selectedItem: PropTypes.shape({}),
  sortProps: SORT_PROPS,
  tab: PropTypes.string,
  tableClassName: PropTypes.string,
  tableHeaders: PropTypes.array,
  virtualizationConfig: VIRTUALIZATION_CONFIG
}

export default Table
