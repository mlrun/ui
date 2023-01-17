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

import NoData from '../../common/NoData/NoData'
import { Button, Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { roundFloats } from '../../utils/roundFloats'
import { resultsTableContent, resultsTableHeaders } from '../../utils/resultsTable'
import { useSortTable } from '../../hooks/useSortTable.hook'

import { ReactComponent as BestIteration } from 'igz-controls/images/best-iteration-icon.svg'

import './detailsResults.scss'
import classNames from 'classnames'

const DetailsResults = ({ allowSortBy, defaultSortBy, excludeSortBy, job }) => {
  const tableHeaders = useMemo(() => {
    return isEmpty(job.error) ? resultsTableHeaders(job) : []
  }, [job])

  const tableContent = useMemo(() => {
    return isEmpty(job.error) ? resultsTableContent(job) : []
  }, [job])

  const [sortTable, selectedColumnName, getSortingIcon, sortedTableContent, sortedTableHeaers] =
    useSortTable({
      headers: tableHeaders,
      content: tableContent,
      sortConfig: { allowSortBy, excludeSortBy, defaultSortBy }
    })

  const getHeaderClasses = headerId =>
    classNames(
      'results-table__header-item',
      'table__header-item-sortable',
      selectedColumnName === headerId && 'table__header-item-sortable-active'
    )

  return (
    <div className="table__item-results">
      <div className="results-table">
        {(job.iterationStats && job.iterationStats.length !== 0) || !job.error ? (
          <>
            <div className="results-table__header">
              <div className="results-table__row">
                {sortedTableHeaers.map(({ header, headerId, isSortable }) => {
                  return !isSortable ? (
                    <div className="results-table__header-item" key={headerId}>
                      <Tooltip template={<TextTooltipTemplate text={header} />}>{header}</Tooltip>
                    </div>
                  ) : (
                    <Button
                      className={getHeaderClasses(headerId)}
                      icon={getSortingIcon(headerId)}
                      key={headerId}
                      label={header}
                      onClick={() => sortTable(headerId)}
                      tooltip={header}
                    />
                  )
                })}
              </div>
            </div>
            <div className="results-table__body">
              {sortedTableContent.map((tableContentItem, index) => (
                <div className="results-table__row" key={index}>
                  {tableContentItem.map((contentItemValue, idx) => {
                    if (
                      typeof value === 'string' &&
                      contentItemValue.match(/completed|running|error/gi)
                    ) {
                      return (
                        <div
                          className="results-table__cell results-table__cell"
                          key={`${contentItemValue}${idx}`}
                        >
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
                        </div>
                      )
                    } else if (
                      job.results &&
                      contentItemValue === job.results.best_iteration &&
                      idx === 0
                    ) {
                      return (
                        <div
                          key={`${contentItemValue}${idx}`}
                          className="results-table__medal results-table__cell"
                        >
                          {contentItemValue}
                          <span className="best_iteration">
                            <Tooltip template={<TextTooltipTemplate text={'Best iteration'} />}>
                              <BestIteration />
                            </Tooltip>
                          </span>
                        </div>
                      )
                    } else {
                      return (
                        <div className="results-table__cell" key={`${contentItemValue}${idx}`}>
                          <Tooltip
                            className="data-ellipsis"
                            template={<TextTooltipTemplate text={contentItemValue.toString()} />}
                          >
                            {roundFloats(contentItemValue, 4)}
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
          Object.keys(job.results).map(key => {
            return (
              <div key={key} className="results-table__row">
                <div className="results-table__cell table__cell-wide">
                  <Tooltip className="data-ellipsis" template={<TextTooltipTemplate text={key} />}>
                    {key}
                  </Tooltip>
                </div>
                <div className="results-table__cell table__cell-wide">
                  <Tooltip
                    className="data-ellipsis"
                    template={<TextTooltipTemplate text={job.results[key]} />}
                  >
                    {job.results[key]}
                  </Tooltip>
                </div>
              </div>
            )
          })
        ) : (
          <NoData />
        )}
      </div>
    </div>
  )
}

DetailsResults.propTypes = {
  // allowSortBy: PropTypes.oneOfType(PropTypes.number, PropTypes.string),
  // defaultSortBy: PropTypes.oneOf(),
  // excludeSortBy: PropTypes.oneOf(),
  job: PropTypes.shape({}).isRequired
}

export default DetailsResults
