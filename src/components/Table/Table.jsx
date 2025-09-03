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
import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import Details from '../Details/Details'

import { EMPTY_OBJECT } from '../../constants'
import { FULL_VIEW_MODE } from 'igz-controls/constants'
import { SORT_PROPS, VIRTUALIZATION_CONFIG, ACTIONS_MENU } from 'igz-controls/types'
import { useTable } from 'igz-controls/hooks/useTable.hook'

import 'igz-controls/scss/table.scss'

const Table = React.forwardRef(
  (
    {
      actionsMenu,
      applyDetailsChanges = () => {},
      applyDetailsChangesCallback = () => {},
      children,
      detailsFormInitialValues = EMPTY_OBJECT,
      getCloseDetailsLink = null,
      handleCancel = () => {},
      hideActionsMenu = false,
      mainRowItemsCount = 1,
      pageData,
      selectedItem = {},
      skipTableWrapper = false,
      sortProps = null,
      tab = '',
      tableClassName = '',
      tableHeaders = [],
      viewMode = '',
      virtualizationConfig = {
        tableBodyPaddingTop: 0,
        startIndex: -1,
        endIndex: -1
      },
      withActionMenu
    },
    ref
  ) => {
    const {
      TableContainer,
      tableBodyRef,
      tableClass,
      tableContentRef,
      tableHeadRef,
      tablePanelRef,
      tableRef,
      tableStore,
      tableWrapperClass
    } = useTable({
      ref,
      selectedItem,
      skipTableWrapper,
      tableClassName
    })

    return (
      <TableContainer
        hideActionsMenu={hideActionsMenu}
        mainRowItemsCount={mainRowItemsCount}
        pageData={pageData}
        sortProps={sortProps}
        tableBodyRef={tableBodyRef}
        tableClass={tableClass}
        tableHeadRef={tableHeadRef}
        tableHeaders={tableHeaders}
        tablePanelRef={tablePanelRef}
        tableRef={tableRef}
        tableStore={tableStore}
        tableWrapperClass={tableWrapperClass}
        virtualizationConfig={virtualizationConfig}
        tableContentRef={tableContentRef}
        renderDetails={() =>
          !isEmpty(selectedItem) &&
          viewMode !== FULL_VIEW_MODE && (
            <Details
              actionsMenu={actionsMenu}
              applyDetailsChanges={applyDetailsChanges}
              applyDetailsChangesCallback={applyDetailsChangesCallback}
              detailsMenu={pageData.details.menu}
              formInitialValues={detailsFormInitialValues}
              getCloseDetailsLink={getCloseDetailsLink}
              handleCancel={handleCancel}
              pageData={pageData}
              selectedItem={selectedItem}
              tab={tab}
              withActionMenu={withActionMenu}
            />
          )
        }
      >
        {children}
      </TableContainer>
    )
  }
)

Table.displayName = 'Table'

Table.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  applyDetailsChanges: PropTypes.func,
  applyDetailsChangesCallback: PropTypes.func,
  children: PropTypes.node.isRequired,
  detailsFormInitialValues: PropTypes.object,
  getCloseDetailsLink: PropTypes.func,
  handleCancel: PropTypes.func,
  hideActionsMenu: PropTypes.bool,
  mainRowItemsCount: PropTypes.number,
  pageData: PropTypes.object.isRequired,
  selectedItem: PropTypes.object,
  skipTableWrapper: PropTypes.bool,
  sortProps: SORT_PROPS,
  tab: PropTypes.string,
  tableClassName: PropTypes.string,
  tableHeaders: PropTypes.array,
  viewMode: PropTypes.string,
  virtualizationConfig: VIRTUALIZATION_CONFIG,
  withActionMenu: PropTypes.bool
}

export default Table
