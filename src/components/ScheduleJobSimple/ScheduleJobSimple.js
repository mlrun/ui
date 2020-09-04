import React from 'react'
import PropTypes from 'prop-types'

import CheckBox from '../../common/CheckBox/CheckBox'
import ScheduleRecurring from '../../elements/ScheduleRecurring/ScheduleRecurring'
import DatePicker from '../../common/DatePicker/DatePicker'
import TimePicker from '../../common/TimePicker/TimePicker'

import './scheduleJobSimple.scss'

const ScheduleJobSimple = ({
  cron,
  date,
  daysOfWeek,
  handleDaysOfWeek,
  isRecurring,
  match,
  recurringDispatch,
  recurringState,
  selectOptions,
  setCron,
  setDate,
  setIsRecurring,
  setTime,
  time
}) => {
  return (
    <>
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
          cron={cron}
          daysOfWeek={daysOfWeek}
          handleDaysOfWeek={handleDaysOfWeek}
          match={match}
          recurringDispatch={recurringDispatch}
          recurringState={recurringState}
          selectOptions={selectOptions}
          setCron={setCron}
        />
      )}
    </>
  )
}

ScheduleJobSimple.propTypes = {
  cron: PropTypes.string.isRequired,
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  daysOfWeek: PropTypes.array.isRequired,
  handleDaysOfWeek: PropTypes.func.isRequired,
  isRecurring: PropTypes.string.isRequired,
  match: PropTypes.shape({}).isRequired,
  recurringDispatch: PropTypes.func.isRequired,
  recurringState: PropTypes.shape({}).isRequired,
  selectOptions: PropTypes.shape({}).isRequired,
  setCron: PropTypes.func.isRequired,
  setDate: PropTypes.func.isRequired,
  setIsRecurring: PropTypes.func.isRequired,
  setTime: PropTypes.func.isRequired,
  time: PropTypes.string.isRequired
}

export default ScheduleJobSimple
