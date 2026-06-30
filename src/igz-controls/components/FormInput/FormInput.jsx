/*
Copyright 2022 Iguazio Systems Ltd.
Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.
In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React, { useState, useEffect, useRef, forwardRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { isEmpty, isNil } from 'lodash'
import { Field, useField } from 'react-final-form'

import InputNumberButtons from './InputNumberButtons/InputNumberButtons'
import OptionsMenu from '../../elements/OptionsMenu/OptionsMenu'
import ValidationTemplate from '../../elements/ValidationTemplate/ValidationTemplate'
import { TextTooltipTemplate, Tip, Tooltip } from '../../components'

import { DENSITY, INPUT_LINK, INPUT_VALIDATION_RULES } from '../../types'
import { checkPatternsValidity, checkPatternsValidityAsync } from '../../utils/validation.util'
import { useDetectOutsideClick, useDebounce } from '../../hooks'
import { validation as ValidationConstants } from '../../constants'

import ExclamationMarkIcon from '../../images/exclamation-mark.svg?react'
import Popout from '../../images/popout.svg?react'
import WarningIcon from '../../images/warning.svg?react'

import './formInput.scss'

const defaultProps = {
  iconClick: () => {},
  link: { show: '', value: '' },
  onBlur: () => {},
  onKeyDown: () => {},
  onValidationError: () => {},
  validator: () => {},
  rules: []
}

let FormInput = (
  {
    async = false,
    className = '',
    customRequiredLabel = '',
    density = 'normal',
    disabled = false,
    focused = false,
    iconClass = '',
    iconClick = defaultProps.iconClick,
    inputIcon = null,
    invalidText = 'This field is invalid',
    label = '',
    link = defaultProps.link,
    name,
    onBlur = defaultProps.onBlur,
    onFocus,
    onKeyDown = defaultProps.onKeyDown,
    pattern = null,
    required = false,
    onValidationError = defaultProps.onValidationError,
    suggestionList = [],
    step = '1',
    tip = '',
    type = 'text',
    validationRules: rules = defaultProps.rules,
    validator = defaultProps.validator,
    withoutBorder = false,
    ...inputProps
  },
  ref
) => {
  const { input, meta } = useField(name)
  const [isInvalid, setIsInvalid] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [typedValue, setTypedValue] = useState('')
  const [validationPattern] = useState(RegExp(pattern))
  const [validationRules, setValidationRules] = useState(rules)
  const [showValidationRules, setShowValidationRules] = useState(false)
  const wrapperRef = useRef()
  ref ??= wrapperRef
  const inputRef = useRef()
  const errorsRef = useRef()
  const isRequiredRulePresentRef = useRef(false)
  useDetectOutsideClick(ref, () => setShowValidationRules(false))
  const debounceAsync = useDebounce()

  const formFieldClassNames = classNames('form-field-input', className)

  const inputWrapperClassNames = classNames(
    'form-field__wrapper',
    `form-field__wrapper-${density}`,
    disabled && 'form-field__wrapper-disabled',
    isInvalid && 'form-field__wrapper-invalid',
    withoutBorder && 'without-border'
  )
  const labelClassNames = classNames('form-field__label', disabled && 'form-field__label-disabled')

  useEffect(() => {
    setTypedValue(String(input.value)) // convert from number to string
  }, [input.value])

  useEffect(() => {
    const isInputInvalid =
      errorsRef.current &&
      meta.invalid &&
      (meta.validating || meta.modified || (meta.submitFailed && meta.touched))
    setIsInvalid(isInputInvalid)
    onValidationError(isInputInvalid)
  }, [
    meta.invalid,
    meta.modified,
    meta.submitFailed,
    meta.touched,
    meta.validating,
    onValidationError
  ])

  useEffect(() => {
    if (!errorsRef.current) {
      if (meta.valid && showValidationRules) {
        setShowValidationRules(false)
      }
    }
  }, [meta.valid, showValidationRules])

  useEffect(() => {
    if (showValidationRules) {
      window.addEventListener('scroll', handleScroll, true)
    }
    return () => {
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [showValidationRules])

  useEffect(() => {
    if (focused) {
      inputRef.current.focus()
    }
  }, [focused])

  useEffect(() => {
    setValidationRules(() => {
      isRequiredRulePresentRef.current = false

      return rules.map(rule => {
        if (rule.name === ValidationConstants.REQUIRED.NAME) {
          isRequiredRulePresentRef.current = true
        }

        return {
          ...rule,
          isValid:
            !errorsRef.current || !Array.isArray(errorsRef.current)
              ? true
              : !errorsRef.current.some(err => err.name === rule.name)
        }
      })
    })
  }, [rules])

  const getValidationRules = () => {
    return validationRules.map(({ isValid = false, label, name }) => {
      return <ValidationTemplate valid={isValid} validationMessage={label} key={name} />
    })
  }

  const isValueEmptyAndValid = value => {
    return (!value && !required) || disabled
  }

  const handleInputBlur = event => {
    input.onBlur && input.onBlur(event)

    if (!event.relatedTarget || !event.relatedTarget?.closest('.form-field__suggestion-list')) {
      setIsFocused(false)
      onBlur && onBlur(event)
    }
  }
  const handleInputFocus = event => {
    input.onFocus && input.onFocus(event)
    onFocus && onFocus(event)
    setIsFocused(true)
  }

  const handleInputKeyDown = event => {
    input.onKeyDown && input.onKeyDown(event)
    onKeyDown && onKeyDown(event)
  }

  const handleScroll = event => {
    if (inputRef.current && inputRef.current.contains(event.target)) return

    if (
      !event.target.closest('.options-menu') &&
      !event.target.classList.contains('form-field-input')
    ) {
      setShowValidationRules(false)
    }
  }

  const handleSuggestionClick = item => {
    input.onChange && input.onChange(item)
    setIsFocused(false)
    onBlur()
  }

  const toggleValidationRulesMenu = () => {
    inputRef.current.focus()
    setShowValidationRules(state => !state)
  }

  const validateField = (value, allValues) => {
    let valueToValidate = isNil(value) ? '' : String(value)

    if (isValueEmptyAndValid(valueToValidate)) return

    let validationError = null

    if (required && valueToValidate.trim().length === 0 && !isRequiredRulePresentRef.current) {
      validationError = {
        name: 'required',
        label: customRequiredLabel || 'This field is required'
      }
    } else if (!isEmpty(rules) && !async) {
      const [newRules, isValidField] = checkPatternsValidity(rules, valueToValidate)
      const invalidRules = newRules.filter(rule => !rule.isValid)

      if (!isValidField) {
        validationError = invalidRules.map(rule => ({ name: rule.name, label: rule.label }))
      }
    }

    if (isEmpty(validationError)) {
      if (type === 'number') {
        if (inputProps.max && +valueToValidate > +inputProps.max) {
          validationError = {
            name: 'maxValue',
            label: `The maximum value must be ${inputProps.max}`
          }
        }

        if (inputProps.min && +valueToValidate < +inputProps.min) {
          validationError = {
            name: 'minValue',
            label: `The minimum value must be ${inputProps.min}`
          }
        }
      }
      if (pattern && !validationPattern.test(valueToValidate)) {
        validationError = { name: 'pattern', label: invalidText }
      } else if (valueToValidate.startsWith(' ')) {
        validationError = { name: 'empty', label: invalidText }
      }
    }

    if (!validationError && validator) {
      validationError = validator(value, allValues)
    }

    errorsRef.current = validationError

    return validationError
  }

  const validateFieldAsync = debounceAsync(async (value, allValues) => {
    let valueToValidate = isNil(value) ? '' : String(value)

    if (isValueEmptyAndValid(valueToValidate)) return

    let validationError = validateField(valueToValidate, allValues)

    if (!isEmpty(rules)) {
      const [newRules, isValidField] = await checkPatternsValidityAsync(rules, valueToValidate)

      const invalidRules = newRules.filter(rule => !rule.isValid)

      if (!isValidField) {
        validationError = invalidRules.map(rule => ({ name: rule.name, label: rule.label }))
      }
    }

    errorsRef.current = validationError

    return validationError
  }, 400)

  const parseField = val => {
    return type === 'number' && val ? parseFloat(val) || val : val
  }

  return (
    <Field validate={async ? validateFieldAsync : validateField} name={name} parse={parseField}>
      {({ input }) => {
        return (
          <div
            ref={ref}
            className={formFieldClassNames}
            data-testid={name ? `${name}-form-field-input` : 'form-field-input'}
          >
            {label && (
              <div className={labelClassNames}>
                <label
                  data-testid={name ? `${name}-form-label` : 'form-label'}
                  htmlFor={input.name}
                >
                  {label}
                  {(required || validationRules.find(rule => rule.name === 'required')) && (
                    <span className="form-field__label-mandatory"> *</span>
                  )}
                </label>
                {link && link.show && typedValue.trim() && (
                  <div className="form-field__label-icon">
                    <Tooltip template={<TextTooltipTemplate text={link.url || typedValue} />}>
                      <a
                        href={link.url || typedValue}
                        onClick={event => event.stopPropagation()}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Popout />
                      </a>
                    </Tooltip>
                  </div>
                )}
              </div>
            )}
            <div className={inputWrapperClassNames}>
              <div className="form-field__control">
                <input
                  data-testid={name ? `${name}-form-input` : 'form-input'}
                  id={input.name}
                  ref={inputRef}
                  required={isInvalid || required}
                  {...{
                    disabled,
                    pattern,
                    type,
                    ...inputProps,
                    ...input
                  }}
                  autoComplete={inputProps.autocomplete ?? 'off'}
                  onBlur={handleInputBlur}
                  onKeyDown={handleInputKeyDown}
                  onFocus={handleInputFocus}
                />
              </div>
              <div className="form-field__icons">
                {isInvalid && !Array.isArray(errorsRef.current) && (
                  <Tooltip
                    className="form-field__warning"
                    template={
                      <TextTooltipTemplate text={errorsRef.current?.label ?? invalidText} warning />
                    }
                  >
                    <ExclamationMarkIcon />
                  </Tooltip>
                )}
                {isInvalid && Array.isArray(errorsRef.current) && (
                  <button className="form-field__warning" onClick={toggleValidationRulesMenu}>
                    <WarningIcon />
                  </button>
                )}
                {tip && <Tip text={tip} className="form-field__tip" />}
                {inputIcon && (
                  <span data-testid="input-icon" className={iconClass} onClick={iconClick}>
                    {inputIcon}
                  </span>
                )}
              </div>
              {type === 'number' && (
                <InputNumberButtons {...{ ...inputProps, step: +step, ...input, disabled }} />
              )}
            </div>
            {suggestionList?.length > 0 && isFocused && (
              <ul className="form-field__suggestion-list">
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
                        __html: item.replace(new RegExp(typedValue, 'gi'), match =>
                          match ? `<b>${match}</b>` : match
                        )
                      }}
                    />
                  )
                })}
              </ul>
            )}
            {!isEmpty(validationRules) && isInvalid && Array.isArray(errorsRef.current) && (
              <OptionsMenu show={showValidationRules} ref={{ refInputContainer: ref }}>
                {getValidationRules()}
              </OptionsMenu>
            )}
          </div>
        )
      }}
    </Field>
  )
}

FormInput = React.memo(forwardRef(FormInput))

FormInput.displayName = 'FormInput'

FormInput.propTypes = {
  async: PropTypes.bool,
  className: PropTypes.string,
  customRequiredLabel: PropTypes.string,
  density: DENSITY,
  disabled: PropTypes.bool,
  focused: PropTypes.bool,
  iconClass: PropTypes.string,
  iconClick: PropTypes.func,
  inputIcon: PropTypes.element,
  invalidText: PropTypes.string,
  label: PropTypes.string,
  link: INPUT_LINK,
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string.isRequired,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onKeyDown: PropTypes.func,
  onValidationError: PropTypes.func,
  pattern: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  suggestionList: PropTypes.arrayOf(PropTypes.string),
  tip: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  type: PropTypes.string,
  validationRules: INPUT_VALIDATION_RULES,
  validator: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  withoutBorder: PropTypes.bool
}

export default React.memo(FormInput)
