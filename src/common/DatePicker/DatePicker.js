import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useLayoutEffect
} from 'react'
import MaskedInput from 'react-text-mask'
import PropTypes from 'prop-types'

import DatePickerView from './DatePickerView'

import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe'
import {
  decodeLocale,
  formatDate,
  generateCalendar,
  getWeekDays,
  getWeekStart,
  months
} from '../../utils/datePicker.util'

import './datePicker.scss'

const DatePicker = ({ onChange, splitCharacter, value }) => {
  const [date, setDate] = useState(value || new Date())
  const [isTopPosition, setIsTopPosition] = useState(false)
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState(value || new Date())
  const [valueDatePickerInput, setValueDatePickerInput] = useState(
    formatDate(value, splitCharacter)
  )

  const datePickerRef = useRef()
  const maskDate = [
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
  ]
  const autoCorrectedDatePipe = createAutoCorrectedDatePipe('mm/dd/yyyy')
  const startWeek = getWeekStart(decodeLocale(navigator.language))

  const calendar = useMemo(() => {
    return generateCalendar(date || new Date(), startWeek)
  }, [date, startWeek])

  const handleCloseDatePickerOutside = useCallback(
    event => {
      if (!event.path.includes(datePickerRef.current)) {
        setOpenDatePicker(false)
        setDate(selectedDate || new Date())
      }
    },
    [selectedDate]
  )

  useLayoutEffect(() => {
    if (openDatePicker) {
      const datePickerBody = [...datePickerRef.current.children].find(item =>
        item.className.includes('date-picker_body')
      )
      const { bottom } = datePickerBody.getBoundingClientRect()
      if (bottom > window.innerHeight) {
        setIsTopPosition(true)
      }
    } else {
      setIsTopPosition(false)
    }
  }, [openDatePicker])

  useEffect(() => {
    if (openDatePicker) {
      window.addEventListener('click', handleCloseDatePickerOutside)
      return () =>
        window.removeEventListener('click', handleCloseDatePickerOutside)
    }
  }, [handleCloseDatePickerOutside, openDatePicker])

  const onChangePreviousMonth = () => {
    setDate(new Date(date.setMonth(date.getMonth() - 1)))
  }

  const onChangeNextMonth = () => {
    setDate(new Date(date.setMonth(date.getMonth() + 1)))
  }

  const onHandleDatePickerChange = selectedValue => {
    setSelectedDate(selectedValue)
    setValueDatePickerInput(formatDate(selectedValue))
    onChange(new Date(selectedValue))
  }

  const onHandleInputDatePickerChange = event => {
    setValueDatePickerInput(event.target.value)
    openDatePicker !== true && setOpenDatePicker(true)

    if (/^\d{2}.\d{2}.\d{4}$/.test(event.target.value)) {
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
        <MaskedInput
          className={`input input-wrapper ${valueDatePickerInput.length > 1 &&
            'active-input'}`}
          keepCharPositions={true}
          mask={maskDate}
          onChange={onHandleInputDatePickerChange}
          pipe={autoCorrectedDatePipe}
          value={valueDatePickerInput}
        />
        <span
          className={`input__label input__label-floating ${valueDatePickerInput.length >
            1 && 'active-label'}`}
        >
          Date
        </span>
      </div>
      {openDatePicker && (
        <DatePickerView
          calendar={calendar}
          close={setOpenDatePicker}
          date={date || new Date()}
          isTopPosition={isTopPosition}
          months={months}
          onChange={onHandleDatePickerChange}
          onNextMonth={onChangeNextMonth}
          onPreviousMonth={onChangePreviousMonth}
          selectedDate={selectedDate || new Date()}
          setSelectedDate={setSelectedDate}
          startWeek={startWeek}
          weekDay={getWeekDays(startWeek)}
        />
      )}
    </div>
  )
}

DatePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  splitCharacter: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.instanceOf(Date).isRequired,
    PropTypes.string
  ]).isRequired
}

export default DatePicker
