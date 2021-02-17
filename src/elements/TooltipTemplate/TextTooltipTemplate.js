import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import './textTooltipTemplate.scss'

const TextTooltipTemplate = ({ text, warning }) => {
  const tooltipClassNames = classnames(
    'tooltip__text',
    warning && 'tooltip__warning'
  )
  return <div className={tooltipClassNames}>{text}</div>
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
