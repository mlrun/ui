import React from 'react'
import PropTypes from 'prop-types'

import { resultsTable } from '../../utils/resultsTable'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

import { ReactComponent as BestIteration } from '../../svg/best-iteration-icon.svg'
import NoData from '../../common/NoData/NoData'

const DetailsResults = ({ job }) => {
  const result = resultsTable(job)
  return job.iterations.length !== 0 ||
    Object.values(job.results).length !== 0 ? (
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
                        <BestIteration />
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
  ) : (
    <NoData />
  )
}

DetailsResults.propTypes = {
  job: PropTypes.shape({}).isRequired
}

export default DetailsResults
