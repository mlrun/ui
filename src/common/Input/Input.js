import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { isEmpty } from 'lodash'

import OptionsMenu from '../OptionsMenu/OptionsMenu'
import ValidationTemplate from '../OptionsMenu/ValidationTemplate/ValidationTemplate'

import { ReactComponent as InvalidIcon } from '../../images/invalid.svg'
import { ReactComponent as WarningIcon } from '../../images/warning.svg'

import { checkPatternsValidity } from '../../services/validationService'

import Tooltip from '../Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import Tip from '../Tip/Tip'

import './input.scss'
import classNames from 'classnames'

const Input = React.forwardRef(
  (
    {
      className,
      density,
      disabled,
      floatingLabel,
      focused,
      iconClass,
      infoLabel,
      inputIcon,
      invalid,
      invalidText,
      label,
      suggestionList,
      maxLength,
      onBlur,
      onChange,
      onKeyDown,
      pattern,
      placeholder,
      required,
      requiredText,
      setInvalid,
      tip,
      type,
      value,
      withoutBorder,
      wrapperClassName,
      validationRules: rules
    },
    ref
  ) => {
    ref = useRef()
    const input = useRef()
    const inputLabel = useRef(null)
    const [inputIsFocused, setInputIsFocused] = useState(false)
    const [isInvalid, setIsInvalid] = useState(false)
    const [typedValue, setTypedValue] = useState('')
    const [validationPattern] = useState(RegExp(pattern))
    const [validationRules, setValidationRules] = useState(rules || [])
    const [showValidationRules, setShowValidationRules] = useState(false)

    const fieldControlClassNames = classnames(
      'field-control',
      `field-control-${density}`
    )

    const eventClassNames = classNames(
      (inputIsFocused || placeholder || typedValue.length > 0) &&
        'active-label',
      (isInvalid || invalid) && 'field_invalid',
      disabled && 'field_disabled',
      inputIsFocused && 'focus',
      (withoutBorder || type === 'number') && 'without-border'
    )
    const inputLabelMandatoryClassNames = classnames(
      'field-control-mandatory',
      disabled && 'field-control-mandatory_disabled'
    )
    useEffect(() => {
      setTypedValue(String(value ?? '')) // convert from number to string
    }, [value])

    useEffect(() => {
      if (focused) {
        input.current.focus()
        setInputIsFocused(true)
      }
    }, [input, focused])

    const validateField = value => {
      let isFieldValidByPattern = true

      if (!isEmpty(validationRules)) {
        const [newRules, isValidField] = checkPatternsValidity(
          validationRules,
          value
        )
        isFieldValidByPattern = isValidField
        setValidationRules(newRules)

        if (
          (isFieldValidByPattern && showValidationRules) ||
          value.trim() === ''
        ) {
          setShowValidationRules(false)
        }
      }

      const fieldInvalid =
        (required && value.trim().length === 0) ||
        (pattern && !validationPattern.test(value)) ||
        value.startsWith(' ') ||
        (value.trim().length > 0 && !isFieldValidByPattern)

      setIsInvalid(fieldInvalid)
      setInvalid(!fieldInvalid)
    }

    const changeValue = value => {
      setTypedValue(value)
      onChange(value)
      validateField(value)
    }

    const handleSuggestionClick = item => {
      setInputIsFocused(false)

      changeValue(item)
    }

    const handleInputBlur = event => {
      if (
        !event.relatedTarget ||
        !event.relatedTarget?.closest('.suggestion-list')
      ) {
        setInputIsFocused(false)

        onBlur(event)
      }
    }

    const handleInputChange = ({ target: { value } }) => {
      changeValue(value)
    }

    const renderValidationRules = validationRules.map(
      ({ isValid = false, label, name }) => {
        return (
          <ValidationTemplate
            valid={isValid}
            validationMessage={label}
            key={name}
          />
        )
      }
    )

    const handleInputFocus = event => {
      setInputIsFocused(true)
    }

    const handleOptionMenu = () => {
      setShowValidationRules(!showValidationRules)
      input.current.focus()
      setInputIsFocused(true)
    }

    return (
      <div className={`input-wrapper ${wrapperClassName}`} ref={ref}>
        <div className={fieldControlClassNames}>
          {label && (
            <label
              data-testid="label"
              className={`field-control__label ${eventClassNames}`}
              ref={inputLabel}
            >
              {label}
              {required && (
                <span className={inputLabelMandatoryClassNames}> *</span>
              )}
            </label>
          )}

          <div className="flex-with-icons">
            {inputIcon && (
              <span data-testid="input-icon" className={iconClass}>
                {inputIcon}
              </span>
            )}
            <div
              className={`field-control__input-wrapper ${eventClassNames} ${className}`}
            >
              <input
                data-testid="input"
                onBlur={handleInputBlur}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                ref={input}
                required={isInvalid}
                {...{
                  disabled,
                  maxLength,
                  onKeyDown,
                  pattern,
                  placeholder,
                  type,
                  value: typedValue
                }}
              />
              {!withoutBorder && (
                <fieldset>
                  <legend>
                    {label && (
                      <span className="field-control__legend-span">
                        {label}
                        {required && (
                          <span className={inputLabelMandatoryClassNames}>
                            {' '}
                            *
                          </span>
                        )}
                      </span>
                    )}
                  </legend>
                </fieldset>
              )}
              {!isEmpty(validationRules) && typedValue && isInvalid && (
                <i
                  className="validation__icon p-1 pointer"
                  onClick={handleOptionMenu}
                >
                  <WarningIcon />
                </i>
              )}
              {isInvalid && !typedValue && (
                <Tooltip
                  className="validation__icon p-1"
                  template={
                    <TextTooltipTemplate
                      text={
                        required && !typedValue ? requiredText : invalidText
                      }
                      warning
                    />
                  }
                >
                  <InvalidIcon />
                </Tooltip>
              )}
            </div>
            {tip && <Tip text={tip} className="input__tip" />}
          </div>
          {suggestionList?.length > 0 && inputIsFocused && (
            <ul className="suggestion-list">
              {suggestionList.map((item, index) => {
                return (
                  <li
                    className="suggestion-item"
                    key={`${item}${index}`}
                    onClick={() => {
                      handleSuggestionClick(item)
                    }}
                    tabIndex={index}
                    dangerouslySetInnerHTML={{
                      __html: item.replace(
                        new RegExp(typedValue, 'gi'),
                        match => (match ? `<b>${match}</b>` : match)
                      )
                    }}
                  />
                )
              })}
            </ul>
          )}
          {!isEmpty(validationRules) && (
            <OptionsMenu
              show={showValidationRules && typedValue !== ''}
              ref={ref}
            >
              {renderValidationRules}
            </OptionsMenu>
          )}
        </div>
      </div>
    )
  }
)

