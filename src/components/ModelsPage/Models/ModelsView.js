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

import ActionBar from '../../ActionBar/ActionBar'
import ArtifactsFilters from '../../ArtifactsActionBar/ArtifactsFilters'
import ArtifactsTableRow from '../../../elements/ArtifactsTableRow/ArtifactsTableRow'
import Details from '../../Details/Details'
import HistoryBackLink from '../../../common/HistoryBackLink/historyBackLink'
import Loader from '../../../common/Loader/Loader'
import ModelsPageTabs from '../ModelsPageTabs/ModelsPageTabs'
import NoData from '../../../common/NoData/NoData'
import Pagination from '../../../common/Pagination/Pagination'
import Table from '../../Table/Table'

import { ACTIONS_MENU } from '../../../types'
import { FULL_VIEW_MODE, MODELS_PAGE, MODELS_TAB, ALL_VERSIONS_PATH } from '../../../constants'
import { SECONDARY_BUTTON, PRIMARY_BUTTON } from 'igz-controls/constants'
import { getCloseDetailsLink } from '../../../utils/link-helper.util'
import { getNoDataMessage } from '../../../utils/getNoDataMessage'
import { getSavedSearchParams } from '../../../utils/filter.util'

const ModelsView = React.forwardRef(
  (
    {
      actionsMenu,
      applyDetailsChanges,
      applyDetailsChangesCallback,
      artifactsStore,
      detailsFormInitialValues,
      filters,
      filtersConfig,
      filtersStore,
      getAndSetSelectedArtifact,
      handleRefreshModels,
      handleRefreshWithFilters,
      handleRegisterModel,
      handleTrainModel,
      isAllVersions,
      isDemoMode,
      modelName,
      models,
      pageData,
      paginationConfigModelsRef,
      projectName,
      requestErrorMessage,
      selectedModel,
      setSearchModelsParams,
      setSelectedModelMin,
      tableContent,
      tableHeaders,
      viewMode = null
    },
    { modelsRef }
  ) => {
    return (
      <>
        <div className="models" ref={modelsRef}>
          <div className="table-container">
            <div className="content__action-bar-wrapper  content__action-bar-wrapper_multi-row">
              <ModelsPageTabs />
              {/* TODO: remove from demo in 1.7 */}
              <ActionBar
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
                filters={filters}
                filtersConfig={filtersConfig}
                navigateLink={`/projects/${projectName}/models/models${isAllVersions ? `/${modelName}/${ALL_VERSIONS_PATH}` : ''}${window.location.search}`}
                handleRefresh={handleRefreshModels}
                page={MODELS_PAGE}
                setSearchParams={setSearchModelsParams}
                tab={MODELS_TAB}
                withRefreshButton
                withoutExpandButton
              >
                <ArtifactsFilters artifacts={models} />
              </ActionBar>
            </div>
            {isAllVersions && (
              <div className="content__history-back-link-wrapper">
                <HistoryBackLink
                  itemName={modelName}
                  link={`/projects/${projectName}/models/models${getSavedSearchParams(window.location.search)}`}
                />
              </div>
            )}
            {artifactsStore.loading ? null : tableContent.length === 0 ? (
              <NoData
                message={getNoDataMessage(
                  filters,
                  filtersConfig,
                  requestErrorMessage,
                  MODELS_PAGE,
                  MODELS_TAB,
                  filtersStore
                )}
              />
            ) : (
              <>
                {(artifactsStore.models.modelLoading || artifactsStore.pipelines.loading) && (
                  <Loader />
                )}
                <Table
                  actionsMenu={actionsMenu}
                  applyDetailsChanges={applyDetailsChanges}
                  applyDetailsChangesCallback={applyDetailsChangesCallback}
                  detailsFormInitialValues={detailsFormInitialValues}
                  getCloseDetailsLink={() =>
                    getCloseDetailsLink(isAllVersions ? ALL_VERSIONS_PATH : MODELS_TAB)
                  }
                  handleCancel={() => setSelectedModelMin({})}
                  pageData={pageData}
                  retryRequest={handleRefreshWithFilters}
                  selectedItem={selectedModel}
                  tab={MODELS_TAB}
                  tableClassName="models-table"
                  tableHeaders={tableHeaders ?? []}
                >
                  {tableContent.map((tableItem, index) => (
                    <ArtifactsTableRow
                      actionsMenu={actionsMenu}
                      key={tableItem.data.ui.identifierUnique}
                      rowIndex={index}
                      rowItem={tableItem}
                      selectedItem={selectedModel}
                      tab={MODELS_TAB}
                    />
                  ))}
                </Table>
                <Pagination
                  paginationConfig={paginationConfigModelsRef.current}
                  closeParamName={isAllVersions ? ALL_VERSIONS_PATH : MODELS_TAB}
                />
              </>
            )}
            {viewMode === FULL_VIEW_MODE && !isEmpty(selectedModel) && (
              <Details
                actionsMenu={actionsMenu}
                applyDetailsChanges={applyDetailsChanges}
                detailsMenu={pageData.details.menu}
                formInitialValues={detailsFormInitialValues}
                handleRefresh={getAndSetSelectedArtifact}
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
  filters: PropTypes.object.isRequired,
  filtersConfig: PropTypes.object.isRequired,
  filtersStore: PropTypes.object.isRequired,
  getAndSetSelectedArtifact: PropTypes.func.isRequired,
  handleRefreshModels: PropTypes.func.isRequired,
  handleRefreshWithFilters: PropTypes.func.isRequired,
  handleRegisterModel: PropTypes.func.isRequired,
  handleTrainModel: PropTypes.func.isRequired,
  isAllVersions: PropTypes.bool.isRequired,
  isDemoMode: PropTypes.bool.isRequired,
  modelName: PropTypes.string,
  models: PropTypes.arrayOf(PropTypes.object).isRequired,
  pageData: PropTypes.object.isRequired,
  projectName: PropTypes.string.isRequired,
  requestErrorMessage: PropTypes.string.isRequired,
  selectedModel: PropTypes.object.isRequired,
  setSearchModelsParams: PropTypes.func.isRequired,
  setSelectedModelMin: PropTypes.func.isRequired,
  tableContent: PropTypes.arrayOf(PropTypes.object).isRequired,
  tableHeaders: PropTypes.arrayOf(PropTypes.object).isRequired,
  viewMode: PropTypes.string
}

export default ModelsView
