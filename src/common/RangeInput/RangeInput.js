import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Input from '../Input/Input'

import { ReactComponent as Arrow } from '../../images/range-arrow-small.svg'

import './rangeInput.scss'

const RangeInput = ({
  density,
  disabled,
  floatingLabel,
  infoLabel,
  label,
  max,
  min,
  onChange,
  value
}) => {
  const [inputValue, setInputValue] = useState(value)
  const rangeClassName = classNames('range', `range-${density}`)

  const handleIncrease = () => {
    if (inputValue >= max) return

    setInputValue(prev => ++prev)
    onChange(+inputValue + 1)
  }

  const handleDecrease = () => {
    if (inputValue <= 0 || inputValue <= min) return

    setInputValue(prev => --prev)
    onChange(+inputValue - 1)
  }

  return (
    <div data-testid="range-input-container" className={rangeClassName}>
      <Input
        className="range__input"
        density={density}
        disabled={disabled}
        floatingLabel={floatingLabel}
        infoLabel={infoLabel}
        label={label}
        onChange={value => {
          setInputValue(value)
          onChange(value)
        }}
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
    </div>
  )
}

RangeInput.defaultProps = {
  density: 'normal',
  disabled: false,
  floatingLabel: false,
  infoLabel: false,
  label: '',
  max: undefined,
  min: 0
}

RangeInput.propTypes = {
  density: PropTypes.oneOf(['dense', 'normal', 'medium', 'chunky']),
  disabled: PropTypes.bool,
  floatingLabel: PropTypes.bool,
  infoLabel: PropTypes.bool,
  label: PropTypes.string,
  max: PropTypes.number,
  min: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
}

export default React.memo(RangeInput)
