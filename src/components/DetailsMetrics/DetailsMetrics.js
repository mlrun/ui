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
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'

import MetricChart from '../MetricChart/MetricChart'
import StatsCard from '../../common/StatsCard/StatsCard'

import detailsActions from '../../actions/details'
import { groupMetricByApplication } from '../../elements/MetricsSelector/metricsSelector.utils'
import { getBarChartMetricConfig, getLineChartMetricConfig } from '../../utils/getMetricChartConfig'

import { TextTooltipTemplate, Tooltip } from 'iguazio.dashboard-react-controls/dist/components'
// import { ReactComponent as NoDataIcon } from 'igz-controls/images/no-data-metric-icon.svg'
// import { ReactComponent as MetricsIcon } from 'igz-controls/images/metrics-icon.svg'

import metric from './metric.svg'
import noData from './nodata.svg'

import './DetailsMetrics.scss'

const DetailsMetrics = ({ selectedItem }) => {
  const [metrics, setMetrics] = useState([])
  const detailsStore = useSelector(store => store.detailsStore)
  const dispatch = useDispatch()
  const lineConfig = useMemo(() => getLineChartMetricConfig(), [])
  const barConfig = useMemo(() => getBarChartMetricConfig(), [])

  const calculateHistogram = useCallback((points, metric) => {
    const numberOfBins = 5
    const minPointValue = Math.min(...points)
    const maxPointValue = Math.max(...points)

    const range = maxPointValue - minPointValue === 0 ? 1 : maxPointValue - minPointValue
    const binSize = range / numberOfBins
    const bins = Array(numberOfBins).fill(0)

    points.forEach(value => {
      const binIndex = Math.min(Math.floor((value - minPointValue) / binSize), numberOfBins - 1)
      bins[binIndex]++
    })

    const totalCount = points.length

    const binPercentages = bins.map(count => ((count / totalCount) * 100).toFixed(1))

    const binLabels = Array.from({ length: numberOfBins }, (_, i) => {
      const rangeStart = (minPointValue + i * binSize).toFixed(2)
      const rangeEnd =
        i === numberOfBins - 1
          ? maxPointValue.toFixed(2)
          : (minPointValue + (i + 1) * binSize).toFixed(2)

      return `${rangeStart} - ${rangeEnd}`
    })

    const calculateAverages = binLabels => {
      return binLabels.map(binLabel => {
        if (maxPointValue === minPointValue) return maxPointValue
        const [num1, num2] = binLabel.split(' - ').map(parseFloat)
        const average = (num1 + num2) / 2
        return (Math.abs(average * 100) / 100).toFixed(1)
      })
    }

    let averageValue = calculateAverages(binLabels)
    const adjustArray = (binPercentages, averageValue) => {
      return binPercentages.map((value, index) => {
        return parseFloat(averageValue[index]) !== 0 ? value : ''
      })
    }

    if (maxPointValue === minPointValue) {
      averageValue = adjustArray(averageValue, binPercentages)
    }

    return {
      labels: averageValue,
      datasets: [
        {
          data: binPercentages,
          chartType: 'bar',
          tension: 0.2,
          borderWidth: 2,
          backgroundColor: metric.color,
          borderColor: metric.color
        }
      ]
    }
  }, [])

  // TODO: add resize invocation card on scroll

  const generatedMetrics = useMemo(() => {
    return groupMetricByApplication(metrics)
  }, [metrics])

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

  if (generatedMetrics.length === 0) {
    return (
      <StatsCard className="metrics__empty-select">
        {/*<MetricsIcon />*/}
        <img src={metric} />

        <div>Choose metrics to view endpoint’s data</div>
      </StatsCard>
    )
  }
  return (
    <>
      {generatedMetrics.map(([name, app]) => {
        return (
          <div className="metrics">
            <div className="app">{name}</div>
            {app.map(metric => {
              if (!metric.data) {
                return (
                  <StatsCard className="metrics__card" key={metric.id}>
                    <StatsCard.Header title={metric.title}></StatsCard.Header>
                    <div className="metrics__empty-card">
                      <div>
                        {/*<NoDataIcon />*/}
                        <img src={noData} />
                      </div>
                      <div>No data to show</div>
                    </div>
                  </StatsCard>
                )
              } else {
                return (
                  <StatsCard className="metrics__card" key={metric.id}>
                    <StatsCard.Header title={metric.title}>
                      {metric.totalDriftStatus && (
                        <Tooltip
                          template={
                            <TextTooltipTemplate
                              text={
                                <div className="total-drift-status">
                                  <div>Date: {metric.labels[metric.totalDriftStatus.index]}</div>
                                  <div>Value:{metric.points[metric.totalDriftStatus.index]}</div>
                                </div>
                              }
                            />
                          }
                        >
                          <div>
                            <span>{metric.totalDriftStatus.text}</span>
                            <span
                              className={`metrics__card-drift-status metrics__card-drift-${metric.totalDriftStatus.className}`}
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
                            {metric.avg}
                          </div>
                        </div>
                        <MetricChart
                          chartConfig={{
                            ...barConfig,
                            data: calculateHistogram(metric.points, metric)
                          }}
                        />
                      </div>
                      <div className="metrics__card-body-line">
                        <div className="metrics__card-header">Value over time</div>
                        <MetricChart
                          chartConfig={{
                            ...lineConfig,
                            data: {
                              labels: metric.labels,
                              datasets: [
                                {
                                  data: metric.points,
                                  chartType: 'line',
                                  metricType: metric.type,
                                  driftStatusList: metric.driftStatusList || [],
                                  tension: 0.2,
                                  totalDriftStatus: metric.totalDriftStatus,
                                  borderWidth: 1,
                                  borderColor: metric.color
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
      })}
    </>
  )
}

export default React.memo(DetailsMetrics)
