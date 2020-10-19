import React from 'react'
import PropTypes from 'prop-types'

import './progressRing.scss'

const ProgressRing = ({ radius, stroke, progress, color, children }) => {
  const normalizedRadius = radius - stroke * 2
  const offset = 1
  const area = (normalizedRadius + offset) * Math.PI * 2

  return (
    <svg data-testid="progress-ring" height={radius * 2} width={radius * 2}>
      <circle
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={(progress * area) / 100 + ' ' + area}
        r={normalizedRadius + offset}
        cx={radius}
        cy={radius}
        className="progress"
      />
      {children}
    </svg>
  )
}

ProgressRing.propTypes = {
  radius: PropTypes.string.isRequired,
  stroke: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired
}

export default ProgressRing
