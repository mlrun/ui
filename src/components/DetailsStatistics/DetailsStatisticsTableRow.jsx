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
import React, { memo, useId, useMemo } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import HistogramChart from '../../common/MlChart/HistogramChart/HistogramChart'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { getScssVariableValue } from 'igz-controls/utils/common.util'

import './detailsStatistics.scss'

const DetailsStatisticsTableRow = ({ statisticsItem, headers, chartConfig }) => {
  const amethystColor = useMemo(() => getScssVariableValue('--amethystColor'), [])
  const id = useId()

  return (
    <div className="details-statistics__table-row">
      {Object.values(statisticsItem).map((statisticsValue, index) => {
        const statisticsItemClassNames = classnames(
          'details-statistics__table-item',
          `statistics-cell__${headers[index].label}`,
          `statistics-cell__type_${headers[index].type}`,
          headers[index].hidden && 'statistics-cell_hidden'
        )

        let config = {}

        if (statisticsValue.type === 'chart') {
          config = {
            ...chartConfig,
            data: {
              labels: statisticsValue.value[1],
              datasets: [
                {
                  data: statisticsValue.value[0],
                  showLine: false,
                  backgroundColor: [amethystColor]
                }
              ]
            },
            options: {
              ...chartConfig.options,
              //  Note if canvas is hidden and chart is responsive it may freeze page for a moment during chart calculations
              //  responsive: false,
              animation: false,
              scales: {
                ...chartConfig.options.scales,
                y: {
                  ...chartConfig.options.scales.y,
                  display: true,
                  min: 0,
                  max: Math.max(...statisticsValue.value[0]),
                  ticks: {
                    ...chartConfig.options.scales.y.ticks,
                    stepSize: Math.max(...statisticsValue.value[0])
                  }
                }
              }
            }
          }
        }

        return (
          <div key={id + index} className={statisticsItemClassNames}>
            {statisticsValue.type.match(/icon/) && !statisticsValue.hidden && statisticsValue.value}
            {statisticsValue.type === 'chart' && statisticsValue.value[1]?.length > 0 && (
              <HistogramChart config={config} showLoader={false} />
            )}
            {!statisticsValue.type.match(/icon|chart/) && (
              <Tooltip
                className="data-ellipsis"
                template={
                  <TextTooltipTemplate
                    text={`${statisticsValue.tooltip ?? statisticsValue.value}`}
                  />
                }
              >
                {statisticsValue.value}
              </Tooltip>
            )}
          </div>
        )
      })}
    </div>
  )
}

DetailsStatisticsTableRow.propTypes = {
  statisticsItem: PropTypes.object.isRequired,
  headers: PropTypes.arrayOf(PropTypes.object).isRequired,
  chartConfig: PropTypes.object.isRequired
}

export default memo(DetailsStatisticsTableRow)
