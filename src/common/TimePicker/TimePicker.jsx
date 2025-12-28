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
import React, { useEffect, useState, useRef, useCallback, useId } from 'react'
import PropTypes from 'prop-types'
import MaskedInput from 'react-text-mask'
import classNames from 'classnames'
import { throttle } from 'lodash'
import moment from 'moment'

import { DENSITY_OPTIONS } from 'igz-controls/types'
import { PopUpDialog } from 'igz-controls/components'
import { is12HourFormat } from './TimePicker.utils'
import TimePickerOptions from './TimePickerOptions'

import Caret from 'igz-controls/images/dropdown.svg?react'

import './timePicker.scss'

// Input and output always in 24-hour format HH:mm, but display in 12-hour format if needed
const TimePicker = ({
  className = '',
  density = 'normal',
  label = '',
  onBlur = () => {},
  onChange = () => {},
  onFocus = () => {},
  value
}) => {
  const [valueInput, setValueInput] = useState(
    value ? (is12HourFormat() ? moment(value, 'HH:mm').format('hh:mm A') : value) : ''
  )
  const [isDropDownMenuOpen, setIsDropDownMenuOpen] = useState(false)
  const timePickerRef = useRef()
  const dropdownRef = useRef()
  const buttonRef = useRef()
  const selectKey = useId()

  const wrapperClassNames = classNames('time-picker-container', className)
  const inputWrapperClassNames = classNames(
    'time-picker__wrapper',
    `time-picker__wrapper-${density}`,
    'time-picker__control'
  )

  useEffect(() => {
    setValueInput(
      value ? (is12HourFormat() ? moment(value, 'HH:mm').format('hh:mm A') : value) : ''
    )
  }, [value])

  const timeMask = value => {
    const chars = value.split('')
    let period = []
    let hours = [/[0-2]/, chars[0] === '2' ? /[0-3]/ : /[0-9]/]

    if (is12HourFormat()) {
      period = [/[ap]/i, /[m]/i]
      hours = [/[0-1]/, chars[0] === '1' ? /[0-2]/ : /[0-9]/]
    }

    const minutes = [/[0-5]/, /[0-9]/]

    return hours
      .concat(':')
      .concat(minutes)
      .concat(is12HourFormat() ? ' ' : '')
      .concat(period)
  }

  const handleInputChange = value => {
    const inputFormats = ['hh:mm A', 'h:mm A', 'HH:mm', 'H:mm']
    const parsedTime = moment(value, inputFormats, true)

    if (parsedTime.isValid()) {
      onChange(parsedTime.format('HH:mm'))
    }

    setValueInput(value)
    setIsDropDownMenuOpen(false)
  }

  const hideFiltersWizard = useCallback(event => {
    if (
      !event.target.closest('.time-picker__dropdown') &&
      event.target.closest('.time-picker__dropdown-button') !== buttonRef.current
    ) {
      setIsDropDownMenuOpen(false)
    }
  }, [])

  useEffect(() => {
    const throttledHideFiltersWizard = throttle(hideFiltersWizard, 500, {
      leading: true,
      trailing: true
    })
    window.addEventListener('click', hideFiltersWizard)
    window.addEventListener('scroll', throttledHideFiltersWizard, true)

    return () => {
      window.removeEventListener('click', hideFiltersWizard)
      window.removeEventListener('scroll', throttledHideFiltersWizard, true)
    }
  }, [hideFiltersWizard])

  return (
    <div ref={timePickerRef} className={wrapperClassNames}>
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
          onChange={event => handleInputChange(event.target.value)}
          onFocus={onFocus}
          value={valueInput}
          placeholder={`__:__${is12HourFormat() ? ' AM' : ''}`}
        />
        <div
          ref={buttonRef}
          className="time-picker__dropdown-button"
          onClick={() => setIsDropDownMenuOpen(state => !state)}
        >
          <Caret />
        </div>
      </div>
      {isDropDownMenuOpen && (
        <PopUpDialog
          key={selectKey}
          className="time-picker__dropdown"
          headerIsHidden
          customPosition={{
            element: timePickerRef,
            position: 'bottom-right'
          }}
          ref={dropdownRef}
          style={{ width: '116px' }}
        >
          <TimePickerOptions key={selectKey} handleInputChange={handleInputChange} />
        </PopUpDialog>
      )}
    </div>
  )
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
