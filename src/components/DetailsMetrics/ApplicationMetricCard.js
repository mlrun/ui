import React, { useMemo, memo } from 'react'

import StatsCard from '../../common/StatsCard/StatsCard'
import { TextTooltipTemplate, Tooltip } from 'iguazio.dashboard-react-controls/dist/components'
import MetricChart from '../MetricChart/MetricChart'

import { getBarChartMetricConfig, getLineChartMetricConfig } from '../../utils/getMetricChartConfig'
import { calculateHistogram, METRIC_COMPUTED_AVG_POINTS } from './detailsMetrics.util'
import { CHART_TYPE_LINE } from '../../constants'

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

export default memo(ApplicationMetricCard)
