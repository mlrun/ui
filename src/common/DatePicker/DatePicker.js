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
import { DATE_FILTER_ANY_TIME } from '../../constants'
import { createAutoCorrectedDatePipe } from '../../utils/createAutoCorrectedDatePipe'
import {
  datesDivider,
  datePickerOptions,
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

const DatePicker = ({
  className,
  date,
  dateTo,
  disabled,
  invalid,
  invalidText,
  label,
  onBlur,
  onChange,
  required,
  requiredText,
  setInvalid,
  splitCharacter,
  tip,
  type,
  withOptions
}) => {
  const [datePickerState, datePickerDispatch] = useReducer(
    datePickerReducer,
    initialState
  )
  const [isCalendarInvalid, setIsCalendarInvalid] = useState(false)
  const [isDatePickerOpened, setIsDatePickerOpened] = useState(false)
  const [isDatePickerOptionsOpened, setIsDatePickerOptionsOpened] = useState(
    false
  )
  const [isRange] = useState(type.includes('range'))
  const [isTime] = useState(type.includes('time'))
  const [isTopPosition, setIsTopPosition] = useState(false)
  const [isValueEmpty, setIsValueEmpty] = useState(true)
  const [valueDatePickerInput, setValueDatePickerInput] = useState(
    formatDate(isRange, isTime, splitCharacter, date, dateTo)
  )
  const [isInvalid, setIsInvalid] = useState(false)

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
        if (isDatePickerOptionsOpened) {
          setIsDatePickerOptionsOpened(false)
        } else if (isDatePickerOpened) {
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

          setIsDatePickerOpened(false)
        }
      }
    },
    [
      datePickerRef,
      datePickerState.configFrom.date,
      datePickerState.configTo.date,
      isDatePickerOpened,
      isDatePickerOptionsOpened,
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

  const getInputValueValidity = useCallback(value => {
    const inputValue = value.replace(/[_\-:/\s]/g, '')
    return inputValue.length === 0
  }, [])

  useLayoutEffect(() => {
    if (isDatePickerOpened) {
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
  }, [isDatePickerOpened])

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
    setValueDatePickerInput(
      formatDate(isRange, isTime, splitCharacter, date, dateTo)
    )
  }, [date, dateTo, isRange, isTime, splitCharacter])

  useEffect(() => {
    const isInputValueEmpty = getInputValueValidity(valueDatePickerInput)
    setIsValueEmpty(withOptions && isInputValueEmpty)

    isInputValueEmpty && setIsDatePickerOpened(false)
  }, [getInputValueValidity, valueDatePickerInput, withOptions])

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
    if (isDatePickerOpened || isDatePickerOptionsOpened) {
      window.addEventListener('click', handleCloseDatePickerOutside)
      return () =>
        window.removeEventListener('click', handleCloseDatePickerOutside)
    }
  }, [
    handleCloseDatePickerOutside,
    isDatePickerOpened,
    isDatePickerOptionsOpened
  ])

  useEffect(() => {
    if (isInvalid !== invalid) {
      if (required && getInputValueValidity(valueDatePickerInput)) {
        setIsInvalid(true)
        setInvalid && setInvalid(false)
      } else {
        setIsInvalid(invalid)
      }
    }
  }, [
    getInputValueValidity,
    invalid,
    isInvalid,
    required,
    setInvalid,
    valueDatePickerInput
  ])

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
    setIsDatePickerOpened(false)
    setIsInvalid(false)
    setInvalid && setInvalid(true)

    let dates = [new Date(datePickerState.configFrom.selectedDate)]

    if (isRange) {
      dates.push(new Date(datePickerState.configTo.selectedDate))
    }

    onChange(dates)
  }

  const onInputDatePickerChange = event => {
    setValueDatePickerInput(event.target.value)
    isDatePickerOptionsOpened && setIsDatePickerOptionsOpened(false)
    let isValueEmpty = getInputValueValidity(event.target.value)

    if (new RegExp(dateRegEx).test(event.target.value) || isValueEmpty) {
      let dates = DATE_FILTER_ANY_TIME

      if (!isValueEmpty) {
        dates = event.target.value
          .split(datesDivider)
          .map(date => new Date(date))

        setIsInvalid(false)
        setInvalid && setInvalid(true)
      } else if (required) {
        setIsInvalid(true)
        setInvalid && setInvalid(false)
      }

      onChange(dates)
    }
  }

  const datePickerInputOnBlur = event => {
    let isValueEmpty = getInputValueValidity(event.target.value)

    if (new RegExp(dateRegEx).test(event.target.value) || isValueEmpty) {
      let dates = DATE_FILTER_ANY_TIME

      if (!isValueEmpty) {
        dates = event.target.value
          .split(datesDivider)
          .map(date => new Date(date))
      }

      onBlur(dates)
    }
  }

  const onInputDatePickerClick = () => {
    if (!disabled) {
      if (withOptions && !isDatePickerOpened) {
        setIsDatePickerOptionsOpened(true)
      } else {
        setIsDatePickerOpened(true)
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

  const onSelectOption = option => {
    if (option.handler) {
      onChange(option.handler(), option.isPredefined)
    } else {
      setIsDatePickerOpened(true)
    }

    setIsDatePickerOptionsOpened(false)
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
    <DatePickerView
      autoCorrectedDatePipe={autoCorrectedDatePipe}
      className={className}
      config={
        isRange
          ? [datePickerState.configFrom, datePickerState.configTo]
          : [datePickerState.configFrom]
      }
      dateMask={dateMask}
      datePickerInputOnBlur={datePickerInputOnBlur}
      datePickerOptions={datePickerOptions}
      disabled={disabled}
      getInputValueValidity={getInputValueValidity}
      invalidText={invalidText}
      isCalendarInvalid={isCalendarInvalid}
      isDatePickerOpened={isDatePickerOpened}
      isDatePickerOptionsOpened={isDatePickerOptionsOpened}
      isInvalid={isInvalid}
      isRange={isRange}
      isRangeDateValid={isRangeDateValid}
      isSameDate={isSameDate}
      isTime={isTime}
      isTopPosition={isTopPosition}
      isValueEmpty={isValueEmpty}
      label={label}
      months={months}
      onApplyChanges={onDatePickerChange}
      onInputChange={onInputDatePickerChange}
      onInputClick={onInputDatePickerClick}
      onNextMonth={onChangeNextMonth}
      onPreviousMonth={onChangePreviousMonth}
      onSelectOption={onSelectOption}
      onTimeChange={onTimeChange}
      ref={{ datePickerRef, datePickerViewRef }}
      required={required}
      requiredText={requiredText}
      setSelectedDate={setSelectedDate}
      tip={tip}
      valueDatePickerInput={valueDatePickerInput}
      weekDay={getWeekDays(startWeek)}
    />
  )
}
DatePicker.defaultProps = {
  className: '',
  dateTo: new Date(),
  disabled: false,
  invalid: false,
  invalidText: 'This field is invalid',
  label: 'Date',
  onBlur: () => {},
  required: false,
  requiredText: 'This field is required',
  setInvalid: () => {},
  splitCharacter: '/',
  tip: '',
  type: 'date',
  withOptions: false
}

DatePicker.propTypes = {
  className: PropTypes.string,
  date: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string])
    .isRequired,
  dateTo: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  disabled: PropTypes.bool,
  invalid: PropTypes.bool,
  invalidText: PropTypes.string,
  label: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  requiredText: PropTypes.string,
  setInvalid: PropTypes.func,
  splitCharacter: PropTypes.oneOf(['/', '.']),
  tip: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  type: PropTypes.oneOf(['date', 'date-time', 'date-range', 'date-range-time']),
  withOptions: PropTypes.bool
}

export default React.memo(
  DatePicker,
  (prev, next) => prev.date === next.date && prev.onChange === next.onChange
)
