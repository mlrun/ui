import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
  useReducer
} from 'react'
import PropTypes from 'prop-types'

import DatePickerView from './DatePickerView'
import { createAutoCorrectedDatePipe } from '../../utils/createAutoCorrectedDatePipe'
import {
  datesDivider,
  decodeLocale,
  formatDate,
  generateCalendar,
  getDateMask,
  getDatePipe,
  getDateRegEx,
  getWeekDays,
  getWeekStart,
  months
} from '../../utils/datePicker.util'
import {
  initialState,
  datePickerActions,
  datePickerReducer
} from './datePickerReducer'

import './datePicker.scss'

const DatePicker = ({
  date,
  dateTo,
  label,
  onChange,
  splitCharacter,
  type
}) => {
  const [datePickerState, datePickerDispatch] = useReducer(
    datePickerReducer,
    initialState
  )
  const [isTopPosition, setIsTopPosition] = useState(false)
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [isRange] = useState(type.includes('range'))
  const [isTime] = useState(type.includes('time'))
  const [isCalendarInvalid, setIsCalendarInvalid] = useState(false)
  const [valueDatePickerInput, setValueDatePickerInput] = useState(
    formatDate(isRange, isTime, splitCharacter, date, dateTo)
  )

  const datePickerRef = React.createRef()
  const datePickerViewRef = useRef()
  const dateMask = getDateMask(isRange, isTime, splitCharacter)
  const autoCorrectedDatePipe = createAutoCorrectedDatePipe(
    getDatePipe(isRange, isTime),
    undefined,
    isRange && datesDivider
  )
  const dateRegEx = getDateRegEx(dateMask)
  const startWeek = getWeekStart(decodeLocale(navigator.language))

  const handleCloseDatePickerOutside = useCallback(
    event => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        datePickerDispatch({
          type: datePickerActions.UPDATE_VISIBLE_DATE_FROM,
          payload: datePickerState.configFrom.date
        })

        if (isRange) {
          datePickerDispatch({
            type: datePickerActions.UPDATE_VISIBLE_DATE_TO,
            payload: datePickerState.configTo.date
          })
        }

        setOpenDatePicker(false)
      }
    },
    [
      datePickerRef,
      datePickerState.configFrom.date,
      datePickerState.configTo.date,
      isRange
    ]
  )

  const isSameDate = (firstDate, secondDate) => {
    return (
      firstDate.getDate() === secondDate.getDate() &&
      firstDate.getMonth() === secondDate.getMonth() &&
      firstDate.getFullYear() === secondDate.getFullYear()
    )
  }

  useLayoutEffect(() => {
    if (openDatePicker) {
      const { top, bottom } = datePickerViewRef.current.getBoundingClientRect()
      if (
        bottom > window.innerHeight &&
        top > datePickerViewRef.current.offsetHeight
      ) {
        setIsTopPosition(true)
      }
    } else {
      setIsTopPosition(false)
    }
  }, [openDatePicker])

  useEffect(() => {
    datePickerDispatch({
      type: datePickerActions.UPDATE_DATE_FROM,
      payload: date || new Date()
    })
  }, [date])

  useEffect(() => {
    datePickerDispatch({
      type: datePickerActions.UPDATE_DATE_TO,
      payload: dateTo || new Date()
    })
  }, [dateTo])

  useEffect(() => {
    if (date) {
      setValueDatePickerInput(
        formatDate(isRange, isTime, splitCharacter, date, dateTo)
      )
    }
  }, [date, dateTo, isRange, isTime, splitCharacter])

  useEffect(() => {
    let isCalendarInvalid = false

    if (
      isRange &&
      datePickerState.configFrom.selectedDate &&
      datePickerState.configTo.selectedDate
    ) {
      isCalendarInvalid =
        datePickerState.configFrom.selectedDate.getTime() >
        datePickerState.configTo.selectedDate.getTime()
    }

    setIsCalendarInvalid(isCalendarInvalid)
  }, [
    datePickerState.configFrom.selectedDate,
    datePickerState.configTo.selectedDate,
    isRange
  ])

  useEffect(() => {
    datePickerDispatch({
      type: datePickerActions.UPDATE_CALENDAR_FROM,
      payload: generateCalendar(
        datePickerState.configFrom.visibleDate || new Date(),
        startWeek
      )
    })
  }, [datePickerState.configFrom.visibleDate, startWeek])

  useEffect(() => {
    datePickerDispatch({
      type: datePickerActions.UPDATE_CALENDAR_TO,
      payload: generateCalendar(
        datePickerState.configTo.visibleDate || new Date(),
        startWeek
      )
    })
  }, [datePickerState.configTo.visibleDate, startWeek])

  useEffect(() => {
    if (openDatePicker) {
      window.addEventListener('click', handleCloseDatePickerOutside)
      return () =>
        window.removeEventListener('click', handleCloseDatePickerOutside)
    }
  }, [handleCloseDatePickerOutside, openDatePicker])

  const isRangeDateValid = day => {
    const dateFromMs = new Date(
      datePickerState.configFrom.selectedDate
    ).setHours(0, 0, 0, 0)
    const dateToMs = new Date(datePickerState.configTo.selectedDate).setHours(
      0,
      0,
      0,
      0
    )
    const dayMs = day.setHours(0, 0, 0, 0)

    return isRange && dayMs >= dateFromMs && dayMs <= dateToMs
  }

  const onChangeNextMonth = configId => {
    datePickerDispatch({
      type:
        datePickerActions[
          configId === 'configFrom'
            ? 'UPDATE_VISIBLE_DATE_FROM'
            : 'UPDATE_VISIBLE_DATE_TO'
        ],
      payload: new Date(
        datePickerState[configId].visibleDate.getFullYear(),
        datePickerState[configId].visibleDate.getMonth() + 1,
        datePickerState[configId].visibleDate.getDate()
      )
    })
  }

  const onChangePreviousMonth = configId => {
    datePickerDispatch({
      type:
        datePickerActions[
          configId === 'configFrom'
            ? 'UPDATE_VISIBLE_DATE_FROM'
            : 'UPDATE_VISIBLE_DATE_TO'
        ],
      payload: new Date(
        datePickerState[configId].visibleDate.getFullYear(),
        datePickerState[configId].visibleDate.getMonth() - 1,
        datePickerState[configId].visibleDate.getDate()
      )
    })
  }

  const onDatePickerChange = () => {
    datePickerDispatch({
      type: datePickerActions.UPDATE_VISIBLE_DATE_FROM,
      payload: datePickerState.configFrom.selectedDate || new Date()
    })

    if (isRange) {
      datePickerDispatch({
        type: datePickerActions.UPDATE_VISIBLE_DATE_TO,
        payload: datePickerState.configTo.selectedDate || new Date()
      })
    }

    setValueDatePickerInput(
      formatDate(
        isRange,
        isTime,
        splitCharacter,
        datePickerState.configFrom.selectedDate,
        datePickerState.configTo.selectedDate
      )
    )
    setOpenDatePicker(false)

    let dates = [new Date(datePickerState.configFrom.selectedDate)]

    if (isRange) {
      dates.push(new Date(datePickerState.configTo.selectedDate))
    }

    onChange(dates)
  }

  const onInputDatePickerChange = event => {
    setValueDatePickerInput(event.target.value)
    openDatePicker !== true && setOpenDatePicker(true)

    if (new RegExp(dateRegEx).test(event.target.value)) {
      const dates = event.target.value
        .split(datesDivider)
        .map(date => new Date(date))

      onChange(dates)
    }
  }

  const onInputDatePickerClick = () => {
    setOpenDatePicker(true)
    datePickerDispatch({
      type: datePickerActions.UPDATE_SELECTED_DATE_FROM,
      payload: date || new Date()
    })

    if (isRange) {
      datePickerDispatch({
        type: datePickerActions.UPDATE_SELECTED_DATE_TO,
        payload: dateTo || new Date()
      })
    }
  }

  const onTimeChange = (configId, time, selectedDate) => {
    if (/\d\d:\d\d/.test(time)) {
      let timeParsed = time.split(':')

      setSelectedDate(
        configId,
        new Date(
          new Date(selectedDate).setHours(
            parseInt(timeParsed[0]),
            parseInt(timeParsed[1])
          )
        )
      )
    }
  }

  const setSelectedDate = (configId, newDate, selectedDate) => {
    datePickerDispatch({
      type:
        datePickerActions[
          configId === 'configFrom'
            ? 'UPDATE_SELECTED_DATE_FROM'
            : 'UPDATE_SELECTED_DATE_TO'
        ],
      payload: selectedDate
        ? new Date(
            newDate.setHours(
              selectedDate.getHours(),
              selectedDate.getMinutes(),
              selectedDate.getSeconds(),
              selectedDate.getMilliseconds()
            )
          )
        : newDate
    })
  }

  return (
    <div
      data-testid="date-picker-container"
      className="date-picker-container"
      ref={datePickerRef}
    >
      <DatePickerView
        autoCorrectedDatePipe={autoCorrectedDatePipe}
        config={
          isRange
            ? [datePickerState.configFrom, datePickerState.configTo]
            : [datePickerState.configFrom]
        }
        dateMask={dateMask}
        isCalendarInvalid={isCalendarInvalid}
        isRange={isRange}
        isRangeDateValid={isRangeDateValid}
        isSameDate={isSameDate}
        isTime={isTime}
        isTopPosition={isTopPosition}
        label={label}
        months={months}
        onApplyChanges={onDatePickerChange}
        onInputChange={onInputDatePickerChange}
        onInputClick={onInputDatePickerClick}
        onNextMonth={onChangeNextMonth}
        onPreviousMonth={onChangePreviousMonth}
        onTimeChange={onTimeChange}
        openDatePicker={openDatePicker}
        ref={datePickerViewRef}
        setSelectedDate={setSelectedDate}
        valueDatePickerInput={valueDatePickerInput}
        weekDay={getWeekDays(startWeek)}
      />
    </div>
  )
}
DatePicker.defaultProps = {
  label: 'Date',
  type: 'date'
}

DatePicker.propTypes = {
  date: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string])
    .isRequired,
  dateTo: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  splitCharacter: PropTypes.oneOf(['/', '.']).isRequired,
  type: PropTypes.oneOf(['date', 'date-time', 'date-range', 'date-range-time'])
}

export default React.memo(DatePicker, (prev, next) => prev.date === next.date)
