import React from 'react'
import PropTypes from 'prop-types'

import './textTooltipTemplate.scss'

const TextTooltipTemplate = ({ text }) => {
  return <div className="text_tooltip_container">{text}</div>
}

TextTooltipTemplate.propTypes = {
  text: ''
}

TextTooltipTemplate.propTypes = {
  text: PropTypes.string
}

export default TextTooltipTemplate
