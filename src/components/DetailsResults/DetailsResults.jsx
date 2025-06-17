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
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import classNames from 'classnames'

import NoData from '../../common/NoData/NoData'
import { Tip, Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { roundFloats } from 'igz-controls/utils/common.util'
import { generateResultsContent } from '../../utils/resultsTable'
import { useSortTable } from '../../hooks/useSortTable.hook'
import { ALLOW_SORT_BY, DEFAULT_SORT_BY, EXCLUDE_SORT_BY } from 'igz-controls/types'

import BestIteration from 'igz-controls/images/best-iteration-icon.svg?react'

import './detailsResults.scss'

const DetailsResults = ({
  allowSortBy = null,
  defaultSortBy = null,
  defaultDirection = 'desc',
  excludeSortBy = null,
  job
}) => {
  const resultsContent = useMemo(() => {
    return generateResultsContent(job)
  }, [job])

  const { sortTable, selectedColumnName, getSortingIcon, sortedTableContent, sortedTableHeaders } =
    useSortTable({
      headers: resultsContent?.[0],
      content: resultsContent,
      sortConfig: { allowSortBy, excludeSortBy, defaultSortBy, defaultDirection }
    })

  const getHeaderCellClasses = (headerId, isSortable, customClassName = '') =>
    classNames(
      'table-header__cell',
      isSortable && 'sortable-header-cell',
      isSortable && selectedColumnName === headerId && 'sortable-header-cell_active',
      customClassName
    )

  const getHeaderTemplate = () => {
    return (
      <div className="table-header">
        <div className="table-row table-header-row">
          {sortedTableHeaders.map(
            ({ headerLabel, headerId, isSortable, className, ...tableItem }) => {
              return (
                <div
                  className={getHeaderCellClasses(headerId, isSortable, className)}
                  key={`${headerId}`}
                  onClick={isSortable ? () => sortTable(headerId) : null}
                >
                  <Tooltip template={<TextTooltipTemplate text={headerLabel} />}>
                    <label className={isSortable ? 'sortable-header-label' : ''}>
                      <span className="data-ellipsis">{headerLabel}</span>
                      {isSortable && getSortingIcon(headerId)}
                    </label>
                  </Tooltip>
                  {tableItem.tip && <Tip text={tableItem.tip} />}
                </div>
              )
            }
          )}
        </div>
      </div>
    )
  }

  return (!job.iterationStats?.length && job.error) ||
    (!job.iterationStats?.length && isEmpty(job.results) && !job.iterations?.length) ? (
    <NoData />
  ) : (
    <div className="table__item-results">
      <div className="table">
        {job.iterationStats && job.iterationStats.length !== 0 ? (
          <>
            {getHeaderTemplate()}
            <div className="table-body">
              {sortedTableContent.map((rowData, rowIndex) => (
                <div className="table-row parent-row" key={rowIndex}>
                  {rowData.map((cellData, cellIndex) => {
                    if (
                      job.results &&
                      cellData.value === job.results.best_iteration &&
                      cellIndex === 0
                    ) {
                      return (
                        <div
                          key={`${cellData.value}-${cellIndex}`}
                          className={classNames(
                            'results-table__medal',
                            'table-body__cell',
                            cellData.className
                          )}
                        >
                          <span>{cellData.value}</span>
                          <Tooltip
                            template={<TextTooltipTemplate text={'Best iteration'} />}
                            className="best-iteration"
                          >
                            <BestIteration />
                          </Tooltip>
                        </div>
                      )
                    } else {
                      return (
                        <div
                          className={classNames('table-body__cell', cellData.className)}
                          key={`${cellData.value}-${cellIndex}`}
                        >
                          <Tooltip
                            className="data-ellipsis"
                            template={<TextTooltipTemplate text={cellData.value.toString()} />}
                          >
                            {roundFloats(cellData.value, 4)}
                          </Tooltip>
                        </div>
                      )
                    }
                  })}
                </div>
              ))}
            </div>
          </>
        ) : job.iterations?.length === 0 && Object.keys(job.results ?? {}).length !== 0 ? (
          <>
            {getHeaderTemplate()}
            <div className="table-body">
              {sortedTableContent.map((rowData, rowIndex) => (
                <div key={rowIndex} className="table-row">
                  {rowData.map((cellData, cellIndex) => (
                    <div
                      key={cellIndex}
                      className={classNames('table-body__cell', cellData.className)}
                    >
                      <Tooltip
                        className="data-ellipsis"
                        template={<TextTooltipTemplate text={cellData.value} />}
                      >
                        {cellData.value}
                      </Tooltip>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

DetailsResults.propTypes = {
  allowSortBy: ALLOW_SORT_BY,
  defaultSortBy: DEFAULT_SORT_BY,
  defaultDirection: PropTypes.string,
  excludeSortBy: EXCLUDE_SORT_BY,
  job: PropTypes.object.isRequired
}

export default DetailsResults
