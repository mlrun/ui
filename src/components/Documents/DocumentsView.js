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

import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import Loader from '../../common/Loader/Loader'
import ActionBar from '../ActionBar/ActionBar'
import ArtifactsFilters from '../ArtifactsActionBar/ArtifactsFilters'
import Table from '../Table/Table'
import NoData from '../../common/NoData/NoData'
import WarningMessage from '../../common/WarningMessage/WarningMessage'
import ArtifactsTableRow from '../../elements/ArtifactsTableRow/ArtifactsTableRow'
import Details from '../Details/Details'

import { ALL_VERSIONS_PATH, DOCUMENTS_PAGE, DOCUMENTS_TAB, FULL_VIEW_MODE } from '../../constants'
import HistoryBackLink from '../../common/HistoryBackLink/historyBackLink'
import { getSavedSearchParams } from '../../utils/filter.util'
import { getNoDataMessage } from '../../utils/getNoDataMessage'
import { isRowRendered } from '../../hooks/useVirtualization.hook'
import { getCloseDetailsLink } from '../../utils/link-helper.util'
import { ACTIONS_MENU, VIRTUALIZATION_CONFIG } from '../../types'
import { SORT_PROPS } from 'igz-controls/types'

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
      handleRefresh,
      handleRefreshWithFilters,
      isAllVersions,
      maxArtifactsErrorIsShown,
      pageData,
      projectName,
      requestErrorMessage,
      selectedDocument,
      setMaxArtifactsErrorIsShown,
      setSearchParams,
      setSelectedDocumentMin,
      sortProps,
      tableContent,
      tableHeaders,
      viewMode = null,
      virtualizationConfig
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
                  <HistoryBackLink
                    itemName={documentName}
                    link={`/projects/${projectName}/${DOCUMENTS_TAB}${getSavedSearchParams(window.location.search)}`}
                  />
                )}
                <ActionBar
                  filters={filters}
                  filtersConfig={filtersConfig}
                  navigateLink={`/projects/${projectName}/${DOCUMENTS_TAB}${isAllVersions ? `/${documentName}/${ALL_VERSIONS_PATH}` : ''}${window.location.search}`}
                  handleRefresh={handleRefresh}
                  page={DOCUMENTS_PAGE}
                  setSearchParams={setSearchParams}
                  withRefreshButton
                  withoutExpandButton
                >
                  <ArtifactsFilters artifacts={documents} />
                </ActionBar>
              </div>
              {artifactsStore.loading ? null : documents.length === 0 ? (
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
                    getCloseDetailsLink={() =>
                      getCloseDetailsLink(isAllVersions ? ALL_VERSIONS_PATH : DOCUMENTS_TAB)
                    }
                    handleCancel={() => setSelectedDocumentMin({})}
                    pageData={pageData}
                    retryRequest={handleRefreshWithFilters}
                    selectedItem={selectedDocument}
                    sortProps={sortProps}
                    tableClassName="documents-table"
                    tableHeaders={tableHeaders ?? []}
                    virtualizationConfig={virtualizationConfig}
                  >
                    {tableContent.map(
                      (tableItem, index) =>
                        isRowRendered(virtualizationConfig, index) && (
                          <ArtifactsTableRow
                            actionsMenu={actionsMenu}
                            key={tableItem.data.ui.identifierUnique}
                            rowIndex={index}
                            rowItem={tableItem}
                            selectedItem={selectedDocument}
                          />
                        )
                    )}
                  </Table>
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
  documents: PropTypes.arrayOf(PropTypes.object).isRequired,
  documentName: PropTypes.string,
  filters: PropTypes.object.isRequired,
  filtersConfig: PropTypes.object.isRequired,
  filtersStore: PropTypes.object.isRequired,
  getAndSetSelectedArtifact: PropTypes.func.isRequired,
  handleRefresh: PropTypes.func.isRequired,
  handleRefreshWithFilters: PropTypes.func.isRequired,
  isAllVersions: PropTypes.bool.isRequired,
  maxArtifactsErrorIsShown: PropTypes.bool.isRequired,
  pageData: PropTypes.object.isRequired,
  projectName: PropTypes.string.isRequired,
  requestErrorMessage: PropTypes.string.isRequired,
  selectedDocument: PropTypes.object.isRequired,
  setMaxArtifactsErrorIsShown: PropTypes.func.isRequired,
  setSearchParams: PropTypes.func.isRequired,
  setSelectedDocumentMin: PropTypes.func.isRequired,
  sortProps: SORT_PROPS,
  tableContent: PropTypes.arrayOf(PropTypes.object).isRequired,
  tableHeaders: PropTypes.arrayOf(PropTypes.object).isRequired,
  viewMode: PropTypes.string,
  virtualizationConfig: VIRTUALIZATION_CONFIG.isRequired
}

export default DocumentsView
