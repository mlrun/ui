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

import ArtifactsTableRow from '../../../elements/ArtifactsTableRow/ArtifactsTableRow'
import FilterMenu from '../../FilterMenu/FilterMenu'
import ModelsPageTabs from '../ModelsPageTabs/ModelsPageTabs'
import NoData from '../../../common/NoData/NoData'
import Table from '../../Table/Table'

import { filters } from './modelEndpoints.util'
import { MODEL_ENDPOINTS_TAB, MODELS_PAGE } from '../../../constants'
import { getNoDataMessage } from '../../../utils/getNoDataMessage'
import { ACTIONS_MENU } from '../../../types'

const ModelEndpointsView = React.forwardRef(
  (
    {
      actionsMenu,
      artifactsStore,
      fetchData,
      filtersStore,
      largeRequestErrorMessage,
      modelEndpoints,
      pageData,
      selectedModelEndpoint,
      setSelectedModelEndpoint,
      tableContent
    },
    ref
  ) => {
    return (
      <>
        <div className="models" ref={ref}>
          <div className="table-container">
            <div className="content__action-bar-wrapper">
              <ModelsPageTabs />
              <div className="action-bar">
                <FilterMenu
                  filters={filters}
                  onChange={fetchData}
                  page={MODELS_PAGE}
                  tab={MODEL_ENDPOINTS_TAB}
                  withoutExpandButton
                />
              </div>
            </div>
            {artifactsStore.loading ? null : modelEndpoints.length === 0 ? (
              <NoData
                message={getNoDataMessage(
                  filtersStore,
                  filters,
                  largeRequestErrorMessage,
                  MODELS_PAGE,
                  MODEL_ENDPOINTS_TAB
                )}
              />
            ) : (
              <>
                <Table
                  actionsMenu={actionsMenu}
                  content={modelEndpoints}
                  handleCancel={() => setSelectedModelEndpoint({})}
                  pageData={pageData}
                  retryRequest={fetchData}
                  selectedItem={selectedModelEndpoint}
                  tab={MODEL_ENDPOINTS_TAB}
                  tableHeaders={tableContent[0]?.content ?? []}
                >
                  {tableContent.map((tableItem, index) => {
                    return (
                      <ArtifactsTableRow
                        actionsMenu={actionsMenu}
                        handleSelectItem={setSelectedModelEndpoint}
                        key={index}
                        rowIndex={index}
                        rowItem={tableItem}
                        selectedItem={selectedModelEndpoint}
                        tab={MODEL_ENDPOINTS_TAB}
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

ModelEndpointsView.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  artifactsStore: PropTypes.object.isRequired,
  fetchData: PropTypes.func.isRequired,
  filtersStore: PropTypes.object.isRequired,
  largeRequestErrorMessage: PropTypes.string.isRequired,
  modelEndpoints: PropTypes.arrayOf(PropTypes.object).isRequired,
  pageData: PropTypes.object.isRequired,
  selectedModelEndpoint: PropTypes.object.isRequired,
  setSelectedModelEndpoint: PropTypes.func.isRequired,
  tableContent: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default ModelEndpointsView
