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
import { Chart, registerables } from 'chart.js'
import Loader from '../Loader/Loader'
import classnames from 'classnames'

import './mlChart.scss'

Chart.register(...registerables)

const MlChart = ({ config }) => {
  const canvasRef = useRef()
  const [isLoading, setIsLoading] = useState(true)
  const canvasClassNames = classnames(isLoading && 'hidden')

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')
    const mlChartInstance = new Chart(ctx, {
      ...config,
      options: {
        ...config.options,
        animation: {
          ...config.options.animation,
          onComplete: () => {
            setIsLoading(false)

            if (config?.options?.animation?.onComplete) {
              config.options.animation.onComplete()
            }
          }
        }
      }
    })

    return () => {
      mlChartInstance.destroy()
    }
  }, [isLoading, config])

  return (
    <div className="chart-container">
      {isLoading && <Loader section small secondary />}
      <canvas className={canvasClassNames} ref={canvasRef} />
    </div>
  )
}

MlChart.propTypes = {
  config: PropTypes.shape({}).isRequired
}

export default React.memo(MlChart)
