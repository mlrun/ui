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

import FilterMenu from '../../FilterMenu/FilterMenu'
import ArtifactsTableRow from '../../../elements/ArtifactsTableRow/ArtifactsTableRow'
import NoData from '../../../common/NoData/NoData'
import Table from '../../Table/Table'

import { MODELS_PAGE, MODELS_TAB } from '../../../constants'
import { getNoDataMessage } from '../../../layout/Content/content.util'
import { filters } from './models.util'

const ModelsView = React.forwardRef(
  (
    {
      actionsMenu,
      artifactsStore,
      applyDetailsChanges,
      filtersStore,
      handleExpandRow,
      handleRefresh,
      models,
      pageData,
      selectedModel,
      selectedRowData,
      setSelectedModel,
      tableContent
    },
    ref
  ) => {
    return (
      <>
        <div className="models" ref={ref}>
          <div className="table-container">
            <div className="content__action-bar">
              <FilterMenu
                filters={filters}
                onChange={handleRefresh}
                page={MODELS_PAGE}
                tab={MODELS_TAB}
                withoutExpandButton
              />
            </div>
            {artifactsStore.loading ? null : models.length === 0 ? (
              <NoData message={getNoDataMessage(filtersStore, filters, MODELS_PAGE, MODELS_TAB)} />
            ) : (
              <>
                <Table
                  actionsMenu={actionsMenu}
                  applyDetailsChanges={applyDetailsChanges}
                  content={models}
                  handleCancel={() => setSelectedModel({})}
                  pageData={pageData}
                  retryRequest={handleRefresh}
                  selectedItem={selectedModel}
                  tab={MODELS_TAB}
                  tableHeaders={tableContent[0]?.content ?? []}
                >
                  {tableContent.map((tableItem, index) => {
                    return (
                      <ArtifactsTableRow
                        actionsMenu={actionsMenu}
                        handleExpandRow={handleExpandRow}
                        handleSelectItem={setSelectedModel}
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
          </div>
        </div>
      </>
    )
  }
)

ModelsView.propTypes = {
  actionsMenu: PropTypes.arrayOf(PropTypes.object).isRequired,
  artifactsStore: PropTypes.object.isRequired,
  applyDetailsChanges: PropTypes.func.isRequired,
  filtersStore: PropTypes.object.isRequired,
  handleExpandRow: PropTypes.func.isRequired,
  handleRefresh: PropTypes.func.isRequired,
  models: PropTypes.arrayOf(PropTypes.object).isRequired,
  pageData: PropTypes.object.isRequired,
  selectedModel: PropTypes.object.isRequired,
  selectedRowData: PropTypes.object.isRequired,
  setSelectedModel: PropTypes.func.isRequired,
  tableContent: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default ModelsView
