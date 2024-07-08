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
import { useEffect, useMemo, useRef, useState } from 'react'
import { Chart } from 'chart.js/auto'
import classnames from 'classnames'

import Loader from '../../common/Loader/Loader'
import { CHART_TYPE_BAR } from '../../constants'

import { calculateMaxTicksLimit, generateMetricChartTooltip, hexToRGB } from './metricChart.util'

const GenericMetricChart = ({ chartConfig, isInvocationCardExpanded }) => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const canvasClassNames = classnames(isLoading && 'hidden-canvas')
  const customPoints = useMemo(() => {
    const hasDriftStatusList = chartConfig.data.datasets[0]?.driftStatusList?.length !== 0
    const isOnlyOnePoint = chartConfig?.data?.datasets[0]?.data?.length === 1
    const totalDriftIndex = chartConfig.data.datasets[0]?.totalDriftStatus?.index

    return {
      radius: context => {
        const isCurrentIndexTotalDriftIndex = context.dataIndex === totalDriftIndex
        return (hasDriftStatusList && isCurrentIndexTotalDriftIndex) || isOnlyOnePoint ? 2 : 0
      },
      pointStyle: context => (hasDriftStatusList || isOnlyOnePoint ? 'circle' : 'none'),
      backgroundColor: () => (hasDriftStatusList || isOnlyOnePoint ? 'black' : undefined),
      borderColor: () => 'white'
    }
  }, [chartConfig])

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d')

    if (ctx) {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
      const container = chartRef.current
      const maxTicksLimit = calculateMaxTicksLimit(container, chartConfig.type)
      chartInstance.current = new Chart(ctx, {
        type: chartConfig.type,
        data: chartConfig.data,
        options: {
          ...chartConfig.options,
          scales: {
            ...chartConfig.options.scales,
            x: {
              ...chartConfig.options.scales?.x,
              ticks: {
                ...chartConfig.options.scales?.x?.ticks,
                maxTicksLimit
              },
              title:
                chartConfig.type === CHART_TYPE_BAR
                  ? {
                      display: true,
                      text: 'Value',
                      font: 10
                    }
                  : {
                      display: true,
                      text: '',
                      font: 0
                    }
            },
            y: {
              ...chartConfig.options.scales?.y,
              grid: {
                drawBorder: true,
                borderColor: 'E9E8EB'
              },
              title:
                chartConfig.type === CHART_TYPE_BAR
                  ? {
                      display: true,
                      text: 'Percentage',
                      font: 10
                    }
                  : undefined
            }
          },
          animation: {
            duration: 0,
            onComplete: () => setIsLoading(false)
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              enabled: false,
              intersect: false,
              mode: 'index',
              external: generateMetricChartTooltip
            }
          },
          elements: {
            point: customPoints
          }
        }
      })
    }

    if (chartConfig.gradient) {
      const canvasHeight = isInvocationCardExpanded ? 200 : 80
      if (chartInstance.current.options.scales.x.grid.display !== isInvocationCardExpanded) {
        chartInstance.current.options.scales.x.grid.display = isInvocationCardExpanded
        chartInstance.current.options.scales.y.grid.display = isInvocationCardExpanded
        chartInstance.current.options.scales.y.display = isInvocationCardExpanded
        chartInstance.current.options.scales.x.grid.ticks = true
        chartInstance.current.options.scales.y.grid.ticks = true
      }

      const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight)
      gradient.addColorStop(
        0,
        hexToRGB(chartConfig?.data?.datasets[0].backgroundColor || '#FFF', 0.7)
      )
      gradient.addColorStop(1, hexToRGB(chartConfig?.data?.datasets[0].backgroundColor))
      chartInstance.current.data.datasets.forEach(dataset => {
        dataset.backgroundColor = gradient
      })
      chartInstance.current.update()
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
        const tooltipEl = document.querySelector('#chartjs-tooltip-metric')
        if (tooltipEl) {
          tooltipEl.style.opacity = 0
        }
      }
    }
  }, [
    chartConfig.data,
    chartConfig.type,
    chartConfig.gradient,
    chartConfig.options,
    isInvocationCardExpanded,
    customPoints
  ])

  useEffect(() => {
    const handleResize = () => {
      if (chartInstance.current) {
        const container = chartRef.current
        const maxTicksLimit = calculateMaxTicksLimit(container, chartConfig.type)
        chartInstance.current.options.scales.x.ticks.maxTicksLimit = maxTicksLimit
        chartInstance.current.options.scales.y.ticks.maxTicksLimit = maxTicksLimit
        chartInstance.current.update()
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [chartConfig.type])

  return (
    <>
      {isLoading && <Loader section secondary />}
      <canvas className={canvasClassNames} ref={chartRef} />
    </>
  )
}

export default GenericMetricChart
