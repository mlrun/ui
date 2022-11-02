import React from 'react'
import FilterMenu from '../../FilterMenu/FilterMenu'
import { filters } from './realTimePipelines.util'
import { MODELS_PAGE, REAL_TIME_PIPELINES_TAB } from '../../../constants'
import NoData from '../../../common/NoData/NoData'
import { getNoDataMessage } from '../../../layout/Content/content.util'
import Table from '../../Table/Table'
import Pipeline from '../../Pipeline/Pipeline'
import FunctionsTableRow from '../../../elements/FunctionsTableRow/FunctionsTableRow'
import classnames from 'classnames'
// import PropTypes from "prop-types";

const RealTimePipelinesView = React.forwardRef(
  (
    {
      actionsMenu,
      artifactsStore,
      expand,
      fetchData,
      filtersStore,
      selectedRowData,
      handleExpandAll,
      handleExpandRow,
      pageData,
      params,
      pipelines,
      tableContent
    },
    ref
  ) => {
    const filterMenuClassNames = classnames(
      'content__action-bar',
      params.pipelineId && 'content__action-bar_hidden'
    )

    return (
      <>
        <div className="models" ref={ref}>
          <div className="table-container">
            <div className={filterMenuClassNames}>
              <FilterMenu
                expand={expand}
                filters={filters}
                handleExpandAll={handleExpandAll}
                onChange={fetchData}
                page={MODELS_PAGE}
                tab={REAL_TIME_PIPELINES_TAB}
              />
            </div>
            {artifactsStore.loading ? null : pipelines.length === 0 ? (
              <NoData
                message={getNoDataMessage(
                  filtersStore,
                  filters,
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
                        content={pipelines}
                        handleExpandRow={handleExpandRow}
                        handleSelectItem={() => {}}
                        key={index}
                        rowItem={tableItem}
                        selectedItem={{}}
                        tableContent={selectedRowData}
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

RealTimePipelinesView.propTypes = {}

export default RealTimePipelinesView
