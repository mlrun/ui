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

import { FILES_PAGE, FULL_VIEW_MODE, ALL_VERSIONS_PATH, FILES_TAB } from '../../constants'
import { ACTIONS_MENU } from '../../types'
import { SECONDARY_BUTTON } from 'igz-controls/constants'
import { getCloseDetailsLink } from '../../utils/link-helper.util'
import { getNoDataMessage } from '../../utils/getNoDataMessage'
import { getSavedSearchParams } from '../../utils/filter.util'
import { registerArtifactTitle } from './files.util'

const FilesView = React.forwardRef(
  (
    {
      actionsMenu,
      applyDetailsChanges,
      applyDetailsChangesCallback,
      artifactsStore,
      detailsFormInitialValues,
      fileName,
      files,
      filters,
      filtersConfig,
      filtersStore,
      getAndSetSelectedArtifact,
      handleRefreshFiles,
      handleRefreshWithFilters,
      handleRegisterArtifact,
      isAllVersions,
      pageData,
      paginationConfigFilesRef,
      projectName,
      requestErrorMessage,
      selectedFile,
      setSearchFilesParams,
      setSelectedFileMin,
      tableContent,
      tableHeaders,
      viewMode = null
    },
    { filesRef }
  ) => {
    return (
      <>
        <div className="content-wrapper" ref={filesRef}>
          <div className="content__header">
            <Breadcrumbs />
          </div>
          <div className="content">
            {artifactsStore.loading && <Loader />}
            <div className="table-container">
              <div className="content__action-bar-wrapper">
                {isAllVersions && (
                  <HistoryBackLink
                    itemName={fileName}
                    link={`/projects/${projectName}/files${getSavedSearchParams(window.location.search)}`}
                  />
                )}
                <ActionBar
                  actionButtons={[
                    {
                      variant: SECONDARY_BUTTON,
                      label: registerArtifactTitle,
                      className: 'action-button',
                      onClick: handleRegisterArtifact
                    }
                  ]}
                  filters={filters}
                  filtersConfig={filtersConfig}
                  navigateLink={`/projects/${projectName}/files${isAllVersions ? `/${fileName}/${ALL_VERSIONS_PATH}` : ''}${window.location.search}`}
                  handleRefresh={handleRefreshFiles}
                  page={FILES_PAGE}
                  setSearchParams={setSearchFilesParams}
                  withRefreshButton
                  withoutExpandButton
                >
                  <ArtifactsFilters artifacts={files} />
                </ActionBar>
              </div>
              {artifactsStore.loading ? null : tableContent.length === 0 ? (
                <NoData
                  message={getNoDataMessage(
                    filters,
                    filtersConfig,
                    requestErrorMessage,
                    FILES_PAGE,
                    null,
                    filtersStore
                  )}
                />
              ) : (
                <>
                  {artifactsStore.files.fileLoading && <Loader />}
                  <Table
                    actionsMenu={actionsMenu}
                    applyDetailsChanges={applyDetailsChanges}
                    applyDetailsChangesCallback={applyDetailsChangesCallback}
                    detailsFormInitialValues={detailsFormInitialValues}
                    getCloseDetailsLink={() =>
                      getCloseDetailsLink(isAllVersions ? ALL_VERSIONS_PATH : FILES_TAB)
                    }
                    handleCancel={() => setSelectedFileMin({})}
                    pageData={pageData}
                    retryRequest={handleRefreshWithFilters}
                    selectedItem={selectedFile}
                    tableClassName="files-table"
                    tableHeaders={tableHeaders ?? []}
                  >
                    {tableContent.map((tableItem, index) => (
                      <ArtifactsTableRow
                        actionsMenu={actionsMenu}
                        key={tableItem.data.ui.identifierUnique}
                        rowIndex={index}
                        rowItem={tableItem}
                        selectedItem={selectedFile}
                      />
                    ))}
                  </Table>
                  <Pagination
                    paginationConfig={paginationConfigFilesRef.current}
                    closeParamName={isAllVersions ? ALL_VERSIONS_PATH : FILES_TAB}
                  />
                </>
              )}
              {viewMode === FULL_VIEW_MODE && !isEmpty(selectedFile) && (
                <Details
                  actionsMenu={actionsMenu}
                  applyDetailsChanges={applyDetailsChanges}
                  applyDetailsChangesCallback={applyDetailsChangesCallback}
                  formInitialValues={detailsFormInitialValues}
                  detailsMenu={pageData.details.menu}
                  handleRefresh={getAndSetSelectedArtifact}
                  isDetailsScreen
                  pageData={pageData}
                  selectedItem={selectedFile}
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

FilesView.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  applyDetailsChanges: PropTypes.func.isRequired,
  applyDetailsChangesCallback: PropTypes.func.isRequired,
  artifactsStore: PropTypes.object.isRequired,
  detailsFormInitialValues: PropTypes.object.isRequired,
  fileName: PropTypes.string,
  files: PropTypes.arrayOf(PropTypes.object).isRequired,
  filters: PropTypes.object.isRequired,
  filtersConfig: PropTypes.object.isRequired,
  filtersStore: PropTypes.object.isRequired,
  getAndSetSelectedArtifact: PropTypes.func.isRequired,
  handleRefreshFiles: PropTypes.func.isRequired,
  handleRefreshWithFilters: PropTypes.func.isRequired,
  handleRegisterArtifact: PropTypes.func.isRequired,
  isAllVersions: PropTypes.bool.isRequired,
  pageData: PropTypes.object.isRequired,
  projectName: PropTypes.string.isRequired,
  requestErrorMessage: PropTypes.string.isRequired,
  selectedFile: PropTypes.object.isRequired,
  setSearchFilesParams: PropTypes.func.isRequired,
  setSelectedFileMin: PropTypes.func.isRequired,
  tableContent: PropTypes.arrayOf(PropTypes.object).isRequired,
  tableHeaders: PropTypes.arrayOf(PropTypes.object).isRequired,
  viewMode: PropTypes.string
}

export default FilesView
