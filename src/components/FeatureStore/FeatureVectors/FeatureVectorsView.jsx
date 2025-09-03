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

import ActionBar from '../../ActionBar/ActionBar'
import CreateFeatureVectorPopUp from '../../../elements/CreateFeatureVectorPopUp/CreateFeatureVectorPopUp'
import FeatureStoreFilters from '../FeatureStoreFilters'
import FeatureStorePageTabs from '../FeatureStorePageTabs/FeatureStorePageTabs'
import FeatureStoreTableRow from '../../../elements/FeatureStoreTableRow/FeatureStoreTableRow'
import NoData from '../../../common/NoData/NoData'
import Table from '../../Table/Table'

import { FEATURE_STORE_PAGE, FEATURE_VECTORS_TAB } from '../../../constants'
import { PRIMARY_BUTTON } from 'igz-controls/constants'
import { VIRTUALIZATION_CONFIG } from 'igz-controls/types'
import { createFeatureVectorTitle } from '../featureStore.util'
import { filtersConfig } from './featureVectors.util'
import { getNoDataMessage } from '../../../utils/getNoDataMessage'
import { isRowRendered } from '../../../hooks/useVirtualization.hook'

const FeatureVectorsView = React.forwardRef(
  (
    {
      actionsMenu,
      applyDetailsChanges,
      createFeatureVector,
      createVectorPopUpIsOpen,
      detailsFormInitialValues,
      featureStore,
      featureVectors,
      filters,
      filtersStore,
      handleRefresh,
      pageData,
      requestErrorMessage,
      selectedFeatureVector,
      selectedRowData,
      setCreateVectorPopUpIsOpen,
      setSearchParams,
      setSelectedFeatureVector,
      tableContent,
      toggleRow,
      virtualizationConfig
    },
    { featureStoreRef }
  ) => {
    return (
      <div className="feature-store" ref={featureStoreRef}>
        <div className="content__action-bar-wrapper">
          <FeatureStorePageTabs />
          <ActionBar
            actionButtons={[
              {
                className: 'action-button',
                label: createFeatureVectorTitle,
                variant: PRIMARY_BUTTON,
                onClick: () => setCreateVectorPopUpIsOpen(true)
              }
            ]}
            closeParamName={FEATURE_VECTORS_TAB}
            filters={filters}
            filtersConfig={filtersConfig}
            handleRefresh={handleRefresh}
            setSearchParams={setSearchParams}
            tab={FEATURE_VECTORS_TAB}
            withoutExpandButton
          >
            <FeatureStoreFilters content={featureVectors} />
          </ActionBar>
        </div>
        {featureStore.loading ? null : featureVectors.length === 0 ? (
          <NoData
            message={getNoDataMessage(
              filters,
              filtersConfig,
              requestErrorMessage,
              FEATURE_STORE_PAGE,
              FEATURE_VECTORS_TAB,
              FEATURE_VECTORS_TAB,
              filtersStore
            )}
          />
        ) : (
          <>
            <Table
              actionsMenu={actionsMenu}
              applyDetailsChanges={applyDetailsChanges}
              detailsFormInitialValues={detailsFormInitialValues}
              handleCancel={() => setSelectedFeatureVector({})}
              pageData={pageData}
              selectedItem={selectedFeatureVector}
              tab={FEATURE_VECTORS_TAB}
              tableClassName="feature-vectors-table"
              tableHeaders={tableContent[0]?.content ?? []}
              virtualizationConfig={virtualizationConfig}
            >
              {tableContent.map(
                (tableItem, index) =>
                  isRowRendered(virtualizationConfig, index) && (
                    <FeatureStoreTableRow
                      actionsMenu={actionsMenu}
                      key={tableItem.data?.ui?.identifier ?? index}
                      pageTab={FEATURE_VECTORS_TAB}
                      rowIndex={index}
                      rowItem={tableItem}
                      selectedItem={selectedFeatureVector}
                      selectedRowData={selectedRowData}
                      toggleRow={toggleRow}
                      withQuickActions={true}
                    />
                  )
              )}
            </Table>
          </>
        )}
        {createVectorPopUpIsOpen && (
          <CreateFeatureVectorPopUp
            closePopUp={() => {
              setCreateVectorPopUpIsOpen(false)
            }}
            createFeatureVector={createFeatureVector}
          />
        )}
      </div>
    )
  }
)

FeatureVectorsView.displayName = 'FeatureVectorsView'

FeatureVectorsView.propTypes = {
  actionsMenu: PropTypes.array.isRequired,
  applyDetailsChanges: PropTypes.func.isRequired,
  createFeatureVector: PropTypes.func.isRequired,
  createVectorPopUpIsOpen: PropTypes.bool.isRequired,
  detailsFormInitialValues: PropTypes.object.isRequired,
  featureStore: PropTypes.object.isRequired,
  featureVectors: PropTypes.arrayOf(PropTypes.object).isRequired,
  filters: PropTypes.object.isRequired,
  filtersStore: PropTypes.object.isRequired,
  handleRefresh: PropTypes.func.isRequired,
  pageData: PropTypes.object.isRequired,
  requestErrorMessage: PropTypes.string.isRequired,
  selectedFeatureVector: PropTypes.object.isRequired,
  selectedRowData: PropTypes.object.isRequired,
  setCreateVectorPopUpIsOpen: PropTypes.func.isRequired,
  setSearchParams: PropTypes.func.isRequired,
  setSelectedFeatureVector: PropTypes.func.isRequired,
  tableContent: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleRow: PropTypes.func.isRequired,
  virtualizationConfig: VIRTUALIZATION_CONFIG.isRequired
}

export default FeatureVectorsView
