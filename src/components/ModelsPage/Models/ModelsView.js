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

import ArtifactsActionBar from '../../ArtifactsActionBar/ArtifactsActionBar'
import ArtifactsTableRow from '../../../elements/ArtifactsTableRow/ArtifactsTableRow'
import Loader from '../../../common/Loader/Loader'
import ModelsPageTabs from '../ModelsPageTabs/ModelsPageTabs'
import NoData from '../../../common/NoData/NoData'
import Table from '../../Table/Table'
import Details from '../../Details/Details'

import { FULL_VIEW_MODE, MODELS_PAGE, MODELS_TAB } from '../../../constants'
import { SORT_PROPS } from 'igz-controls/types'
import { getNoDataMessage } from '../../../utils/getNoDataMessage'
import { removeModel } from '../../../reducers/artifactsReducer'
import { filters } from './models.util'
import { ACTIONS_MENU } from '../../../types'

const ModelsView = React.forwardRef(
  (
    {
      actionsMenu,
      artifactsStore,
      applyDetailsChanges,
      applyDetailsChangesCallback,
      detailsFormInitialValues,
      filtersStore,
      handleExpandRow,
      handleRefresh,
      models,
      pageData,
      selectedModel,
      selectedRowData,
      setModels,
      setSelectedModel,
      setSelectedRowData,
      sortProps,
      tableContent,
      viewMode
    },
    ref
  ) => {
    return (
      <>
        <div className="models" ref={ref}>
          <div className="table-container">
            <div className="content__action-bar-wrapper">
              <ModelsPageTabs />
              <ArtifactsActionBar
                filterMenuName={MODELS_TAB}
                handleRefresh={handleRefresh}
                page={MODELS_PAGE}
                removeSelectedItem={removeModel}
                setContent={setModels}
                setSelectedRowData={setSelectedRowData}
                tab={MODELS_TAB}
              />
            </div>
            {artifactsStore.loading ? null : models.length === 0 ? (
              <NoData message={getNoDataMessage(filtersStore, filters, MODELS_PAGE, MODELS_TAB)} />
            ) : (
              <>
                {selectedRowData.loading && <Loader />}
                <Table
                  actionsMenu={actionsMenu}
                  applyDetailsChanges={applyDetailsChanges}
                  applyDetailsChangesCallback={applyDetailsChangesCallback}
                  content={models}
                  handleCancel={() => setSelectedModel({})}
                  detailsFormInitialValues={detailsFormInitialValues}
                  pageData={pageData}
                  retryRequest={handleRefresh}
                  selectedItem={selectedModel}
                  sortProps={sortProps}
                  tab={MODELS_TAB}
                  tableHeaders={tableContent[0]?.content ?? []}
                >
                  {tableContent.map((tableItem, index) => {
                    return (
                      <ArtifactsTableRow
                        actionsMenu={actionsMenu}
                        handleExpandRow={handleExpandRow}
                        key={index}
                        rowItem={tableItem}
                        selectedItem={selectedModel}
                        selectedRowData={selectedRowData}
                      />
                    )
                  })}
                </Table>
              </>
            )}
            {viewMode === FULL_VIEW_MODE && (
              <Details
                actionsMenu={actionsMenu}
                detailsMenu={pageData.details.menu}
                handleRefresh={handleRefresh}
                isDetailsScreen
                pageData={pageData}
                selectedItem={selectedModel}
                setSelectedItem={setSelectedModel}
                tab={MODELS_TAB}
              />
            )}
          </div>
        </div>
      </>
    )
  }
)

ModelsView.defaultProps = {
  sortProps: null,
  viewMode: null
}

ModelsView.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  artifactsStore: PropTypes.object.isRequired,
  applyDetailsChanges: PropTypes.func.isRequired,
  applyDetailsChangesCallback: PropTypes.func.isRequired,
  filtersStore: PropTypes.object.isRequired,
  handleExpandRow: PropTypes.func.isRequired,
  handleRefresh: PropTypes.func.isRequired,
  models: PropTypes.arrayOf(PropTypes.object).isRequired,
  pageData: PropTypes.object.isRequired,
  selectedModel: PropTypes.object.isRequired,
  selectedRowData: PropTypes.object.isRequired,
  setModels: PropTypes.func.isRequired,
  setSelectedModel: PropTypes.func.isRequired,
  setSelectedRowData: PropTypes.func.isRequired,
  sortProps: SORT_PROPS,
  tableContent: PropTypes.arrayOf(PropTypes.object).isRequired,
  viewMode: PropTypes.string
}

export default ModelsView
