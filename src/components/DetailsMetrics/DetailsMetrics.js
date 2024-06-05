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
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'

import GenericMetricChart from '../MetricChart/MetricChart'
import MetricChart from '../MetricChart/MetricChart'
import NoMetricData from './NoMetricData'
import StatsCard from '../../common/StatsCard/StatsCard'
import { TextTooltipTemplate, Tooltip } from 'iguazio.dashboard-react-controls/dist/components'

import { CHART_TYPE_LINE, CHART_TYPE_BAR, REQUEST_CANCELED } from '../../constants'
import detailsActions from '../../actions/details'
import {
  groupMetricByApplication,
  ML_RUN_INFRA
} from '../../elements/MetricsSelector/metricsSelector.utils'
import {
  getBarChartMetricConfig,
  getGradientLineChartConfig,
  getLineChartMetricConfig
} from '../../utils/getMetricChartConfig'

import {
  calculatePercentageDrift,
  getDateRangeBefore,
  timeRangeMapping
} from './detailsMetrics.utils'

import { ReactComponent as ArrowUp } from 'igz-controls/images/arrow-up.svg'
import { ReactComponent as ArrowDown } from 'igz-controls/images/arrow-down.svg'
import { ReactComponent as MetricsIcon } from 'igz-controls/images/metrics-icon.svg'

import './DetailsMetrics.scss'
import colors from 'igz-controls/scss/colors.scss'

