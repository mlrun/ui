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
import classNames from 'classnames'

import MlChart from '../../../common/MlChart/MlChart'
import NoData from '../../../common/NoData/NoData'
import { Loader, Tip } from 'igz-controls/components'

import { MONITORING_APPLICATIONS_NO_DATA_MESSAGE } from '../MonitoringApplicationsPage.util'
import { getMEPsWithDetectionChartConfig } from '../../../utils/getChartConfig'
import { groupDataToBins } from './monitoringApplications.util'
import { useSelector } from 'react-redux'

const MEPsWithDetections = () => {
  const [isLoading, setIsLoading] = useState(true)
  const chartRef = useRef()
  const chartYAxisRef = useRef()
  const chartWrapperRef = useRef()
  const barConfig = useMemo(() => getMEPsWithDetectionChartConfig(), [])
  const {
    endpointsWithDetections: { data: endpointsWithDetectionsData, loading, error }
  } = useSelector(store => store.monitoringApplicationsStore)

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
    const { labels, values, dates } = groupDataToBins(
      endpointsWithDetectionsData.values,
      endpointsWithDetectionsData.start,
      endpointsWithDetectionsData.end
    )

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
  }, [barConfig, endpointsWithDetectionsData, renderPlugin])

  return (
    <div className="monitoring-app__section-item">
      <div className="section-item_title">
        <span>Model endpoints with suspected/detected issue</span>
        <Tip text="This chart displays the number of model endpoints that had at least one detected issue, in any monitoring application, in the relevant time period" />
      </div>
      {endpointsWithDetectionsData.values?.length === 0 && !(isLoading || loading) ? (
        <NoData
          message={
            error
              ? 'Failed to fetch Model endpoints with suspected/detected issue'
              : MONITORING_APPLICATIONS_NO_DATA_MESSAGE
          }
        />
      ) : (
        <div className="section-item_chart-wrapper">
          <div className="section-item_chart">
            {(isLoading || loading) && <Loader section secondary />}
            <div
              className={classNames('section-item_chart-area', (isLoading || loading) && 'loading')}
            >
              <canvas id="chart-y-axis" ref={chartYAxisRef} width={0} height={0} />
              <div className="section-item_ml-chart-wrapper" ref={chartWrapperRef}>
                <MlChart config={barChartConfig} chartRef={chartRef} />
              </div>
              <div className="section-item_chart-area_x-axis-label">Time range</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(MEPsWithDetections)
