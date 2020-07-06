import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './input.scss'

const Input = ({
  className,
  disabled,
  floatingLabel,
  iconClass,
  infoLabel,
  inputIcon,
  label,
  maxLength,
  onChange,
  onKeyDown,
  placeholder,
  type,
  value,
  wrapperClassName
}) => {
  const [inputIsFocused, setInputIsFocused] = useState(false)
  const input = React.createRef()

  const wrapperClassNames = classNames(wrapperClassName, 'input-wrapper')
  const inputClassNames = classNames(
    'input',
    className,
    inputIsFocused && floatingLabel && 'active-input'
  )

  useEffect(() => {
    if (input.current.value.length > 0) {
      setInputIsFocused(true)
    }
  }, [input])

  const handleClick = () => {
    if (input.current.value.length > 0) {
      setInputIsFocused(true)
    } else {
      setInputIsFocused(false)
    }

    onChange(input.current.value)
  }

  return (
    <div className={wrapperClassNames}>
      <input
        className={inputClassNames}
        disabled={disabled}
        maxLength={maxLength}
        onChange={handleClick}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        ref={input}
        type={type}
        value={value && value}
      />
      {label && (
        <label
          className={`input__label ${inputIsFocused &&
            floatingLabel &&
            'active-label'} ${floatingLabel &&
            'input__label-floating'} ${infoLabel && 'input__label_info'}`}
          style={
            infoLabel
              ? {
                  left: (value ? value.length + 2 : 2) * 10
                }
              : {}
          }
        >
          {label}
        </label>
      )}
      {inputIcon && <span className={iconClass}>{inputIcon}</span>}
    </div>
  )
}

Input.defaultProps = {
  disabled: false,
  floatingLabel: false,
  iconClass: null,
  infoLabel: false,
  inputIcon: null,
  label: null,
  maxLength: null,
  onChange: null,
  onKeyDown: null,
  placeholder: '',
  value: undefined,
  wrapperClassName: ''
}

Input.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  floatingLabel: PropTypes.bool,
  iconClass: PropTypes.string,
  infoLabel: PropTypes.bool,
  inputIcon: PropTypes.element,
  label: PropTypes.string,
  maxLength: PropTypes.number,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  wrapperClassName: PropTypes.string
}

export default React.memo(Input)
