import React from 'react'
import PropTypes from 'prop-types'

import CheckBox from '../../common/CheckBox/CheckBox'
import ScheduleRecurring from '../../elements/ScheduleRecurring/ScheduleRecurring'
import DatePicker from '../../common/DatePicker/DatePicker'

import './scheduleJobSimple.scss'
import TimePicker from '../../common/TimePicker/TimePicker'

const ScheduleJobSimple = ({
  date,
  daysOfWeek,
  dispatch,
  isRecurring,
  match,
  recurringState,
  setDate,
  setIsRecurring,
  setTime,
  time
}) => {
  return (
    <div className="schedule-job-normal_container">
      <h3>Simple Schedule</h3>
      <div className="input_container">
        <DatePicker value={date} onChange={setDate} splitCharacter="." />
        <TimePicker value={time} onChange={setTime} />
      </div>
      <div className="checkbox_container">
        <CheckBox
          item={{
            label: 'Recurring',
            id: 'recurring'
          }}
          selectedId={isRecurring}
          onChange={setIsRecurring}
        />
      </div>
      {isRecurring && (
        <ScheduleRecurring
          daysOfWeek={daysOfWeek}
          dispatch={dispatch}
          match={match}
          recurringState={recurringState}
        />
      )}
    </div>
  )
}

ScheduleJobSimple.propTypes = {
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  daysOfWeek: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
  isRecurring: PropTypes.string.isRequired,
  match: PropTypes.shape({}).isRequired,
  recurringState: PropTypes.shape({}).isRequired,
  setDate: PropTypes.func.isRequired,
  setIsRecurring: PropTypes.func.isRequired,
  setTime: PropTypes.func.isRequired,
  time: PropTypes.string.isRequired
}

export default ScheduleJobSimple
