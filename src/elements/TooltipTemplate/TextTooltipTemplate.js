import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import './textTooltipTemplate.scss'

const TextTooltipTemplate = ({ text, warning }) => {
  const textRef = useRef()

  const tooltipClassNames = classnames(
    'tooltip-template',
    'tooltip__text',
    warning && 'tooltip__warning'
  )

  return (
    <div className={tooltipClassNames}>
      <span ref={textRef}>{text}</span>
    </div>
  )
}

TextTooltipTemplate.propTypes = {
  text: ''
}

TextTooltipTemplate.propTypes = {
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.number
  ])
}

export default TextTooltipTemplate
