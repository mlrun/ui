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
import classnames from 'classnames'
import PropTypes from 'prop-types'

import FilterMenu from '../../FilterMenu/FilterMenu'
import FunctionsTableRow from '../../../elements/FunctionsTableRow/FunctionsTableRow'
import ModelsPageTabs from '../ModelsPageTabs/ModelsPageTabs'
import Pipeline from '../../Pipeline/Pipeline'
import Table from '../../Table/Table'
import Loader from '../../../common/Loader/Loader'

import { filters } from './realTimePipelines.util'
import { MODELS_PAGE, REAL_TIME_PIPELINES_TAB } from '../../../constants'
import NoData from '../../../common/NoData/NoData'
import { getNoDataMessage } from '../../../utils/getNoDataMessage'
import { ACTIONS_MENU } from '../../../types'

const RealTimePipelinesView = React.forwardRef(
  (
    {
      actionsMenu,
      artifactsStore,
      expand,
      fetchData,
      filtersStore,
      handleExpandAll,
      handleExpandRow,
      largeRequestErrorMessage,
      pageData,
      params,
      pipelines,
      selectedRowData,
      tableContent
    },
    ref
  ) => {
    const filterMenuClassNames = classnames(
      'content__action-bar-wrapper',
      params.pipelineId && 'content__action-bar-wrapper_hidden'
    )

    return (
      <>
        {artifactsStore.loading && <Loader />}
        <div className="models" ref={ref}>
          <div className="table-container">
            <div className={filterMenuClassNames}>
              <ModelsPageTabs />
              <div className="action-bar">
                <FilterMenu
                  expand={expand}
                  filters={filters}
                  handleExpandAll={handleExpandAll}
                  hidden={Boolean(params.pipelineId)}
                  onChange={fetchData}
                  page={MODELS_PAGE}
                  tab={REAL_TIME_PIPELINES_TAB}
                />
              </div>
            </div>
            {artifactsStore.loading ? null : pipelines.length === 0 ? (
              <NoData
                message={getNoDataMessage(
                  filtersStore,
                  filters,
                  largeRequestErrorMessage,
                  MODELS_PAGE,
                  REAL_TIME_PIPELINES_TAB
                )}
              />
            ) : params.pipelineId ? (
              <Pipeline content={pipelines} />
            ) : (
              <>
                <Table
                  actionsMenu={actionsMenu}
                  content={pipelines}
                  pageData={pageData}
                  retryRequest={fetchData}
                  selectedItem={{}}
                  tab={REAL_TIME_PIPELINES_TAB}
                  tableHeaders={tableContent[0]?.content ?? []}
                >
                  {tableContent.map((tableItem, index) => {
                    return (
                      <FunctionsTableRow
                        actionsMenu={actionsMenu}
                        handleExpandRow={handleExpandRow}
                        handleSelectItem={() => {}}
                        rowIndex={index}
                        key={index}
                        rowItem={tableItem}
                        selectedItem={{}}
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

RealTimePipelinesView.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  artifactsStore: PropTypes.object.isRequired,
  expand: PropTypes.bool.isRequired,
  fetchData: PropTypes.func.isRequired,
  filtersStore: PropTypes.object.isRequired,
  handleExpandAll: PropTypes.func.isRequired,
  handleExpandRow: PropTypes.func.isRequired,
  largeRequestErrorMessage: PropTypes.string.isRequired,
  pageData: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  pipelines: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedRowData: PropTypes.object.isRequired,
  tableContent: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default RealTimePipelinesView
