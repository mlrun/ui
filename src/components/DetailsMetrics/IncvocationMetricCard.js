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
import { forwardRef, useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import StatsCard from '../../common/StatsCard/StatsCard'
import MetricChart from '../MetricChart/MetricChart'
import { RoundedIcon } from 'igz-controls/components'

import {
  calculatePercentageDrift,
  METRIC_COMPUTED_TOTAL_POINTS,
  METRIC_RAW_TOTAL_POINTS
} from './detailsMetrics.util'
import { getGradientLineChartConfig } from '../../utils/getMetricChartConfig'
import { CHART_TYPE_LINE } from '../../constants'
import { ReactComponent as UnpinIcon } from 'igz-controls/images/unpin-icon.svg'

import colors from 'igz-controls/scss/colors.scss'

const InvocationMetricCard = forwardRef(
  (
    {
      isInvocationCardExpanded,
      metric,
      previousTotalInvocation,
      selectedDate,
      expandInvocationCard
    },
    invocationBodyCardRef
  ) => {
    const invocationCardClassnames = classNames(
      'metrics__card-invocations',
      !isInvocationCardExpanded
        ? 'metrics__card-invocations_collapsed'
        : 'metrics__card-invocations_expanded'
    )

    const gradientConfig = useMemo(() => getGradientLineChartConfig(), [])
    const resultPercentageDrift = calculatePercentageDrift(
      previousTotalInvocation,
      metric[METRIC_RAW_TOTAL_POINTS]
    )

    return (
      <div className={invocationCardClassnames}>
        <StatsCard key={metric.id} className="metrics__card">
          <StatsCard.Header title="Endpoint call count">
            <div className="metrics__card-invocation-header">
              <div className="metrics__card-invocation-header_drift-icon-container">
                {resultPercentageDrift.icon }
              </div>
              <div className={`metrics__card-invocation-header_${resultPercentageDrift.className}`}>
                {resultPercentageDrift.percentageChange}
              </div>
              <div className="metrics__card-invocation-header-selected-date">{selectedDate}</div>
              <div className="metrics__card-invocation-header-total-title">Total</div>
              <div className="metrics__card-invocation-header-total-score">
                {metric[METRIC_COMPUTED_TOTAL_POINTS]}
              </div>
            </div>
          </StatsCard.Header>
          <div
            ref={invocationBodyCardRef}
            className={`metrics__card-body ${isInvocationCardExpanded ? 'metrics__card-body-expanded' : 'metrics__card-body-collapsed'}`}
          >
              {!isInvocationCardExpanded && (
                  <RoundedIcon
                      className="metrics__card-pin-icon"
                      onClick={() => expandInvocationCard(true)}
                      tooltipText={'Expand Invocation Card'}
                  >
                      <UnpinIcon />
                  </RoundedIcon>
              )}
            <div
              className={`metrics__card-invocation-content ${!isInvocationCardExpanded && 'metrics__card-invocation-content-visible'}`}
            >
              <div className="metrics__card-invocation-content-title">Endpoint call count</div>
              <div className="metrics__card-invocation-content-container">
                <div className="metrics__card-invocation-content-container_drift_icon">
                  {resultPercentageDrift.icon}
                </div>
                <div
                  className={`metrics__card-invocation-content-container_${resultPercentageDrift.className}`}
                >
                  {resultPercentageDrift.percentageChange}
                </div>
                <div>{selectedDate}</div>
              </div>
              <div className="metrics__card-invocation-content-data">
                <div className="metrics__card-invocation-content-data_total_title">Total</div>
                <div className="metrics__card-invocation-content-data-total-score">
                  {' '}
                  {metric[METRIC_COMPUTED_TOTAL_POINTS]}
                </div>
              </div>
            </div>
            <div className="metrics__card-body-invocation">
              <MetricChart
                isInvocationCardExpanded={isInvocationCardExpanded}
                chartConfig={{
                  gradient: true,
                  ...gradientConfig,
                  data: {
                    labels: metric.labels,
                    datasets: [
                      {
                        data: metric.points,
                        dates: metric.dates,
                      chartType: CHART_TYPE_LINE,
                        fill: true,
                        metricType: metric.type,
                        driftStatusList: [],
                        backgroundColor: colors.cornflowerBlueTwo,
                        borderColor: colors.cornflowerBlueTwo,
                        borderWidth: 1,
                        tension: 0.4
                      }
                    ]
                  }
                }}
              />
            </div>
          </div>
        </StatsCard>
      </div>
    )
  }
)

InvocationMetricCard.propTypes = {
  expandInvocationCard: PropTypes.func.isRequired,
  isInvocationCardExpanded: PropTypes.bool.isRequired,
  metric: PropTypes.object.isRequired,
  previousTotalInvocation: PropTypes.number,
  selectedDate: PropTypes.string.isRequired
}

export default InvocationMetricCard
