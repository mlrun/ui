import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import MaskedInput from 'react-text-mask'

import './timePicker.scss'

const TimePicker = ({ onChange, value, hideLabel }) => {
  const [valueInput, setValueInput] = useState(value)

  useEffect(() => {
    setValueInput(value)
  }, [value])

  const timeMask = value => {
    const chars = value.split('')
    const hours = [/[0-2]/, chars[0] === '2' ? /[0-3]/ : /[0-9]/]

    const minutes = [/[0-5]/, /[0-9]/]

    return hours.concat(':').concat(minutes)
  }

  const onHandleInputChange = event => {
    setValueInput(event.target.value)
    onChange(event.target.value)
  }

  return (
    <div className="time-picker-container">
      {!hideLabel && (
        <span
          className={`input__label input__label-floating ${valueInput.length >
            1 && 'active-label'}`}
        >
          Time
        </span>
      )}
      <MaskedInput
        className={`input input-wrapper ${valueInput.length > 1 &&
          !hideLabel &&
          'active-input'}`}
        keepCharPositions
        mask={timeMask}
        onChange={onHandleInputChange}
        value={valueInput}
      />
    </div>
  )
}

TimePicker.propTypes = {
  hideLabel: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
}

export default TimePicker
