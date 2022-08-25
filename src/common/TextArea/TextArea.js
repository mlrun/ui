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
import React, { useEffect, useState, useCallback } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import { Tip, Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { ReactComponent as Invalid } from 'igz-controls/images/invalid.svg'

import './textArea.scss'

const TextArea = React.forwardRef(
  (
    {
      className,
      disabled,
      floatingLabel,
      focused,
      iconClass,
      invalid,
      invalidText,
      label,
      onBlur,
      onChange,
      onKeyDown,
      placeholder,
      required,
      requiredText,
      rows,
      setInvalid,
      textAreaIcon,
      tip,
      value,
      wrapperClassName
    },
    ref
  ) => {
    const [textAreaIsFocused, setTextAreaIsFocused] = useState(false)
    const [isInvalid, setIsInvalid] = useState(false)
    const textArea = React.createRef()
    const labelRef = React.createRef()
    const textAreaClassNames = classnames(
      'text-area',
      className,
      textAreaIsFocused && floatingLabel && 'text-area_active',
      isInvalid && 'text-area_invalid'
    )
    const wrapperClassNames = classnames(wrapperClassName, 'text-area-wrapper')
    const labelClassNames = classnames(
      'text-area__label',
      textAreaIsFocused && floatingLabel && 'active-label',
      floatingLabel && 'text-area__label-floating'
    )

    useEffect(() => {
      if (textArea.current.value.length > 0) {
        setTextAreaIsFocused(true)
      } else if (textAreaIsFocused && textArea.current.value.length === 0) {
        setTextAreaIsFocused(false)
      }

      if (focused) {
        textArea.current.focus()
      }
    }, [focused, textArea, textAreaIsFocused])

    useEffect(() => {
      if (isInvalid !== invalid) {
        if (required && value.trim().length === 0) {
          setIsInvalid(true)
          setInvalid && setInvalid(false)
        } else {
          setIsInvalid(invalid)
        }
      }
    }, [invalid, isInvalid, required, setInvalid, value])

    const handleTextAreaScroll = useCallback(
      event => {
        if (event.target.scrollTop > 5) {
          labelRef.current.classList.add('text-area__label_hidden')
        } else if (
          event.target.scrollTop <= 5 &&
          labelRef.current.classList.contains('text-area__label_hidden')
        ) {
          labelRef.current.classList.remove('text-area__label_hidden')
        }
      },
      [labelRef]
    )

    useEffect(() => {
      const textAreaRef = textArea.current

      if (textArea.current) {
        textArea.current.addEventListener('scroll', handleTextAreaScroll)
      }

      return () => {
        if (textAreaRef) {
          textAreaRef.removeEventListener('scroll', handleTextAreaScroll)
        }
      }
    }, [handleTextAreaScroll, textArea])

    const handleClick = event => {
      if (event.target.value.length > 0) {
        setTextAreaIsFocused(true)
      } else {
        setTextAreaIsFocused(false)
      }

      if (required && event.target.value.trim().length === 0) {
        setIsInvalid(true)
        setInvalid && setInvalid(false)
      } else {
        setIsInvalid(false)
        setInvalid && setInvalid(true)
      }

      onChange(event.target.value)
    }

    return (
      <div ref={ref} className={wrapperClassNames}>
        <textarea
          className={textAreaClassNames}
          data-testid="text-area"
          disabled={disabled}
          onBlur={onBlur}
          onChange={handleClick}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          rows={rows}
          required={isInvalid}
          ref={textArea}
          value={value && value}
        />
        {label && (
          <label data-testid="label" className={labelClassNames} ref={labelRef}>
            {label}
            {required && <span className="text-area__label-mandatory"> *</span>}
          </label>
        )}
        {isInvalid && (
          <Tooltip
            className="text-area__warning"
            template={
              <TextTooltipTemplate
                text={required && value.length === 0 ? requiredText : invalidText}
                warning
              />
            }
          >
            <Invalid />
          </Tooltip>
        )}
        {tip && !required && <Tip text={tip} className="text-area__tip" />}
        {textAreaIcon && (
          <span data-testid="text-area__icon" className={iconClass}>
            {textAreaIcon}
          </span>
        )}
      </div>
    )
  }
)

TextArea.defaultProps = {
  className: '',
  disabled: false,
  floatingLabel: false,
  focused: false,
  iconClass: '',
  inputIcon: null,
  invalid: false,
  invalidText: 'This field is invalid',
  label: '',
  onBlur: () => {},
  onChange: () => {},
  onKeyDown: () => {},
  placeholder: '',
  required: false,
  requiredText: 'This field is required',
  rows: 2,
  setInvalid: () => {},
  tip: '',
  value: '',
  wrapperClassName: ''
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
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  requiredText: PropTypes.string,
  rows: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setInvalid: PropTypes.func,
  tip: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  wrapperClassName: PropTypes.string
}

export default React.memo(TextArea)
