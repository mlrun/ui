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

import FeatureStoreTableRow from '../../../elements/FeatureStoreTableRow/FeatureStoreTableRow'
import NoData from '../../../common/NoData/NoData'
import Table from '../../Table/Table'
import FeatureStorePageTabs from '../FeatureStorePageTabs/FeatureStorePageTabs'

import { FEATURE_STORE_PAGE, FEATURES_TAB } from '../../../constants'
import { SECONDARY_BUTTON } from 'igz-controls/constants'
import { VIRTUALIZATION_CONFIG } from '../../../types'
import { filtersConfig } from './features.util'
import { getNoDataMessage } from '../../../utils/getNoDataMessage'
import { isRowRendered } from '../../../hooks/useVirtualization.hook'
import ActionBar from '../../ActionBar/ActionBar'
import FeatureStoreFilters from '../FeatureStoreFilters'
import { addToFeatureVectorTitle } from '../featureStore.util'

const FeaturesView = React.forwardRef(
  (
    {
      actionsMenu,
      features,
      featureStore,
      filters,
      filtersStore,
      getPopUpTemplate,
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
    { featureStoreRef }
  ) => {
    return (
      <div className="feature-store" ref={featureStoreRef}>
        <div className="content__action-bar-wrapper">
          <FeatureStorePageTabs />
          <ActionBar
            actionButtons={[
              {
                hidden: false,
                template: getPopUpTemplate({
                  className: 'action-button',
                  label: addToFeatureVectorTitle,
                  variant: SECONDARY_BUTTON
                })
              }
            ]}
            filters={filters}
            filtersConfig={filtersConfig}
            handleRefresh={handleRefresh}
            page={FEATURE_STORE_PAGE}
            tab={FEATURES_TAB}
            withoutExpandButton
          >
            <FeatureStoreFilters content={features} />
          </ActionBar>
        </div>
        {featureStore.features.loading || featureStore.entities.loading ? null : features.length ===
          0 ? (
          <NoData
            message={getNoDataMessage(
              filters,
              filtersConfig,
              requestErrorMessage,
              FEATURE_STORE_PAGE,
              FEATURES_TAB,
              FEATURES_TAB,
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
              tab={FEATURES_TAB}
              tableClassName="features-table"
              tableHeaders={tableContent[0]?.content ?? []}
              virtualizationConfig={virtualizationConfig}
            >
              <>
                {tableContent.map(
                  (tableItem, index) =>
                    isRowRendered(virtualizationConfig, index) && (
                      <FeatureStoreTableRow
                        actionsMenu={actionsMenu}
                        handleExpandRow={handleExpandRow}
                        key={tableItem.data.ui.identifier}
                        hideActionsMenu={tableStore.isTablePanelOpen}
                        mainRowItemsCount={2}
                        pageTab={FEATURES_TAB}
                        rowIndex={index}
                        rowItem={tableItem}
                        selectedRowData={selectedRowData}
                      />
                    )
                )}
              </>
            </Table>
          </>
        )}
      </div>
    )
  }
)

FeaturesView.propTypes = {
  actionsMenu: PropTypes.array.isRequired,
  features: PropTypes.arrayOf(PropTypes.object).isRequired,
  featureStore: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  filtersStore: PropTypes.object.isRequired,
  getPopUpTemplate: PropTypes.func.isRequired,
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

export default FeaturesView
