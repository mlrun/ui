import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './loadButton.scss'

export const LoadButton = ({ type, label, addClass, ...props }) => {
  const buttonClassName = classNames(`btn-${type}`, addClass)

  return (
    <button type="button" className={buttonClassName} {...props}>
      {label}
    </button>
  )
}

LoadButton.propTypes = {
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  addClass: PropTypes.string
}

LoadButton.defaultProps = {
  type: 'primary',
  label: 'Button',
  onClick: undefined,
  addClass: ''
}
