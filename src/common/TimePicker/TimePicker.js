import React, { useState } from 'react'
import PropTypes from 'prop-types'
import MaskedInput from 'react-text-mask'

import './timePicker.scss'

const TimePicker = ({ value, onChange }) => {
  const [valueInput, setValueInput] = useState(value)

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
      <span
        className={`time-picker_input_label ${value.length > 0 &&
          'focus-input'}`}
      >
        Time
      </span>
      <MaskedInput
        className="input input-wrapper"
        keepCharPositions
        value={valueInput}
        mask={timeMask}
        onChange={onHandleInputChange}
      />
    </div>
  )
}

TimePicker.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default TimePicker
