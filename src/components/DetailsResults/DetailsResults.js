import React from 'react'
import PropTypes from 'prop-types'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import NoData from '../../common/NoData/NoData'

import { roundFloats } from '../../utils/roundFloats'
import { resultsTable } from '../../utils/resultsTable'

import { ReactComponent as BestIteration } from '../../images/best-iteration-icon.svg'

import './detailsResults.scss'

const DetailsResults = ({ job }) => {
  const result = resultsTable(job)

  return (
    <div className="table__item-results">
      <div className="results-table">
        {job.iterationStats && job.iterationStats.length !== 0 ? (
          <>
            <div className="results-table__header">
              <div className="results-table__row">
                {result.headers.map((item, i) => (
                  <div className="results-table__header-item" key={i}>
                    <Tooltip template={<TextTooltipTemplate text={item} />}>
                      {item}
                    </Tooltip>
                  </div>
                ))}
              </div>
            </div>
            <div className="results-table__body">
              {result.tableContent.map((tableContentItem, index) => (
                <div className="results-table__row" key={index}>
                  {tableContentItem.map((contentItemValue, idx) => {
                    if (
                      typeof value === 'string' &&
                      contentItemValue.match(/completed|running|error/gi)
                    ) {
                      return (
                        <div
                          className="results-table__cell"
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
                          className="results-table__cell"
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
          </>
        ) : job.iterations?.length === 0 &&
          Object.keys(job.results ?? {}).length !== 0 ? (
          Object.keys(job.results).map(key => {
            return (
              <div key={key} className="results-table__row">
                <div className="results-table__cell">{key}</div>
                <div className="results-table__cell">{job.results[key]}</div>
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
  job: PropTypes.shape({}).isRequired
}

export default DetailsResults
