import React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

import PreviewModal from '../../elements/PreviewModal/PreviewModal'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import PageActionsMenu from '../../common/PageActionsMenu/PageActionsMenu'
import Table from '../Table/Table'
import ArtifactsTableRow from '../../elements/ArtifactsTableRow/ArtifactsTableRow'
import YamlModal from '../../common/YamlModal/YamlModal'
import RegisterArtifactModal from '../RegisterArtifactModal/RegisterArtifactModal'
import Loader from '../../common/Loader/Loader'
import FilterMenu from '../FilterMenu/FilterMenu'
import NoData from '../../common/NoData/NoData'

import { DATASETS_PAGE } from '../../constants'
import { getNoDataMessage } from '../../layout/Content/content.util'
import { actionsMenuHeader, filters } from './datasets.util'
import { openPopUp } from 'igz-controls/utils/common.util'

const DatasetsView = React.forwardRef(
  (
    {
      actionsMenu,
      artifactsStore,
      convertedYaml,
      datasets,
      filtersStore,
      handleExpandRow,
      handleRefresh,
      pageData,
      selectedDataset,
      selectedRowData,
      setSelectedDataset,
      tableContent,
      toggleConvertedYaml
    },
    ref
  ) => {
    const params = useParams()

    return (
      <>
        <div className="content-wrapper" ref={ref}>
          <div className="content__header">
            <Breadcrumbs />
            <PageActionsMenu
              actionsMenuHeader={actionsMenuHeader}
              onClick={() =>
                openPopUp(RegisterArtifactModal, {
                  artifactKind: 'artifact',
                  projectName: params.projectName,
                  refresh: handleRefresh,
                  title: actionsMenuHeader
                })
              }
              showActionsMenu
            />
          </div>
          <div className="content">
            {artifactsStore.loading && <Loader />}
            <div className="table-container">
              <div className="content__action-bar">
                <FilterMenu
                  filters={filters}
                  onChange={handleRefresh}
                  page={DATASETS_PAGE}
                  withoutExpandButton
                />
              </div>
              {artifactsStore.loading ? null : datasets.length === 0 ? (
                <NoData message={getNoDataMessage(filtersStore, filters, DATASETS_PAGE)} />
              ) : (
                <>
                  <Table
                    actionsMenu={actionsMenu}
                    content={datasets}
                    handleCancel={() => setSelectedDataset({})}
                    pageData={pageData}
                    retryRequest={handleRefresh}
                    selectedItem={selectedDataset}
                    tableHeaders={tableContent[0]?.content ?? []}
                  >
                    {tableContent.map((tableItem, index) => (
                      <ArtifactsTableRow
                        actionsMenu={actionsMenu}
                        handleExpandRow={handleExpandRow}
                        handleSelectItem={setSelectedDataset}
                        key={index}
                        rowItem={tableItem}
                        selectedItem={selectedDataset}
                        selectedRowData={selectedRowData}
                      />
                    ))}
                  </Table>
                </>
              )}
            </div>
          </div>
        </div>
        {convertedYaml.length > 0 && (
          <YamlModal convertedYaml={convertedYaml} toggleConvertToYaml={toggleConvertedYaml} />
        )}
        {artifactsStore?.preview?.isPreview && (
          <PreviewModal item={artifactsStore?.preview?.selectedItem} />
        )}
      </>
    )
  }
)

DatasetsView.propTypes = {
  actionsMenu: PropTypes.arrayOf(PropTypes.object).isRequired,
  artifactsStore: PropTypes.object.isRequired,
  convertedYaml: PropTypes.string.isRequired,
  datasets: PropTypes.arrayOf(PropTypes.object).isRequired,
  filtersStore: PropTypes.object.isRequired,
  handleExpandRow: PropTypes.func.isRequired,
  handleRefresh: PropTypes.func.isRequired,
  pageData: PropTypes.object.isRequired,
  selectedDataset: PropTypes.object.isRequired,
  selectedRowData: PropTypes.object.isRequired,
  setSelectedDataset: PropTypes.func.isRequired,
  tableContent: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleConvertedYaml: PropTypes.func.isRequired
}

export default DatasetsView
