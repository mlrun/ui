import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './button.scss'

const Button = ({ className, label, variant, ...restProps }) => {
  const buttonClassName = classNames('btn', `btn-${variant}`, className)

  return (
    <button {...restProps} className={buttonClassName}>
      {label}
    </button>
  )
}

Button.defaultProps = {
  className: '',
  label: 'Button',
  variant: 'tertiary'
}

Button.propTypes = {
  className: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  variant: PropTypes.PropTypes.oneOf([
    'primary',
    'secondary',
    'tertiary',
    'danger',
    'label'
  ]).isRequired
}

export default Button
