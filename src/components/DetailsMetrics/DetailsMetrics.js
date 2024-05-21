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
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'
// import classnames from 'classnames'

import GenericMetricChart from '../Cartjs/MetricChart'
import StatsCard from '../../common/StatsCard/StatsCard'

import detailsActions from '../../actions/details'

import noData from './noData.svg' // TODO add to igz-controls
import Data from './Data.svg'

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
  const cardRef = useRef(null)
  // const prevScrollPos = useRef(0)
  const lineConfig = useMemo(() => getLineChartMetricConfig(), [])
  const barConfig = useMemo(() => getBarChartMetricConfig(), [])
  const invocationsConfig = useMemo(() => getGradientLineChart(), [])

  const [expand] = useState(false)

  // TODO: scroll bug, refactor the code
  // const handleResizeCard = useCallback(e => {
  //   if (!e.target.classList.contains('item-info')) return
  //   const card = cardRef.current
  //   if (e.target.scrollTop > prevScrollPos.current) {
  //     if (e.target.scrollTop > 5 && card.clientHeight !== 80) {
  //       card.parentNode.parentNode.style.height += 173
  //       card.style.height = '80px'
  //       toggleExpand(false)
  //     }
  //   } else {
  //     if (e.target.scrollTop === 0 && card.clientHeight === 80) {
  //       card.parentNode.parentNode.style.height -= 80
  //       card.style.height = '200px'
  //       toggleExpand(true)
  //     }
  //   }
  //   prevScrollPos.current = e.target.scrollTop
  // }, [])
  // TODO: will be add after the invocations implementation request
  // useEffect(() => {
  //   window.addEventListener('scroll', handleResizeCard, true)
  //   return () => window.removeEventListener('scroll', handleResizeCard, true)
  // }, [handleResizeCard])

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

  if (metrics.length === 0) {
    return (
      <StatsCard className="metrics__empty-select">
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '25px'
          }}
        >
          <div>
            <img alt="no data" src={Data} />
          </div>
          <div>Choose metrics to view endpoint’s data</div>
        </div>
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
              <div style={{ height: '80px' }} ref={cardRef} className="metrics__card-body">
                {!expand && (
                  <div
                    style={{
                      flex: '0 1 27%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
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
                      ...invocationsConfig,
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
                <div className="metrics__card-header">
                  <div className="metrics__card-header-data">
                    <span className="metrics__card-header-label">Avg. </span>
                    {item.avg}
                  </div>
                </div>
              </StatsCard.Header>
              <div className="metrics__card-body">
                <div className="metrics__card-body-bar">
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
                  <GenericMetricChart
                    chartConfig={{
                      ...lineConfig,
                      data: {
                        labels: item.labels,
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
              </div>
            </StatsCard>
          )
        }
      })}
    </div>
  )
}

export default React.memo(DetailsMetrics)
