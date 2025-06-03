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
import FeatureStoreFilters from '../FeatureStoreFilters'
import FeatureStorePageTabs from '../FeatureStorePageTabs/FeatureStorePageTabs'
import FeatureStoreTableRow from '../../../elements/FeatureStoreTableRow/FeatureStoreTableRow'
import NoData from '../../../common/NoData/NoData'
import Table from '../../Table/Table'

import { FEATURE_STORE_PAGE, FEATURES_TAB } from '../../../constants'
import { PRIMARY_BUTTON } from 'igz-controls/constants'
import { VIRTUALIZATION_CONFIG } from 'igz-controls/types'
import { addToFeatureVectorTitle } from '../featureStore.util'
import { filtersConfig } from './features.util'
import { getNoDataMessage } from '../../../utils/getNoDataMessage'
import { isRowRendered } from '../../../hooks/useVirtualization.hook'

const FeaturesView = React.forwardRef(
  (
    {
      actionsMenu,
      featureStore,
      features,
      filters,
      filtersStore,
      getPopUpTemplate,
      handleRefresh,
      pageData,
      requestErrorMessage,
      selectedRowData,
      setSearchParams,
      tableContent,
      tableStore,
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
                hidden: false,
                template: getPopUpTemplate({
                  className: 'action-button',
                  label: addToFeatureVectorTitle,
                  variant: PRIMARY_BUTTON
                })
              }
            ]}
            filters={filters}
            filtersConfig={filtersConfig}
            handleRefresh={handleRefresh}
            setSearchParams={setSearchParams}
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
                        hideActionsMenu={tableStore.isTablePanelOpen}
                        key={tableItem.data.ui.identifier}
                        mainRowItemsCount={2}
                        pageTab={FEATURES_TAB}
                        rowIndex={index}
                        rowItem={tableItem}
                        selectedRowData={selectedRowData}
                        toggleRow={toggleRow}
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

FeaturesView.displayName = 'FeaturesView'

FeaturesView.propTypes = {
  actionsMenu: PropTypes.array.isRequired,
  featureStore: PropTypes.object.isRequired,
  features: PropTypes.arrayOf(PropTypes.object).isRequired,
  filters: PropTypes.object.isRequired,
  filtersStore: PropTypes.object.isRequired,
  getPopUpTemplate: PropTypes.func.isRequired,
  handleRefresh: PropTypes.func.isRequired,
  pageData: PropTypes.object.isRequired,
  requestErrorMessage: PropTypes.string.isRequired,
  selectedRowData: PropTypes.object.isRequired,
  setSearchParams: PropTypes.func.isRequired,
  tableContent: PropTypes.arrayOf(PropTypes.object).isRequired,
  tableStore: PropTypes.object.isRequired,
  toggleRow: PropTypes.func.isRequired,
  virtualizationConfig: VIRTUALIZATION_CONFIG.isRequired
}

export default FeaturesView
