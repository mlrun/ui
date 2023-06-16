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
import { isEmpty, isObjectLike } from 'lodash'
import classNames from 'classnames'

import NoData from '../../common/NoData/NoData'
import { Tip, Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { roundFloats } from '../../utils/roundFloats'
import { resultsTableContent, resultsTableHeaders } from '../../utils/resultsTable'
import { useSortTable } from '../../hooks/useSortTable.hook'
import { ALLOW_SORT_BY, DEFAULT_SORT_BY, EXCLUDE_SORT_BY } from 'igz-controls/types'

import { ReactComponent as BestIteration } from 'igz-controls/images/best-iteration-icon.svg'

import './detailsResults.scss'

const DetailsResults = ({ allowSortBy, defaultSortBy, defaultDirection, excludeSortBy, job }) => {
  const tableHeaders = useMemo(() => {
    return isEmpty(job.error) ? resultsTableHeaders(job) : []
  }, [job])

  const tableContent = useMemo(() => {
    return isEmpty(job.error) ? resultsTableContent(job) : []
  }, [job])

  const { sortTable, selectedColumnName, getSortingIcon, sortedTableContent, sortedTableHeaders } =
    useSortTable({
      headers: tableHeaders,
      content: tableContent,
      sortConfig: { allowSortBy, excludeSortBy, defaultSortBy, defaultDirection }
    })

  const getHeaderCellClasses = (headerId, isSortable) =>
    classNames(
      'table-header-item',
      isSortable && 'sortable-header-cell',
      isSortable && selectedColumnName === headerId && 'sortable-header-cell_active'
    )

  return (!job.iterationStats.length && job.error) ||
    (!job.iterationStats.length && isEmpty(job.results) && !job.iterations?.length) ||
    job.error ? (
    <NoData />
  ) : (
    <div className="table__item-results">
      <div className="table__content">
        <div className="table__wrapper">
          <table className="table results-table" cellPadding="0" cellSpacing="0">
            {job.iterationStats && job.iterationStats.length !== 0 && !job.error ? (
              <>
                <thead className="table-header">
                  <tr className="table-row">
                    {sortedTableHeaders.map(
                      ({ headerLabel, headerId, isSortable, ...tableItem }) => {
                        return (
                          <th
                            className={getHeaderCellClasses(headerId, isSortable)}
                            key={`${headerId}`}
                            onClick={isSortable ? () => sortTable(headerId) : null}
                          >
                            <Tooltip template={<TextTooltipTemplate text={headerLabel} />}>
                              <label className="sortable-header-label">
                                <span className="data-ellipsis">{headerLabel}</span>
                                {isSortable && getSortingIcon(headerId)}
                              </label>
                            </Tooltip>
                            {tableItem.tip && <Tip text={tableItem.tip} />}
                          </th>
                        )
                      }
                    )}
                  </tr>
                </thead>
                <tbody className="table-body">
                  {sortedTableContent.map((tableContentItem, index) => (
                    <tr className="table-row parent-row" key={index}>
                      {tableContentItem.map((contentItemValue, idx) => {
                        if (
                          typeof value === 'string' &&
                          contentItemValue.match(/completed|running|error/gi)
                        ) {
                          return (
                            <td className="table-body-cell" key={`${contentItemValue}-${idx}`}>
                              <Tooltip
                                template={
                                  <TextTooltipTemplate
                                    text={`${contentItemValue[0].toUpperCase()}${contentItemValue.slice(
                                      1
                                    )}`}
                                  />
                                }
                              >
                                <i className={contentItemValue} />
                              </Tooltip>
                            </td>
                          )
                        } else if (
                          job.results &&
                          contentItemValue === job.results.best_iteration &&
                          idx === 0
                        ) {
                          return (
                            <td
                              key={`${contentItemValue}-${idx}`}
                              className="results-table__medal table-body-cell"
                            >
                              <span>{contentItemValue}</span>
                              <Tooltip
                                template={<TextTooltipTemplate text={'Best iteration'} />}
                                className="best-iteration"
                              >
                                <BestIteration />
                              </Tooltip>
                            </td>
                          )
                        } else {
                          return (
                            <td className="table-body-cell" key={`${contentItemValue}-${idx}`}>
                              <Tooltip
                                className="data-ellipsis"
                                template={
                                  <TextTooltipTemplate text={contentItemValue.toString()} />
                                }
                              >
                                {roundFloats(contentItemValue, 4)}
                              </Tooltip>
                            </td>
                          )
                        }
                      })}
                    </tr>
                  ))}
                </tbody>
              </>
            ) : job.iterations?.length === 0 && Object.keys(job.results ?? {}).length !== 0 ? (
              <tbody className="table-body">
                {Object.keys(job.results).map(key => {
                  const resultValue = isObjectLike(job.results[key])
                    ? JSON.stringify(job.results[key])
                    : job.results[key]

                  return (
                    <tr key={key} className="table-row">
                      <td className="table-body-cell table-cell-wide">
                        <Tooltip
                          className="data-ellipsis"
                          template={<TextTooltipTemplate text={key} />}
                        >
                          {key}
                        </Tooltip>
                      </td>
                      <td className="table-body-cell table-cell-full">
                        <Tooltip
                          className="data-ellipsis"
                          template={<TextTooltipTemplate text={resultValue} />}
                        >
                          {resultValue}
                        </Tooltip>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            ) : null}
          </table>
        </div>
      </div>
    </div>
  )
}

DetailsResults.defaultProps = {
  allowSortBy: null,
  defaultSortBy: null,
  excludeSortBy: null
}

DetailsResults.propTypes = {
  allowSortBy: ALLOW_SORT_BY,
  defaultSortBy: DEFAULT_SORT_BY,
  excludeSortBy: EXCLUDE_SORT_BY,
  job: PropTypes.shape({}).isRequired
}

export default DetailsResults
