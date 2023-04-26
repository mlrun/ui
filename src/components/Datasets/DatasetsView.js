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
import { useParams } from 'react-router-dom'

import PreviewModal from '../../elements/PreviewModal/PreviewModal'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import PageActionsMenu from '../../common/PageActionsMenu/PageActionsMenu'
import Table from '../Table/Table'
import ArtifactsTableRow from '../../elements/ArtifactsTableRow/ArtifactsTableRow'
import YamlModal from '../../common/YamlModal/YamlModal'
import RegisterArtifactModal from '../RegisterArtifactModal/RegisterArtifactModal'
import Loader from '../../common/Loader/Loader'
import ArtifactsActionBar from '../ArtifactsActionBar/ArtifactsActionBar'
import NoData from '../../common/NoData/NoData'

import { DATASET_TYPE, DATASETS_PAGE } from '../../constants'
import { getNoDataMessage } from '../../utils/getNoDataMessage'
import { actionsMenuHeader, filters } from './datasets.util'
import { openPopUp } from 'igz-controls/utils/common.util'
import { removeDataSet } from '../../reducers/artifactsReducer'

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
      pageData,
      selectedDataset,
      selectedRowData,
      setDatasets,
      setSelectedDataset,
      setSelectedRowData,
      tableContent,
      toggleConvertedYaml
    },
    ref
  ) => {
    const params = useParams()

    return (
      <>
        <div className="content-wrapper" ref={ref}>
          <div className="content__header">
            <Breadcrumbs />
            <PageActionsMenu
              actionsMenuHeader={actionsMenuHeader}
              onClick={() =>
                openPopUp(RegisterArtifactModal, {
                  artifactKind: DATASET_TYPE,
                  projectName: params.projectName,
                  refresh: handleRefresh,
                  title: actionsMenuHeader
                })
              }
              showActionsMenu
            />
          </div>
          <div className="content">
            {artifactsStore.loading && <Loader />}
            <div className="table-container">
              <div className="content__action-bar-wrapper">
                <ArtifactsActionBar
                  filterMenuName={DATASETS_PAGE}
                  handleRefresh={handleRefresh}
                  page={DATASETS_PAGE}
                  removeSelectedItem={removeDataSet}
                  setContent={setDatasets}
                  setSelectedRowData={setSelectedRowData}
                />
              </div>
              {artifactsStore.loading ? null : datasets.length === 0 ? (
                <NoData message={getNoDataMessage(filtersStore, filters, DATASETS_PAGE)} />
              ) : (
                <>
                  <Table
                    applyDetailsChanges={applyDetailsChanges}
                    applyDetailsChangesCallback={applyDetailsChangesCallback}
                    actionsMenu={actionsMenu}
                    content={datasets}
                    detailsFormInitialValues={detailsFormInitialValues}
                    handleCancel={() => setSelectedDataset({})}
                    pageData={pageData}
                    retryRequest={handleRefresh}
                    selectedItem={selectedDataset}
                    tableHeaders={tableContent[0]?.content ?? []}
                  >
                    {tableContent.map((tableItem, index) => (
                      <ArtifactsTableRow
                        actionsMenu={actionsMenu}
                        handleExpandRow={handleExpandRow}
                        key={index}
                        rowItem={tableItem}
                        selectedItem={selectedDataset}
                        selectedRowData={selectedRowData}
                      />
                    ))}
                  </Table>
                </>
              )}
            </div>
          </div>
        </div>
        {convertedYaml.length > 0 && (
          <YamlModal convertedYaml={convertedYaml} toggleConvertToYaml={toggleConvertedYaml} />
        )}
        {artifactsStore?.preview?.isPreview && (
          <PreviewModal item={artifactsStore?.preview?.selectedItem} />
        )}
      </>
    )
  }
)

DatasetsView.propTypes = {
  actionsMenu: PropTypes.arrayOf(PropTypes.object).isRequired,
  applyDetailsChanges: PropTypes.func.isRequired,
  applyDetailsChangesCallback: PropTypes.func.isRequired,
  artifactsStore: PropTypes.object.isRequired,
  convertedYaml: PropTypes.string.isRequired,
  datasets: PropTypes.arrayOf(PropTypes.object).isRequired,
  detailsFormInitialValues: PropTypes.object.isRequired,
  filtersStore: PropTypes.object.isRequired,
  handleExpandRow: PropTypes.func.isRequired,
  handleRefresh: PropTypes.func.isRequired,
  pageData: PropTypes.object.isRequired,
  selectedDataset: PropTypes.object.isRequired,
  selectedRowData: PropTypes.object.isRequired,
  setDatasets: PropTypes.func.isRequired,
  setSelectedDataset: PropTypes.func.isRequired,
  setSelectedRowData: PropTypes.func.isRequired,
  tableContent: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleConvertedYaml: PropTypes.func.isRequired
}

export default DatasetsView
