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
import { isNil } from 'lodash'

import InvocationMetricCard from './IncvocationMetricCard'
import MetricChart from '../MetricChart/MetricChart'
import NoMetricData from './NoMetricData'
import DatePicker from '../../common/DatePicker/DatePicker'
import MetricsSelector from '../../elements/MetricsSelector/MetricsSelector'
import StatsCard from '../../common/StatsCard/StatsCard'
import { TextTooltipTemplate, Tooltip } from 'iguazio.dashboard-react-controls/dist/components'

import { CHART_TYPE_LINE, CHART_TYPE_BAR, REQUEST_CANCELED } from '../../constants'
import detailsActions from '../../actions/details'
import modelEndpointsActions from '../../actions/modelEndpoints'
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

import {
  datePickerPastOptions,
  PAST_24_HOUR_DATE_OPTION,
  TIME_FRAME_LIMITS
} from '../../utils/datePicker.util'

import { ReactComponent as MetricsIcon } from 'igz-controls/images/metrics-icon.svg'
import colors from 'igz-controls/scss/colors.scss'

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
  const prevSelectedEndPointNameRef = useRef('')
  const [metricOptionsAreLoaded, setMetricOptionsAreLoaded] = useState(false)
  const detailsStore = useSelector(store => store.detailsStore)
  const dispatch = useDispatch()
  const lineConfig = useMemo(() => getLineChartMetricConfig(), [])
  const barConfig = useMemo(() => getBarChartMetricConfig(), [])
  const generatedMetrics = useMemo(() => {
    return groupMetricByApplication(metrics, true)
  }, [metrics])

  const chooseMetricsDataCard = useMemo(() => {
    return (
      generatedMetrics.length === 1 && (
        <StatsCard className="metrics__empty-select">
          <MetricsIcon />
          <div>Choose metrics to view endpoint’s data</div>
        </StatsCard>
      )
    )
  }, [generatedMetrics.length])

  const calculateHistogram = useCallback((points, metric) => {
    const numberOfBins = 5
    const minPointValue = Math.min(...points)
    const maxPointValue = Math.max(...points)
    const range = maxPointValue - minPointValue === 0 ? 1 : maxPointValue - minPointValue
    const binSize = range / numberOfBins
    const bins = Array(numberOfBins)
      .fill()
      .map(() => ({ count: 0, minBinValue: null, maxBinValue: null }))
    const roundValue = (value, fraction = 100) => Math.round(value * fraction) / fraction

    points.forEach(value => {
      const binIndex = Math.min(Math.floor((value - minPointValue) / binSize), numberOfBins - 1)
      bins[binIndex].count++

      if (isNil(bins[binIndex].minBinValue) || bins[binIndex].minBinValue > value)
        bins[binIndex].minBinValue = value

      if (isNil(bins[binIndex].maxBinValue) || bins[binIndex].maxBinValue < value)
        bins[binIndex].maxBinValue = value
    })

    const totalCount = points.length

    const binPercentages = bins.map(bin => roundValue((bin.count / totalCount) * 100, 1000))

    const binLabels = Array.from({ length: numberOfBins }, (_, i) => {
      if (parseFloat(binPercentages[i]) === 0) return ''

      if (maxPointValue === minPointValue) return `${roundValue(maxPointValue)}`

      const rangeStart = bins[i].minBinValue
      const rangeEnd = bins[i].maxBinValue

      if (rangeStart === rangeEnd) return String(roundValue(rangeStart))

      return `${roundValue(rangeStart)} - ${roundValue(rangeEnd)}`
    })

    return {
      labels: binLabels,
      datasets: [
        {
          data: binPercentages,
          chartType: CHART_TYPE_BAR,
          tension: 0.2,
          borderWidth: 2,
          backgroundColor: colors.java,
          borderColor: colors.java
        }
      ]
    }
  }, [])

  const expandInvocationCard = useCallback(
    (isUnpinAction = false) => {
      const invocationBodyCard = invocationBodyCardRef.current
      const metricsContainer = metricsContainerRef.current
      const isOnlyOneMetric = generatedMetrics.length === 1

      if (!invocationBodyCard || !metricsContainer) return

      if (!isUnpinAction && isOnlyOneMetric) {
        setIsInvocationCardExpanded(true)
      } else if (isUnpinAction) {
        enableScrollRef.current = false
        metricsContainer.parentNode.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        setIsInvocationCardExpanded(true)
        setTimeout(() => {
          enableScrollRef.current = true
        }, INVOCATION_CARD_SCROLL_DELAY)
      }
    },
    [generatedMetrics]
  )

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
      }

      prevScrollPositionRef.current = scrollTopPosition
    },
    [isInvocationCardExpanded, detailsStore.metricsOptions.selectedByEndpoint, selectedItem]
  )

  const handleChangeDates = useCallback(
    (dates, isPredefined, selectedOptionId) => {
      const generatedDates = [...dates]

      if (generatedDates.length === 1) {
        generatedDates.push(new Date())
      }

      dispatch(
        detailsActions.setDetailsDates({
          value: generatedDates,
          selectedOptionId,
          isPredefined
        })
      )
    },
    [dispatch]
  )

  useEffect(() => {
    const past24hoursOption = datePickerPastOptions.find(
      option => option.id === PAST_24_HOUR_DATE_OPTION
    )

    handleChangeDates(past24hoursOption.handler(), true, PAST_24_HOUR_DATE_OPTION)
  }, [handleChangeDates])

  useEffect(() => {
    expandInvocationCard()
  }, [metrics, expandInvocationCard])

  useEffect(() => {
    window.addEventListener('scroll', handleWindowScroll, true)
    return () => window.removeEventListener('scroll', handleWindowScroll, true)
  }, [handleWindowScroll])

  useEffect(() => {
    dispatch(
      modelEndpointsActions.fetchModelEndpointMetrics(
        selectedItem.metadata.project,
        selectedItem.metadata.uid
      )
    ).then(() => setMetricOptionsAreLoaded(true))
  }, [dispatch, selectedItem.metadata.project, selectedItem.metadata.uid])

  useEffect(() => {
    const selectedDate = detailsStore.dates.selectedOptionId
    if (!selectedDate || !(selectedDate in timeRangeMapping)) return

    setSelectedDate(timeRangeMapping[selectedDate])
  }, [detailsStore.dates.selectedOptionId])

  const fetchData = useCallback(
    (selectedMetricsParams, preInvocationMetricParams, selectedItemProject, selectedItemUid) => {
      metricsValuesAbortController.current = new AbortController()

      return Promise.all([
        dispatch(
          modelEndpointsActions.fetchModelEndpointMetricsValues(
            selectedItemProject,
            selectedItemUid,
            selectedMetricsParams,
            metricsValuesAbortController.current.signal
          )
        ),
        dispatch(
          modelEndpointsActions.fetchModelEndpointMetricsValues(
            selectedItemProject,
            selectedItemUid,
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
    if (selectedItem.metadata.uid !== prevSelectedEndPointNameRef.current) {
      prevSelectedEndPointNameRef.current = selectedItem.metadata.uid
      return
    }
    if (
      metricOptionsAreLoaded &&
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
      fetchData(
        params,
        preInvocationMetricParams,
        selectedItem.metadata.project,
        selectedItem.metadata.uid
      )
    } else {
      setMetrics([])
    }

    return () => {
      metricsValuesAbortController.current?.abort(REQUEST_CANCELED)
    }
  }, [
    metricOptionsAreLoaded,
    fetchData,
    selectedItem.metadata.uid,
    selectedItem.metadata.project,
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
    <div className="metrics-wrapper">
      <div className="metrics__custom-filters">
        <MetricsSelector
          name="metrics"
          metrics={detailsStore.metricsOptions.all}
          onSelect={metrics =>
            dispatch(
              modelEndpointsActions.setSelectedMetricsOptions({
                endpointUid: selectedItem.metadata.uid,
                metrics
              })
            )
          }
          preselectedMetrics={detailsStore.metricsOptions.preselected}
        />
        <DatePicker
          className="details-date-picker"
          date={detailsStore.dates.value[0]}
          dateTo={detailsStore.dates.value[1]}
          selectedOptionId={detailsStore.dates.selectedOptionId}
          label=""
          onChange={handleChangeDates}
          type="date-range-time"
          timeFrameLimit={TIME_FRAME_LIMITS.MONTH}
          withLabels
        />
      </div>

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
                      <React.Fragment key={metric.id}>
                        <NoMetricData
                          className="empty-invocation-card"
                          key={metric.id}
                          title="Endpoint call count"
                        />
                        {chooseMetricsDataCard}
                      </React.Fragment>
                    )
                  } else {
                    return (
                      <React.Fragment key={metric.id}>
                        <InvocationMetricCard
                          ref={invocationBodyCardRef}
                          expandInvocationCard={expandInvocationCard}
                          isInvocationCardExpanded={isInvocationCardExpanded}
                          key={metric.id}
                          metric={metric}
                          previousTotalInvocation={previousTotalInvocation}
                          selectedDate={selectedDate}
                        />
                        {chooseMetricsDataCard}
                      </React.Fragment>
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
    </div>
  )
}

export default React.memo(DetailsMetrics)
