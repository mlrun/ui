import React from 'react'
import PropTypes from 'prop-types'

import { resultsTable } from '../../utils/resultsTable'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import NoData from '../../common/NoData/NoData'

import { roundFloats } from '../../utils/roundFloats'

import { ReactComponent as BestIteration } from '../../images/best-iteration-icon.svg'

import './detailsResults.scss'

const DetailsResults = ({ job }) => {
  const result = resultsTable(job)

  return job.iterationStats.length !== 0 ? (
    <div className="table__item_results">
      {job.iterationStats && (
        <div className="table__item_results__table">
          <div className="table__item_results__table_header">
            <div className="table__item_results__table_row">
              {result.headers.map((item, i) => (
                <div className="table__item_results__table_header_item" key={i}>
                  <Tooltip
                    className="data-ellipsis"
                    template={<TextTooltipTemplate text={item} />}
                  >
                    {item}
                  </Tooltip>
                </div>
              ))}
            </div>
          </div>
          <div className="table__item_results__table-body">
            {result.tableContent.map((tableContentItem, index) => (
              <div className="table__item_results__table_row" key={index}>
                {tableContentItem.map((contentItemValue, idx) => {
                  if (
                    typeof value === 'string' &&
                    contentItemValue.match(/completed|running|error/gi)
                  ) {
                    return (
                      <div
                        className="table__item_results__table_row_cell"
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
                        className="table__item_results__table_medal table__item_results__table_row_cell"
                      >
                        {contentItemValue}
                        <Tooltip
                          template={
                            <TextTooltipTemplate text={'Best iteration'} />
                          }
                        >
                          <BestIteration />
                        </Tooltip>
                      </div>
                    )
                  } else {
                    return (
                      <div
                        className="table__item_results__table_row_cell"
                        key={`${contentItemValue}${idx}`}
                      >
                        <Tooltip
                          className="data-ellipsis"
                          template={
                            <TextTooltipTemplate
                              text={contentItemValue.toString()}
                            />
                          }
                        >
                          {roundFloats(contentItemValue)}
                        </Tooltip>
                      </div>
                    )
                  }
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  ) : job.iterations.length === 0 && Object.keys(job.results).length !== 0 ? (
    Object.keys(job.results).map(key => {
      return (
        <div key={key} className="result_table">
          <div className="result_table_item_key">{key}</div>
          <div className="result_table_item_value">{job.results[key]}</div>
        </div>
      )
    })
  ) : (
    <NoData />
  )
}

DetailsResults.propTypes = {
  job: PropTypes.shape({}).isRequired
}

export default DetailsResults
