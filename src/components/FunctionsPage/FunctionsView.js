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

import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import FilterMenu from '../FilterMenu/FilterMenu'
import Loader from '../../common/Loader/Loader'
import NoData from '../../common/NoData/NoData'
import Table from '../Table/Table'
import FunctionsTableRow from '../../elements/FunctionsTableRow/FunctionsTableRow'
import FunctionsPanel from '../FunctionsPanel/FunctionsPanel'
import { ConfirmDialog } from 'igz-controls/components'
import YamlModal from '../../common/YamlModal/YamlModal'

import { getNoDataMessage } from '../../utils/getNoDataMessage'
import { SECONDARY_BUTTON } from 'igz-controls/constants'
import { filters } from './functions.util'
import { FUNCTIONS_PAGE, PANEL_CREATE_MODE, PANEL_EDIT_MODE } from '../../constants'

const FunctionsView = ({
  actionsMenu,
  closePanel,
  confirmData,
  convertedYaml,
  createFunctionSuccess,
  editableItem,
  expand,
  filtersChangeCallback,
  filtersStore,
  functionsPanelIsOpen,
  functionsStore,
  getPopUpTemplate,
  handleCancel,
  handleDeployFunctionFailure,
  handleDeployFunctionSuccess,
  handleExpandAll,
  handleExpandRow,
  handleSelectFunction,
  isDemoMode,
  largeRequestErrorMessage,
  pageData,
  refreshFunctions,
  selectedFunction,
  selectedRowData,
  tableContent,
  taggedFunctions,
  toggleConvertedYaml
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
              <div className="action-bar">
                <FilterMenu
                  actionButton={{
                    getCustomTemplate: getPopUpTemplate,
                    hidden: !isDemoMode,
                    label: 'New',
                    variant: SECONDARY_BUTTON
                  }}
                  expand={expand}
                  filters={filters}
                  handleExpandAll={handleExpandAll}
                  onChange={filtersChangeCallback}
                  page={FUNCTIONS_PAGE}
                />
              </div>
            </div>
            {functionsStore.loading ? (
              <Loader />
            ) : taggedFunctions.length === 0 ? (
              <NoData
                message={getNoDataMessage(
                  filtersStore,
                  filters,
                  largeRequestErrorMessage,
                  FUNCTIONS_PAGE
                )}
              />
            ) : (
              <>
                <Table
                  actionsMenu={actionsMenu}
                  content={taggedFunctions}
                  handleCancel={handleCancel}
                  pageData={pageData}
                  retryRequest={refreshFunctions}
                  selectedItem={selectedFunction}
                  tableHeaders={tableContent[0]?.content ?? []}
                >
                  {tableContent.map((tableItem, index) => {
                    return (
                      <FunctionsTableRow
                        actionsMenu={actionsMenu}
                        handleExpandRow={handleExpandRow}
                        handleSelectItem={handleSelectFunction}
                        rowIndex={index}
                        key={index}
                        rowItem={tableItem}
                        selectedItem={selectedFunction}
                        selectedRowData={selectedRowData}
                      />
                    )
                  })}
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
      {convertedYaml.length > 0 && (
        <YamlModal convertedYaml={convertedYaml} toggleConvertToYaml={toggleConvertedYaml} />
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
  closePanel: PropTypes.func.isRequired,
  createFunctionSuccess: PropTypes.func.isRequired,
  confirmData: PropTypes.object,
  convertedYaml: PropTypes.string.isRequired,
  editableItem: PropTypes.object,
  expand: PropTypes.bool.isRequired,
  filtersChangeCallback: PropTypes.func.isRequired,
  filtersStore: PropTypes.object.isRequired,
  functionsPanelIsOpen: PropTypes.bool.isRequired,
  functionsStore: PropTypes.object.isRequired,
  getPopUpTemplate: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleDeployFunctionFailure: PropTypes.func.isRequired,
  handleDeployFunctionSuccess: PropTypes.func.isRequired,
  handleExpandAll: PropTypes.func.isRequired,
  handleExpandRow: PropTypes.func.isRequired,
  handleSelectFunction: PropTypes.func.isRequired,
  largeRequestErrorMessage: PropTypes.string.isRequired,
  pageData: PropTypes.object.isRequired,
  refreshFunctions: PropTypes.func.isRequired,
  selectedFunction: PropTypes.object.isRequired,
  selectedRowData: PropTypes.object.isRequired,
  tableContent: PropTypes.arrayOf(PropTypes.object).isRequired,
  taggedFunctions: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleConvertedYaml: PropTypes.func.isRequired
}

export default FunctionsView
