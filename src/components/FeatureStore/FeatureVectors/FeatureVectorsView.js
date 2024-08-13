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

import CreateFeatureVectorPopUp from '../../../elements/CreateFeatureVectorPopUp/CreateFeatureVectorPopUp'
import FeatureStoreTableRow from '../../../elements/FeatureStoreTableRow/FeatureStoreTableRow'
import FilterMenu from '../../FilterMenu/FilterMenu'
import NoData from '../../../common/NoData/NoData'
import Table from '../../Table/Table'

import { FEATURE_STORE_PAGE, FEATURE_VECTORS_TAB } from '../../../constants'
import { VIRTUALIZATION_CONFIG } from '../../../types'
import { featureVectorsFilters } from './featureVectors.util'
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
      filtersStore,
      handleExpandRow,
      handleRefresh,
      pageData,
      requestErrorMessage,
      selectedFeatureVector,
      selectedRowData,
      setCreateVectorPopUpIsOpen,
      setSelectedFeatureVector,
      tableContent,
      virtualizationConfig
    },
    { featureStoreRef }
  ) => {
    return (
      <div className="feature-store" ref={featureStoreRef}>
        <div className="content__action-bar-wrapper">
          <div className="action-bar">
            <FilterMenu
              filters={featureVectorsFilters}
              onChange={handleRefresh}
              page={FEATURE_STORE_PAGE}
              tab={FEATURE_VECTORS_TAB}
              withoutExpandButton
            />
          </div>
        </div>
        {featureStore.loading ? null : featureVectors.length === 0 ? (
          <NoData
            message={getNoDataMessage(
              filtersStore,
              featureVectorsFilters,
              requestErrorMessage,
              FEATURE_STORE_PAGE,
              FEATURE_VECTORS_TAB
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
              retryRequest={handleRefresh}
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
                      handleExpandRow={handleExpandRow}
                      key={index}
                      pageTab={FEATURE_VECTORS_TAB}
                      rowIndex={index}
                      rowItem={tableItem}
                      selectedItem={selectedFeatureVector}
                      selectedRowData={selectedRowData}
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

FeatureVectorsView.propTypes = {
  actionsMenu: PropTypes.array.isRequired,
  applyDetailsChanges: PropTypes.func.isRequired,
  createFeatureVector: PropTypes.func.isRequired,
  createVectorPopUpIsOpen: PropTypes.bool.isRequired,
  featureStore: PropTypes.object.isRequired,
  featureVectors: PropTypes.arrayOf(PropTypes.object).isRequired,
  filtersStore: PropTypes.object.isRequired,
  handleExpandRow: PropTypes.func.isRequired,
  handleRefresh: PropTypes.func.isRequired,
  pageData: PropTypes.object.isRequired,
  requestErrorMessage: PropTypes.string.isRequired,
  selectedFeatureVector: PropTypes.object.isRequired,
  selectedRowData: PropTypes.object.isRequired,
  setCreateVectorPopUpIsOpen: PropTypes.func.isRequired,
  setSelectedFeatureVector: PropTypes.func.isRequired,
  tableContent: PropTypes.arrayOf(PropTypes.object).isRequired,
  virtualizationConfig: VIRTUALIZATION_CONFIG.isRequired
}

export default FeatureVectorsView
