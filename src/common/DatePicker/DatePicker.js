import React, { useState, useRef, useEffect, useMemo } from 'react'
import MaskedInput from 'react-text-mask'
import PropTypes from 'prop-types'

import DatePickerView from './DatePickerView'

import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe'
import {
  generateCalendar,
  decodeLocale,
  months,
  weekStart,
  weeksDay,
  dateFormat
} from './datePicker.util'

import './datePicker.scss'

const DatePicker = ({ value, onChange, splitCharacter }) => {
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [date, setDate] = useState(value || new Date())
  const [selectedDate, setSelectedDate] = useState(value || new Date())
  const [valueDatePickerInput, setValueDatePickerInput] = useState(
    dateFormat(value, splitCharacter)
  )
  const datePickerRef = useRef()

  const startWeek = weekStart(decodeLocale(navigator.language))

  const calendar = useMemo(() => {
    return generateCalendar(date || new Date(), startWeek)
  }, [date, startWeek])

  const handleCloseDatePickerOutside = event => {
    if (!event.path.includes(datePickerRef.current)) {
      setOpenDatePicker(false)
    }
  }

  useEffect(() => {
    if (openDatePicker) {
      window.addEventListener('click', handleCloseDatePickerOutside)
      return () =>
        window.removeEventListener('click', handleCloseDatePickerOutside)
    }
  }, [openDatePicker])

  const onChangePreviousMonth = () => {
    setDate(new Date(date.setMonth(date.getMonth() - 1)))
  }

  const onChangeNextMonth = () => {
    setDate(new Date(date.setMonth(date.getMonth() + 1)))
  }

  const onHandleDatePickerChange = selectedValue => {
    onChange(new Date(selectedValue))
    setSelectedDate(selectedValue)
    setValueDatePickerInput(dateFormat(selectedValue))
  }

  const onHandleInputDatePickerChange = event => {
    openDatePicker === false && setOpenDatePicker(true)
    setValueDatePickerInput(event.target.value)
    if (
      !Object.is(Date.parse(event.target.value), NaN) &&
      /^\d{2}.\d{2}.\d{4}$/.test(event.target.value)
    ) {
      setDate(new Date(event.target.value))
      setSelectedDate(new Date(event.target.value))
    }
  }

  return (
    <div className="date-picker-container" ref={datePickerRef}>
      <div
        className="date-picker_input"
        onClick={() => setOpenDatePicker(true)}
      >
        <span
          className={`date-picker_input_label ${valueDatePickerInput.length >
            0 && 'focus-input'}`}
        >
          Date
        </span>
        <MaskedInput
          mask={[
            /\d/,
            /\d/,
            splitCharacter,
            /\d/,
            /\d/,
            splitCharacter,
            /\d/,
            /\d/,
            /\d/,
            /\d/
          ]}
          pipe={createAutoCorrectedDatePipe('mm/dd/yyyy')}
          keepCharPositions
          value={valueDatePickerInput}
          onChange={onHandleInputDatePickerChange}
          className="input input-wrapper"
        />
      </div>
      {openDatePicker && (
        <DatePickerView
          calendar={calendar}
          close={setOpenDatePicker}
          date={date || new Date()}
          months={months}
          onChange={onHandleDatePickerChange}
          onNextMonth={onChangeNextMonth}
          onPreviousMonth={onChangePreviousMonth}
          selectedDate={selectedDate || new Date()}
          setSelectedDate={setSelectedDate}
          startWeek={startWeek}
          weekDay={weeksDay(startWeek)}
        />
      )}
    </div>
  )
}

DatePicker.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  splitCharacter: PropTypes.string.isRequired
}

export default DatePicker
