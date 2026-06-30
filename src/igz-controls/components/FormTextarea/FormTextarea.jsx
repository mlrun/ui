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
import React, { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { Field, useField } from 'react-final-form'

import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import Tip from '../Tip/Tip'
import Tooltip from '../Tooltip/Tooltip'

import ExclamationMarkIcon from '../../images/exclamation-mark.svg?react'

import './formTextarea.scss'

let FormTextarea = (
  {
    className = '',
    disabled = false,
    focused = false,
    iconClass = '',
    invalidText = 'This field is invalid',
    label = '',
    maxLength = null,
    name,
    onBlur = () => {},
    onChange = () => {},
    required = false,
    rows = 3,
    textAreaIcon = null,
    tip = '',
    withoutBorder = false,
    ...textareaProps
  },
  ref
) => {
  const { input, meta } = useField(name)
  const [isInvalid, setIsInvalid] = useState(false)
  const [textAreaCount, setTextAreaCount] = useState(input.value.length)
  const textAreaRef = useRef()

  const formFieldClassNames = classnames('form-field-textarea', className)
  const labelClassNames = classnames('form-field__label', disabled && 'form-field__label-disabled')
  const textAreaClassNames = classnames(
    'form-field__wrapper',
    disabled && 'form-field__wrapper-disabled',
    isInvalid && 'form-field__wrapper-invalid',
    withoutBorder && 'without-border'
  )

  useLayoutEffect(() => {
    setTextAreaCount(input.value.length)
  }, [input.value.length])

  useEffect(() => {
    if (focused) {
      textAreaRef.current.focus()
    }
  }, [focused, textAreaRef])

  useEffect(() => {
    setIsInvalid(
      meta.invalid && (meta.validating || meta.modified || (meta.submitFailed && meta.touched))
    )
  }, [meta.invalid, meta.modified, meta.submitFailed, meta.touched, meta.validating])

  const handleInputBlur = event => {
    input.onBlur(event)
    onBlur && onBlur(event)
  }

  const handleInputChange = event => {
    input.onChange(event)
    onChange && onChange(event.target.value)
  }

  const handleInputFocus = event => {
    input.onFocus(event)
  }

  const validateField = value => {
    const valueToValidate = value ?? ''
    let validationError = null

    if (valueToValidate.startsWith(' ')) {
      validationError = { name: 'empty', label: invalidText }
    } else if (required && valueToValidate.trim().length === 0) {
      validationError = { name: 'required', label: 'This field is required' }
    }

    return validationError
  }

  return (
    <Field validate={validateField} name={name}>
      {({ input, meta }) => (
        <div ref={ref} className={formFieldClassNames}>
          <div className={labelClassNames}>
            {label && (
              <label data-testid="label" htmlFor={input.name}>
                {label}
                {required && <span className="form-field__label-mandatory"> *</span>}
              </label>
            )}
          </div>
          <div className={textAreaClassNames}>
            <div className="form-field__control">
              <textarea
                data-testid="textarea"
                id={input.name}
                maxLength={maxLength}
                ref={textAreaRef}
                required={isInvalid || required}
                {...{
                  disabled,
                  rows,
                  ...textareaProps,
                  ...input
                }}
                onBlur={handleInputBlur}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
            </div>
            <div className="form-field__icons">
              {isInvalid && (
                <Tooltip
                  className="form-field__warning"
                  template={<TextTooltipTemplate text={meta.error?.label ?? invalidText} warning />}
                >
                  <ExclamationMarkIcon />
                </Tooltip>
              )}
              {tip && !required && <Tip text={tip} className="form-field__tip" />}
              {textAreaIcon && (
                <span data-testid="textarea__icon" className={iconClass}>
                  {textAreaIcon}
                </span>
              )}
            </div>
          </div>
          {maxLength && (
            <div className="form-field__counter">{`${maxLength - textAreaCount} ${
              maxLength - textAreaCount !== 1 ? 'characters' : 'character'
            } left`}</div>
          )}
        </div>
      )}
    </Field>
  )
}

FormTextarea = React.memo(forwardRef(FormTextarea))

FormTextarea.displayName = 'FormTextarea'

FormTextarea.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  focused: PropTypes.bool,
  iconClass: PropTypes.string,
  invalidText: PropTypes.string,
  label: PropTypes.string,
  maxLength: PropTypes.number,
  name: PropTypes.string.isRequired,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  rows: PropTypes.number,
  textAreaIcon: PropTypes.element,
  tip: PropTypes.string,
  withoutBorder: PropTypes.bool
}

export default FormTextarea
