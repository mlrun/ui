import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './loadButton.scss'

const LoadButton = ({ className, label, variant, ...restProps }) => {
  const buttonClassName = classNames(
    'btn-load',
    `btn-load-${variant}`,
    className
  )

  return (
    <button {...restProps} className={buttonClassName}>
      {label}
    </button>
  )
}

LoadButton.defaultProps = {
  classList: '',
  label: 'Load button',
  variant: 'tertiary'
}

LoadButton.propTypes = {
  classList: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  variant: PropTypes.PropTypes.oneOf(['primary', 'secondary', 'tertiary'])
    .isRequired
}

export default LoadButton
