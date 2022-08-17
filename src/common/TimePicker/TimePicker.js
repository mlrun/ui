import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import MaskedInput from 'react-text-mask'
import classNames from 'classnames'

import { DENSITY_OPTIONS } from '../../types'

import './timePicker.scss'

const TimePicker = ({ className, density, label, onBlur, onChange, onFocus, value }) => {
  const [valueInput, setValueInput] = useState(value)

  const wrapperClassNames = classNames('time-picker-container', className)
  const inputWrapperClassNames = classNames(
    'time-picker__wrapper',
    `time-picker__wrapper-${density}`,
    'time-picker__control'
  )

  useEffect(() => {
    setValueInput(value)
  }, [value])

  const timeMask = value => {
    const chars = value.split('')
    const hours = [/[0-2]/, chars[0] === '2' ? /[0-3]/ : /[0-9]/]

    const minutes = [/[0-5]/, /[0-9]/]

    return hours.concat(':').concat(minutes)
  }

  const handleInputChange = event => {
    setValueInput(event.target.value)
    onChange(event.target.value)
  }

  return (
    <div className={wrapperClassNames}>
      {label && (
        <div className="time-picker__label">
          <label data-testid="label">{label}</label>
        </div>
      )}
      <div data-testid="time-picker" className={inputWrapperClassNames}>
        <MaskedInput
          keepCharPositions
          mask={timeMask}
          onBlur={onBlur}
          onChange={handleInputChange}
          onFocus={onFocus}
          value={valueInput}
          placeholder="__:__"
        />
      </div>
    </div>
  )
}

TimePicker.defaultProps = {
  className: '',
  density: 'normal',
  label: '',
  onBlur: () => {},
  onChange: () => {},
  onFocus: () => {}
}

TimePicker.propTypes = {
  className: PropTypes.string,
  density: DENSITY_OPTIONS,
  label: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  value: PropTypes.string.isRequired
}

export default TimePicker
