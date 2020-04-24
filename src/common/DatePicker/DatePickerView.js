import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import { ReactComponent as Arrow } from '../../images/back-arrow.svg'

const DatePickerView = ({
  calendar,
  close,
  date,
  months,
  onChange,
  onNextMonth,
  onPreviousMonth,
  selectedDate,
  setSelectedDate,
  weekDay
}) => {
  const [isTopPosition, setIsTopPosition] = useState(false)
  const datePickerRef = useRef()

  useEffect(() => {
    if (datePickerRef.current) {
      const { bottom } = datePickerRef.current.getBoundingClientRect()
      if (bottom > window.innerHeight) {
        setIsTopPosition(true)
      }
    }
  }, [])

  return (
    <div
      className={`date-picker_body ${isTopPosition && 'positionTop'}`}
      ref={datePickerRef}
    >
      <div className="date-picker-header">
        <Arrow className="previous-month" onClick={onPreviousMonth} />
        <div>
          <span className="date-picker-header_month">
            {months[date.getMonth()]}
          </span>
          <span className="date-picker-header_year">{date.getFullYear()}</span>
        </div>
        <Arrow className="next-month" onClick={onNextMonth} />
      </div>
      <div className="date-picker_body_weeks">
        {weekDay.map((day, index) => {
          return (
            <div key={day + index} className="date-picker_body_weeks_day">
              {day.label}
            </div>
          )
        })}
      </div>
      {calendar.map(({ week }, index) => (
        <div
          key={week[0].day.getMonth() + index}
          className="date-picker_body_week"
        >
          {week.map(({ day }) => (
            <div
              key={day.getMonth() + day.getDate() + day.getFullYear()}
              className={`date-picker_body_week_day ${
                date.getMonth() === day.getMonth()
                  ? 'current-month'
                  : 'not-current_month'
              } ${selectedDate.getDate() === day.getDate() &&
                selectedDate.getMonth() === day.getMonth() &&
                'selected'}`}
              onClick={() => {
                date.getMonth() === day.getMonth() && setSelectedDate(day)
              }}
            >
              {day.getDate()}
            </div>
          ))}
        </div>
      ))}
      <button
        className="btn-date-picker"
        onClick={() => {
          onChange(selectedDate)
          close(false)
        }}
      >
        Apply
      </button>
    </div>
  )
}

DatePickerView.propTypes = {
  calendar: PropTypes.array.isRequired,
  close: PropTypes.func.isRequired,
  date: PropTypes.any,
  months: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onNextMonth: PropTypes.func.isRequired,
  onPreviousMonth: PropTypes.func.isRequired,
  selectedDate: PropTypes.oneOfType([PropTypes.any, PropTypes.shape({})]),
  setSelectedDate: PropTypes.func.isRequired,
  weekDay: PropTypes.array.isRequired
}

export default DatePickerView
