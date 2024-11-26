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
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import AddToFeatureVectorPageHeader from '../../elements/AddToFeatureVectorPageHeader/AddToFeatureVectorPageHeader'
import Loader from '../../common/Loader/Loader'
import NoData from '../../common/NoData/NoData'
import Table from '../Table/Table'
import FeatureStoreTableRow from '../../elements/FeatureStoreTableRow/FeatureStoreTableRow'

import {
  ADD_TO_FEATURE_VECTOR_TAB,
  FEATURE_STORE_PAGE
} from '../../constants'
import { VIRTUALIZATION_CONFIG } from '../../types'
import { getNoDataMessage } from '../../utils/getNoDataMessage'
import { isRowRendered } from '../../hooks/useVirtualization.hook'
import ActionBar from '../ActionBar/ActionBar'
import AddToFeatureVectorFilters from './AddToFeatureVectorFilters'

import './addToFeatureVector.scss'

const AddToFeatureVectorView = React.forwardRef(
  (
    {
      actionsMenu,
      content,
      featureStore,
      filters,
      filtersConfig,
      filtersStore,
      handleExpandRow,
      handleRefresh,
      handleRefreshWithFilters,
      pageData,
      requestErrorMessage,
      selectedRowData,
      tableContent,
      tableStore,
      virtualizationConfig
    },
    ref
  ) => {
    const params = useParams()
    return (
      <div ref={ref} className="add-to-feature-vector content-wrapper">
        <div className="content__header">
          <AddToFeatureVectorPageHeader params={params} />
          <div className="content__action-bar-wrapper">
              <ActionBar
                filters={filters}
                filtersConfig={filtersConfig}
                handleRefresh={handleRefresh}
                page={FEATURE_STORE_PAGE}
                tab={ADD_TO_FEATURE_VECTOR_TAB}
                withoutExpandButton
              >
                <AddToFeatureVectorFilters content={content} />
              </ActionBar>
            </div>
        </div>
        {(featureStore.loading || featureStore.features.loading) && <Loader />}
        <div className="content">
          <div className="table-container">
            {featureStore.loading || featureStore.features.loading ? null : content.length === 0 ? (
              <NoData
                message={getNoDataMessage(
                  filters,
                  filtersConfig,
                  requestErrorMessage,
                  FEATURE_STORE_PAGE,
                  ADD_TO_FEATURE_VECTOR_TAB,
                  ADD_TO_FEATURE_VECTOR_TAB,
                  filtersStore
                )}
              />
            ) : (
              <>
                <Table
                  actionsMenu={actionsMenu}
                  hideActionsMenu={tableStore.isTablePanelOpen}
                  pageData={pageData}
                  retryRequest={handleRefreshWithFilters}
                  tab={ADD_TO_FEATURE_VECTOR_TAB}
                  tableClassName="features-table"
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
                          hideActionsMenu={tableStore.isTablePanelOpen}
                          mainRowItemsCount={2}
                          pageTab={ADD_TO_FEATURE_VECTOR_TAB}
                          rowIndex={index}
                          rowItem={tableItem}
                          selectedRowData={selectedRowData}
                        />
                      )
                  )}
                </Table>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }
)

AddToFeatureVectorView.propTypes = {
  actionsMenu: PropTypes.array.isRequired,
  content: PropTypes.arrayOf(PropTypes.object).isRequired,
  featureStore: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  filtersConfig: PropTypes.object.isRequired,
  filtersStore: PropTypes.object.isRequired,
  handleExpandRow: PropTypes.func.isRequired,
  handleRefresh: PropTypes.func.isRequired,
  handleRefreshWithFilters: PropTypes.func.isRequired,
  pageData: PropTypes.object.isRequired,
  requestErrorMessage: PropTypes.string.isRequired,
  selectedRowData: PropTypes.object.isRequired,
  tableContent: PropTypes.arrayOf(PropTypes.object).isRequired,
  tableStore: PropTypes.object.isRequired,
  virtualizationConfig: VIRTUALIZATION_CONFIG.isRequired
}

export default AddToFeatureVectorView
