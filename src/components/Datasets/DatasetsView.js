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

import PreviewModal from '../../elements/PreviewModal/PreviewModal'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import Table from '../Table/Table'
import ArtifactsTableRow from '../../elements/ArtifactsTableRow/ArtifactsTableRow'
import YamlModal from '../../common/YamlModal/YamlModal'
import Loader from '../../common/Loader/Loader'
import ArtifactsActionBar from '../ArtifactsActionBar/ArtifactsActionBar'
import NoData from '../../common/NoData/NoData'
import Details from '../Details/Details'

import { DATASETS_FILTERS, DATASETS_PAGE, FULL_VIEW_MODE } from '../../constants'
import { getNoDataMessage } from '../../utils/getNoDataMessage'
import { registerDatasetTitle, filters } from './datasets.util'
import { removeDataSet } from '../../reducers/artifactsReducer'
import { ACTIONS_MENU, VIRTUALIZATION_CONFIG } from '../../types'
import { SECONDARY_BUTTON } from 'igz-controls/constants'
import { SORT_PROPS } from 'igz-controls/types'
import { isRowRendered } from '../../hooks/useVirtualization.hook'

const DatasetsView = React.forwardRef(
  (
    {
      actionsMenu,
      applyDetailsChanges,
      applyDetailsChangesCallback,
      artifactsStore,
      convertedYaml,
      datasets,
      detailsFormInitialValues,
      filtersStore,
      handleExpandRow,
      handleRefresh,
      handleRegisterDataset,
      largeRequestErrorMessage,
      pageData,
      selectedDataset,
      selectedRowData,
      setDatasets,
      setSelectedDataset,
      setSelectedRowData,
      sortProps,
      tableContent,
      tableHeaders,
      toggleConvertedYaml,
      urlTagOption,
      viewMode,
      virtualizationConfig
    },
    { datasetsRef, tableRef, tableBodyRef }
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
                <ArtifactsActionBar
                  actionButtons={[
                    {
                      variant: SECONDARY_BUTTON,
                      label: registerDatasetTitle,
                      className: 'action-button',
                      onClick: handleRegisterDataset
                    }
                  ]}
                  artifacts={datasets}
                  filterMenuName={DATASETS_FILTERS}
                  handleRefresh={handleRefresh}
                  page={DATASETS_PAGE}
                  removeSelectedItem={removeDataSet}
                  setContent={setDatasets}
                  setSelectedRowData={setSelectedRowData}
                  urlTagOption={urlTagOption}
                />
              </div>
              {artifactsStore.loading ? null : datasets.length === 0 ? (
                <NoData
                  message={getNoDataMessage(
                    filtersStore,
                    filters,
                    largeRequestErrorMessage,
                    DATASETS_PAGE,
                    null,
                    DATASETS_FILTERS
                  )}
                />
              ) : (
                <>
                  {selectedRowData.loading && <Loader />}
                  <Table
                    actionsMenu={actionsMenu}
                    applyDetailsChanges={applyDetailsChanges}
                    applyDetailsChangesCallback={applyDetailsChangesCallback}
                    detailsFormInitialValues={detailsFormInitialValues}
                    handleCancel={() => setSelectedDataset({})}
                    pageData={pageData}
                    ref={{ tableRef, tableBodyRef }}
                    retryRequest={handleRefresh}
                    selectedItem={selectedDataset}
                    sortProps={sortProps}
                    tableClassName="datasets-table"
                    tableHeaders={tableHeaders ?? []}
                    virtualizationConfig={virtualizationConfig}
                  >
                    {tableContent.map(
                      (tableItem, index) =>
                        isRowRendered(virtualizationConfig, index) && (
                          <ArtifactsTableRow
                            actionsMenu={actionsMenu}
                            handleExpandRow={handleExpandRow}
                            key={index}
                            rowIndex={index}
                            rowItem={tableItem}
                            selectedItem={selectedDataset}
                            selectedRowData={selectedRowData}
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
                  applyDetailsChangesCallback={applyDetailsChangesCallback}
                  formInitialValues={detailsFormInitialValues}
                  detailsMenu={pageData.details.menu}
                  handleRefresh={handleRefresh}
                  isDetailsScreen
                  pageData={pageData}
                  selectedItem={selectedDataset}
                />
              )}
            </div>
          </div>
        </div>
        {convertedYaml.length > 0 && (
          <YamlModal convertedYaml={convertedYaml} toggleConvertToYaml={toggleConvertedYaml} />
        )}
        {artifactsStore?.preview?.isPreview && (
          <PreviewModal artifact={artifactsStore?.preview?.selectedItem} />
        )}
      </>
    )
  }
)

DatasetsView.defaultProps = {
  viewMode: null,
  urlTagOption: null
}

DatasetsView.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  applyDetailsChanges: PropTypes.func.isRequired,
  applyDetailsChangesCallback: PropTypes.func.isRequired,
  artifactsStore: PropTypes.object.isRequired,
  convertedYaml: PropTypes.string.isRequired,
  datasets: PropTypes.arrayOf(PropTypes.object).isRequired,
  detailsFormInitialValues: PropTypes.object.isRequired,
  filtersStore: PropTypes.object.isRequired,
  handleExpandRow: PropTypes.func.isRequired,
  handleRefresh: PropTypes.func.isRequired,
  handleRegisterDataset: PropTypes.func.isRequired,
  largeRequestErrorMessage: PropTypes.string.isRequired,
  pageData: PropTypes.object.isRequired,
  selectedDataset: PropTypes.object.isRequired,
  selectedRowData: PropTypes.object.isRequired,
  setDatasets: PropTypes.func.isRequired,
  setSelectedDataset: PropTypes.func.isRequired,
  setSelectedRowData: PropTypes.func.isRequired,
  sortProps: SORT_PROPS,
  tableContent: PropTypes.arrayOf(PropTypes.object).isRequired,
  tableHeaders: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleConvertedYaml: PropTypes.func.isRequired,
  urlTagOption: PropTypes.string,
  viewMode: PropTypes.string,
  virtualizationConfig: VIRTUALIZATION_CONFIG.isRequired
}

export default DatasetsView
