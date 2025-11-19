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
import React, { memo, useMemo } from 'react'
import PropTypes from 'prop-types'

import HistogramChart from '../../common/MlChart/HistogramChart/HistogramChart'
import NoData from '../../common/NoData/NoData'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { generateFeaturesAnalysis } from './detailsFeaturesAnalysis.util'
import { getHistogramChartConfig } from '../../utils/getChartConfig'
import { getScssVariableValue } from 'igz-controls/utils/common.util'

import './detailsFeaturesAnalysis.scss'

const DetailsFeaturesAnalysis = ({ selectedItem }) => {
  const table = generateFeaturesAnalysis(selectedItem)
  const amethystColor = useMemo(() => getScssVariableValue('--amethystColor'), [])
  const chartConfig = useMemo(() => getHistogramChartConfig, [])

  return (
    <div className="features-analysis">
      {table.body.length === 0 ? (
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
                            <HistogramChart
                              config={{
                                ...chartConfig,
                                data: {
                                  labels: item.value[1],
                                  datasets: [
                                    {
                                      data: item.value[0],
                                      showLine: false,
                                      backgroundColor: [amethystColor]
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
  selectedItem: PropTypes.object.isRequired
}

export default memo(DetailsFeaturesAnalysis)
