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
import React, { useMemo, memo } from 'react'

import StatsCard from '../../common/StatsCard/StatsCard'
import { TextTooltipTemplate, Tooltip } from 'iguazio.dashboard-react-controls/dist/components'
import MetricChart from '../MetricChart/MetricChart'

import { getBarChartMetricConfig, getLineChartMetricConfig } from '../../utils/getMetricChartConfig'
import { calculateHistogram, METRIC_COMPUTED_AVG_POINTS } from './detailsMetrics.util'
import { CHART_TYPE_LINE } from '../../constants'
import { METRIC_DATA } from '../../types'

import colors from 'igz-controls/scss/colors.scss'

import './DetailsMetrics.scss'

const ApplicationMetricCard = ({ metric }) => {
  const lineConfig = useMemo(() => getLineChartMetricConfig(), [])
  const barConfig = useMemo(() => getBarChartMetricConfig(), [])

  const lineChartConfig = useMemo(() => {
    return {
        ...lineConfig,
        data: {
          labels: metric.labels,
          datasets: [
            {
              data: metric.points,
              dates: metric.dates,
              chartType: CHART_TYPE_LINE,
              metricType: metric.type,
              driftStatusList: metric.driftStatusList || [],
              tension: 0.2,
              totalDriftStatus: metric.totalDriftStatus,
              borderWidth: 1,
              borderColor: metric.totalDriftStatus?.chartColor || colors.java
            }
          ]
        }
      }
  }, [lineConfig, metric])
  
  const barChartConfig = useMemo(() => {
    return {
        ...barConfig,
        data: calculateHistogram(metric)
      }
  }, [barConfig, metric])

  return (
    <StatsCard className="metrics__card">
      <StatsCard.Header title={metric.title}>
        {metric.totalDriftStatus && (
          <Tooltip
            template={
              <TextTooltipTemplate
                text={
                  <div className="total-drift-status-tooltip">
                    <div>Date: {metric.dates[metric.totalDriftStatus.index]}</div>
                    <div>Value:{metric.points[metric.totalDriftStatus.index]}</div>
                  </div>
                }
              />
            }
          >
            <div>
              <span>{metric.totalDriftStatus.text}</span>
              <span
                className={`metrics__card-drift-status metrics__card-drift-status-${metric.totalDriftStatus.className}`}
              ></span>
            </div>
          </Tooltip>
        )}
      </StatsCard.Header>
      <div className="metrics__card-body">
        <div className="metrics__card-body-bar">
          <div className="metrics__card-header">
            <div>Value distribution</div>
            <div className="metrics__card-header-data">
              <span className="metrics__card-header-label">Avg. </span>
              {metric[METRIC_COMPUTED_AVG_POINTS]}
            </div>
          </div>
          <MetricChart chartConfig={barChartConfig} />
        </div>
        <div className="metrics__card-body-line">
          <div className="metrics__card-header">Value over time</div>
          <MetricChart chartConfig={lineChartConfig} />
        </div>
      </div>
    </StatsCard>
  )
}

ApplicationMetricCard.propTypes = {
  metric: METRIC_DATA.isRequired
}

export default memo(ApplicationMetricCard)
