import React from 'react'
import PropTypes from 'prop-types'
import './button.scss'
import classNames from 'classnames'

export const Button = ({ type, label, addClass, ...props }) => {
  const buttonClassName = classNames(`btn-${type}`, addClass)

  return (
    <button type="button" className={buttonClassName} {...props}>
      {label}
    </button>
  )
}

Button.propTypes = {
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  addClass: PropTypes.string
}

Button.defaultProps = {
  type: 'primary',
  label: 'Button',
  onClick: undefined,
  addClass: ''
}
