import React from 'react'
import PropTypes from 'prop-types'

import CheckBox from '../../common/CheckBox/CheckBox'
import ScheduleRecurring from '../../elements/ScheduleRecurring/ScheduleRecurring'
import DatePicker from '../../common/DatePicker/DatePicker'
import TimePicker from '../../common/TimePicker/TimePicker'

const ScheduleJobSimple = ({
  date,
  daysOfWeek,
  handleDaysOfWeek,
  isRecurring,
  recurringDispatch,
  recurringState,
  setDate,
  setIsRecurring,
  setTime,
  time
}) => {
  return (
    <>
      <div className="input-container">
        <DatePicker onChange={setDate} date={date} />
        <TimePicker onChange={setTime} value={time} />
      </div>
      <div className="checkbox-container">
        <CheckBox
          item={{ label: 'Recurring', id: 'recurring' }}
          onChange={recurring =>
            setIsRecurring(state => (state === recurring ? '' : recurring))
          }
          selectedId={isRecurring}
        />
      </div>
      {isRecurring && (
        <ScheduleRecurring
          daysOfWeek={daysOfWeek}
          handleDaysOfWeek={handleDaysOfWeek}
          recurringDispatch={recurringDispatch}
          recurringState={recurringState}
        />
      )}
    </>
  )
}

ScheduleJobSimple.propTypes = {
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  daysOfWeek: PropTypes.array.isRequired,
  handleDaysOfWeek: PropTypes.func.isRequired,
  isRecurring: PropTypes.string.isRequired,
  recurringDispatch: PropTypes.func.isRequired,
  recurringState: PropTypes.shape({}).isRequired,
  setDate: PropTypes.func.isRequired,
  setIsRecurring: PropTypes.func.isRequired,
  setTime: PropTypes.func.isRequired,
  time: PropTypes.string.isRequired
}

export default ScheduleJobSimple
