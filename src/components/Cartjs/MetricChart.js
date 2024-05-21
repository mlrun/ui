import { useEffect, useRef, useState } from 'react'
import { Chart } from 'chart.js/auto'
import classnames from 'classnames'

import Loader from '../../common/Loader/Loader'

import { formatNumber } from '../DetailsMetrics/detailsMetrics.utils'
import { calculateMaxTicksLimit, formattYaxisForBarChart, hexToRGB } from './metricChart.util'

const GenericMetricChart = ({ chartConfig, showGrid }) => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const canvasClassNames = classnames(isLoading && 'hidden')

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d')
    if (ctx) {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
      const container = chartRef.current
      const maxTicksLimit = calculateMaxTicksLimit(container)
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
              }
            },
            y: {
              ...chartConfig.options.scales?.y,
              min: chartConfig.type === 'bar' ? 0 : undefined,
              max: chartConfig.type === 'bar' ? 1 : undefined,
              ticks: {
                ...chartConfig.options.scales?.y?.ticks,
                maxTicksLimit,
                callback: value => {
                  if (chartConfig.type === 'line') {
                    return formatNumber(value)
                  } else if (chartConfig.type === 'bar') {
                    return formattYaxisForBarChart(value)
                  } else {
                    return value
                  }
                }
              }
            }
          },
          animation: {
            onComplete: () => setIsLoading(false)
          }
        }
      })

      if (chartConfig.gradient) {
        const canvasHeight = showGrid ? 200 : 80
        if (chartInstance.current.options.scales.x.grid.display !== showGrid) {
          chartInstance.current.options.scales.x.grid.display = showGrid
          chartInstance.current.options.scales.y.grid.display = showGrid

          chartInstance.current.options.scales.y.display = showGrid

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
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [showGrid, chartConfig.data, chartConfig.type, chartConfig.gradient, chartConfig.options])

  useEffect(() => {
    const handleResize = () => {
      if (chartInstance.current) {
        const container = chartRef.current
        const maxTicksLimit = calculateMaxTicksLimit(container)
        chartInstance.current.options.scales.x.ticks.maxTicksLimit = maxTicksLimit
        chartInstance.current.options.scales.y.ticks.maxTicksLimit = maxTicksLimit
        chartInstance.current.update()
      }
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <>
      {isLoading && <Loader section secondary />}
      <canvas className={canvasClassNames} ref={chartRef} />
    </>
  )
}

export default GenericMetricChart