Input.defaultProps = {
  className: '',
  density: 'normal',
  disabled: false,
  floatingLabel: false,
  focused: false,
  iconClass: '',
  infoLabel: false,
  inputIcon: null,
  invalid: false,
  invalidText: 'This field is invalid',
  label: '',
  maxLength: null,
  onBlur: () => {},
  onChange: () => {},
  onKeyDown: () => {},
  placeholder: '',
  required: false,
  requiredText: 'This field is required',
  setInvalid: () => {},
  tip: '',
  type: 'text',
  value: undefined,
  withoutBorder: false,
  wrapperClassName: ''
}

Input.propTypes = {
  className: PropTypes.string,
  density: PropTypes.oneOf(['dense', 'normal', 'medium', 'chunky', 'full']),
  disabled: PropTypes.bool,
  floatingLabel: PropTypes.bool,
  focused: PropTypes.bool,
  iconClass: PropTypes.string,
  infoLabel: PropTypes.bool,
  inputIcon: PropTypes.element,
  invalid: PropTypes.bool,
  invalidText: PropTypes.string,
  label: PropTypes.string,
  maxLength: PropTypes.number,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  pattern: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  requiredText: PropTypes.string,
  setInvalid: PropTypes.func,
  tip: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  withoutBorder: PropTypes.bool,
  wrapperClassName: PropTypes.string,
  validationRules: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      pattern: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.instanceOf(RegExp)
      ]).isRequired
    })
  )
}

export default React.memo(Input)