const DetailsMetrics = ({ selectedItem }) => {
  const [isInvocationCardCollapsed, setIsInvocationCardCollapsed] = useState(true)
  const [metrics, setMetrics] = useState([])
  const [selectedDate, setSelectedDate] = useState('')
  const [previousTotalInvocation, setPreviousTotalInvocation] = useState(0)
  const prevScrollPositionRef = useRef(0)
  const invocationBodyCardRef = useRef(null)

  const detailsStore = useSelector(store => store.detailsStore)
  const dispatch = useDispatch()
  const metricsValuesAbortController = useRef(new AbortController())
  const lineConfig = useMemo(() => getLineChartMetricConfig(), [])
  const barConfig = useMemo(() => getBarChartMetricConfig(), [])
  const gradientConfig = useMemo(() => getGradientLineChartConfig(), [])

  const handleWindowResize = useCallback(e => {
    if (e.target && !e.target.classList?.contains('item-info')) return
    const card = invocationBodyCardRef.current

    if (!card) return

    const metrics = document.querySelector('.metrics')
    const content = document.querySelector('.metrics__card-invocation-content')
    const invocationHeader = document.querySelector('.stats-card__row')
    e.preventDefault()
    metrics.scrollBy({
      top: e.deltaY * 0.1,
      left: 0,
      behavior: 'smooth'
    })

    if (
      e.target.scrollTop > prevScrollPositionRef.current &&
      e.target.scrollTop > 5 &&
      card.clientHeight !== 80
    ) {
      card.style.height = '80px'
      content.style.display = 'flex'
      invocationHeader.style.display = 'none'
      setIsInvocationCardCollapsed(false)
    } else if (e.target.scrollTop === 0 && card.clientHeight === 80) {
      card.style.height = '200px'
      content.style.display = 'none'
      invocationHeader.style.display = 'flex'
      setIsInvocationCardCollapsed(true)
    }
    prevScrollPositionRef.current = e.target.scrollTop
  }, [])

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
          chartType: CHART_TYPE_BAR,
          tension: 0.2,
          borderWidth: 2,
          backgroundColor: metric.color,
          borderColor: metric.color
        }
      ]
    }
  }, [])

  const generatedMetrics = useMemo(() => {
    return groupMetricByApplication(metrics, true)
  }, [metrics])

  useEffect(() => {
    window.addEventListener('scroll', handleWindowResize, true)
    return () => window.removeEventListener('scroll', handleWindowResize, true)
  }, [handleWindowResize])

  useEffect(() => {
    dispatch(
      detailsActions.fetchModelEndpointMetrics(
        selectedItem.metadata.project,
        selectedItem.metadata.uid
      )
    )
  }, [dispatch, selectedItem])

  useEffect(() => {
    const selectedDate = detailsStore.dates.selectedOptionId
    if (!selectedDate || !(selectedDate in timeRangeMapping)) return

    setSelectedDate(timeRangeMapping[selectedDate])
  }, [detailsStore.dates.selectedOptionId])

  const fetchData = useCallback(
    (selectedMetricsParams, preInvocationMetricParams, selectedItem) => {
      metricsValuesAbortController.current = new AbortController()

      return Promise.all([
        dispatch(
          detailsActions.fetchModelEndpointMetricsValues(
            selectedItem.metadata.project,
            selectedItem.metadata.uid,
            selectedMetricsParams,
            metricsValuesAbortController.current.signal
          )
        ),
        dispatch(
          detailsActions.fetchModelEndpointMetricsValues(
            selectedItem.metadata.project,
            selectedItem.metadata.uid,
            preInvocationMetricParams,
            metricsValuesAbortController.current.signal
          )
        )
      ]).then(([metrics, previousInvocation]) => {
        if (metrics) setMetrics(metrics)

        if (!!previousInvocation && previousInvocation.length !== 0) {
          setPreviousTotalInvocation(previousInvocation[0].rawDataTotal)
        }
      })
    },
    [dispatch, setMetrics, metricsValuesAbortController]
  )

  useEffect(() => {
    if (
      selectedItem.metadata?.uid &&
      !isEmpty(detailsStore.metricsOptions.selectedByEndpoint[selectedItem.metadata?.uid])
    ) {
      const selectedMetrics =
        detailsStore.metricsOptions.selectedByEndpoint[selectedItem.metadata?.uid]

      const invocationMetric = detailsStore.metricsOptions.all.find(
        metric => metric.app === 'mlrun-infra'
      )

      const params = { name: [] }

      if (detailsStore.dates.value[0]) {
        params.start = detailsStore.dates.value[0].getTime()
      }

      if (detailsStore.dates.value[1]) {
        params.end = detailsStore.dates.value[1].getTime()
      }

      ;[invocationMetric, ...selectedMetrics].forEach(metric => {
        params.name.push(metric.full_name)
      })

      const newRange = getDateRangeBefore(params)

      const preInvocationMetricParams = { name: [] }
      preInvocationMetricParams.start = newRange.start
      preInvocationMetricParams.end = newRange.end
      const [{ full_name }] = detailsStore.metricsOptions.all.filter(
        metric => metric.app === 'mlrun-infra'
      )
      preInvocationMetricParams.name.push(full_name)

      fetchData(params, preInvocationMetricParams, selectedItem)
    } else if (detailsStore.metricsOptions.all.length !== 0) {
      const selectedMetricsParams = { name: [] }
      selectedMetricsParams.start =
        detailsStore.dates?.value[0] === '' ? '' : detailsStore.dates?.value[0].getTime()
      selectedMetricsParams.end =
        detailsStore.dates?.value[0] === '' ? '' : detailsStore.dates?.value[1].getTime()

      const newRange = getDateRangeBefore(selectedMetricsParams)
      const preInvocMetricParams = { name: [] }

      preInvocMetricParams.start = newRange.start
      preInvocMetricParams.end = newRange.end

      const { full_name } = detailsStore.metricsOptions.all.find(
        metric => metric.app === 'mlrun-infra'
      )

      selectedMetricsParams.name.push(full_name)
      preInvocMetricParams.name.push(full_name)

      fetchData(selectedMetricsParams, preInvocMetricParams, selectedItem)
    } else {
      setMetrics([])
    }

    return () => {
      metricsValuesAbortController.current?.abort(REQUEST_CANCELED)
    }
  }, [
    fetchData,
    selectedItem,
    detailsStore.dates.value,
    detailsStore.metricsOptions.all,
    detailsStore.metricsOptions.selectedByEndpoint,
    setMetrics,
    metricsValuesAbortController
  ])

  if (generatedMetrics.length === 0) {
    return (
      <StatsCard className="metrics__empty-select">
        <MetricsIcon />
        <div>Choose metrics to view endpoint’s data</div>
      </StatsCard>
    )
  }

  return (
    <div className="metrics">
      {generatedMetrics.map(([applicationName, applicationMetrics]) => {
        return (
          <React.Fragment key={applicationName}>
            <div className="metrics__app-name">
              {applicationName === ML_RUN_INFRA ? '' : applicationName}
            </div>
            {applicationMetrics.map(metric => {
              if (applicationName === ML_RUN_INFRA) {
                if (!metric.data) {
                  return (
                    <NoMetricData
                      className="empty-invocation-card"
                      key={metric.id}
                      title="Endpoint call count"
                    />
                  )
                } else {
                  const resultPercentageDrift = calculatePercentageDrift(
                    previousTotalInvocation,
                    metric.rawDataTotal
                  )

                  return (
                    <StatsCard className="metrics__card metrics__card-invocations" key={metric.id}>
                      <StatsCard.Header title="Endpoint call count">
                        <div className="metrics__card-invocation-header">
                          <div className="metrics__card-invocation-header_drift-icon-contrainer">
                            {resultPercentageDrift.positive ? <ArrowUp /> : <ArrowDown />}
                          </div>
                          <div
                            className={`metrics__card-invocation-header_${resultPercentageDrift.className}`}
                          >
                            {resultPercentageDrift.percentageChange}
                          </div>
                          <div className="metrics__card-invocation-header_selected_date">
                            {selectedDate}
                          </div>
                          <div className="metrics__card-invocation-header_total_title">Total</div>
                          <div className="metrics__card-invocation-header_total_score">
                            {metric.total}
                          </div>
                        </div>
                      </StatsCard.Header>
                      <div ref={invocationBodyCardRef} className="metrics__card-body">
                        <div className="metrics__card-invocation-content">
                          <div className="metrics__card-invocation-content-title">
                            Endpoint call count
                          </div>
                          <div className="metrics__card-invocation-content_container">
                            <div className="metrics__card-invocation-content_container_drift_icon">
                              {resultPercentageDrift.positive ? <ArrowUp /> : <ArrowDown />}
                            </div>
                            <div
                              className={`metrics__card-invocation-content_container_${resultPercentageDrift.className}`}
                            >
                              {resultPercentageDrift.percentageChange}
                            </div>
                            <div>{selectedDate}</div>
                          </div>
                          <div className="metrics__card-invocation-content-data">
                            <div className="metrics__card-invocation-content-data_total_title">
                              Total
                            </div>
                            <div className="metrics__card-invocation-content-data_total_score">
                              {' '}
                              {metric.total}
                            </div>
                          </div>
                        </div>
                        <div className="metrics__card-body-invocation">
                          <GenericMetricChart
                            showGrid={isInvocationCardCollapsed}
                            chartConfig={{
                              gradient: true,
                              ...gradientConfig,
                              data: {
                                labels: metric.labels,
                                datasets: [
                                  {
                                    data: metric.points,
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
                  )
                }
              } else if (!metric.data) {
                return <NoMetricData key={metric.id} title={metric.title} />
              } else {
                return (
                  <StatsCard className="metrics__card" key={metric.id}>
                    <StatsCard.Header title={metric.title}>
                      {metric.totalDriftStatus && (
                        <Tooltip
                          template={
                            <TextTooltipTemplate
                              text={
                                <div className="total-drift-status-tooltip">
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
                                  chartType: CHART_TYPE_LINE,
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
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default React.memo(DetailsMetrics)
