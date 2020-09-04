import React, { useState, useCallback, useReducer } from 'react'
import PropTypes from 'prop-types'

import ScheduleJobView from './ScheduleJobView'

import {
  initialState,
  recurringReducer,
  scheduleActionType
} from './recurringReducer'
import {
  decodeLocale,
  getWeekDays,
  getWeekStart
} from '../../utils/datePicker.util'
import { tabs } from './scheduleJobData'

import './scheduleJob.scss'

const ScheduleJob = ({ handleRunJob, match, setOpenScheduleJob }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id)
  const [cron, setCron] = useState('10 * * * *')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [isRecurring, setIsRecurring] = useState('recurring')
  const [recurringState, recurringDispatch] = useReducer(
    recurringReducer,
    initialState
  )
  const [error, setError] = useState('')
  const startWeek = getWeekStart(decodeLocale(navigator.language))
  const daysOfWeek = getWeekDays(startWeek)

  const handleDaysOfWeek = day => {
    const {
      scheduleRepeat: { week }
    } = recurringState
    let distinctWeek = week

    if (week.indexOf(day) === -1) {
      distinctWeek = week.concat(day)
    } else {
      distinctWeek = distinctWeek.filter(item => item !== day)
    }

    let days = daysOfWeek
      .filter(day => distinctWeek.includes(day.id))
      .map(day => day.index)
      .sort()
      .join(',')

    days = days ? days : '*'

    setCron(`0 0 * * ${days}`)

    recurringDispatch({
      type: scheduleActionType.SCHEDULE_REPEAT_DAYS_OF_WEEK,
      payload: distinctWeek
    })
  }

  const onHandleDateChange = date => {
    setDate(date)
  }

  const onHandleTimeChange = time => {
    setTime(time)
  }

  const onSchedule = useCallback(
    event => {
      handleRunJob(event, cron)
      setOpenScheduleJob(false)
    },
    [cron, handleRunJob, setOpenScheduleJob]
  )

  return (
    <ScheduleJobView
      activeTab={activeTab}
      cron={cron}
      date={date}
      daysOfWeek={daysOfWeek}
      error={error}
      handleDaysOfWeek={handleDaysOfWeek}
      isRecurring={isRecurring}
      match={match}
      onSchedule={onSchedule}
      recurringDispatch={recurringDispatch}
      recurringState={recurringState}
      setActiveTab={setActiveTab}
      setCron={setCron}
      setDate={onHandleDateChange}
      setError={setError}
      setIsRecurring={setIsRecurring}
      setTime={onHandleTimeChange}
      time={time}
    />
  )
}

ScheduleJob.propTypes = {
  handleRunJob: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  setOpenScheduleJob: PropTypes.func.isRequired
}

export default ScheduleJob
