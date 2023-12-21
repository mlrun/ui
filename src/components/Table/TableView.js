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
import classnames from 'classnames'

import Details from '../Details/Details'
import TableHead from './TableHead'

import { ACTIONS_MENU } from '../../types'
import { SORT_PROPS } from 'igz-controls/types'

const TableView = ({
  actionsMenu,
  applyDetailsChanges,
  applyDetailsChangesCallback,
  children,
  detailsFormInitialValues,
  getCloseDetailsLink,
  handleCancel,
  hideActionsMenu,
  isTablePanelOpen,
  mainRowItemsCount,
  pageData,
  retryRequest,
  selectedItem,
  sortProps,
  tab,
  tableRef,
  tableContentRef,
  tableHeaders,
  tableHeadRef,
  tablePanelRef
}) => {
  const tableClass = classnames(
    'table',
    'table-main',
    !isEmpty(selectedItem) && 'table-with-details'
  )

  return (
    <div className="table__flex">
      <div className="table__content" id="table-content" ref={tableContentRef}>
        <div className="table__wrapper">
          <table className={tableClass} cellPadding="0" cellSpacing="0" ref={tableRef}>
            {tableHeaders?.length > 0 && (
              <TableHead
                content={tableHeaders}
                hideActionsMenu={hideActionsMenu}
                mainRowItemsCount={mainRowItemsCount}
                ref={tableHeadRef}
                selectedItem={selectedItem}
                sortProps={sortProps}
              />
            )}
            <tbody className="table-body">{children}</tbody>
          </table>
          {isTablePanelOpen && (
            <div className="table__panel-container" ref={tablePanelRef}>
              <div className="table__panel">{pageData.tablePanel}</div>
            </div>
          )}
        </div>
        {!isEmpty(selectedItem) && (
          <Details
            actionsMenu={actionsMenu}
            applyDetailsChanges={applyDetailsChanges}
            applyDetailsChangesCallback={applyDetailsChangesCallback}
            getCloseDetailsLink={getCloseDetailsLink}
            detailsMenu={pageData.details.menu}
            formInitialValues={detailsFormInitialValues}
            handleCancel={handleCancel}
            pageData={pageData}
            retryRequest={retryRequest}
            selectedItem={selectedItem}
            tab={tab}
          />
        )}
      </div>
    </div>
  )
}

TableView.defaultProps = {
  applyDetailsChanges: () => {},
  applyDetailsChangesCallback: () => {},
  getCloseDetailsLink: null,
  groupLatestJob: {},
  sortProps: null
}

TableView.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  applyDetailsChanges: PropTypes.func,
  applyDetailsChangesCallback: PropTypes.func,
  detailsFormInitialValues: PropTypes.object.isRequired,
  getCloseDetailsLink: PropTypes.func,
  handleCancel: PropTypes.func.isRequired,
  hideActionsMenu: PropTypes.bool.isRequired,
  isTablePanelOpen: PropTypes.bool.isRequired,
  pageData: PropTypes.shape({}).isRequired,
  retryRequest: PropTypes.func.isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  sortProps: SORT_PROPS,
  tab: PropTypes.string,
  tableHeaders: PropTypes.array,
  tableHeadRef: PropTypes.shape({}),
  tablePanelRef: PropTypes.shape({})
}

export default TableView
