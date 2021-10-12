import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import lodash from 'lodash'

import { useDetectOutsideClick } from '../../hooks/useDetectOutsideClick'

import OptionsMenu from '../OptionsMenu/OptionsMenu'
import ValidationTemplate from '../OptionsMenu/ValidationTemplate/ValidationTemplate'

import { ReactComponent as InvalidIcon } from '../../images/invalid.svg'
import { ReactComponent as WarningIcon } from '../../images/warning.svg'
// import { ReactComponent as CheckmarkIcon } from '../../images/success_done.svg'

import { checkPatternsValidity } from '../../services/validationService'

import Tooltip from '../Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import Tip from '../Tip/Tip'

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
    const input = React.createRef()
    const inputLabel = useRef(null)
    const [inputIsFocused, setInputIsFocused] = useState(false)
    const [labelWidth, setLabelWidth] = useState(0)
    const [isInvalid, setIsInvalid] = useState(false)
    const [typedValue, setTypedValue] = useState('')
    const [validationPattern] = useState(RegExp(pattern))
    const [validationRules, setValidationRules] = useState(rules || [])
    const [showValidationRules, setShowValidationRules] = useState(false)
    const [isClickedOutside, setIsClickedOutside] = useDetectOutsideClick(
      ref,
      false
    )
    const inputClassNames = classnames(
      'input',
      className,
      `input-${density}`,
      (inputIsFocused || placeholder || typedValue.length > 0) &&
        floatingLabel &&
        'active-input',
      isInvalid ? 'input_invalid' : 'input_valid',
      !lodash.isEmpty(validationRules) && 'has-icon',
      tip && 'input-short',
      withoutBorder && 'without-border'
    )
    const labelClassNames = classnames(
      'input__label',
      disabled && 'input__label_disabled',
      floatingLabel && 'input__label-floating',
      (inputIsFocused || placeholder || typedValue.length > 0) &&
        floatingLabel &&
        'active-label',
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

    // useEffect(() => {
    //   if (isInvalid !== invalid) {
    //     if (
    //       (required && typedValue.trim().length === 0) ||
    //       (pattern && !validationPattern.test(typedValue)) ||
    //       typedValue.startsWith(' ')
    //     ) {
    //       setIsInvalid(true)
    //       setInvalid && setInvalid(false)
    //     } else {
    //       setIsInvalid(invalid)
    //     }
    //   }
    // }, [
    //   invalid,
    //   isInvalid,
    //   pattern,
    //   required,
    //   setInvalid,
    //   typedValue,
    //   validationPattern
    // ])

    useEffect(() => {
      if (focused) {
        input.current.focus()
        setInputIsFocused(true)
      }
    }, [input, focused])

    useEffect(() => {
      if (inputLabel) {
        setLabelWidth(inputLabel.current?.clientWidth)
      }
    }, [label])

    const validateField = value => {
      let isFieldValidByPattern = true

      if (!lodash.isEmpty(validationRules)) {
        const [newRules, isValidField] = checkPatternsValidity(
          validationRules,
          value
        )
        isFieldValidByPattern = isValidField
        setValidationRules(newRules)

        if (isFieldValidByPattern && showValidationRules) {
          setShowValidationRules(false)
        }
      }

      if (
        (required && value.trim().length === 0) ||
        (pattern && !validationPattern.test(value)) ||
        typedValue.startsWith(' ') ||
        typedValue.trim().length > 0 ||
        !isFieldValidByPattern
      ) {
        setIsInvalid(true)
        setInvalid && setInvalid(false)
      } else {
        setIsInvalid(false)
        setInvalid && setInvalid(true)
      }
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
      setIsClickedOutside(!isClickedOutside || !showValidationRules)
      setShowValidationRules(!isClickedOutside || !showValidationRules)
      input.current.focus()
    }

    return (
      <div ref={ref} className={wrapperClassNames}>
        <input
          data-testid="input"
          className={inputClassNames}
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
          style={floatingLabel ? {} : { paddingLeft: `${labelWidth + 16}px` }}
        />
        {label && (
          <label
            data-testid="label"
            className={labelClassNames}
            ref={inputLabel}
            style={
              infoLabel
                ? {
                    left: (value ? value.length + 2 : 2) * 10
                  }
                : {}
            }
          >
            {label}
            {required && (
              <span className={inputLabelMandatoryClassNames}> *</span>
            )}
          </label>
        )}

        {!lodash.isEmpty(validationRules) && typedValue && isInvalid && (
          <i
            className="validation__icon p-1 pointer"
            onClick={handleOptionMenu}
          >
            <WarningIcon />
          </i>
        )}
        {isInvalid && !typedValue && (
          <Tooltip
            className="validation__icon"
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
        <OptionsMenu show={showValidationRules && typedValue !== ''}>
          {renderValidationRules}
        </OptionsMenu>
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
