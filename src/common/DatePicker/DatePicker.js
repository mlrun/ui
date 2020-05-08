import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useLayoutEffect
} from 'react'
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
  const datePickerViewRef = useRef()
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
      const { bottom } = datePickerViewRef.current.getBoundingClientRect()
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
      <DatePickerView
        autoCorrectedDatePipe={autoCorrectedDatePipe}
        calendar={calendar}
        close={setOpenDatePicker}
        date={date || new Date()}
        isTopPosition={isTopPosition}
        maskDate={maskDate}
        months={months}
        onChange={onHandleDatePickerChange}
        onInputChange={onHandleInputDatePickerChange}
        onNextMonth={onChangeNextMonth}
        onPreviousMonth={onChangePreviousMonth}
        openDatePicker={openDatePicker}
        ref={datePickerViewRef}
        selectedDate={selectedDate || new Date()}
        setOpenDatePicker={setOpenDatePicker}
        setSelectedDate={setSelectedDate}
        startWeek={startWeek}
        valueDatePickerInput={valueDatePickerInput}
        weekDay={getWeekDays(startWeek)}
      />
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

export default React.memo(DatePicker, (prev, next) => prev.value === next.value)
