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
  getRangeInputValue,
  handleDaysOfWeek,
  isRecurring,
  match,
  recurringDispatch,
  recurringState,
  selectOptions,
  setDate,
  setIsRecurring,
  setTime,
  time
}) => {
  return (
    <div className="schedule-job-simple_container">
      <h3>Simple Schedule</h3>
      <div className="input_container">
        <DatePicker onChange={setDate} splitCharacter="." value={date} />
        <TimePicker onChange={setTime} value={time} />
      </div>
      <div className="checkbox_container">
        <CheckBox
          item={{ label: 'Recurring', id: 'recurring' }}
          onChange={setIsRecurring}
          selectedId={isRecurring}
        />
      </div>
      {isRecurring && (
        <ScheduleRecurring
          daysOfWeek={daysOfWeek}
          getRangeInputValue={getRangeInputValue}
          handleDaysOfWeek={handleDaysOfWeek}
          match={match}
          recurringDispatch={recurringDispatch}
          recurringState={recurringState}
          selectOptions={selectOptions}
        />
      )}
    </div>
  )
}

ScheduleJobSimple.propTypes = {
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  daysOfWeek: PropTypes.array.isRequired,
  getRangeInputValue: PropTypes.func.isRequired,
  handleDaysOfWeek: PropTypes.func.isRequired,
  isRecurring: PropTypes.string.isRequired,
  match: PropTypes.shape({}).isRequired,
  recurringDispatch: PropTypes.func.isRequired,
  recurringState: PropTypes.shape({}).isRequired,
  selectOptions: PropTypes.shape({}).isRequired,
  setDate: PropTypes.func.isRequired,
  setIsRecurring: PropTypes.func.isRequired,
  setTime: PropTypes.func.isRequired,
  time: PropTypes.string.isRequired
}

export default ScheduleJobSimple
