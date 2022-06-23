import React from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import AddToFeatureVectorPageHeader from '../../elements/AddToFeatureVectorPageHeader/AddToFeatureVectorPageHeader'
import Loader from '../../common/Loader/Loader'
import FilterMenu from '../FilterMenu/FilterMenu'
import NoData from '../../common/NoData/NoData'
import Table from '../Table/Table'
import FeatureStoreTableRow from '../../elements/FeatureStoreTableRow/FeatureStoreTableRow'
import YamlModal from '../../common/YamlModal/YamlModal'

import { filters } from './addToFeatureVectorPage.util'
import { ADD_TO_FEATURE_VECTOR_TAB, FEATURE_STORE_PAGE } from '../../constants'
import { getNoDataMessage } from '../../layout/Content/content.util'

const AddToFeatureVectorView = React.forwardRef(
  (
    {
      actionsMenu,
      content,
      convertedYaml,
      featureStore,
      fetchData,
      filtersStore,
      handleExpandRow,
      pageData,
      selectedRowData,
      tableContent,
      tableStore,
      toggleConvertedYaml
    },
    ref
  ) => {
    const params = useParams()
    return (
      <div ref={ref} className="add-to-feature-vector content-wrapper">
        <div className="content__header">
          <AddToFeatureVectorPageHeader params={params} />
        </div>
        {(featureStore.loading || featureStore.features.loading) && <Loader />}
        <div className="content">
          <div className="table-container">
            <div className="content__action-bar">
              <FilterMenu
                filters={filters}
                onChange={fetchData}
                page={FEATURE_STORE_PAGE}
                withoutExpandButton
              />
            </div>
            {featureStore.loading || featureStore.features.loading ? null : content.length === 0 ? (
              <NoData
                message={getNoDataMessage(
                  filtersStore,
                  filters,
                  ADD_TO_FEATURE_VECTOR_TAB,
                  FEATURE_STORE_PAGE
                )}
              />
            ) : (
              <>
                <Table
                  actionsMenu={actionsMenu}
                  content={content}
                  pageData={pageData}
                  retryRequest={fetchData}
                  tab={ADD_TO_FEATURE_VECTOR_TAB}
                  tableHeaders={tableContent[0]?.content ?? []}
                >
                  {tableContent.map((tableItem, index) => (
                    <FeatureStoreTableRow
                      actionsMenu={actionsMenu}
                      handleExpandRow={handleExpandRow}
                      key={index}
                      hideActionsMenu={tableStore.isTablePanelOpen}
                      mainRowItemsCount={2}
                      pageTab={ADD_TO_FEATURE_VECTOR_TAB}
                      rowItem={tableItem}
                      selectedRowData={selectedRowData}
                    />
                  ))}
                </Table>
              </>
            )}
            {convertedYaml.length > 0 && (
              <YamlModal convertedYaml={convertedYaml} toggleConvertToYaml={toggleConvertedYaml} />
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
  convertedYaml: PropTypes.string.isRequired,
  featureStore: PropTypes.object.isRequired,
  fetchData: PropTypes.func.isRequired,
  filtersStore: PropTypes.object.isRequired,
  handleExpandRow: PropTypes.func.isRequired,
  pageData: PropTypes.object.isRequired,
  selectedRowData: PropTypes.object.isRequired,
  tableContent: PropTypes.arrayOf(PropTypes.object).isRequired,
  tableStore: PropTypes.object.isRequired,
  toggleConvertedYaml: PropTypes.func.isRequired
}

export default AddToFeatureVectorView
