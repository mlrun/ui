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
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import ActionBar from '../ActionBar/ActionBar'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import FunctionsFilters from './FunctionsFilters'
import FunctionsPanel from '../FunctionsPanel/FunctionsPanel'
import FunctionsTableRow from '../../elements/FunctionsTableRow/FunctionsTableRow'
import Loader from '../../common/Loader/Loader'
import NoData from '../../common/NoData/NoData'
import Table from '../Table/Table'
import { ConfirmDialog } from 'igz-controls/components'

import { FUNCTIONS_PAGE, PANEL_CREATE_MODE, PANEL_EDIT_MODE } from '../../constants'
import { SECONDARY_BUTTON } from 'igz-controls/constants'
import { FILTERS_CONFIG, VIRTUALIZATION_CONFIG } from '../../types'
import { getNoDataMessage } from '../../utils/getNoDataMessage'
import { isRowRendered } from '../../hooks/useVirtualization.hook'

const FunctionsView = ({
  actionsMenu,
  allRowsAreExpanded,
  closePanel,
  confirmData,
  createFunctionSuccess,
  editableItem,
  expandedRowsData,
  filters,
  filtersChangeCallback,
  filtersStore,
  functions,
  functionsFiltersConfig,
  functionsPanelIsOpen,
  functionsStore,
  getPopUpTemplate,
  handleCancel,
  handleDeployFunctionFailure,
  handleDeployFunctionSuccess,
  handleSelectFunction,
  isDemoMode,
  pageData,
  requestErrorMessage,
  retryRequest,
  selectedFunction,
  setSearchParams,
  tableContent,
  toggleAllRows,
  toggleRow,
  virtualizationConfig
}) => {
  const params = useParams()
  return (
    <>
      <div className="content-wrapper">
        <div className="content__header">
          <Breadcrumbs />
        </div>
        <div className="content">
          <div className="table-container">
            <div className="content__action-bar-wrapper">
              <ActionBar
                allRowsAreExpanded={allRowsAreExpanded}
                filters={filters}
                filtersConfig={functionsFiltersConfig}
                handleRefresh={filtersChangeCallback}
                navigateLink={`/projects/${params.projectName}/functions${window.location.search}`}
                page={FUNCTIONS_PAGE}
                setSearchParams={setSearchParams}
                toggleAllRows={toggleAllRows}
                actionButtons={[
                  {
                    hidden: !isDemoMode,
                    template: getPopUpTemplate({
                      className: 'action-button',
                      label: 'New',
                      variant: SECONDARY_BUTTON
                    })
                  }
                ]}
              >
                <FunctionsFilters />
              </ActionBar>
            </div>
            {functionsStore.loading ? (
              <Loader />
            ) : functions.length === 0 ? (
              <NoData
                message={getNoDataMessage(
                  filters,
                  functionsFiltersConfig,
                  requestErrorMessage,
                  FUNCTIONS_PAGE,
                  null,
                  filtersStore
                )}
              />
            ) : (
              <>
                {functionsStore.funcLoading && <Loader />}
                <Table
                  actionsMenu={actionsMenu}
                  handleCancel={handleCancel}
                  pageData={pageData}
                  retryRequest={retryRequest}
                  selectedItem={selectedFunction}
                  tableClassName="functions-table"
                  tableHeaders={tableContent[0]?.content ?? []}
                  virtualizationConfig={virtualizationConfig}
                >
                  {tableContent.map(
                    (tableItem, index) =>
                      isRowRendered(virtualizationConfig, index) && (
                        <FunctionsTableRow
                          actionsMenu={actionsMenu}
                          expandedRowsData={expandedRowsData}
                          handleSelectItem={handleSelectFunction}
                          key={tableItem.data.ui.identifier}
                          rowIndex={index}
                          rowItem={tableItem}
                          selectedItem={selectedFunction}
                          toggleRow={toggleRow}
                          withQuickActions
                        />
                      )
                  )}
                </Table>
              </>
            )}
          </div>
        </div>
      </div>
      {functionsPanelIsOpen && (
        <FunctionsPanel
          closePanel={closePanel}
          createFunctionSuccess={createFunctionSuccess}
          defaultData={editableItem}
          handleDeployFunctionFailure={handleDeployFunctionFailure}
          handleDeployFunctionSuccess={handleDeployFunctionSuccess}
          mode={editableItem ? PANEL_EDIT_MODE : PANEL_CREATE_MODE}
          project={params.projectName}
        />
      )}
      {confirmData && (
        <ConfirmDialog
          cancelButton={{
            handler: confirmData.rejectHandler,
            label: confirmData.btnCancelLabel,
            variant: confirmData.btnCancelVariant
          }}
          closePopUp={confirmData.rejectHandler}
          confirmButton={{
            handler: () => confirmData.confirmHandler(confirmData.item),
            label: confirmData.btnConfirmLabel,
            variant: confirmData.btnConfirmVariant
          }}
          header={confirmData.header}
          isOpen={confirmData}
          message={confirmData.message}
        />
      )}
    </>
  )
}

FunctionsView.defaultPropTypes = {
  confirmData: null,
  editableItem: null
}

FunctionsView.propTypes = {
  actionsMenu: PropTypes.func.isRequired,
  allRowsAreExpanded: PropTypes.bool.isRequired,
  closePanel: PropTypes.func.isRequired,
  confirmData: PropTypes.object,
  createFunctionSuccess: PropTypes.func.isRequired,
  editableItem: PropTypes.object,
  expandedRowsData: PropTypes.object.isRequired,
  filtersChangeCallback: PropTypes.func.isRequired,
  filtersStore: PropTypes.object.isRequired,
  functions: PropTypes.arrayOf(PropTypes.object).isRequired,
  functionsFiltersConfig: FILTERS_CONFIG.isRequired,
  functionsPanelIsOpen: PropTypes.bool.isRequired,
  functionsStore: PropTypes.object.isRequired,
  getPopUpTemplate: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleDeployFunctionFailure: PropTypes.func.isRequired,
  handleDeployFunctionSuccess: PropTypes.func.isRequired,
  handleSelectFunction: PropTypes.func.isRequired,
  pageData: PropTypes.object.isRequired,
  requestErrorMessage: PropTypes.string.isRequired,
  retryRequest: PropTypes.func.isRequired,
  selectedFunction: PropTypes.object.isRequired,
  setSearchParams: PropTypes.func.isRequired,
  tableContent: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleAllRows: PropTypes.func.isRequired,
  toggleRow: PropTypes.func.isRequired,
  virtualizationConfig: VIRTUALIZATION_CONFIG.isRequired
}

export default FunctionsView
