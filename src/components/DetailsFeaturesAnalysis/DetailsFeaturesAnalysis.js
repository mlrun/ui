import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import MlChart from '../../common/Chart/MlChart'
import Loader from '../../common/Loader/Loader'
import NoData from '../../common/NoData/NoData'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { generateFeaturesAnalysis } from './detailsFeaturesAnalysis.util'
import { getHistogramChartConfig } from '../../utils/getHistogramChartConfig'

import './detailsFeaturesAnalysis.scss'
import colors from 'igz-controls/scss/colors.scss'

const DetailsFeaturesAnalysis = ({ detailsStore }) => {
  const table = generateFeaturesAnalysis(detailsStore.modelEndpoint.data)
  const chartConfig = useMemo(getHistogramChartConfig, [])

  return (
    <div className="features-analysis">
      {detailsStore.modelEndpoint.loading && <Loader />}
      {detailsStore.modelEndpoint.error ? (
        <div className="features-analysis__error">
          Failed to fetch data from model endpoint analysis. Please try again later.
        </div>
      ) : table.body.length === 0 ? (
        <NoData />
      ) : (
        <div className="features-analysis__table">
          <div className="features-analysis__table-header">
            {Object.values(table.header).map((headerCell, index) => (
              <div className={`features-analysis__table-cell ${headerCell.className}`} key={index}>
                {headerCell.contentArray ? (
                  <>
                    <div className="features-analysis__table-cell_top">
                      <Tooltip template={<TextTooltipTemplate text={headerCell.label} />}>
                        {headerCell.label}
                      </Tooltip>
                    </div>
                    <div className="features-analysis__table-cell_bottom">
                      {headerCell.contentArray.map((cell, index) => (
                        <div className={`${cell.className}`} key={index}>
                          <Tooltip
                            className="data-ellipsis"
                            template={<TextTooltipTemplate text={cell.label} />}
                          >
                            {cell.label}
                          </Tooltip>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <Tooltip template={<TextTooltipTemplate text={headerCell.label} />}>
                    {headerCell.label}
                  </Tooltip>
                )}
              </div>
            ))}
          </div>
          <div className="features-analysis__table-body">
            {Object.values(table.body).map((row, rowIndex) => (
              <div className="features-analysis__table-row" key={rowIndex}>
                {Object.values(row).map((cell, index) => (
                  <div className={`features-analysis__table-cell ${cell.className}`} key={index}>
                    {cell.contentArray ? (
                      cell.contentArray.map((item, index) => (
                        <div className={`${item.className}`} key={index}>
                          {item.type === 'chart' && item.value[1]?.length > 0 ? (
                            <MlChart
                              config={{
                                ...chartConfig,
                                data: {
                                  labels: item.value[1],
                                  datasets: [
                                    {
                                      data: item.value[0],
                                      showLine: false,
                                      backgroundColor: [colors.amethyst]
                                    }
                                  ]
                                }
                              }}
                            />
                          ) : (
                            item.type !== 'chart' && (
                              <Tooltip
                                className="data-ellipsis"
                                template={<TextTooltipTemplate text={item.value} />}
                              >
                                {item.value}
                              </Tooltip>
                            )
                          )}
                        </div>
                      ))
                    ) : cell.type === 'icon' ? (
                      cell.value
                    ) : (
                      <Tooltip
                        className="data-ellipsis"
                        template={<TextTooltipTemplate text={cell.value} />}
                      >
                        {cell.value}
                      </Tooltip>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

DetailsFeaturesAnalysis.propTypes = {
  detailsStore: PropTypes.shape({}).isRequired
}

export default connect(({ detailsStore }) => ({
  detailsStore
}))(DetailsFeaturesAnalysis)
