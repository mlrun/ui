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

import ActionBar from '../ActionBar/ActionBar'
import ArtifactsFilters from '../ArtifactsActionBar/ArtifactsFilters'
import ArtifactsTableRow from '../../elements/ArtifactsTableRow/ArtifactsTableRow'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import Details from '../Details/Details'
import HistoryBackLink from '../../common/HistoryBackLink/historyBackLink'
import Loader from '../../common/Loader/Loader'
import NoData from '../../common/NoData/NoData'
import Pagination from '../../common/Pagination/Pagination'
import PreviewModal from '../../elements/PreviewModal/PreviewModal'
import Table from '../Table/Table'

import { ALL_VERSIONS_PATH, DATASETS_PAGE, DATASETS_TAB, FULL_VIEW_MODE } from '../../constants'
import { ACTIONS_MENU } from '../../types'
import { PRIMARY_BUTTON } from 'igz-controls/constants'
import { getCloseDetailsLink } from '../../utils/link-helper.util'
import { getNoDataMessage } from '../../utils/getNoDataMessage'
import { registerDatasetTitle } from './datasets.util'
import { getDefaultFirstHeader } from '../../utils/createArtifactsContent'

const DatasetsView = React.forwardRef(
  (
    {
      actionsMenu,
      applyDetailsChanges,
      applyDetailsChangesCallback,
      artifactsStore,
      datasetName,
      datasets,
      detailsFormInitialValues,
      filters,
      filtersConfig,
      filtersStore,
      getAndSetSelectedArtifact,
      handleRefreshDatasets,
      handleRefreshWithFilters,
      handleRegisterDataset,
      historyBackLink,
      isAllVersions,
      pageData,
      paginationConfigDatasetsRef,
      projectName,
      requestErrorMessage,
      selectedDataset,
      setSearchDatasetsParams,
      setSelectedDataset,
      tableContent,
      tableHeaders,
      viewMode = null
    },
    { datasetsRef }
  ) => {
    return (
      <>
        <div className="content-wrapper" ref={datasetsRef}>
          <div className="content__header">
            <Breadcrumbs />
          </div>
          <div className="content">
            {artifactsStore.loading && <Loader />}
            <div className="table-container">
              <div className="content__action-bar-wrapper">
                {isAllVersions && <HistoryBackLink itemName={datasetName} link={historyBackLink} />}
                <ActionBar
                  actionButtons={[
                    {
                      variant: PRIMARY_BUTTON,
                      label: registerDatasetTitle,
                      className: 'action-button',
                      onClick: handleRegisterDataset
                    }
                  ]}
                  closeParamName={isAllVersions ? ALL_VERSIONS_PATH : DATASETS_TAB}
                  filters={filters}
                  filtersConfig={filtersConfig}
                  handleRefresh={handleRefreshDatasets}
                  setSearchParams={setSearchDatasetsParams}
                  withRefreshButton
                  withoutExpandButton
                >
                  <ArtifactsFilters artifacts={datasets} />
                </ActionBar>
              </div>
              {artifactsStore.loading ? null : tableContent.length === 0 && isEmpty(selectedDataset) ? (
                <NoData
                  message={getNoDataMessage(
                    filters,
                    filtersConfig,
                    requestErrorMessage,
                    DATASETS_PAGE,
                    null,
                    filtersStore
                  )}
                />
              ) : (
                <>
                  {artifactsStore.dataSets.datasetLoading && <Loader />}
                  <Table
                    actionsMenu={actionsMenu}
                    applyDetailsChanges={applyDetailsChanges}
                    applyDetailsChangesCallback={applyDetailsChangesCallback}
                    detailsFormInitialValues={detailsFormInitialValues}
                    getCloseDetailsLink={() =>
                      getCloseDetailsLink(isAllVersions ? ALL_VERSIONS_PATH : DATASETS_TAB)
                    }
                    handleCancel={() => setSelectedDataset({})}
                    pageData={pageData}
                    retryRequest={handleRefreshWithFilters}
                    selectedItem={selectedDataset}
                    tableClassName="datasets-table"
                    tableHeaders={!isEmpty(tableHeaders) ? tableHeaders : getDefaultFirstHeader(isAllVersions)}
                  >
                    {tableContent.map((tableItem, index) => (
                      <ArtifactsTableRow
                        actionsMenu={actionsMenu}
                        key={tableItem.data.ui.identifierUnique}
                        rowIndex={index}
                        rowItem={tableItem}
                        selectedItem={selectedDataset}
                      />
                    ))}
                  </Table>
                  <Pagination
                    paginationConfig={paginationConfigDatasetsRef.current}
                    closeParamName={isAllVersions ? ALL_VERSIONS_PATH : DATASETS_TAB}
                  />
                </>
              )}
              {viewMode === FULL_VIEW_MODE && !isEmpty(selectedDataset) && (
                <Details
                  actionsMenu={actionsMenu}
                  applyDetailsChanges={applyDetailsChanges}
                  applyDetailsChangesCallback={applyDetailsChangesCallback}
                  formInitialValues={detailsFormInitialValues}
                  detailsMenu={pageData.details.menu}
                  handleRefresh={getAndSetSelectedArtifact}
                  isDetailsScreen
                  pageData={pageData}
                  selectedItem={selectedDataset}
                />
              )}
            </div>
          </div>
        </div>
        {artifactsStore?.preview?.isPreview && (
          <PreviewModal artifact={artifactsStore?.preview?.selectedItem} />
        )}
      </>
    )
  }
)

DatasetsView.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  applyDetailsChanges: PropTypes.func.isRequired,
  applyDetailsChangesCallback: PropTypes.func.isRequired,
  artifactsStore: PropTypes.object.isRequired,
  datasetName: PropTypes.string,
  datasets: PropTypes.arrayOf(PropTypes.object).isRequired,
  detailsFormInitialValues: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  filtersConfig: PropTypes.object.isRequired,
  filtersStore: PropTypes.object.isRequired,
  getAndSetSelectedArtifact: PropTypes.func.isRequired,
  handleRefreshDatasets: PropTypes.func.isRequired,
  handleRefreshWithFilters: PropTypes.func.isRequired,
  handleRegisterDataset: PropTypes.func.isRequired,
  historyBackLink: PropTypes.string.isRequired,
  isAllVersions: PropTypes.bool.isRequired,
  pageData: PropTypes.object.isRequired,
  projectName: PropTypes.string.isRequired,
  requestErrorMessage: PropTypes.string.isRequired,
  selectedDataset: PropTypes.object.isRequired,
  setSearchDatasetsParams: PropTypes.func.isRequired,
  setSelectedDataset: PropTypes.func.isRequired,
  tableContent: PropTypes.arrayOf(PropTypes.object).isRequired,
  tableHeaders: PropTypes.arrayOf(PropTypes.object).isRequired,
  viewMode: PropTypes.string
}

export default DatasetsView
