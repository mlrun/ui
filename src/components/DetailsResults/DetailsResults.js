import React from 'react'
import PropTypes from 'prop-types'

import { resultsTable } from '../../utils/resultsTable'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import NoData from '../../common/NoData/NoData'

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
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="table__item_results__table-body">
            {result.items.map((item, i) => (
              <div className="table__item_results__table_row" key={i}>
                {item.map((value, i) => {
                  if (value.length > 3) {
                    return (
                      <div
                        className="table__item_results__table_row_cell"
                        key={`${value}${i}`}
                      >
                        <Tooltip
                          template={
                            <TextTooltipTemplate
                              text={`${value[0].toUpperCase()}${value.slice(
                                1
                              )}`}
                            />
                          }
                        >
                          <i className={value} />
                        </Tooltip>
                      </div>
                    )
                  } else if (
                    job.results &&
                    value === job.results.best_iteration &&
                    i === 0
                  ) {
                    return (
                      <div
                        key={`${value}${i}`}
                        className="table__item_results__table_medal table__item_results__table_row_cell"
                      >
                        {value}
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
                        key={`${value}${i}`}
                      >
                        {+value}
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
