import React from 'react'
import PropTypes from 'prop-types'

import bestIterationIcon from '../../images/best-iteration-icon.png'
import { resultsTable } from '../../utils/resultsTable'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

const DetailsResults = ({ job }) => {
  const result = resultsTable(job)
  return (
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
                        <img
                          src={bestIterationIcon}
                          alt="Best iteration"
                          title="Best iteration"
                        />
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
  )
}

DetailsResults.propTypes = {
  job: PropTypes.shape({}).isRequired
}

export default DetailsResults
