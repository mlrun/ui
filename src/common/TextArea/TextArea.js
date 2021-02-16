import React, { useEffect, useState, useCallback } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import Tooltip from '../Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import Tip from '../Tip/Tip'

import { ReactComponent as Warning } from '../../images/warning.svg'

import './textArea.scss'

const TextArea = React.forwardRef(
  (
    {
      className,
      disabled,
      floatingLabel,
      iconClass,
      textAreaIcon,
      label,
      onChange,
      onKeyDown,
      placeholder,
      required,
      requiredText,
      focused,
      tip,
      value,
      wrapperClassName
    },
    ref
  ) => {
    const [textAreaIsFocused, setTextAreaIsFocused] = useState(false)
    const textArea = React.createRef()
    const labelRef = React.createRef()
    const textAreaClassNames = classnames(
      'text-area',
      className,
      textAreaIsFocused && floatingLabel && 'text-area_active',
      required && 'text-area_required'
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
      }

      if (focused) {
        textArea.current.focus()
      }
    }, [focused, textArea])

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

      onChange(event.target.value)
    }

    return (
      <div ref={ref} className={wrapperClassNames}>
        <textarea
          className={textAreaClassNames}
          data-testid="text-area"
          disabled={disabled}
          onChange={handleClick}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          ref={textArea}
          value={value && value}
        />
        {label && (
          <label data-testid="label" className={labelClassNames} ref={labelRef}>
            {label}
          </label>
        )}
        {required && (
          <Tooltip
            template={<TextTooltipTemplate text={requiredText} warning />}
            className="text-area__warning"
          >
            <Warning />
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
  label: '',
  onChange: () => {},
  onKeyDown: () => {},
  placeholder: '',
  required: false,
  requiredText: '',
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
  label: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  requiredText: PropTypes.string,
  tip: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  wrapperClassName: PropTypes.string
}

export default React.memo(TextArea)
