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

import InvocationMetricCard from './IncvocationMetricCard'
import MetricChart from '../MetricChart/MetricChart'
import NoMetricData from './NoMetricData'
import StatsCard from '../../common/StatsCard/StatsCard'
import { TextTooltipTemplate, Tooltip } from 'iguazio.dashboard-react-controls/dist/components'

import { CHART_TYPE_LINE, CHART_TYPE_BAR, REQUEST_CANCELED } from '../../constants'
import detailsActions from '../../actions/details'
import { groupMetricByApplication } from '../../elements/MetricsSelector/metricsSelector.util'
import { getBarChartMetricConfig, getLineChartMetricConfig } from '../../utils/getMetricChartConfig'
import {
  getDateRangeBefore,
  INVOCATION_CARD_SCROLL_DELAY,
  INVOCATION_CARD_SCROLL_THRESHOLD,
  METRIC_COMPUTED_AVG_POINTS,
  METRIC_RAW_TOTAL_POINTS,
  ML_RUN_INFRA,
  timeRangeMapping
} from './detailsMetrics.util'

import { ReactComponent as MetricsIcon } from 'igz-controls/images/metrics-icon.svg'

import './DetailsMetrics.scss'

const DetailsMetrics = ({ selectedItem }) => {
  const [metrics, setMetrics] = useState([])
  const [selectedDate, setSelectedDate] = useState('')
  const [previousTotalInvocation, setPreviousTotalInvocation] = useState(0)
  const [isInvocationCardExpanded, setIsInvocationCardExpanded] = useState(true)
  const enableScrollRef = useRef(true)
  const invocationBodyCardRef = useRef(null)
  const metricsContainerRef = useRef(null)
  const metricsValuesAbortController = useRef(new AbortController())
  const prevScrollPositionRef = useRef(0)

  const detailsStore = useSelector(store => store.detailsStore)
  const dispatch = useDispatch()
  const lineConfig = useMemo(() => getLineChartMetricConfig(), [])
  const barConfig = useMemo(() => getBarChartMetricConfig(), [])
  const generatedMetrics = useMemo(() => {
    return groupMetricByApplication(metrics, true)
  }, [metrics])

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

  const expandOrCollapseInvocationCard = useCallback(() => {
    const invocationBodyCard = invocationBodyCardRef.current
    const metricsContainer = metricsContainerRef.current

    if (!invocationBodyCard || !metricsContainer) return

    const containerOverflow =
      metricsContainer.parentNode.scrollHeight !== metricsContainer.parentNode.clientHeight

    if (containerOverflow) {
      if (isInvocationCardExpanded) {
        setIsInvocationCardExpanded(true)
      } else {
        setIsInvocationCardExpanded(false)
      }
    } else if (generatedMetrics.length === 1) {
      setIsInvocationCardExpanded(true)
    }
  }, [generatedMetrics, invocationBodyCardRef, isInvocationCardExpanded, metricsContainerRef])

  const handleWindowScroll = useCallback(
    e => {
      if (e.target && !e.target.classList?.contains('item-info')) return

      const invocationBodyCard = invocationBodyCardRef.current
      const metricsContainer = metricsContainerRef.current
      const scrollTopPosition = e.target.scrollTop

      if (!invocationBodyCard) return

      const selectedMetrics =
        detailsStore.metricsOptions.selectedByEndpoint[selectedItem?.metadata?.uid]

      e.preventDefault()

      metricsContainer.scrollBy({
        top: e.deltaY * 0.1,
        left: 0,
        behavior: 'smooth'
      })

      const shouldCollapse =
        isInvocationCardExpanded &&
        enableScrollRef.current &&
        selectedMetrics.length > 0 &&
        scrollTopPosition > prevScrollPositionRef.current &&
        scrollTopPosition > INVOCATION_CARD_SCROLL_THRESHOLD

      if (shouldCollapse) {
        setIsInvocationCardExpanded(false)
        enableScrollRef.current = false
        setTimeout(() => {
          enableScrollRef.current = true
        }, INVOCATION_CARD_SCROLL_DELAY)
      } else if (!scrollTopPosition && !isInvocationCardExpanded && enableScrollRef.current) {
        setIsInvocationCardExpanded(true)
      }

      prevScrollPositionRef.current = scrollTopPosition
    },
    [isInvocationCardExpanded, detailsStore.metricsOptions.selectedByEndpoint, selectedItem]
  )

  useEffect(() => {
    expandOrCollapseInvocationCard()
  }, [metrics, expandOrCollapseInvocationCard])

  useEffect(() => {
    window.addEventListener('scroll', handleWindowScroll, true)
    return () => window.removeEventListener('scroll', handleWindowScroll, true)
  }, [handleWindowScroll])

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
          setPreviousTotalInvocation(previousInvocation[0][METRIC_RAW_TOTAL_POINTS])
        }
      })
    },
    [dispatch, setMetrics, metricsValuesAbortController]
  )

  useEffect(() => {
    if (
      selectedItem.metadata?.uid &&
      detailsStore.metricsOptions.all.length > 0 &&
      detailsStore.metricsOptions.selectedByEndpoint[selectedItem.metadata?.uid]
    ) {
      const selectedMetrics =
        detailsStore.metricsOptions.selectedByEndpoint[selectedItem.metadata?.uid]
      const invocationMetric = detailsStore.metricsOptions.all.find(
        metric => metric.app === ML_RUN_INFRA
      )

      const params = { name: [] }

      if (detailsStore.dates.value[0] && detailsStore.dates.value[1]) {
        params.start = detailsStore.dates.value[0].getTime()
        params.end = detailsStore.dates.value[1].getTime()
      }

      ;[invocationMetric, ...selectedMetrics].forEach(metric => {
        params.name.push(metric.full_name)
      })

      const preInvocationMetricParams = { name: [] }

      if (params.start && params.end) {
        const newRange = getDateRangeBefore(params)
        preInvocationMetricParams.start = newRange.start
        preInvocationMetricParams.end = newRange.end
      }

      const [{ full_name }] = detailsStore.metricsOptions.all.filter(
        metric => metric.app === ML_RUN_INFRA
      )
      preInvocationMetricParams.name.push(full_name)
      fetchData(params, preInvocationMetricParams, selectedItem)
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
    detailsStore.metricsOptions.loading,
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
    <div ref={metricsContainerRef} className="metrics">
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
                  return (
                    <InvocationMetricCard
                      ref={invocationBodyCardRef}
                      isInvocationCardExpanded={isInvocationCardExpanded}
                      key={metric.id}
                      metric={metric}
                      previousTotalInvocation={previousTotalInvocation}
                      selectedDate={selectedDate}
                    />
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
                            {metric[METRIC_COMPUTED_AVG_POINTS]}
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
