import React from 'react'
import PropTypes from 'prop-types'

import './input.scss'

const Input = ({
  type,
  className,
  inputIcon,
  placeholder,
  onChange,
  iconCLass
}) => {
  return (
    <div className="input-wrapper">
      <input
        type={type}
        className={`input ${className}`}
        placeholder={placeholder}
        onChange={onChange}
      />
      {inputIcon && <span className={iconCLass}>{inputIcon}</span>}
    </div>
  )
}

Input.defaultProps = {
  inputIcon: null,
  iconCLass: null,
  onChange: null
}

Input.propTypes = {
  className: PropTypes.string.isRequired,
  inputIcon: PropTypes.element,
  iconCLass: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
}

export default Input
