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

import ActionBar from '../ActionBar/ActionBar'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import FunctionsFilters from './FunctionsFilters'
import FunctionsPanel from '../FunctionsPanel/FunctionsPanel'
import FunctionsTableRow from '../../elements/FunctionsTableRow/FunctionsTableRow'
import HistoryBackLink from '../../common/HistoryBackLink/historyBackLink'
import NoData from '../../common/NoData/NoData'
import Pagination from '../../common/Pagination/Pagination'
import Table from '../Table/Table'
import { ConfirmDialog, Loader } from 'igz-controls/components'

import {
  FUNCTIONS_PAGE,
  FUNCTIONS_PAGE_PATH,
  PANEL_CREATE_MODE,
  PANEL_EDIT_MODE,
  ALL_VERSIONS_PATH
} from '../../constants'
import { FILTERS_CONFIG } from '../../types'
import { PRIMARY_BUTTON } from 'igz-controls/constants'
import { getCloseDetailsLink } from '../../utils/link-helper.util'
import { getNoDataMessage } from '../../utils/getNoDataMessage'
import { getSavedSearchParams } from 'igz-controls/utils/filter.util'
import { isEmpty } from 'lodash'

const FunctionsView = ({
  actionsMenu,
  closePanel,
  confirmData = null,
  createFunctionSuccess,
  editableItem = null,
  filters,
  filtersStore,
  functionsFiltersConfig,
  functionsPanelIsOpen,
  functionsStore,
  getPopUpTemplate,
  handleCancel,
  handleDeployFunctionFailure,
  handleDeployFunctionSuccess,
  handleRefreshFunctions,
  handleSelectFunction,
  isAllVersions,
  isDemoMode,
  pageData,
  paginationConfigFunctionsRef,
  params,
  requestErrorMessage,
  selectedFunction,
  setSearchFunctionsParams,
  tableContent
}) => {

  return (
    <>
      <div className="content-wrapper">
        <div className="content__header">
          <Breadcrumbs itemName={params.funcName} />
        </div>
        <div className="content">
          <div className="table-container">
            <div className="content__action-bar-wrapper">
              {isAllVersions && (
                <HistoryBackLink
                  link={`/projects/${params.projectName}/functions${getSavedSearchParams(window.location.search)}`}
                  itemName={params.funcName}
                />
              )}
              <ActionBar
                actionButtons={[
                  {
                    hidden: !isDemoMode,
                    template: getPopUpTemplate({
                      className: 'action-button',
                      label: 'New',
                      variant: PRIMARY_BUTTON
                    })
                  }
                ]}
                closeParamName={isAllVersions ? ALL_VERSIONS_PATH : FUNCTIONS_PAGE_PATH}
                filters={filters}
                filtersConfig={functionsFiltersConfig}
                handleRefresh={handleRefreshFunctions}
                setSearchParams={setSearchFunctionsParams}
                selectedItemName={params.funcName}
                withoutExpandButton
              >
                <FunctionsFilters />
              </ActionBar>
            </div>
            {functionsStore.loading ? (
              <Loader />
            ) : tableContent.length === 0 && isEmpty(selectedFunction) ? (
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
                  getCloseDetailsLink={() =>
                    getCloseDetailsLink(isAllVersions ? ALL_VERSIONS_PATH : FUNCTIONS_PAGE_PATH, false, params.funcName)
                  }
                  handleCancel={handleCancel}
                  pageData={pageData}
                  selectedItem={selectedFunction}
                  tableClassName="functions-table"
                  tableHeaders={
                    tableContent[0]?.content ?? [
                      {
                        headerId: isAllVersions ? 'hash' : 'name',
                        headerLabel: isAllVersions ? 'Hash' : 'Name',
                        className: 'table-cell-name'
                      }
                    ]
                  }
                >
                  {tableContent.map((tableItem, index) => (
                    <FunctionsTableRow
                      actionsMenu={actionsMenu}
                      handleSelectItem={handleSelectFunction}
                      key={tableItem.data.hash + index}
                      rowItem={tableItem}
                      selectedItem={selectedFunction}
                      withQuickActions
                    />
                  ))}
                </Table>
                <Pagination
                  paginationConfig={paginationConfigFunctionsRef.current}
                  closeParamName={isAllVersions ? ALL_VERSIONS_PATH : FUNCTIONS_PAGE_PATH}
                  selectedItemName={params.funcName}
                />
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
          isOpen={Boolean(confirmData)}
          message={confirmData.message}
        />
      )}
    </>
  )
}

FunctionsView.propTypes = {
  actionsMenu: PropTypes.func.isRequired,
  closePanel: PropTypes.func.isRequired,
  confirmData: PropTypes.object,
  createFunctionSuccess: PropTypes.func.isRequired,
  editableItem: PropTypes.object,
  filters: PropTypes.object.isRequired,
  filtersStore: PropTypes.object.isRequired,
  functionsFiltersConfig: FILTERS_CONFIG.isRequired,
  functionsPanelIsOpen: PropTypes.bool.isRequired,
  functionsStore: PropTypes.object.isRequired,
  getPopUpTemplate: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleDeployFunctionFailure: PropTypes.func.isRequired,
  handleDeployFunctionSuccess: PropTypes.func.isRequired,
  handleRefreshFunctions: PropTypes.func.isRequired,
  handleSelectFunction: PropTypes.func.isRequired,
  isAllVersions: PropTypes.bool.isRequired,
  isDemoMode: PropTypes.bool.isRequired,
  pageData: PropTypes.object.isRequired,
  paginationConfigFunctionsRef: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  requestErrorMessage: PropTypes.string.isRequired,
  selectedFunction: PropTypes.object.isRequired,
  setSearchFunctionsParams: PropTypes.func.isRequired,
  tableContent: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default FunctionsView
