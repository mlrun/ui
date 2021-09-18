import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import './textTooltipTemplate.scss'

const TextTooltipTemplate = ({ text, warning }) => {
  const [style, setStyle] = useState({})
  const textRef = useRef()
  const offset = 60
  const horizontalPadding = 8
  const tooltipClassNames = classnames(
    'tooltip__text',
    warning && 'tooltip__warning'
  )

  useEffect(() => {
    if (textRef?.current) {
      const { width } = textRef.current?.getBoundingClientRect()

      setStyle({
        padding: `6px ${horizontalPadding}px`,
        width:
          width > window.innerWidth
            ? window.innerWidth - offset
            : width + horizontalPadding * 2,
        wordBreak: width > window.innerWidth ? 'break-word' : 'unset'
      })
    }
  }, [])

  return (
    <div className={tooltipClassNames} style={style}>
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
