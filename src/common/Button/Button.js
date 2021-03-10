import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './button.scss'

const Button = ({ classList, disabled, label, onClick, variant }) => {
  const buttonClassName = classNames('btn', `btn-${variant}`, classList)

  return (
    <button
      className={buttonClassName}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  )
}

Button.defaultProps = {
  classList: '',
  disabled: false,
  label: 'Button',
  onClick: () => {}
}

Button.propTypes = {
  classList: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  onClick: PropTypes.func,
  variant: PropTypes.PropTypes.oneOf([
    'primary',
    'secondary',
    'tertiary',
    'danger',
    'label'
  ]).isRequired
}

export default Button
