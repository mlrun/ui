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
import { getFormatTime } from '../../utils'

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

    if (!week.includes(day)) {
      distinctWeek = week.concat(day)
    } else {
      distinctWeek = distinctWeek.filter(item => item !== day)
    }

    let days = daysOfWeek
      .filter(day => distinctWeek.includes(day.id))
      .map(day => day.index)
      .sort()
      .join(',')

    days = days || '*'

    const { hour, minute } = getFormatTime(time)

    setCron(`${minute} ${hour} * * ${days}`)

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
      let newCron = cron
      if (/^00 00/.test(cron)) {
        const { hour, minute } = getFormatTime(time)
        newCron = newCron.replace(/00 00/, `${minute} ${hour}`)
      }

      handleRunJob(event, newCron)
      setOpenScheduleJob(false)
    },
    [cron, handleRunJob, setOpenScheduleJob, time]
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
