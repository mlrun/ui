import React, { useState } from 'react'
import PropTypes from 'prop-types'

const ProgressRing = ({ radius, stroke, progress, color, children }) => {
  const [normalizedRadius] = useState(radius - stroke * 2)
  const [circumference] = useState(normalizedRadius * 2 * Math.PI)
  const strokeDashoffset = circumference - (progress / 100) * circumference
  const offset = 2

  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset }}
        r={normalizedRadius + offset}
        cx={radius}
        cy={radius}
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
