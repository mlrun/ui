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
import { useEffect, useMemo, useRef, memo, useCallback } from 'react'
import PropTypes from 'prop-types'

import MlChart from '../MlChart'

import { setChartGradient } from './metricChart.util'

import './metricChart.scss'

const MetricChart = ({ config, isInvocationCardExpanded = false, isInvocationChart = false }) => {
  const chartRef = useRef(null)
  const contextRef = useRef(null)

  const chartConfig = useMemo(() => {
    const hasDriftStatusList = config.data.datasets[0]?.driftStatusList?.length !== 0
    const isOnlyOnePoint = config?.data?.datasets[0]?.data?.length === 1
    const totalDriftIndex = config.data.datasets[0]?.totalDriftStatus?.index

    const customPoints = {
      radius: context => {
        const isCurrentIndexTotalDriftIndex = context.dataIndex === totalDriftIndex
        return (hasDriftStatusList && isCurrentIndexTotalDriftIndex) || isOnlyOnePoint ? 2 : 0
      },
      pointStyle: () => (hasDriftStatusList || isOnlyOnePoint ? 'circle' : 'none'),
      backgroundColor: () => (hasDriftStatusList || isOnlyOnePoint ? 'black' : undefined),
      borderColor: () => 'white'
    }

    return {
      type: config.type,
      data: config.data,
      options: {
        ...config.options,
        animation: {
          duration: 0
        },
        elements: {
          point: customPoints
        }
      }
    }
  }, [config.data, config.options, config.type])

  const backgroundColor = useMemo(() => {
    return config?.data?.datasets[0].backgroundColor
  }, [config])

  const onChartCratedHandler = useCallback(
    (chartInstance, ctx) => {
      if (config.gradient) {
        setChartGradient(chartInstance, ctx, backgroundColor, 200)

        chartInstance.update()
      }
    },
    [backgroundColor, config.gradient]
  )

  useEffect(() => {
    if (chartRef?.current && isInvocationChart) {
      if (chartRef.current.options.scales.x.grid.display !== isInvocationCardExpanded) {
        chartRef.current.options.scales.x.grid.display = isInvocationCardExpanded
        chartRef.current.options.scales.y.grid.display = isInvocationCardExpanded
        chartRef.current.options.scales.y.display = isInvocationCardExpanded
        chartRef.current.options.scales.x.grid.ticks = true
        chartRef.current.options.scales.y.grid.ticks = true
      }

      if (config.gradient && contextRef.current) {
        const canvasHeight = isInvocationCardExpanded ? 200 : 80
        setChartGradient(chartRef.current, contextRef.current, backgroundColor, canvasHeight)
      }

      chartRef.current.update()
    }
  }, [backgroundColor, config.gradient, isInvocationCardExpanded, isInvocationChart])

  return (
    <MlChart
      config={chartConfig}
      chartRef={chartRef}
      contextRef={contextRef}
      onChartCreated={onChartCratedHandler}
    />
  )
}

MetricChart.propTypes = {
  config: PropTypes.object.isRequired,
  isInvocationCardExpanded: PropTypes.bool,
  isInvocationChart: PropTypes.bool
}

export default memo(MetricChart)
