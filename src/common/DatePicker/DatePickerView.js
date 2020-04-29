import React from 'react'
import PropTypes from 'prop-types'
import MaskedInput from 'react-text-mask'

import { ReactComponent as Arrow } from '../../images/back-arrow.svg'

const DatePickerView = React.forwardRef(
  (
    {
      autoCorrectedDatePipe,
      calendar,
      close,
      date,
      isTopPosition,
      maskDate,
      months,
      onChange,
      onInputChange,
      onNextMonth,
      onPreviousMonth,
      openDatePicker,
      selectedDate,
      setOpenDatePicker,
      setSelectedDate,
      valueDatePickerInput,
      weekDay
    },
    ref
  ) => (
    <>
      <div
        className="date-picker_input"
        onClick={() => setOpenDatePicker(true)}
      >
        <MaskedInput
          className={`input input-wrapper ${valueDatePickerInput.length > 1 &&
            'active-input'}`}
          keepCharPositions={true}
          mask={maskDate}
          onChange={onInputChange}
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
        <div
          ref={ref}
          className={`date-picker_body ${
            isTopPosition ? 'positionTop' : 'positionBottom'
          }`}
        >
          <div className="date-picker-header">
            <Arrow className="previous-month" onClick={onPreviousMonth} />
            <div>
              <span className="date-picker-header_month">
                {months[date.getMonth()]}
              </span>
              <span className="date-picker-header_year">
                {date.getFullYear()}
              </span>
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
                      : 'not-current-month'
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
      )}
    </>
  )
)

DatePickerView.propTypes = {
  autoCorrectedDatePipe: PropTypes.func.isRequired,
  calendar: PropTypes.array.isRequired,
  close: PropTypes.func.isRequired,
  date: PropTypes.instanceOf(Date),
  isTopPosition: PropTypes.bool.isRequired,
  maskDate: PropTypes.array.isRequired,
  months: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onNextMonth: PropTypes.func.isRequired,
  onPreviousMonth: PropTypes.func.isRequired,
  openDatePicker: PropTypes.bool.isRequired,
  selectedDate: PropTypes.instanceOf(Date),
  setOpenDatePicker: PropTypes.func.isRequired,
  setSelectedDate: PropTypes.func.isRequired,
  valueDatePickerInput: PropTypes.string.isRequired,
  weekDay: PropTypes.array.isRequired
}

export default DatePickerView
