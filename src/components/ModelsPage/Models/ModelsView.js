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

import ArtifactsActionBar from '../../ArtifactsActionBar/ArtifactsActionBar'
import ArtifactsTableRow from '../../../elements/ArtifactsTableRow/ArtifactsTableRow'
import Loader from '../../../common/Loader/Loader'
import ModelsPageTabs from '../ModelsPageTabs/ModelsPageTabs'
import NoData from '../../../common/NoData/NoData'
import Table from '../../Table/Table'
import Details from '../../Details/Details'
import WarningMessage from '../../../common/WarningMessage/WarningMessage'

import { ACTIONS_MENU, VIRTUALIZATION_CONFIG } from '../../../types'
import { FULL_VIEW_MODE, MODELS_FILTERS, MODELS_PAGE, MODELS_TAB } from '../../../constants'
import { SECONDARY_BUTTON, PRIMARY_BUTTON } from 'igz-controls/constants'
import { SORT_PROPS } from 'igz-controls/types'
import { filters } from './models.util'
import { getNoDataMessage } from '../../../utils/getNoDataMessage'
import { isRowRendered } from '../../../hooks/useVirtualization.hook'
import { removeModel } from '../../../reducers/artifactsReducer'

const ModelsView = React.forwardRef(
  (
    {
      actionsMenu,
      applyDetailsChanges,
      applyDetailsChangesCallback,
      artifactsStore,
      detailsFormInitialValues,
      filtersStore,
      handleExpandRow,
      handleRefresh,
      handleRegisterModel,
      handleTrainModel,
      isDemoMode,
      maxArtifactsErrorIsShown,
      models,
      pageData,
      requestErrorMessage,
      selectedModel,
      selectedRowData,
      setMaxArtifactsErrorIsShown,
      setModels,
      setSelectedModelMin,
      setSelectedRowData,
      sortProps = null,
      tableContent,
      tableHeaders,
      urlTagOption = null,
      viewMode = null,
      virtualizationConfig
    },
    { modelsRef }
  ) => {
    return (
      <>
        <div className="models" ref={modelsRef}>
          <div className="table-container">
            <div className="content__action-bar-wrapper">
              <ModelsPageTabs />
              {/* TODO: remove from demo in 1.7 */}
              <ArtifactsActionBar
                actionButtons={[
                  {
                    variant: PRIMARY_BUTTON,
                    label: 'Train model',
                    className: 'action-button',
                    onClick: handleTrainModel
                  },
                  {
                    variant: SECONDARY_BUTTON,
                    label: 'Register model',
                    className: 'action-button',
                    onClick: handleRegisterModel,
                    hidden: !isDemoMode
                  }
                ]}
                artifacts={models}
                filterMenuName={MODELS_FILTERS}
                handleRefresh={handleRefresh}
                page={MODELS_PAGE}
                removeSelectedItem={removeModel}
                setContent={setModels}
                setSelectedRowData={setSelectedRowData}
                tab={MODELS_TAB}
                urlTagOption={urlTagOption}
              />
            </div>
            {artifactsStore.loading ? null : models.length === 0 ? (
              <NoData
                message={getNoDataMessage(
                  filtersStore,
                  filters,
                  requestErrorMessage,
                  MODELS_PAGE,
                  MODELS_TAB,
                  MODELS_FILTERS
                )}
              />
            ) : (
              <>
                {(selectedRowData.loading ||
                  artifactsStore.models.modelLoading ||
                  artifactsStore.pipelines.loading) && <Loader />}
                {maxArtifactsErrorIsShown && (
                  <WarningMessage
                    message="The query response displays up to 1000 items. Use filters to narrow down the results."
                    handleClose={() => setMaxArtifactsErrorIsShown(false)}
                  />
                )}
                <Table
                  actionsMenu={actionsMenu}
                  applyDetailsChanges={applyDetailsChanges}
                  applyDetailsChangesCallback={applyDetailsChangesCallback}
                  detailsFormInitialValues={detailsFormInitialValues}
                  handleCancel={() => setSelectedModelMin({})}
                  pageData={pageData}
                  retryRequest={handleRefresh}
                  selectedItem={selectedModel}
                  sortProps={sortProps}
                  tab={MODELS_TAB}
                  tableClassName="models-table"
                  tableHeaders={tableHeaders ?? []}
                  virtualizationConfig={virtualizationConfig}
                >
                  {tableContent.map(
                    (tableItem, index) =>
                      isRowRendered(virtualizationConfig, index) && (
                        <ArtifactsTableRow
                          actionsMenu={actionsMenu}
                          handleExpandRow={handleExpandRow}
                          rowIndex={index}
                          key={tableItem.data.ui.identifier}
                          rowItem={tableItem}
                          selectedItem={selectedModel}
                          selectedRowData={selectedRowData}
                          tab={MODELS_TAB}
                        />
                      )
                  )}
                </Table>
              </>
            )}
            {viewMode === FULL_VIEW_MODE && (
              <Details
                actionsMenu={actionsMenu}
                applyDetailsChanges={applyDetailsChanges}
                detailsMenu={pageData.details.menu}
                formInitialValues={detailsFormInitialValues}
                handleRefresh={handleRefresh}
                isDetailsScreen
                pageData={pageData}
                selectedItem={selectedModel}
                tab={MODELS_TAB}
              />
            )}
          </div>
        </div>
      </>
    )
  }
)

ModelsView.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  applyDetailsChanges: PropTypes.func.isRequired,
  applyDetailsChangesCallback: PropTypes.func.isRequired,
  artifactsStore: PropTypes.object.isRequired,
  filtersStore: PropTypes.object.isRequired,
  handleExpandRow: PropTypes.func.isRequired,
  handleRefresh: PropTypes.func.isRequired,
  handleRegisterModel: PropTypes.func.isRequired,
  handleTrainModel: PropTypes.func.isRequired,
  isDemoMode: PropTypes.bool.isRequired,
  maxArtifactsErrorIsShown: PropTypes.bool.isRequired,
  models: PropTypes.arrayOf(PropTypes.object).isRequired,
  pageData: PropTypes.object.isRequired,
  requestErrorMessage: PropTypes.string.isRequired,
  selectedModel: PropTypes.object.isRequired,
  selectedRowData: PropTypes.object.isRequired,
  setMaxArtifactsErrorIsShown: PropTypes.func.isRequired,
  setModels: PropTypes.func.isRequired,
  setSelectedModelMin: PropTypes.func.isRequired,
  setSelectedRowData: PropTypes.func.isRequired,
  sortProps: SORT_PROPS,
  tableContent: PropTypes.arrayOf(PropTypes.object).isRequired,
  tableHeaders: PropTypes.arrayOf(PropTypes.object).isRequired,
  urlTagOption: PropTypes.string,
  viewMode: PropTypes.string,
  virtualizationConfig: VIRTUALIZATION_CONFIG.isRequired
}

export default ModelsView
