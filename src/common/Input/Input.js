import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { ReactComponent as Warning } from '../../images/warning.svg'

import Tooltip from '../Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

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
  required,
  requiredText,
  type,
  value,
  wrapperClassName
}) => {
  const [inputIsFocused, setInputIsFocused] = useState(false)
  const input = React.createRef()
  const inputClassNames = classnames(
    'input',
    className,
    inputIsFocused && floatingLabel && 'active-input',
    required && 'input_required'
  )

  const wrapperClassNames = classnames(wrapperClassName, 'input-wrapper')

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
      {required && (
        <Tooltip
          template={<TextTooltipTemplate text={requiredText} warning />}
          className="input__warning"
        >
          <Warning />
        </Tooltip>
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
  required: false,
  requiredText: '',
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
  required: PropTypes.bool,
  requiredText: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  wrapperClassName: PropTypes.string
}

export default React.memo(Input)
