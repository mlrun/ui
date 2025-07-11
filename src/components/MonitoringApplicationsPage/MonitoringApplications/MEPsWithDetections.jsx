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
import React, { memo, useMemo, useRef, useState } from 'react'
import moment from 'moment'
import classNames from 'classnames'

import MlChart from '../../../common/MlChart/MlChart'
import NoData from '../../../common/NoData/NoData'
import { Loader, Tip } from 'igz-controls/components'

import {
  getFiltersConfig,
  MONITORING_APPLICATIONS_NO_DATA_MESSAGE
} from '../MonitoringApplicationsPage.util'
import { getMEPsWithDetectionChartConfig } from '../../../utils/getChartConfig'
import { groupDataToBins } from './monitoringApplications.util'
import { useFiltersFromSearchParams } from '../../../hooks/useFiltersFromSearchParams.hook'
import { DATES_FILTER } from '../../../constants'

// TODO: remove and use real data
const generateDummyData = (startTime, endTime, setIsLoadingAPI) => {
  const data = []
  const endDate = moment(endTime)
  setIsLoadingAPI(true)
  for (const startDate = moment(startTime); startDate < endDate; startDate.add(1, 'minute')) {
    data.push([
      startDate.utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
      // Math.floor(Math.random() * 11)
      1
    ])
  }
  setIsLoadingAPI(false)

  return data
}

const MEPsWithDetections = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingAPI, setIsLoadingAPI] = useState(true) // TODO: remove and use from redux
  const chartYAxisRef = useRef()
  const chartWrapperRef = useRef()
  const filtersConfig = useMemo(() => getFiltersConfig(), [])
  const filters = useFiltersFromSearchParams(filtersConfig)
  const startTime = useMemo(() => filters[DATES_FILTER].value[0].getTime(), [filters])
  const endTime = useMemo(() => (filters[DATES_FILTER].value[1] || new Date()).getTime(), [filters])
  const barConfig = useMemo(() => getMEPsWithDetectionChartConfig(), [])
  const data = useMemo(
    () => generateDummyData(startTime, endTime, setIsLoadingAPI),
    [endTime, startTime]
  ) // TODO: remove and use real data
  const renderPlugin = useMemo(() => {
    let savedCopyWidth = 0
    let savedCopyHeight = 0

    return {
      id: 'renderTracker',
      afterDatasetsDraw(chart) {
        const copyWidth = chart.scales.x.left
        const copyHeight = chart.scales.y.height + 20

        if (
          (copyWidth !== savedCopyWidth || copyHeight !== savedCopyHeight) &&
          chartYAxisRef.current &&
          chartWrapperRef.current
        ) {
          savedCopyWidth = copyWidth
          savedCopyHeight = copyHeight
          const sourceCanvas = chart.ctx.canvas
          const copyWidthWithRatio = copyWidth * chart.currentDevicePixelRatio
          const copyHeightWithRatio = copyHeight * chart.currentDevicePixelRatio
          const yAxisCtx = chartYAxisRef.current.getContext('2d')
          const spaceForBar = 32
          yAxisCtx.canvas.width = copyWidthWithRatio
          yAxisCtx.canvas.height = copyHeightWithRatio
          yAxisCtx.canvas.style.width = `${chart.currentDevicePixelRatio === 1 ? yAxisCtx.canvas.width : copyWidth}px`
          yAxisCtx.canvas.style.height = `${chart.currentDevicePixelRatio === 1 ? yAxisCtx.canvas.height : copyHeight}px`


          yAxisCtx.drawImage(
            sourceCanvas,
            0,
            0,
            copyWidthWithRatio,
            copyHeightWithRatio,
            0,
            0,
            copyWidthWithRatio,
            copyHeightWithRatio
          )

          chartWrapperRef.current.style.width = `${copyWidth + (chart.scales.x?.ticks?.length || 1) * spaceForBar}px`
        }
      }
    }
  }, [])

  const barChartConfig = useMemo(() => {
    const { labels, values, dates } = groupDataToBins(data, startTime, endTime)

    return {
      ...barConfig,
      options: {
        ...barConfig.options,
        plugins: {
          ...barConfig.options.plugins,
          renderTracker: {}
        },
        animation: {
          ...barConfig.options.animation,
          onComplete: () => {
            setIsLoading(false)
          }
        }
      },
      data: {
        labels,
        datasets: [
          {
            data: values,
            dates,
            chartType: 'bar',
            tension: 0.2,
            borderWidth: 2,
            backgroundColor: '#13bbb1',
            borderColor: '#13bbb1'
          }
        ]
      },
      plugins: [renderPlugin]
    }
  }, [barConfig, data, endTime, renderPlugin, startTime])

  return data?.length ? (
    <div className="monitoring-app__section-item">
      <div className="section-item_title">
        <span>Model Endpoints with suspected/detected issue</span>
        <Tip text="This chart displays the number of model endpoints that had at least one detected issue, in any monitoring application, in the relevant time period" />
      </div>
      {isLoading && <Loader section secondary />}
      <div
        className={classNames(
          'section-item_chart-wrapper',
          (isLoading || isLoadingAPI) && 'loading'
        )}
      >
        <div className="section-item_chart">
          <div className="section-item_chart-area">
            <canvas id="chart-y-axis" ref={chartYAxisRef} width={0} height={0} />
            <div className="section-item_ml-chart-wrapper" ref={chartWrapperRef}>
              <MlChart config={barChartConfig} />
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <NoData message={MONITORING_APPLICATIONS_NO_DATA_MESSAGE} />
  )
}

export default memo(MEPsWithDetections)
