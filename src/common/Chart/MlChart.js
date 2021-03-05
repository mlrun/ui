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
