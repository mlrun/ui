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
import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Chart } from 'chart.js'
import classnames from 'classnames'

import { Loader } from 'igz-controls/components'

import './mlChart.scss'

const defaultOnChartCreated = () => {}

const MlChart = ({
  chartRef,
  config,
  contextRef,
  onChartCreated = defaultOnChartCreated,
  showLoader = true,
  smallLoader = false
}) => {
  const canvasRef = useRef()
  const [isLoading, setIsLoading] = useState(true)
  const canvasClassNames = classnames(showLoader && isLoading && 'hidden')

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')

    if (ctx) {
      if (contextRef) {
        contextRef.current = ctx
      }

      if (chartRef?.current) {
        chartRef.current?.destroy()
      }

      const chartInstance = new Chart(ctx, {
        ...config,
        options: {
          ...config.options,
          animation: {
            ...config.options.animation,
            onComplete: (...args) => {
              showLoader && setIsLoading(false)

              if (config?.options?.animation?.onComplete) {
                config.options.animation.onComplete(...args)
              }
            }
          }
        }
      })

      onChartCreated(chartInstance, ctx)

      if (chartRef) {
        chartRef.current = chartInstance
      }

      return () => {
        chartInstance?.destroy()
      }
    }
  }, [chartRef, config, contextRef, onChartCreated, showLoader])

  return (
    <div className="chart-container">
      {showLoader && isLoading && <Loader section small={smallLoader} secondary />}
      <canvas className={canvasClassNames} ref={canvasRef} />
    </div>
  )
}

MlChart.propTypes = {
  chartRef: PropTypes.object,
  config: PropTypes.object.isRequired,
  contextRef: PropTypes.object,
  onChartCreated: PropTypes.func,
  showLoader: PropTypes.bool,
  smallLoader: PropTypes.bool
}

export default React.memo(MlChart)
