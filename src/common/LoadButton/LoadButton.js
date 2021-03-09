import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './loadButton.scss'

const LoadButton = ({ classList, disabled, label, onClick, type }) => {
  const buttonClassName = classNames('btn-load', `btn-load-${type}`, classList)

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

LoadButton.defaultProps = {
  classList: '',
  disabled: false,
  label: 'Button',
  onClick: () => {}
}

LoadButton.propTypes = {
  classList: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  onClick: PropTypes.func,
  type: PropTypes.string.isRequired
}

export default LoadButton
