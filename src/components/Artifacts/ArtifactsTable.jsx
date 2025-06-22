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
import ArtifactsFilters from '../ArtifactsActionBar/ArtifactsFilters'
import ActionBar from '../ActionBar/ActionBar'
import HistoryBackLink from '../../common/HistoryBackLink/historyBackLink'
import Details from '../Details/Details'
import ArtifactsTableRow from '../../elements/ArtifactsTableRow/ArtifactsTableRow'
import Pagination from '../../common/Pagination/Pagination'
import { Loader } from 'igz-controls/components'

import { ALL_VERSIONS_PATH } from '../../constants'
import { FULL_VIEW_MODE } from 'igz-controls/constants'
import { getCloseDetailsLink } from '../../utils/link-helper.util'
import { getDefaultFirstHeader } from '../../utils/createArtifactsContent'
import { getNoDataMessage } from '../../utils/getNoDataMessage'

let ArtifactsTable = ({
  actionButtons,
  actionsMenu,
  applyDetailsChanges,
  applyDetailsChangesCallback,
  artifactName,
  artifacts,
  artifactsStore,
  detailsFormInitialValues,
  filters,
  filtersConfig,
  filtersStore,
  getAndSetSelectedArtifact,
  handleRefreshArtifacts,
  historyBackLink,
  isAllVersions,
  isOnlyTabScreen,
  page,
  pageData,
  paginationConfigArtifactsRef,
  requestErrorMessage,
  renderPageTabs = null,
  selectedArtifact,
  setSearchArtifactsParams,
  setSelectedArtifact,
  storeArtifactTypeLoading,
  tab = '',
  tableContent,
  tableHeaders,
  viewMode
}) => {
  return (
    <div className="table-container">
      <div className="content__action-bar-wrapper">
        {renderPageTabs && renderPageTabs()}
        <ActionBar
          actionButtons={actionButtons}
          closeParamName={isAllVersions ? ALL_VERSIONS_PATH : tab || page}
          filters={filters}
          filtersConfig={filtersConfig}
          handleRefresh={handleRefreshArtifacts}
          setSearchParams={setSearchArtifactsParams}
          selectedItemName={artifactName}
          tab={tab}
          withRefreshButton
          withoutExpandButton
        >
          <ArtifactsFilters
            artifacts={artifacts}
            filtersConfig={filtersConfig}
            isAllVersions={isAllVersions}
          />
        </ActionBar>
      </div>
      {isAllVersions &&
        (isOnlyTabScreen ? (
          <div className="content__history-back-link-wrapper">
            <HistoryBackLink itemName={artifactName} link={historyBackLink} />
          </div>
        ) : (
          <HistoryBackLink itemName={artifactName} link={historyBackLink} />
        ))}
      {artifactsStore.loading ? null : tableContent.length === 0 && isEmpty(selectedArtifact) ? (
        <NoData
          message={getNoDataMessage(
            filters,
            filtersConfig,
            requestErrorMessage,
            page,
            tab,
            filtersStore
          )}
        />
      ) : (
        <>
          {storeArtifactTypeLoading && <Loader />}
          <Table
            actionsMenu={actionsMenu}
            applyDetailsChanges={applyDetailsChanges}
            applyDetailsChangesCallback={applyDetailsChangesCallback}
            detailsFormInitialValues={detailsFormInitialValues}
            getCloseDetailsLink={() =>
              getCloseDetailsLink(
                isAllVersions ? ALL_VERSIONS_PATH : tab || page,
                false,
                artifactName
              )
            }
            handleCancel={() => setSelectedArtifact({})}
            pageData={pageData}
            selectedItem={selectedArtifact}
            tableClassName="artifacts-table"
            tableHeaders={
              !isEmpty(tableHeaders) ? tableHeaders : getDefaultFirstHeader(isAllVersions)
            }
            viewMode={viewMode}
          >
            {tableContent.map((tableItem, index) => (
              <ArtifactsTableRow
                actionsMenu={actionsMenu}
                key={tableItem.data.ui.identifierUnique}
                rowIndex={index}
                rowItem={tableItem}
                selectedItem={selectedArtifact}
                tab={tab}
              />
            ))}
          </Table>
          <Pagination
            paginationConfig={paginationConfigArtifactsRef.current}
            closeParamName={isAllVersions ? ALL_VERSIONS_PATH : tab || page}
            selectedItemName={artifactName}
          />
        </>
      )}
      {viewMode === FULL_VIEW_MODE && !isEmpty(selectedArtifact) && (
        <Details
          actionsMenu={actionsMenu}
          applyDetailsChanges={applyDetailsChanges}
          applyDetailsChangesCallback={applyDetailsChangesCallback}
          formInitialValues={detailsFormInitialValues}
          detailsMenu={pageData.details.menu}
          handleRefresh={getAndSetSelectedArtifact}
          isDetailsScreen
          pageData={pageData}
          selectedItem={selectedArtifact}
        />
      )}
    </div>
  )
}

ArtifactsTable.propTypes = {
  actionButtons: PropTypes.array,
  actionsMenu: PropTypes.func.isRequired,
  applyDetailsChanges: PropTypes.func.isRequired,
  applyDetailsChangesCallback: PropTypes.func.isRequired,
  artifactName: PropTypes.string.isRequired,
  artifacts: PropTypes.array.isRequired,
  artifactsStore: PropTypes.object.isRequired,
  detailsFormInitialValues: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  filtersConfig: PropTypes.object.isRequired,
  filtersStore: PropTypes.object.isRequired,
  getAndSetSelectedArtifact: PropTypes.func.isRequired,
  handleRefreshArtifacts: PropTypes.func.isRequired,
  historyBackLink: PropTypes.string.isRequired,
  isAllVersions: PropTypes.bool.isRequired,
  isOnlyTabScreen: PropTypes.bool.isRequired,
  page: PropTypes.string.isRequired,
  pageData: PropTypes.object.isRequired,
  paginationConfigArtifactsRef: PropTypes.object.isRequired,
  requestErrorMessage: PropTypes.string,
  renderPageTabs: PropTypes.func,
  selectedArtifact: PropTypes.object.isRequired,
  setSearchArtifactsParams: PropTypes.func.isRequired,
  setSelectedArtifact: PropTypes.func.isRequired,
  storeArtifactTypeLoading: PropTypes.bool.isRequired,
  tab: PropTypes.string,
  tableContent: PropTypes.array.isRequired,
  tableHeaders: PropTypes.array.isRequired,
  viewMode: PropTypes.string.isRequired
}

export default ArtifactsTable
