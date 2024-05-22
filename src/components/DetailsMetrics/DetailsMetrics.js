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
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'

import GenericMetricChart from '../Cartjs/MetricChart'
import StatsCard from '../../common/StatsCard/StatsCard'

import detailsActions from '../../actions/details'

import noData from './noData.svg' // TODO add to igz-controls
import Data from './Data.svg' // TODO add to igz-controls

import './DetailsMetrics.scss'

import {
  getLineChartMetricConfig,
  getBarChartMetricConfig,
  getGradientLineChart
} from '../../utils/getMetricChartConfig'

const DetailsMetrics = ({ selectedItem }) => {
  const [metrics, setMetrics] = useState([])
  const detailsStore = useSelector(store => store.detailsStore)
  const dispatch = useDispatch()
  const gradientConfig = useMemo(() => getGradientLineChart(), [])
  const lineConfig = useMemo(() => getLineChartMetricConfig(), [])
  const barConfig = useMemo(() => getBarChartMetricConfig(), [])

  const [expand] = useState(false)

  // TODO: add resize invocation card on scroll

  useEffect(() => {
    dispatch(
      detailsActions.fetchModelEndpointMetrics(
        selectedItem.metadata.project,
        selectedItem.metadata.uid
      )
    )
  }, [dispatch, selectedItem])

  useEffect(() => {
    if (
      selectedItem.metadata?.uid &&
      !isEmpty(detailsStore.metricsOptions.selectedByEndpoint[selectedItem.metadata?.uid])
    ) {
      const selectedMetrics =
        detailsStore.metricsOptions.selectedByEndpoint[selectedItem.metadata?.uid]
      const params = { name: [] }

      if (detailsStore.dates.value[0]) {
        params.start = detailsStore.dates.value[0].getTime()
      }

      if (detailsStore.dates.value[1]) {
        params.end = detailsStore.dates.value[1].getTime()
      }

      selectedMetrics.forEach(metric => {
        params.name.push(metric.full_name)
      })

      dispatch(
        detailsActions.fetchModelEndpointMetricsValues(
          selectedItem.metadata.project,
          selectedItem.metadata.uid,
          params
        )
      ).then(metricsList => {
        setMetrics(metricsList)
      })
    } else if (selectedItem.metadata?.uid) {
      setMetrics([])
    }
  }, [dispatch, selectedItem, detailsStore.dates, detailsStore.metricsOptions.selectedByEndpoint])

  if (metrics.length === 0) {
    return (
      <StatsCard className="metrics__empty-select">
        <img alt="metrics" src={Data} />
        <div>Choose metrics to view endpoint’s data</div>
      </StatsCard>
    )
  }
  return (
    <div className="metrics">
      {metrics.map((item, index) => {
        if (!item.data) {
          return (
            <StatsCard className="metrics__card">
              <StatsCard.Header title={item.title}></StatsCard.Header>
              <div className="metrics__empty-card">
                <div>
                  <img alt="no data" src={noData} />
                </div>
                <div>No data to show</div>
              </div>
            </StatsCard>
          )
        } else if (item.title.includes('invocation')) {
          return (
            <StatsCard className="metrics__card-tmp">
              <div style={{ height: '80px' }} className="metrics__card-body">
                <div className="metrics__card-invocation-content">
                  <div className="metrics__card-invocation-content-title">Endpoint call count</div>
                  <div className="metrics__card-invocation-content-content-data">
                    <span>Total</span>
                    {item.total}
                  </div>
                </div>
                <div className="metrics__card-body-invocation">
                  <GenericMetricChart
                    showGrid={expand}
                    chartConfig={{
                      gradient: true,
                      ...gradientConfig,
                      type: 'line',
                      data: {
                        labels: item.labels,
                        datasets: [
                          {
                            data: item.points,
                            fill: true,
                            backgroundColor: item.color,
                            borderColor: item.color,
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
          )
        } else {
          return (
            <StatsCard className="metrics__card">
              <StatsCard.Header title={item.title}>
                {item.totalDriftStatus && (
                  <div>
                    {item.totalDriftStatus.text}
                    <span
                      className="metrics__card-drift-status"
                      style={{
                        backgroundColor: item.totalDriftStatus.color
                      }}
                    ></span>
                  </div>
                )}
              </StatsCard.Header>
              <div className="metrics__card-body">
                <div className="metrics__card-body-bar">
                  <div className="metrics__card-header">
                    <div>Value distribution</div>
                    <div className="metrics__card-header-data">
                      <span className="metrics__card-header-label">Avg. </span>
                      {item.avg}
                    </div>
                  </div>
                  <GenericMetricChart
                    chartConfig={{
                      ...barConfig,
                      data: {
                        labels: item.points,
                        datasets: [
                          {
                            data: item.points,
                            tension: 0.2,
                            borderWidth: 2,
                            backgroundColor: item.color,
                            borderColor: item.color
                          }
                        ]
                      }
                    }}
                  />
                </div>
                <div className="metrics__card-body-line">
                  <div className="metrics__card-header">Value over time</div>
                  <GenericMetricChart
                    chartConfig={{
                      ...lineConfig,
                      data: {
                        labels: item.labels,
                        datasets: [
                          {
                            data: item.points,
                            metricType: item.type,
                            driftStatus: item.driftStatus || [],
                            tension: 0.2,
                            borderWidth: 1,
                            borderColor: item.color
                          }
                        ]
                      }
                    }}
                  />
                </div>
              </div>
            </StatsCard>
          )
        }
      })}
    </div>
  )
}

export default React.memo(DetailsMetrics)
