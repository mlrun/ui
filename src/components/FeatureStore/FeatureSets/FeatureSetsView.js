import React from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import FilterMenu from '../../FilterMenu/FilterMenu'
import Table from '../../Table/Table'
import NoData from '../../../common/NoData/NoData'
import FeatureSetsPanel from '../../FeatureSetsPanel/FeatureSetsPanel'
import FeatureStoreTableRow from '../../../elements/FeatureStoreTableRow/FeatureStoreTableRow'

import { featureSetsFilters } from './featureSets.util'
import { FEATURE_SETS_TAB, FEATURE_STORE_PAGE } from '../../../constants'
import { getNoDataMessage } from '../../../layout/Content/content.util'

const FeatureSetsView = React.forwardRef(
  (
    {
      actionsMenu,
      applyDetailsChanges,
      closePanel,
      createFeatureSetSuccess,
      featureSets,
      featureSetsPanelIsOpen,
      featureStore,
      filtersStore,
      handleExpandRow,
      handleRefresh,
      pageData,
      selectedFeatureSet,
      selectedRowData,
      setSelectedFeatureSet,
      tableContent
    },
    ref
  ) => {
    const params = useParams()
    return (
      <div className="feature-store" ref={ref}>
        <div className="content__action-bar">
          <FilterMenu
            filters={featureSetsFilters}
            onChange={handleRefresh}
            page={FEATURE_STORE_PAGE}
            tab={FEATURE_SETS_TAB}
            withoutExpandButton
          />
        </div>
        {featureStore.loading ? null : featureSets.length === 0 ? (
          <NoData
            message={getNoDataMessage(
              filtersStore,
              featureSetsFilters,
              FEATURE_SETS_TAB,
              FEATURE_STORE_PAGE
            )}
          />
        ) : (
          <>
            <Table
              actionsMenu={actionsMenu}
              applyDetailsChanges={applyDetailsChanges}
              content={featureSets}
              handleCancel={() => setSelectedFeatureSet({})}
              pageData={pageData}
              retryRequest={handleRefresh}
              selectedItem={selectedFeatureSet}
              tab={FEATURE_SETS_TAB}
              tableHeaders={tableContent[0]?.content ?? []}
            >
              {tableContent.map((tableItem, index) => (
                <FeatureStoreTableRow
                  actionsMenu={actionsMenu}
                  handleExpandRow={handleExpandRow}
                  handleSelectItem={setSelectedFeatureSet}
                  key={index}
                  pageTab={FEATURE_SETS_TAB}
                  rowItem={tableItem}
                  selectedItem={selectedFeatureSet}
                  selectedRowData={selectedRowData}
                />
              ))}
            </Table>
          </>
        )}
        {featureSetsPanelIsOpen && (
          <FeatureSetsPanel
            closePanel={closePanel}
            createFeatureSetSuccess={createFeatureSetSuccess}
            project={params.projectName}
          />
        )}
      </div>
    )
  }
)

FeatureSetsView.propTypes = {
  actionsMenu: PropTypes.array.isRequired,
  applyDetailsChanges: PropTypes.func.isRequired,
  closePanel: PropTypes.func.isRequired,
  createFeatureSetSuccess: PropTypes.func.isRequired,
  featureSets: PropTypes.arrayOf(PropTypes.object).isRequired,
  featureSetsPanelIsOpen: PropTypes.bool.isRequired,
  featureStore: PropTypes.object.isRequired,
  filtersStore: PropTypes.object.isRequired,
  handleExpandRow: PropTypes.func.isRequired,
  handleRefresh: PropTypes.func.isRequired,
  pageData: PropTypes.object.isRequired,
  selectedFeatureSet: PropTypes.object.isRequired,
  selectedRowData: PropTypes.object.isRequired,
  setSelectedFeatureSet: PropTypes.func.isRequired,
  tableContent: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default FeatureSetsView
