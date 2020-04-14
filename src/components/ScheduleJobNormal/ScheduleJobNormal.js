import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'

import CheckBox from '../../common/CheckBox/CheckBox'
import Input from '../../common/Input/Input'
import ScheduleRecurring from '../../elements/ScheduleRecurring/ScheduleRecurring'

import { ReactComponent as Schedule } from '../../images/clock.svg'

import './scheduleJobNormal.scss'

const ScheduleJobNormal = ({ match }) => {
  const [date, setDate] = useState('')
  const [isRecurring, setIsRecurring] = useState('')
  const [scheduleRepeatEnd, setScheduleRepeatEnd] = useState('never')
  const [scheduleRepeatInterval, setScheduleRepeatInterval] = useState('minute')
  const [scheduleRepeatStep, setScheduleRepeatStep] = useState(1)
  const [time, setTime] = useState('')

  const onSchedule = useCallback(data => {
    console.log(data)
  }, [])

  return (
    <>
      <div className="schedule-job-normal_container">
        <h3>Normal Schedule</h3>
        <div className="input_container">
          <Input
            value={date}
            onChange={setDate}
            label="Date"
            type="text"
            className="input-row__item"
            floatingLabel
          />
          <Input
            value={time}
            onChange={setTime}
            label="Time"
            type="text"
            className="input-row__item"
            floatingLabel
          />
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
            match={match}
            scheduleRepeatEnd={scheduleRepeatEnd}
            scheduleRepeatInterval={scheduleRepeatInterval}
            scheduleRepeatStep={scheduleRepeatStep}
            setScheduleRepeatEnd={setScheduleRepeatEnd}
            setScheduleRepeatInterval={setScheduleRepeatInterval}
            setScheduleRepeatStep={setScheduleRepeatStep}
          />
        )}
      </div>
      <button
        className="btn-schedule"
        onClick={() => {
          onSchedule({
            date,
            scheduleRepeatEnd,
            scheduleRepeatInterval,
            scheduleRepeatStep,
            time
          })
        }}
      >
        <Schedule />
        Schedule
      </button>
    </>
  )
}

ScheduleJobNormal.propTypes = {
  match: PropTypes.shape({}).isRequired
}

export default ScheduleJobNormal
