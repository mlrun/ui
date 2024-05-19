import { useEffect, useRef, useState } from 'react'
import { Chart } from 'chart.js/auto'
import Loader from '../../common/Loader/Loader'

import classnames from 'classnames'

const GenericMetricChart = ({ chartConfig, showGrid }) => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const canvasClassNames = classnames(isLoading && 'hidden')

  const hexToRGB = (hex, alpha = 0) => {
    if (typeof hex !== 'string') return
    const r = parseInt(hex.substring(1, 3), 16)
    const g = parseInt(hex.substring(3, 5), 16)
    const b = parseInt(hex.substring(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d')

    if (ctx) {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
      chartInstance.current = new Chart(ctx, {
        type: chartConfig.type,
        data: chartConfig.data,
        options: {
          ...chartConfig.options,
          animation: {
            onComplete: () => setIsLoading(false)
          },
          className: 'hidden'
        }
      })

      if (chartConfig.gradient) {
        // const canvasHeight = chartRef.current.clientHeight
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

  return (
    <>
      {isLoading && <Loader section secondary />}
      <canvas className={canvasClassNames} ref={chartRef} />
    </>
  )
}
export default GenericMetricChart
