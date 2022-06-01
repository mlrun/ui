import React from 'react'
import PropTypes from 'prop-types'

import FilterMenu from '../../FilterMenu/FilterMenu'
import NoData from '../../../common/NoData/NoData'
import Table from '../../Table/Table'
import FeatureStoreTableRow from '../../../elements/FeatureStoreTableRow/FeatureStoreTableRow'

import { SECONDARY_BUTTON } from 'iguazio.dashboard-react-controls/dist/constants'
import { featuresFilters } from './features.util'
import { FEATURE_STORE_PAGE, FEATURES_TAB } from '../../../constants'
import { getNoDataMessage } from '../../../layout/Content/content.util'

const FeaturesView = React.forwardRef(
  (
    {
      actionsMenu,
      features,
      featureStore,
      filtersStore,
      getPopUpTemplate,
      handleExpandRow,
      handleRefresh,
      pageData,
      selectedRowData,
      tableContent,
      tableStore
    },
    ref
  ) => {
    return (
      <div className="feature-store" ref={ref}>
        <div className="content__action-bar">
          <FilterMenu
            actionButton={{
              label: 'Add to feature vector',
              variant: SECONDARY_BUTTON,
              getCustomTemplate: getPopUpTemplate
            }}
            filters={featuresFilters}
            onChange={handleRefresh}
            page={FEATURE_STORE_PAGE}
            withoutExpandButton
          />
        </div>
        {featureStore.loading ? null : features.length === 0 ? (
          <NoData
            message={getNoDataMessage(
              filtersStore,
              featuresFilters,
              FEATURES_TAB,
              FEATURE_STORE_PAGE
            )}
          />
        ) : (
          <>
            <Table
              actionsMenu={actionsMenu}
              content={features}
              pageData={pageData}
              retryRequest={handleRefresh}
              tab={FEATURES_TAB}
              tableHeaders={tableContent[0]?.content ?? []}
            >
              <>
                <div className="table-body">
                  {tableContent.map((tableItem, index) => (
                    <FeatureStoreTableRow
                      actionsMenu={actionsMenu}
                      handleExpandRow={handleExpandRow}
                      key={index}
                      hideActionsMenu={tableStore.isTablePanelOpen}
                      mainRowItemsCount={2}
                      pageTab={FEATURES_TAB}
                      rowItem={tableItem}
                      selectedRowData={selectedRowData}
                    />
                  ))}
                </div>
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
  filtersStore: PropTypes.object.isRequired,
  getPopUpTemplate: PropTypes.func.isRequired,
  handleExpandRow: PropTypes.func.isRequired,
  handleRefresh: PropTypes.func.isRequired,
  pageData: PropTypes.object.isRequired,
  selectedRowData: PropTypes.object.isRequired,
  tableContent: PropTypes.arrayOf(PropTypes.object).isRequired,
  tableStore: PropTypes.object.isRequired
}

export default FeaturesView
