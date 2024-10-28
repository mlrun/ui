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
import React, { useState, useRef, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import { Chart, registerables } from 'chart.js'
import Loader from '../Loader/Loader'
import classnames from 'classnames'

import './mlChart.scss'

Chart.register(...registerables)

const MlChart = ({ config, showLoader = true }) => {
  const canvasRef = useRef()
  const [isLoading, setIsLoading] = useState(true)
  const canvasClassNames = classnames(showLoader && isLoading && 'hidden')

  useLayoutEffect(() => {
    const ctx = canvasRef.current.getContext('2d')
    const pythonInfinity = 'e+308'
    const chartConfig = {
      ...config,
      data: {
        ...config.data,
        labels: config.data.labels.map(label => {
          const labelStr = String(label)
          if (labelStr.includes(pythonInfinity)) {
            if (labelStr.includes('-')) {
              return `${labelStr.replace(/^([-]).*/, '$1∞')}`
            }

            return '∞'
          }

          return label
        })
      }
    }
    const mlChartInstance = new Chart(ctx, {
      ...chartConfig,
      options: {
        ...chartConfig.options,
        animation: {
          ...chartConfig.options.animation,
          onComplete: () => {
            showLoader && setIsLoading(false)

            if (chartConfig?.options?.animation?.onComplete) {
              chartConfig.options.animation.onComplete()
            }
          }
        }
      }
    })

    return () => {
      mlChartInstance?.destroy()
    }
  }, [config, showLoader])

  return (
    <div className="chart-container">
      {showLoader && isLoading && <Loader section small secondary />}
      <canvas className={canvasClassNames} ref={canvasRef} />
    </div>
  )
}

MlChart.propTypes = {
  config: PropTypes.shape({}).isRequired
}

export default React.memo(MlChart)
