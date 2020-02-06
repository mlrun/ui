import React, { useState } from 'react'
import PropTypes from 'prop-types'

const ProgressRing = ({ radius, stroke, progress, textX, textY, color }) => {
  const [normalizedRadius] = useState(radius - stroke * 2)
  const [circumference] = useState(normalizedRadius * 2 * Math.PI)
  const strokeDashoffset = circumference - (progress / 100) * circumference
  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <text
        x={textX}
        y={textY}
        textAnchor="middle"
        dy="7"
        fontSize="10"
        color={color}
      >
        {progress}%
      </text>
    </svg>
  )
}

ProgressRing.propTypes = {
  radius: PropTypes.string.isRequired,
  stroke: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired,
  textX: PropTypes.number.isRequired,
  textY: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired
}

export default ProgressRing
