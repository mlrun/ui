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

import ArtifactsActionBar from '../ArtifactsActionBar/ArtifactsActionBar'
import NoData from '../../common/NoData/NoData'
import Table from '../Table/Table'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import RegisterArtifactModal from '../RegisterArtifactModal/RegisterArtifactModal'
import YamlModal from '../../common/YamlModal/YamlModal'
import Loader from '../../common/Loader/Loader'
import PageActionsMenu from '../../common/PageActionsMenu/PageActionsMenu'
import PreviewModal from '../../elements/PreviewModal/PreviewModal'
import ArtifactsTableRow from '../../elements/ArtifactsTableRow/ArtifactsTableRow'

import { ARTIFACT_TYPE, FILES_FILTERS, FILES_PAGE, FULL_VIEW_MODE } from '../../constants'
import { getNoDataMessage } from '../../utils/getNoDataMessage'
import { actionsMenuHeader, filters } from './files.util'
import { openPopUp } from 'igz-controls/utils/common.util'
import { removeFile } from '../../reducers/artifactsReducer'
import Details from '../Details/Details'

const FilesView = React.forwardRef(
  (
    {
      actionsMenu,
      applyDetailsChanges,
      applyDetailsChangesCallback,
      artifactsStore,
      convertedYaml,
      detailsFormInitialValues,
      files,
      filtersStore,
      handleExpandRow,
      handleRefresh,
      pageData,
      selectedFile,
      selectedRowData,
      setFiles,
      setSelectedFile,
      setSelectedRowData,
      tableContent,
      toggleConvertedYaml,
      viewMode,
      urlTagOption
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
                  artifactKind: ARTIFACT_TYPE,
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
                  filterMenuName={FILES_FILTERS}
                  handleRefresh={handleRefresh}
                  page={FILES_PAGE}
                  removeSelectedItem={removeFile}
                  setContent={setFiles}
                  setSelectedRowData={setSelectedRowData}
                  urlTagOption={urlTagOption}
                />
              </div>
              {artifactsStore.loading ? null : files.length === 0 ? (
                <NoData
                  message={getNoDataMessage(filtersStore, filters, FILES_PAGE, null, FILES_FILTERS)}
                />
              ) : (
                <>
                  {selectedRowData.loading && <Loader />}
                  <Table
                    actionsMenu={actionsMenu}
                    applyDetailsChanges={applyDetailsChanges}
                    applyDetailsChangesCallback={applyDetailsChangesCallback}
                    content={files}
                    detailsFormInitialValues={detailsFormInitialValues}
                    handleCancel={() => setSelectedFile({})}
                    pageData={pageData}
                    retryRequest={handleRefresh}
                    selectedItem={selectedFile}
                    tableHeaders={tableContent[0]?.content ?? []}
                  >
                    {tableContent.map((tableItem, index) => (
                      <ArtifactsTableRow
                        actionsMenu={actionsMenu}
                        handleExpandRow={handleExpandRow}
                        key={index}
                        rowIndex={index}
                        rowItem={tableItem}
                        selectedItem={selectedFile}
                        selectedRowData={selectedRowData}
                      />
                    ))}
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
                  selectedItem={selectedFile}
                />
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

FilesView.defaultProps = {
  viewMode: null,
  urlTagOption: null
}

FilesView.propTypes = {
  actionsMenu: PropTypes.arrayOf(PropTypes.object).isRequired,
  applyDetailsChanges: PropTypes.func.isRequired,
  applyDetailsChangesCallback: PropTypes.func.isRequired,
  artifactsStore: PropTypes.object.isRequired,
  convertedYaml: PropTypes.string.isRequired,
  detailsFormInitialValues: PropTypes.object.isRequired,
  files: PropTypes.arrayOf(PropTypes.object).isRequired,
  filtersStore: PropTypes.object.isRequired,
  handleExpandRow: PropTypes.func.isRequired,
  handleRefresh: PropTypes.func.isRequired,
  pageData: PropTypes.object.isRequired,
  selectedFile: PropTypes.object.isRequired,
  selectedRowData: PropTypes.object.isRequired,
  setSelectedFile: PropTypes.func.isRequired,
  tableContent: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleConvertedYaml: PropTypes.func.isRequired,
  viewMode: PropTypes.string,
  urlTagOption: PropTypes.string
}

export default FilesView
