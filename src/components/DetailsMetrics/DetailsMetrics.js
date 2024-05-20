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
import classnames from 'classnames'

import GenericMetricChart from '../Cartjs/MetricChart'
import StatsCard from '../../common/StatsCard/StatsCard'

import detailsActions from '../../actions/details'

import noData from './noData.svg' // TODO add to igz-controls

import './DetailsMetrics.scss'

import {
  getLineChartMetricConfig,
  getBarChartMetricConfig,
  getGradientLineChart
} from '../../utils/getMetricChartConfig'
import { dummyData } from './tmpData.js'

const DetailsMetrics = ({ selectedItem }) => {
  const [metrics, setMetrics] = useState([])
  const detailsStore = useSelector(store => store.detailsStore)
  const dispatch = useDispatch()

  const cardRef = useRef(null)
  const prevScrollPos = useRef(0)
  const lineConfig = useMemo(() => getLineChartMetricConfig(), [])
  const barConfig = useMemo(() => getBarChartMetricConfig(), [])
  const invocationsConfig = useMemo(() => getGradientLineChart(), [])

  const [expand, toggleExpand] = useState(true)

  // TODO: check the card style
  const itemClass = classnames('metrics__card-body-invocation', {
    'max-width-60': !expand
  })

  // TODO: move to DetailsMetrics.util file
  const modifiedData = useMemo(() => {
    function convertTimestampToTime(timestamp) {
      const date = new Date(timestamp)
      let hours = date.getUTCHours()
      const minutes = date.getUTCMinutes().toString().padStart(2, '0')
      let ampm = hours >= 12 ? 'PM' : 'AM'
      hours = hours % 12
      hours = hours ? hours : 12
      hours = hours.toString().padStart(2, '0')
      return `${hours}:${minutes} ${ampm}`
    }

    function modifyArray(arr) {
      return arr.map(obj => {
        if (obj.values && Array.isArray(obj.values)) {
          const labels = obj.values.map(entry => convertTimestampToTime(entry[0]))
          const dataModify = obj.values.map(entry => entry[1])

          if (obj.full_name.includes('invocations-rate')) {
            obj.total = dataModify.reduce((sum, value) => sum + value, 0)
          } else {
            const sum = dataModify.reduce((sum, value) => sum + value, 0)
            obj.avg = (sum / dataModify.length).toFixed(2)
          }

          const newObj = {
            ...obj,
            labels,
            dataModify
          }

          return newObj
        } else {
          return obj
        }
      })
    }

    const result = []
    const [invocationsRate] = modifyArray(dummyData).filter(obj =>
      obj.full_name.includes('invocations-rate')
    )
    const grouped = modifyArray(dummyData).filter(
      obj => !obj.full_name.includes('invocations-rate') && obj.data
    )

    invocationsRate.total = invocationsRate.dataModify.reduce((sum, value) => sum + value, 0)

    const noData = dummyData.filter(obj => !obj.data)
    result.push(invocationsRate)

    if (noData) {
      result.push(noData)
    }

    if (grouped.length > 0) {
      result.push(grouped)
    }

    return result
  }, [])

  // TODO: refactor the code
  // TODO: scroll bug
  const handleResizeCard = useCallback(e => {
    if (!e.target.classList.contains('item-info')) return
    const card = cardRef.current
    if (e.target.scrollTop > prevScrollPos.current) {
      if (e.target.scrollTop > 5 && card.clientHeight !== 80) {
        card.parentNode.parentNode.style.height += 173
        card.style.height = '80px'
        toggleExpand(false)
      }
    } else {
      if (e.target.scrollTop === 0 && card.clientHeight === 80) {
        card.parentNode.parentNode.style.height -= 80
        card.style.height = '200px'
        toggleExpand(true)
      }
    }
    prevScrollPos.current = e.target.scrollTop
  }, [])

  // TODO: metric render logic check with Jonathan
  const processData = function (data) {
    const valueCounts = {}
    data.forEach(value => {
      if (valueCounts[value]) {
        valueCounts[value]++
      } else {
        valueCounts[value] = 1
      }
    })

    const counts = Object.values(valueCounts)
    const labels = Object.keys(valueCounts)
    return {
      labels: labels,
      datasets: [
        {
          label: 'Value Counts',
          data: counts,
          borderWidth: 1,
          barThickness: 'flex',
          borderRadius: 6,
          maxBarThickness: 32,
          barPercentage: 1,
          backgroundColor: '#13BBB1',
          borderColor: '#13BBB1'
        }
      ]
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleResizeCard, true)
    return () => window.removeEventListener('scroll', handleResizeCard, true)
  }, [handleResizeCard])

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

      // todo: metrics - remove mockNamesToFilter after test and when real API ready with all types (for now metrics type is not supported and it leads to error)
      const mockNamesToFilter = []

      selectedMetrics.forEach(metric => {
        // todo: metrics - remove 'if statement and mockNamesToFilter after test and when real API ready with all types (for now metrics type is not supported and it leads to error)
        mockNamesToFilter.push(metric.full_name)
        if (metric.type === 'metric') return

        params.name.push(metric.full_name)
      })

      // todo: metrics - remove if block after test and when real API ready with all types (for now metrics type is not supported and it leads to error)
      if (isEmpty(params.name))
        params.name.push('for-mock-only.histogram-data-drift.result.hellinger_mean')

      // todo: metrics - remove mockNamesToFilter after test and when real API ready with all types (for now metrics type is not supported and it leads to error)
      dispatch(
        detailsActions.fetchModelEndpointMetricsValues(
          selectedItem.metadata.project,
          selectedItem.metadata.uid,
          params,
          mockNamesToFilter
        )
      ).then(metricsList => {
        // todo: metrics - remove filter after test and when real API ready with all types (for now metrics type is not supported and it leads to error)
        setMetrics(
          metricsList.filter(
            metric =>
              metric.full_name !== 'for-mock-only.histogram-data-drift.result.hellinger_mean'
          )
        )
      })
    }
  }, [dispatch, selectedItem, detailsStore.dates, detailsStore.metricsOptions.selectedByEndpoint])

  // todo: metrics - - remove when merge charts
  /* eslint-disable-next-line no-console */
  console.log(metrics)

  return (
    <div className="metrics">
      {modifiedData.map((item, index) => {
        // TODO: update the render
        if (index === 0) {
          return (
            <StatsCard className="metrics__card-tmp">
              {expand && (
                <StatsCard.Header title="Endpoint call count">
                  <div
                    style={{
                      flex: 1,
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
              <div ref={cardRef} className="metrics__card-body">
                {!expand && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '15px',
                      maxWidth: '30%'
                    }}
                  >
                    <div className="title">Endpoint call count</div>
                    <div className="kpi-value">
                      <span style={{ fontSize: '14px' }}>Total</span>120
                    </div>
                  </div>
                )}
                <div className={itemClass}>
                  <GenericMetricChart
                    showGrid={expand}
                    chartConfig={{
                      gradient: true,
                      ...invocationsConfig,
                      data: {
                        labels: item.labels,
                        datasets: [
                          {
                            data: item.dataModify,
                            fill: true,
                            backgroundColor: '#5871F4',
                            borderColor: '#5871F4',
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
          return item.map((subItem, subIndex) => {
            if (!subItem.data) {
              return (
                <StatsCard className="metrics__card">
                  {/*TODO: implement the metric name in modifiedData */}
                  <StatsCard.Header
                    title={subItem.full_name
                      .substring(subItem.full_name.lastIndexOf('.') + 1)
                      .replace(/-/g, ' ')
                      .replace(/^\w|-\w/g, c => c.toUpperCase())}
                  ></StatsCard.Header>
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '25px'
                    }}
                  >
                    <div>
                      <img alt="no data" src={noData} />
                    </div>
                    <div>No data to show</div>
                  </div>
                </StatsCard>
              )
            } else {
              return (
                <StatsCard className="metrics__card" key={subIndex}>
                  <StatsCard.Header
                    title={subItem.full_name
                      .substring(subItem.full_name.lastIndexOf('.') + 1)
                      .replace(/-/g, ' ')
                      .replace(/^\w|-\w/g, c => c.toUpperCase())}
                  >
                    <div className="metrics__card-header">
                      <div className="metrics__card-header-data">
                        <span className="metrics__card-header-label">Avg. </span>
                        {subItem.avg}
                      </div>
                    </div>
                  </StatsCard.Header>
                  <div className="metrics__card-body">
                    <div className="metrics__card-body-bar">
                      <GenericMetricChart
                        chartConfig={{
                          ...barConfig,
                          data: processData(subItem.dataModify)
                        }}
                      />
                    </div>
                    <div className="metrics__card-body-line">
                      <GenericMetricChart
                        chartConfig={{
                          ...lineConfig,
                          data: {
                            labels: subItem.labels,
                            datasets: [
                              {
                                data: subItem.dataModify,
                                tension: 0.2,
                                borderWidth: 2,
                                backgroundColor: '#13BBB1',
                                borderColor: '#13BBB1'
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
          })
        }
      })}
    </div>
  )
}

export default DetailsMetrics
