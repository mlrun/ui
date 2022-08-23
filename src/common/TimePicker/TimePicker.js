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
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import MaskedInput from 'react-text-mask'
import classNames from 'classnames'

import './timePicker.scss'

const TimePicker = ({ onChange, value, hideLabel }) => {
  const [valueInput, setValueInput] = useState(value)

  const timePickerClassName = classNames(
    'input input-wrapper',
    valueInput.length > 1 && !hideLabel && 'active-input'
  )

  const labelClassName = classNames(
    'input__label',
    'input__label-floating',
    valueInput.length > 1 && 'active-label'
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

  const onHandleInputChange = event => {
    setValueInput(event.target.value)
    onChange(event.target.value)
  }

  return (
    <div data-testid="time-picker" className="time-picker-container">
      {!hideLabel && <span className={labelClassName}>Time</span>}
      <MaskedInput
        className={timePickerClassName}
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
