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
import StatsCard from '../../common/StatsCard/StatsCard'

import detailsActions from '../../actions/details'
import { groupMetricByApplication } from '../../elements/MetricsSelector/metricsSelector.utils'
import {
  getGradientLineChart,
  getBarChartMetricConfig,
  getLineChartMetricConfig
} from '../../utils/getMetricChartConfig'

import { TextTooltipTemplate, Tooltip } from 'iguazio.dashboard-react-controls/dist/components'
// import { ReactComponent as NoData } from 'igz-controls/images/no-data-metric-icon.svg'
// import { ReactComponent as Metrics } from 'igz-controls/images/metrics-icon.svg'

import { ReactComponent as NoData } from './nodata.svg'
import { ReactComponent as Metrics } from './metric.svg'

import './DetailsMetrics.scss'

const DetailsMetrics = ({ selectedItem }) => {
  const [metrics, setMetrics] = useState([])
  const prevScrollPos = useRef(0)

  const [expand, toggleExpand] = useState(true)
  const cardRef = useRef(null)

  const detailsStore = useSelector(store => store.detailsStore)
  const dispatch = useDispatch()
  const lineConfig = useMemo(() => getLineChartMetricConfig(), [])
  const barConfig = useMemo(() => getBarChartMetricConfig(), [])
  const gradientConfig = useMemo(() => getGradientLineChart(), [])

  // TODO: refactor the calculateHistogram
  const calculateHistogram = useCallback((data, item) => {
    const numberOfBins = 5
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min === 0 ? 1 : max - min
    const binSize = range / numberOfBins

    const bins = Array(numberOfBins).fill(0)
    data.forEach(value => {
      const binIndex = Math.min(Math.floor((value - min) / binSize), numberOfBins - 1)
      bins[binIndex]++
    })

    const totalCount = data.length
    const binPercentages = bins.map(count => ((count / totalCount) * 100).toFixed(1))
    const binLabels = Array.from({ length: numberOfBins }, (_, i) => {
      const rangeStart = (min + i * binSize).toFixed(2)
      const rangeEnd =
        i === numberOfBins - 1 ? max.toFixed(2) : (min + (i + 1) * binSize).toFixed(2)
      return `${rangeStart} - ${rangeEnd}`
    })

    const calculateAverages = data => {
      return data.map(item => {
        if (max === min) return max
        const [num1, num2] = item.split(' - ').map(parseFloat)
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
    if (max === min) {
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
          backgroundColor: item.color,
          borderColor: item.color
        }
      ],
      options: {
        scales: {
          y: {
            step: 10,
            title: {
              display: true,
              text: 'Percentage',
              font: 10
            }
          },
          x: {
            title: {
              text: 'Value',
              font: 10
            }
          }
        }
      }
    }
  }, [])

  // TODO: add resize invocation card on scroll

  const handleResizeCard = useCallback(e => {
    if (!e.target.classList.contains('item-info')) return
    const card = cardRef.current
    console.log(card)
    if (e.target.scrollTop > prevScrollPos.current) {
      if (e.target.scrollTop > 5 && card.clientHeight !== 80) {
        card.parentNode.parentNode.style.height += 173
        card.style.height = '80px'
        toggleExpand(false)
      }
    } else {
      if (e.target.scrollTop === 0 && card.clientHeight === 80) {
        // card.parentNode.parentNode.style.height -= 80
        // card.style.height = '200px'
        toggleExpand(true)
      }
    }
    prevScrollPos.current = e.target.scrollTop
  }, [])
  // TODO: will be add after the invocations implementation request
  useEffect(() => {
    window.addEventListener('scroll', handleResizeCard, true)
    return () => window.removeEventListener('scroll', handleResizeCard, true)
  }, [handleResizeCard])

  const generatedMetrics = useMemo(() => {
    const list = groupMetricByApplication(metrics, false)

    return list.sort(([a], [b]) => {
      if (a === 'mlrun-infra') return -1
      if (b === 'mlrun-infra') return 1
      return 0
    })
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
      let metrics = detailsStore.metricsOptions.all
      const invocation = metrics.filter(item => item.app === 'mlrun-infra')

      const selectedMetrics =
        detailsStore.metricsOptions.selectedByEndpoint[selectedItem.metadata?.uid]
      // console.log(selectedMetrics)
      const params = { name: [] }

      if (detailsStore.dates.value[0]) {
        params.start = detailsStore.dates.value[0].getTime()
      }

      if (detailsStore.dates.value[1]) {
        params.end = detailsStore.dates.value[1].getTime()
      }

      ;[...selectedMetrics, ...invocation].forEach(metric => {
        params.name.push(metric.full_name)
      })
      console.log(params.name)
      dispatch(
        detailsActions.fetchModelEndpointMetricsValues(
          selectedItem.metadata.project,
          selectedItem.metadata.uid,
          params
        )
      ).then(metricsList => {
        setMetrics(metricsList)
      })
    } else if (detailsStore.metricsOptions.all.length !== 0) {
      const params = { name: [] }

      if (detailsStore.dates.value[0]) {
        params.start = detailsStore.dates.value[0].getTime()
      }

      if (detailsStore.dates.value[1]) {
        params.end = detailsStore.dates.value[1].getTime()
      }
      let metrics = detailsStore.metricsOptions.all
      const [invocation] = metrics.filter(item => item.app === 'mlrun-infra')
      params.name.push(invocation.full_name)
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
  }, [
    dispatch,
    selectedItem,
    detailsStore.dates,
    detailsStore.metricsOptions.all,
    detailsStore.metricsOptions.selectedByEndpoint
  ])

  if (generatedMetrics.length === 0) {
    return (
      <StatsCard className="metrics__empty-select">
        <Metrics />
        <div>Choose metrics to view endpoint’s data</div>
      </StatsCard>
    )
  }

  return (
    <div className="metrics">
      {generatedMetrics.map(([name, app]) => {
        return (
          <>
            {app.map(item => {
              if (item.app === 'mlrun-infra') {
                if (!item.data) return <div>no data</div>
                return (
                  <StatsCard className="metrics__card-tmp">
                    {expand && (
                      <StatsCard.Header title="Endpoint call count">
                        <div
                          style={{
                            flex: 1,
                            fontSize: '18px',
                            fontWeight: '700',
                            display: 'flex',
                            justifyContent: 'end',
                            alignItems: 'center'
                          }}
                        >
                          <div className="kpi-value">
                            <span style={{ fontSize: '14px', margin: '0 10px 0 0' }}>Total</span>
                            {item.total}
                          </div>
                        </div>
                      </StatsCard.Header>
                    )}
                    <div style={{ height: '80px' }} ref={cardRef} className="metrics__card-body">
                      {!expand && (
                        <div
                          style={{
                            flex: '0 1 27%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '18px',
                            fontWeight: '700',
                            width: '27%',
                            gap: '15px'
                          }}
                        >
                          <div className="title">Endpoint call count</div>
                          <div className="kpi-value">
                            <span style={{ fontSize: '14px', marginRight: '5px' }}>Total</span>
                            {item.total}
                          </div>
                        </div>
                      )}
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
                                  metricType: 'invocation',
                                  driftStatusList: [],
                                  backgroundColor: '#5871F4',
                                  borderColor: '#5871F4',
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
              } else if (!item.data) {
                console.log('no data')
                return (
                  <StatsCard className="metrics__card" key={item.id}>
                    <StatsCard.Header title={item.title}></StatsCard.Header>
                    <div className="metrics__empty-card">
                      <div>
                        <NoData />
                      </div>
                      <div>No data to show</div>
                    </div>
                  </StatsCard>
                )
              } else {
                return (
                  <StatsCard className="metrics__card" key={item.id}>
                    <StatsCard.Header title={item.title}>
                      {item.totalDriftStatus && (
                        <Tooltip
                          template={
                            <TextTooltipTemplate
                              text={
                                <div className="total-drift-status">
                                  <div>Date: {item.labels[item.totalDriftStatus.index]}</div>
                                  <div>Value:{item.points[item.totalDriftStatus.index]}</div>
                                </div>
                              }
                            />
                          }
                        >
                          <div>
                            <span>{item.totalDriftStatus.text}</span>
                            <span
                              className={`metrics__card-drift-status metrics__card-drift-${item.totalDriftStatus.color}`}
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
                            {item.avg}
                          </div>
                        </div>
                        <GenericMetricChart
                          chartConfig={{
                            ...barConfig,
                            data: calculateHistogram(item.points, item)
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
                                  driftStatusList: item.driftStatusList || [],
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
          </>
        )
      })}
    </div>
  )
}

export default React.memo(DetailsMetrics)
