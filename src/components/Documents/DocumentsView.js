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
import Table from '../Table/Table'

import { ACTIONS_MENU } from '../../types'
import { ALL_VERSIONS_PATH, DOCUMENTS_PAGE, DOCUMENTS_TAB, FULL_VIEW_MODE } from '../../constants'
import { getCloseDetailsLink } from '../../utils/link-helper.util'
import { getDefaultFirstHeader } from '../../utils/createArtifactsContent'
import { getNoDataMessage } from '../../utils/getNoDataMessage'

const DocumentsView = React.forwardRef(
  (
    {
      actionsMenu,
      applyDetailsChanges,
      applyDetailsChangesCallback,
      artifactsStore,
      detailsFormInitialValues,
      documents,
      documentName,
      filters,
      filtersConfig,
      filtersStore,
      getAndSetSelectedArtifact,
      handleRefreshDocuments,
      handleRefreshWithFilters,
      historyBackLink,
      isAllVersions,
      pageData,
      paginationConfigDocumentsRef,
      projectName,
      requestErrorMessage,
      selectedDocument,
      setSearchDocumentsParams,
      setSelectedDocument,
      tableContent,
      tableHeaders,
      viewMode = null
    },
    { documentsRef }
  ) => {
    return (
      <>
        <div className="content-wrapper" ref={documentsRef}>
          <div className="content__header">
            <Breadcrumbs />
          </div>
          <div className="content">
            {artifactsStore.loading && <Loader />}
            <div className="table-container">
              <div className="content__action-bar-wrapper">
                {isAllVersions && (
                  <HistoryBackLink itemName={documentName} link={historyBackLink} />
                )}
                <ActionBar
                  closeParamName={isAllVersions ? ALL_VERSIONS_PATH : DOCUMENTS_TAB}
                  filters={filters}
                  filtersConfig={filtersConfig}
                  handleRefresh={handleRefreshDocuments}
                  setSearchParams={setSearchDocumentsParams}
                  withRefreshButton
                  withoutExpandButton
                >
                  <ArtifactsFilters artifacts={documents} />
                </ActionBar>
              </div>
              {artifactsStore.loading ? null : tableContent.length === 0 &&
                isEmpty(selectedDocument) ? (
                <NoData
                  message={getNoDataMessage(
                    filters,
                    filtersConfig,
                    requestErrorMessage,
                    DOCUMENTS_PAGE,
                    null,
                    filtersStore
                  )}
                />
              ) : (
                <>
                  {artifactsStore.documents.documentLoading && <Loader />}
                  <Table
                    actionsMenu={actionsMenu}
                    applyDetailsChanges={applyDetailsChanges}
                    applyDetailsChangesCallback={applyDetailsChangesCallback}
                    detailsFormInitialValues={detailsFormInitialValues}
                    getCloseDetailsLink={() =>
                      getCloseDetailsLink(isAllVersions ? ALL_VERSIONS_PATH : DOCUMENTS_TAB)
                    }
                    handleCancel={() => setSelectedDocument({})}
                    pageData={pageData}
                    retryRequest={handleRefreshWithFilters}
                    selectedItem={selectedDocument}
                    tableClassName="documents-table"
                    tableHeaders={!isEmpty(tableHeaders) ? tableHeaders : getDefaultFirstHeader(isAllVersions)}
                    viewMode={viewMode}
                  >
                    {tableContent.map((tableItem, index) => (
                      <ArtifactsTableRow
                        actionsMenu={actionsMenu}
                        key={tableItem.data.ui.identifierUnique}
                        rowIndex={index}
                        rowItem={tableItem}
                        selectedItem={selectedDocument}
                      />
                    ))}
                  </Table>
                  <Pagination
                    paginationConfig={paginationConfigDocumentsRef.current}
                    closeParamName={isAllVersions ? ALL_VERSIONS_PATH : DOCUMENTS_TAB}
                  />
                </>
              )}
              {viewMode === FULL_VIEW_MODE && !isEmpty(selectedDocument) && (
                <Details
                  actionsMenu={actionsMenu}
                  applyDetailsChanges={applyDetailsChanges}
                  applyDetailsChangesCallback={applyDetailsChangesCallback}
                  formInitialValues={detailsFormInitialValues}
                  detailsMenu={pageData.details.menu}
                  handleRefresh={getAndSetSelectedArtifact}
                  isDetailsScreen
                  pageData={pageData}
                  selectedItem={selectedDocument}
                />
              )}
            </div>
          </div>
        </div>
      </>
    )
  }
)

DocumentsView.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  applyDetailsChanges: PropTypes.func.isRequired,
  applyDetailsChangesCallback: PropTypes.func.isRequired,
  artifactsStore: PropTypes.object.isRequired,
  detailsFormInitialValues: PropTypes.object.isRequired,
  documentName: PropTypes.string,
  documents: PropTypes.arrayOf(PropTypes.object).isRequired,
  filters: PropTypes.object.isRequired,
  filtersConfig: PropTypes.object.isRequired,
  filtersStore: PropTypes.object.isRequired,
  getAndSetSelectedArtifact: PropTypes.func.isRequired,
  handleRefreshDocuments: PropTypes.func.isRequired,
  handleRefreshWithFilters: PropTypes.func.isRequired,
  historyBackLink: PropTypes.string.isRequired,
  isAllVersions: PropTypes.bool.isRequired,
  pageData: PropTypes.object.isRequired,
  projectName: PropTypes.string.isRequired,
  requestErrorMessage: PropTypes.string.isRequired,
  selectedDocument: PropTypes.object.isRequired,
  setSearchDocumentsParams: PropTypes.func.isRequired,
  setSelectedDocument: PropTypes.func.isRequired,
  tableContent: PropTypes.arrayOf(PropTypes.object).isRequired,
  tableHeaders: PropTypes.arrayOf(PropTypes.object).isRequired,
  viewMode: PropTypes.string
}

export default DocumentsView
