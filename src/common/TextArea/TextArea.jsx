/*
Copyright 2019 Iguazio Systems Ltd.

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
import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash-es'

import { Tip, Tooltip, TextTooltipTemplate } from 'igz-controls/components'
import { OptionsMenu, ValidationTemplate } from 'igz-controls/elements'

import { checkPatternsValidity } from 'igz-controls/utils/validation.util'
import { useDetectOutsideClick } from 'igz-controls/hooks'

import ExclamationMarkIcon from 'igz-controls/images/exclamation-mark.svg?react'
import WarningIcon from 'igz-controls/images/warning.svg?react'

import './textArea.scss'

function TextArea({
  className = '',
  disabled = false,
  floatingLabel = false,
  focused = false,
  iconClass = '',
  invalid = false,
  invalidText = 'This field is invalid',
  label = '',
  maxLength = null,
  onBlur = () => {},
  onChange = () => {},
  onKeyDown = () => {},
  placeholder = '',
  ref,
  required = false,
  requiredText = 'This field is required',
  rows = 2,
  setInvalid = () => {},
  textAreaIcon = null,
  tip = '',
  validationRules: rules = [],
  value = '',
  wrapperClassName = ''
}) {
  const [textAreaIsFocused, setTextAreaIsFocused] = useState(false)
  const [localInvalid, setLocalInvalid] = useState(false)
  const [validationRules, setValidationRules] = useState(rules)
  const [showValidationRules, setShowValidationRules] = useState(false)
  const wrapperRef = useRef()
  ref ??= wrapperRef
  const textAreaRef = React.useRef()
  const labelRef = React.useRef()
  useDetectOutsideClick(ref, () => setShowValidationRules(false))

  const stringValue = String(value ?? '')
  const isInvalid = useMemo(() => {
    if (required && stringValue.trim().length === 0) {
      return true
    }
    if (localInvalid) {
      return true
    }
    return invalid
  }, [required, stringValue, localInvalid, invalid])

  const labelActive = textAreaIsFocused || stringValue.length > 0

  const textAreaClassNames = classnames(
    'text-area',
    className,
    labelActive && floatingLabel && 'text-area_active',
    isInvalid && 'text-area_invalid',
    !isEmpty(validationRules) && isInvalid && 'input_rules-invalid'
  )
  const wrapperClassNames = classnames(wrapperClassName, 'text-area-wrapper')
  const labelClassNames = classnames(
    'text-area__label',
    labelActive && floatingLabel && 'active-label',
    floatingLabel && 'text-area__label-floating'
  )

  useEffect(() => {
    if (focused) {
      textAreaRef.current?.focus()
    }
  }, [focused])

  const handleScroll = useCallback(event => {
    if (!event.target.closest('.options-menu') && !event.target.classList.contains('area-input')) {
      setShowValidationRules(false)
    }
  }, [])

  const handleTextAreaScroll = useCallback(event => {
    if (event.target.scrollTop > 5) {
      labelRef.current.classList.add('text-area__label_hidden')
    } else if (
      event.target.scrollTop <= 5 &&
      labelRef.current.classList.contains('text-area__label_hidden')
    ) {
      labelRef.current.classList.remove('text-area__label_hidden')
    }
  }, [])

  useEffect(() => {
    if (showValidationRules) {
      window.addEventListener('scroll', handleScroll, true)
    }
    return () => {
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [showValidationRules, handleScroll])

  useEffect(() => {
    const textArea = textAreaRef.current

    if (textAreaRef.current && labelRef.current) {
      textAreaRef.current.addEventListener('scroll', handleTextAreaScroll)
    }

    return () => {
      if (textArea) {
        textArea.removeEventListener('scroll', handleTextAreaScroll)
      }
    }
  }, [handleTextAreaScroll])

  const handleChange = event => {
    if (event.target.value.length > 0) {
      setTextAreaIsFocused(true)
    } else {
      setTextAreaIsFocused(false)
    }

    if (required && event.target.value.trim().length === 0) {
      setLocalInvalid(true)
      setInvalid && setInvalid(false)
    } else {
      setLocalInvalid(false)
      setInvalid && setInvalid(true)
    }

    validateField(event.target.value)
    onChange(event.target.value)
  }

  const renderValidationRules = validationRules.map(({ isValid = false, label, name }) => {
    return <ValidationTemplate valid={isValid} validationMessage={label} key={name} />
  })

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

    const fieldInvalid = (required && value.trim().length === 0) || !isFieldValidByPattern

    setLocalInvalid(!isFieldValidByPattern)
    setInvalid(!fieldInvalid)
  }

  const toggleValidationRulesMenu = () => {
    setShowValidationRules(!showValidationRules)
    textAreaRef.current.focus()
    setTextAreaIsFocused(true)
  }

  return (
    <div ref={ref} className={wrapperClassNames}>
      <textarea
        className={textAreaClassNames}
        data-testid="text-area"
        disabled={disabled}
        maxLength={maxLength}
        onBlur={onBlur}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        rows={rows}
        required={isInvalid}
        ref={textAreaRef}
        value={value && value}
      />
      {label && (
        <label data-testid="label" className={labelClassNames} ref={labelRef}>
          {label}
          {required && <span className="text-area__label-mandatory"> *</span>}
        </label>
      )}
      {isInvalid && !isEmpty(validationRules) && (
        <i className="text-area-input__warning input__warning" onClick={toggleValidationRulesMenu}>
          <WarningIcon />
        </i>
      )}
      {isInvalid && isEmpty(validationRules) && (
        <Tooltip
          className="text-area__warning"
          template={
            <TextTooltipTemplate
              text={required && stringValue.length === 0 ? requiredText : invalidText}
              warning
            />
          }
        >
          <ExclamationMarkIcon />
        </Tooltip>
      )}
      {tip && !required && <Tip text={tip} className="text-area__tip" />}
      {textAreaIcon && (
        <span data-testid="text-area__icon" className={iconClass}>
          {textAreaIcon}
        </span>
      )}
      {!isEmpty(validationRules) && (
        <OptionsMenu show={showValidationRules} refInputContainer={ref}>
          {renderValidationRules}
        </OptionsMenu>
      )}
      {maxLength && (
        <div className="text-area__counter">{`${maxLength - stringValue.length} ${
          maxLength - stringValue.length !== 1 ? 'characters' : 'character'
        } left`}</div>
      )}
    </div>
  )
}

TextArea.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  floatingLabel: PropTypes.bool,
  focused: PropTypes.bool,
  iconClass: PropTypes.string,
  inputIcon: PropTypes.element,
  invalid: PropTypes.bool,
  invalidText: PropTypes.string,
  label: PropTypes.string,
  maxLength: PropTypes.number,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  requiredText: PropTypes.string,
  rows: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setInvalid: PropTypes.func,
  textAreaIcon: PropTypes.node,
  tip: PropTypes.string,
  validationRules: PropTypes.array,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  wrapperClassName: PropTypes.string
}

export default React.memo(TextArea)
