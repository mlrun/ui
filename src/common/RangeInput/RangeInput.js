import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { isNil } from 'lodash'

import Input from '../Input/Input'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { ReactComponent as Arrow } from 'igz-controls/images/range-arrow-small.svg'
import { ReactComponent as Invalid } from 'igz-controls/images/invalid.svg'

import './rangeInput.scss'

const RangeInput = ({
  density,
  disabled,
  invalid,
  invalidText,
  label,
  labelType,
  max,
  min,
  onChange,
  step,
  tip,
  required,
  requiredText,
  value
}) => {
  const [inputValue, setInputValue] = useState('')
  const [isRequired, setIsRequired] = useState(false)
  const rangeClassName = classNames(
    'range',
    `range-${density}`,
    labelType === 'none' && 'range__label-none',
    tip && 'range__input-tip',
    (isRequired || invalid) && 'range-warning'
  )

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleIncrease = () => {
    if (inputValue >= max) return

    const value = isCurrentValueEmpty() ? step : Number(inputValue) + step
    const nextValue = isInteger(value) ? value : value.toFixed(3)

    setInputValue(nextValue)
    onChange(nextValue)
  }

  const handleDecrease = () => {
    if (inputValue <= 0 || inputValue <= min) return

    const value = isCurrentValueEmpty() ? -step : Number(inputValue) - step
    const nextValue = isInteger(value) ? value : value.toFixed(3)

    setInputValue(nextValue)
    onChange(nextValue)
  }

  const rangeOnFocus = () => {
    setIsRequired(false)
  }

  const rangeOnBlur = () => {
    if (required && inputValue.length === 0) {
      setIsRequired(true)
    }
  }
  const isCurrentValueEmpty = () => {
    return isNil(inputValue) || inputValue === ''
  }

  const isInteger = number => {
    return Number(number) === number && number % 1 === 0
  }

  return (
    <div
      data-testid="range-input-container"
      className={rangeClassName}
      onFocus={rangeOnFocus}
      onBlur={rangeOnBlur}
    >
      {labelType === 'labelAtTop' && (
        <label className="range__label">
          {label}
          {required && <span className="range__label-mandatory"> *</span>}
        </label>
      )}
      <Input
        className="range__input"
        density={density}
        disabled={disabled}
        floatingLabel={labelType === 'floatingLabel'}
        infoLabel={labelType === 'infoLabel'}
        label={labelType !== 'labelAtTop' && labelType !== 'none' ? label : ''}
        min={min}
        max={max}
        onChange={value => {
          setInputValue(value)
          onChange(value)
        }}
        tip={tip}
        required={required}
        step="any"
        type="number"
        value={inputValue}
      />
      <div className="range__buttons">
        <button
          data-testid="btn-increase"
          className="range__button range__button-increase"
          disabled={disabled}
          onClick={handleIncrease}
        >
          <Arrow className="increase" />
        </button>
        <button
          data-testid="btn-decrease"
          className="range__button range__button-decrease"
          disabled={disabled}
          onClick={handleDecrease}
        >
          <Arrow className="decrease" />
        </button>
      </div>
      {(isRequired || invalid) && (
        <Tooltip
          className="range__warning"
          template={
            <TextTooltipTemplate
              text={
                invalid && inputValue.length > 0 ? invalidText : requiredText
              }
              warning
            />
          }
        >
          <Invalid className="range__warning-icon" />
        </Tooltip>
      )}
      {required && labelType === 'none' && (
        <span className="range-required_asterisk">*</span>
      )}
    </div>
  )
}

RangeInput.defaultProps = {
  density: 'normal',
  disabled: false,
  invalid: false,
  invalidText: 'This field is invalid',
  label: '',
  labelType: 'labelAtTop',
  max: undefined,
  min: 0,
  step: 1,
  tip: '',
  required: false,
  requiredText: 'This field is required'
}

RangeInput.propTypes = {
  density: PropTypes.oneOf(['dense', 'normal', 'medium', 'chunky']),
  disabled: PropTypes.bool,
  invalid: PropTypes.bool,
  invalidText: PropTypes.string,
  label: PropTypes.string,
  labelType: PropTypes.oneOf([
    'none',
    'floatingLabel',
    'infoLabel',
    'labelAtTop'
  ]),
  max: PropTypes.number,
  min: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  step: PropTypes.number,
  tip: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  required: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
}

export default React.memo(RangeInput)
