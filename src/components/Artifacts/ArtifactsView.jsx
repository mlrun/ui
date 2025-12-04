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

import ArtifactsTable from './ArtifactsTable'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import PreviewModal from '../../elements/PreviewModal/PreviewModal'
import { Loader } from 'igz-controls/components'

import './artifacts.scss'

let ArtifactsView = React.forwardRef(
  (
    {
      actionButtons = [],
      actionsMenu,
      applyDetailsChanges,
      applyDetailsChangesCallback,
      artifactName = '',
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
      params,
      requestErrorMessage = '',
      renderPageTabs = null,
      selectedArtifact,
      setSearchArtifactsParams,
      setSelectedArtifact,
      storeArtifactTypeLoading,
      tab = '',
      tableContent,
      tableHeaders,
      viewMode = ''
    },
    { artifactsRef }
  ) => {
    return isOnlyTabScreen ? (
      <div className="models" ref={artifactsRef}>
        <ArtifactsTable
          actionButtons={actionButtons}
          actionsMenu={actionsMenu}
          applyDetailsChanges={applyDetailsChanges}
          applyDetailsChangesCallback={applyDetailsChangesCallback}
          artifactName={artifactName}
          artifacts={artifacts}
          artifactsStore={artifactsStore}
          detailsFormInitialValues={detailsFormInitialValues}
          filters={filters}
          filtersConfig={filtersConfig}
          filtersStore={filtersStore}
          getAndSetSelectedArtifact={getAndSetSelectedArtifact}
          handleRefreshArtifacts={handleRefreshArtifacts}
          historyBackLink={historyBackLink}
          isAllVersions={isAllVersions}
          isOnlyTabScreen={isOnlyTabScreen}
          page={page}
          pageData={pageData}
          paginationConfigArtifactsRef={paginationConfigArtifactsRef}
          requestErrorMessage={requestErrorMessage}
          renderPageTabs={renderPageTabs}
          selectedArtifact={selectedArtifact}
          setSearchArtifactsParams={setSearchArtifactsParams}
          setSelectedArtifact={setSelectedArtifact}
          storeArtifactTypeLoading={storeArtifactTypeLoading}
          tab={tab}
          tableContent={tableContent}
          tableHeaders={tableHeaders}
          viewMode={viewMode}
        />
      </div>
    ) : (
      <>
        <div className="content-wrapper" ref={artifactsRef}>
          <div className="content__header">
            <Breadcrumbs itemName={params.artifactName} />
          </div>
          <div className="content">
            {artifactsStore.loading && <Loader />}
            <ArtifactsTable
              actionButtons={actionButtons}
              actionsMenu={actionsMenu}
              applyDetailsChanges={applyDetailsChanges}
              applyDetailsChangesCallback={applyDetailsChangesCallback}
              artifactName={artifactName}
              artifacts={artifacts}
              artifactsStore={artifactsStore}
              detailsFormInitialValues={detailsFormInitialValues}
              filters={filters}
              filtersConfig={filtersConfig}
              filtersStore={filtersStore}
              getAndSetSelectedArtifact={getAndSetSelectedArtifact}
              handleRefreshArtifacts={handleRefreshArtifacts}
              historyBackLink={historyBackLink}
              isAllVersions={isAllVersions}
              isOnlyTabScreen={isOnlyTabScreen}
              page={page}
              pageData={pageData}
              paginationConfigArtifactsRef={paginationConfigArtifactsRef}
              requestErrorMessage={requestErrorMessage}
              selectedArtifact={selectedArtifact}
              setSearchArtifactsParams={setSearchArtifactsParams}
              setSelectedArtifact={setSelectedArtifact}
              storeArtifactTypeLoading={storeArtifactTypeLoading}
              tab={tab}
              tableContent={tableContent}
              tableHeaders={tableHeaders}
              viewMode={viewMode}
            />
          </div>
        </div>
        {artifactsStore?.preview?.isPreview && (
          <PreviewModal artifact={artifactsStore?.preview?.selectedItem} />
        )}
      </>
    )
  }
)

ArtifactsView.displayName = 'ArtifactsView'

ArtifactsView.propTypes = {
  actionButtons: PropTypes.array,
  actionsMenu: PropTypes.func.isRequired,
  applyDetailsChanges: PropTypes.func.isRequired,
  applyDetailsChangesCallback: PropTypes.func.isRequired,
  artifactName: PropTypes.string,
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
  params: PropTypes.object.isRequired,
  requestErrorMessage: PropTypes.string,
  renderPageTabs: PropTypes.func,
  selectedArtifact: PropTypes.object.isRequired,
  setSearchArtifactsParams: PropTypes.func.isRequired,
  setSelectedArtifact: PropTypes.func.isRequired,
  storeArtifactTypeLoading: PropTypes.bool.isRequired,
  tab: PropTypes.string,
  tableContent: PropTypes.array.isRequired,
  tableHeaders: PropTypes.array.isRequired,
  viewMode: PropTypes.string
}

export default ArtifactsView
