import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { ReactComponent as Warning } from '../../images/warning.svg'

import Tooltip from '../Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import Tip from '../Tip/Tip'

import './input.scss'

const Input = React.forwardRef(
  (
    {
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
      pattern,
      placeholder,
      required,
      requiredText,
      focused,
      tip,
      type,
      value,
      wrapperClassName
    },
    ref
  ) => {
    const [inputIsFocused, setInputIsFocused] = useState(false)
    const input = React.createRef()
    const inputClassNames = classnames(
      'input',
      className,
      (inputIsFocused || placeholder) && floatingLabel && 'active-input',
      required && 'input_required'
    )
    const labelClassNames = classnames(
      'input__label',
      floatingLabel && 'input__label-floating',
      (inputIsFocused || placeholder) && floatingLabel && 'active-label',
      infoLabel && 'input__label_info'
    )
    const wrapperClassNames = classnames(wrapperClassName, 'input-wrapper')

    useEffect(() => {
      if (input.current.value.length > 0) {
        setInputIsFocused(true)
      }

      if (focused) {
        input.current.focus()
      }
    }, [input, focused])

    const handleClick = event => {
      if (event.target.value.length > 0) {
        setInputIsFocused(true)
      } else {
        setInputIsFocused(false)
      }

      onChange(event.target.value)
    }

    return (
      <div ref={ref} className={wrapperClassNames}>
        <input
          data-testid="input"
          className={inputClassNames}
          onChange={handleClick}
          ref={input}
          {...{
            disabled,
            maxLength,
            onKeyDown,
            pattern,
            placeholder,
            required,
            type,
            value
          }}
        />
        {label && (
          <label
            data-testid="label"
            className={labelClassNames}
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
        {tip && !required && <Tip text={tip} className="input__tip" />}
        {inputIcon && (
          <span data-testid="input-icon" className={iconClass}>
            {inputIcon}
          </span>
        )}
      </div>
    )
  }
)
Input.defaultProps = {
  className: '',
  disabled: false,
  floatingLabel: false,
  focused: false,
  iconClass: '',
  infoLabel: false,
  inputIcon: null,
  label: '',
  maxLength: null,
  onChange: () => {},
  onKeyDown: () => {},
  placeholder: '',
  required: false,
  requiredText: '',
  tip: '',
  value: undefined,
  wrapperClassName: ''
}

Input.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  floatingLabel: PropTypes.bool,
  focused: PropTypes.bool,
  iconClass: PropTypes.string,
  infoLabel: PropTypes.bool,
  inputIcon: PropTypes.element,
  label: PropTypes.string,
  maxLength: PropTypes.number,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  pattern: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  requiredText: PropTypes.string,
  tip: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  wrapperClassName: PropTypes.string
}

export default React.memo(Input)
