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

import NoData from '../../common/NoData/NoData'
import Table from '../Table/Table'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import Loader from '../../common/Loader/Loader'
import PreviewModal from '../../elements/PreviewModal/PreviewModal'
import ArtifactsTableRow from '../../elements/ArtifactsTableRow/ArtifactsTableRow'
import Details from '../Details/Details'
import WarningMessage from '../../common/WarningMessage/WarningMessage'
import ActionBar from '../ActionBar/ActionBar'

import { ACTIONS_MENU, VIRTUALIZATION_CONFIG } from '../../types'
import { FILES_PAGE, FULL_VIEW_MODE } from '../../constants'
import { SECONDARY_BUTTON } from 'igz-controls/constants'
import { SORT_PROPS } from 'igz-controls/types'
import { getNoDataMessage } from '../../utils/getNoDataMessage'
import { isRowRendered } from '../../hooks/useVirtualization.hook'
import { registerArtifactTitle, filtersConfig } from './files.util'
import ArtifactsFilters from '../ArtifactsActionBar/ArtifactsFilters'

const FilesView = React.forwardRef(
  (
    {
      actionsMenu,
      applyDetailsChanges,
      applyDetailsChangesCallback,
      artifactsStore,
      detailsFormInitialValues,
      files,
      filters,
      filtersStore,
      getAndSetSelectedArtifact,
      handleExpandRow,
      handleRefresh,
      handleRefreshWithFilters,
      handleRegisterArtifact,
      handleSelectFile,
      maxArtifactsErrorIsShown,
      pageData,
      requestErrorMessage,
      selectedFile,
      selectedRowData,
      setMaxArtifactsErrorIsShown,
      setSelectedFileMin,
      sortProps,
      tableContent,
      tableHeaders,
      viewMode = null,
      virtualizationConfig
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
                  handleRefresh={handleRefresh}
                  page={FILES_PAGE}
                  withRefreshButton
                  withoutExpandButton
                >
                  <ArtifactsFilters artifacts={files} />
                </ActionBar>
              </div>
              {artifactsStore.loading ? null : files.length === 0 ? (
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
                  {(selectedRowData.loading || artifactsStore.files.fileLoading) && <Loader />}
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
                    handleCancel={() => setSelectedFileMin({})}
                    pageData={pageData}
                    retryRequest={handleRefreshWithFilters}
                    selectedItem={selectedFile}
                    sortProps={sortProps}
                    tableClassName="files-table"
                    tableHeaders={tableHeaders ?? []}
                    virtualizationConfig={virtualizationConfig}
                  >
                    {tableContent.map(
                      (tableItem, index) =>
                        isRowRendered(virtualizationConfig, index) && (
                          <ArtifactsTableRow
                            actionsMenu={actionsMenu}
                            handleExpandRow={handleExpandRow}
                            handleSelectItem={handleSelectFile}
                            key={tableItem.data.ui.identifier}
                            rowIndex={index}
                            rowItem={tableItem}
                            selectedItem={selectedFile}
                            selectedRowData={selectedRowData}
                          />
                        )
                    )}
                  </Table>
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
  files: PropTypes.arrayOf(PropTypes.object).isRequired,
  filters: PropTypes.object.isRequired,
  filtersStore: PropTypes.object.isRequired,
  getAndSetSelectedArtifact: PropTypes.func.isRequired,
  handleExpandRow: PropTypes.func.isRequired,
  handleRefresh: PropTypes.func.isRequired,
  handleRefreshWithFilters: PropTypes.func.isRequired,
  handleRegisterArtifact: PropTypes.func.isRequired,
  handleSelectFile: PropTypes.func.isRequired,
  maxArtifactsErrorIsShown: PropTypes.bool.isRequired,
  pageData: PropTypes.object.isRequired,
  requestErrorMessage: PropTypes.string.isRequired,
  selectedFile: PropTypes.object.isRequired,
  selectedRowData: PropTypes.object.isRequired,
  setMaxArtifactsErrorIsShown: PropTypes.func.isRequired,
  setSelectedFileMin: PropTypes.func.isRequired,
  sortProps: SORT_PROPS,
  tableContent: PropTypes.arrayOf(PropTypes.object).isRequired,
  tableHeaders: PropTypes.arrayOf(PropTypes.object).isRequired,
  viewMode: PropTypes.string,
  virtualizationConfig: VIRTUALIZATION_CONFIG.isRequired
}

export default FilesView
