import React from 'react'
import PropTypes from 'prop-types'
import MaskedInput from 'react-text-mask'
import classnames from 'classnames'

import { ReactComponent as Arrow } from '../../images/arrow.svg'
import Button from '../Button/Button'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import TimePicker from '../TimePicker/TimePicker'

const DatePickerView = React.forwardRef(
  (
    {
      autoCorrectedDatePipe,
      config,
      dateMask,
      isCalendarInvalid,
      isRange,
      isRangeDateValid,
      isSameDate,
      isTime,
      isTopPosition,
      label,
      months,
      onApplyChanges,
      onInputChange,
      onInputClick,
      onNextMonth,
      onPreviousMonth,
      onTimeChange,
      openDatePicker,
      setSelectedDate,
      valueDatePickerInput,
      weekDay
    },
    ref
  ) => {
    const inputClassNames = classnames(
      'input',
      'date-picker__input',
      'active-input',
      isRange && 'long-input'
    )
    const inputLabelClassNames = classnames('input__label', 'active-label')

    return (
      <>
        <div
          data-testid="date-picker-input"
          className="date-picker__input-wrapper input-wrapper"
          onClick={onInputClick}
        >
          <MaskedInput
            className={inputClassNames}
            keepCharPositions={true}
            mask={dateMask}
            showMask={true}
            onChange={onInputChange}
            pipe={autoCorrectedDatePipe}
            value={valueDatePickerInput}
          />
          <span className={inputLabelClassNames}>{label}</span>
        </div>
        {openDatePicker && (
          <div
            ref={ref}
            className={`date-picker ${
              isTopPosition ? 'positionTop' : 'positionBottom'
            }`}
          >
            <div className="date-picker__calendars">
              {config.map(item => (
                <div
                  className={classnames('date-picker__calendar')}
                  key={item.id}
                >
                  <div className="date-picker__header">
                    <Arrow
                      data-testid="btn-previous-month"
                      className="date-picker__header-previous-month"
                      onClick={() => onPreviousMonth(item.id)}
                    />
                    {isRange && (
                      <span className="date-picker__header-label">
                        {item.label}
                      </span>
                    )}
                    <div>
                      <span className="date-picker__header-month">
                        {months[item.visibleDate.getMonth()]}
                      </span>
                      <span className="date-picker__header-year">
                        {item.visibleDate.getFullYear()}
                      </span>
                    </div>
                    <Arrow
                      data-testid="btn-next-month"
                      className="date-picker__header-next-month"
                      onClick={() => onNextMonth(item.id)}
                    />
                  </div>
                  <div className="date-picker__weeks">
                    {weekDay.map((day, index) => {
                      return (
                        <div
                          key={`${day}${index}`}
                          className="date-picker__weeks-day"
                        >
                          {day.label}
                        </div>
                      )
                    })}
                  </div>
                  {item.calendar.map(({ week }, index) => (
                    <div
                      key={`${week[0].day.getMonth()}${index}`}
                      className="date-picker__week"
                    >
                      {week.map(({ day }) => (
                        <div
                          key={`${day.getMonth()}${day.getDate()}${day.getFullYear()}`}
                          className={classnames(
                            'date-picker__week-day-wrapper',
                            item.id === 'configFrom'
                              ? 'calendar-from'
                              : 'calendar-to',
                            item.visibleDate.getMonth() === day.getMonth()
                              ? 'current-month'
                              : 'not-current-month',
                            isSameDate(config[0].selectedDate, day) &&
                              'selected-from',
                            isRange &&
                              isSameDate(config[1].selectedDate, day) &&
                              'selected-to',
                            isRangeDateValid(day) && 'in-range',
                            isCalendarInvalid && 'invalid'
                          )}
                          onClick={() => {
                            item.visibleDate.getMonth() === day.getMonth() &&
                              setSelectedDate(item.id, day, item.selectedDate)
                          }}
                        >
                          <div className="date-picker__week-day">
                            {day.getDate()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                  {isTime && (
                    <div className="date-picker__time">
                      <TimePicker
                        onChange={time =>
                          onTimeChange(item.id, time, item.selectedDate)
                        }
                        value={`${String(item.selectedDate.getHours()).padStart(
                          2,
                          '0'
                        )}:${String(item.selectedDate.getMinutes()).padStart(
                          2,
                          '0'
                        )}`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="date-picker__footer">
              {isCalendarInvalid && (
                <ErrorMessage message="“To” must be later than “From”" />
              )}
              <Button
                variant="secondary"
                label="Apply"
                onClick={onApplyChanges}
                className="date-picker__apply-btn"
                disabled={isCalendarInvalid}
              />
            </div>
          </div>
        )}
      </>
    )
  }
)

DatePickerView.propTypes = {
  autoCorrectedDatePipe: PropTypes.func.isRequired,
  config: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  dateMask: PropTypes.array.isRequired,
  floatingLabel: PropTypes.bool,
  isCalendarInvalid: PropTypes.bool.isRequired,
  isRangeDateValid: PropTypes.func.isRequired,
  isRange: PropTypes.bool.isRequired,
  isSameDate: PropTypes.func.isRequired,
  isTime: PropTypes.bool.isRequired,
  isTopPosition: PropTypes.bool.isRequired,
  label: PropTypes.string,
  months: PropTypes.array.isRequired,
  onApplyChanges: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onInputClick: PropTypes.func.isRequired,
  onNextMonth: PropTypes.func.isRequired,
  onPreviousMonth: PropTypes.func.isRequired,
  onTimeChange: PropTypes.func.isRequired,
  openDatePicker: PropTypes.bool.isRequired,
  setSelectedDate: PropTypes.func.isRequired,
  valueDatePickerInput: PropTypes.string.isRequired,
  weekDay: PropTypes.array.isRequired
}

export default React.memo(DatePickerView)
