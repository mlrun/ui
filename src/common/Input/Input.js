import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { isEmpty } from 'lodash'

import OptionsMenu from '../OptionsMenu/OptionsMenu'
import ValidationTemplate from '../../elements/ValidationTemplate/ValidationTemplate'
import Tip from '../Tip/Tip'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { checkPatternsValidity } from '../../utils/validationService'
import { useDetectOutsideClick } from '../../hooks/useDetectOutsideClick'

import { INPUT_LINK } from '../../types'

import { ReactComponent as InvalidIcon } from 'igz-controls/images/invalid.svg'
import { ReactComponent as Popout } from 'igz-controls/images/popout.svg'
import { ReactComponent as WarningIcon } from 'igz-controls/images/warning.svg'

import './input.scss'

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
      link,
      min,
      maxLength,
      onBlur,
      onChange,
      onKeyDown,
      pattern,
      placeholder,
      required,
      requiredText,
      setInvalid,
      step,
      suggestionList,
      tip,
      type,
      validationRules: rules,
      value,
      withoutBorder,
      wrapperClassName
    },
    ref
  ) => {
    const [inputIsFocused, setInputIsFocused] = useState(false)
    const [labelWidth, setLabelWidth] = useState(0)
    const [isInvalid, setIsInvalid] = useState(false)
    const [typedValue, setTypedValue] = useState('')
    const [validationPattern] = useState(RegExp(pattern))
    const [validationRules, setValidationRules] = useState(rules)
    const [showValidationRules, setShowValidationRules] = useState(false)
    const wrapperRef = useRef()
    ref ??= wrapperRef
    const inputRef = useRef()
    const inputLabelRef = useRef(null)
    useDetectOutsideClick(ref, () => setShowValidationRules(false))

    const inputClassNames = classnames(
      'input',
      className,
      `input-${density}`,
      (inputIsFocused || placeholder || typedValue.length > 0) && floatingLabel && 'active-input',
      isInvalid && 'input_invalid',
      tip && 'input-short',
      !isEmpty(validationRules) && isInvalid && 'input_rules-invalid',
      withoutBorder && 'without-border'
    )
    const labelClassNames = classnames(
      'input__label',
      disabled && 'input__label_disabled',
      floatingLabel && 'input__label-floating',
      (inputIsFocused || placeholder || typedValue.length > 0) && floatingLabel && 'active-label',
      infoLabel && 'input__label_info'
    )
    const wrapperClassNames = classnames(wrapperClassName, 'input-wrapper')
    const inputLabelMandatoryClassNames = classnames(
      'input__label-mandatory',
      disabled && 'input__label-mandatory_disabled'
    )

    useEffect(() => {
      setTypedValue(String(value ?? '')) // convert from number to string
    }, [value])

    useEffect(() => {
      if (showValidationRules) {
        window.addEventListener('scroll', handleScroll, true)
      }
      return () => {
        window.removeEventListener('scroll', handleScroll, true)
      }
    }, [showValidationRules])

    useEffect(() => {
      if (isInvalid !== invalid) {
        if (
          (required && typedValue.trim().length === 0) ||
          (pattern && !validationPattern.test(typedValue)) ||
          typedValue.startsWith(' ')
        ) {
          setIsInvalid(true)
          setInvalid && setInvalid(false)
        } else {
          setIsInvalid(invalid)
        }
      }
    }, [invalid, isInvalid, pattern, required, setInvalid, typedValue, validationPattern])

    useEffect(() => {
      if (focused) {
        inputRef.current.focus()
        setInputIsFocused(true)
      }
    }, [inputRef, focused])

    useEffect(() => {
      if (inputLabelRef.current) {
        setLabelWidth(inputLabelRef.current?.getBoundingClientRect().width)
      }
    }, [label])

    const handleSuggestionClick = item => {
      setInputIsFocused(false)

      changeValue(item)
    }

    const handleScroll = event => {
      if (!event.target.closest('.options-menu') && !event.target.classList.contains('input')) {
        setShowValidationRules(false)
      }
    }

    const handleInputBlur = event => {
      if (!event.relatedTarget || !event.relatedTarget?.closest('.suggestion-list')) {
        setInputIsFocused(false)

        onBlur(event)
      }
    }

    const validateField = value => {
      let isFieldValidByPattern = true

      if (!isEmpty(validationRules)) {
        const [newRules, isValidField] = checkPatternsValidity(validationRules, value)
        isFieldValidByPattern = isValidField
        setValidationRules(newRules)

        if ((isFieldValidByPattern && showValidationRules) || value.trim() === '') {
          setShowValidationRules(false)
        }
      }

      const fieldInvalid =
        (required && value.trim().length === 0) ||
        (pattern && !validationPattern.test(value)) ||
        value.startsWith(' ') ||
        !isFieldValidByPattern

      setIsInvalid(fieldInvalid)
      setInvalid(!fieldInvalid)
    }

    const changeValue = value => {
      setTypedValue(value)
      onChange(value)
      validateField(value)
    }

    const handleInputChange = event => {
      changeValue(event.target.value)
    }

    const renderValidationRules = validationRules.map(({ isValid = false, label, name }) => {
      return <ValidationTemplate valid={isValid} validationMessage={label} key={name} />
    })

    const handleInputFocus = () => {
      setInputIsFocused(true)
    }

    const toggleValidationRulesMenu = () => {
      setShowValidationRules(!showValidationRules)
      inputRef.current.focus()
      setInputIsFocused(true)
    }

    return (
      <div ref={ref} className={wrapperClassNames}>
        <input
          data-testid="input"
          className={inputClassNames}
          onBlur={handleInputBlur}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          ref={inputRef}
          required={isInvalid}
          {...{
            disabled,
            min,
            maxLength,
            onKeyDown,
            pattern,
            placeholder,
            step,
            type,
            value: typedValue
          }}
          style={floatingLabel ? {} : { paddingLeft: `${labelWidth + 16}px` }}
        />
        {label && (
          <div className={labelClassNames}>
            <label
              data-testid="label"
              ref={inputLabelRef}
              style={
                infoLabel
                  ? {
                      left: (value ? value.length + 2 : 2) * 10
                    }
                  : {}
              }
            >
              {label}
              {required && <span className={inputLabelMandatoryClassNames}> *</span>}
            </label>
            {floatingLabel && link && link.show && typedValue.trim() && (
              <div className="input__link-icon">
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

        {isInvalid && !isEmpty(validationRules) && (
          <i className="input__warning" onClick={toggleValidationRulesMenu}>
            <WarningIcon />
          </i>
        )}
        {isInvalid && isEmpty(validationRules) && (
          <Tooltip
            className="input__warning"
            template={
              <TextTooltipTemplate
                text={required && !typedValue ? requiredText : invalidText}
                warning
              />
            }
          >
            <InvalidIcon />
          </Tooltip>
        )}
        {tip && <Tip text={tip} className="input__tip" />}
        {inputIcon && (
          <span data-testid="input-icon" className={iconClass}>
            {inputIcon}
          </span>
        )}
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
                    __html: item.replace(new RegExp(typedValue, 'gi'), match =>
                      match ? `<b>${match}</b>` : match
                    )
                  }}
                />
              )
            })}
          </ul>
        )}
        {!isEmpty(validationRules) && (
          <OptionsMenu show={showValidationRules} ref={ref}>
            {renderValidationRules}
          </OptionsMenu>
        )}
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
  link: { show: '', value: '' },
  label: '',
  maxLength: null,
  min: null,
  onBlur: () => {},
  onChange: () => {},
  onKeyDown: () => {},
  placeholder: '',
  required: false,
  requiredText: 'This field is required',
  setInvalid: () => {},
  step: '',
  tip: '',
  type: 'text',
  validationRules: [],
  value: undefined,
  withoutBorder: false,
  wrapperClassName: ''
}

Input.propTypes = {
  className: PropTypes.string,
  density: PropTypes.oneOf(['dense', 'normal', 'medium', 'chunky']),
  disabled: PropTypes.bool,
  floatingLabel: PropTypes.bool,
  focused: PropTypes.bool,
  iconClass: PropTypes.string,
  infoLabel: PropTypes.bool,
  inputIcon: PropTypes.element,
  invalid: PropTypes.bool,
  invalidText: PropTypes.string,
  label: PropTypes.string,
  link: INPUT_LINK,
  maxLength: PropTypes.number,
  min: PropTypes.number,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  pattern: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  requiredText: PropTypes.string,
  setInvalid: PropTypes.func,
  step: PropTypes.string,
  tip: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  withoutBorder: PropTypes.bool,
  wrapperClassName: PropTypes.string
}

export default React.memo(Input)
