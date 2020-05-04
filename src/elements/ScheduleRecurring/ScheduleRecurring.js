import React from 'react'
import PropTypes from 'prop-types'

import RangeInput from '../../common/RangeInput/RangeInput'
import Select from '../../common/Select/Select'

import './scheduleRecurring.scss'
import DatePicker from '../../common/DatePicker/DatePicker'

const ScheduleRecurring = ({
  daysOfWeek,
  match,
  scheduleRepeatEnd,
  scheduleRepeatEndValue,
  scheduleRepeatInterval,
  scheduleRepeatStep,
  setScheduleRepeatEnd,
  setScheduleRepeatEndValue,
  setScheduleRepeatInterval,
  setScheduleRepeatStep
}) => {
  return (
    <div className="recurring_container">
      <span>Repeat every</span>
      <div className="repeat_container">
        <RangeInput
          onChange={setScheduleRepeatStep}
          value={scheduleRepeatStep.toString()}
        />
        <Select
          match={match}
          onClick={setScheduleRepeatInterval}
          option="repeatInterval"
          page="jobs"
          value={scheduleRepeatInterval}
        />
        {scheduleRepeatInterval === 'week' && (
          <div className="schedule-repeat-week">
            {daysOfWeek.map((day, index) => (
              <span
                key={day.label + index}
                className={`schedule-repeat-week_day ${day.label}`}
              >
                {day.label}
              </span>
            ))}
          </div>
        )}
      </div>
      <span>Ends</span>
      <div className="repeat_end_container">
        <Select
          match={match}
          onClick={setScheduleRepeatEnd}
          option="repeatEnd"
          page="jobs"
          value={scheduleRepeatEnd}
        />
        {scheduleRepeatEnd === 'onDate' && (
          <DatePicker
            onChange={setScheduleRepeatEndValue}
            splitCharacter="."
            value={scheduleRepeatEndValue}
          />
        )}
        {scheduleRepeatEnd === 'after' && (
          <div className="range-input-container">
            <RangeInput
              onChange={setScheduleRepeatEndValue}
              value={scheduleRepeatEndValue}
            />
            {scheduleRepeatEndValue.length < 10 && (
              <span
                className="range-input-label"
                style={{
                  left:
                    (scheduleRepeatEndValue
                      ? scheduleRepeatEndValue.length + 2
                      : 2) * 10
                }}
              >
                occurrences
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

PropTypes.propTypes = {
  match: PropTypes.shape({}).isRequired,
  scheduleRepeatEnd: PropTypes.string.isRequired,
  scheduleRepeatInterval: PropTypes.string.isRequired,
  scheduleRepeatStep: PropTypes.number.isRequired,
  setScheduleRepeatEnd: PropTypes.func.isRequired,
  setScheduleRepeatInterval: PropTypes.func.isRequired,
  setScheduleRepeatStep: PropTypes.func.isRequired
}

export default React.memo(ScheduleRecurring)
