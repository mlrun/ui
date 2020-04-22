import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import './input.scss'

const Input = ({
  className,
  disabled,
  floatingLabel,
  iconClass,
  inputIcon,
  label,
  onChange,
  onKeyDown,
  placeholder,
  type,
  value
}) => {
  const [labelToTop, setLabelToTop] = useState(false)
  const input = React.createRef()

  useEffect(() => {
    if (input.current.value.length > 0) {
      setLabelToTop(true)
    }
  }, [input])

  const handleClick = () => {
    if (input.current.value.length > 0) {
      setLabelToTop(true)
    } else {
      setLabelToTop(false)
    }

    onChange(input.current.value)
  }

  return (
    <div className="input-wrapper">
      <input
        className={`input 
        ${className} 
        ${labelToTop && floatingLabel && 'active-input'}`}
        disabled={disabled}
        onChange={handleClick}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        ref={input}
        type={type}
        value={value && value}
      />
      <label
        className={`input__label ${labelToTop &&
          floatingLabel &&
          'active-label'} ${floatingLabel && 'input__label-floating'}`}
      >
        {label}
      </label>
      {inputIcon && <span className={iconClass}>{inputIcon}</span>}
    </div>
  )
}

Input.defaultProps = {
  disabled: false,
  floatingLabel: false,
  iconClass: null,
  inputIcon: null,
  label: null,
  onChange: null,
  onKeyDown: null,
  placeholder: '',
  value: undefined
}

Input.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  floatingLabel: PropTypes.bool,
  iconClass: PropTypes.string,
  inputIcon: PropTypes.element,
  label: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default Input
