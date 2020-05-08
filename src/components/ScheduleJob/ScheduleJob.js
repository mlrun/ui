import React, { useState, useCallback, useReducer } from 'react'
import PropTypes from 'prop-types'

import ScheduleJobView from './ScheduleJobView'

import scheduleData from './scheduleData.json'
import {
  recurringReducer,
  initialState,
  scheduleActionType
} from './recurringReducer'

import {
  getWeekDays,
  getWeekStart,
  decodeLocale
} from '../../utils/datePicker.util'

import './scheduleJob.scss'

const ScheduleJob = ({ match }) => {
  const [activeTab, setActiveTab] = useState(scheduleData.tabs[0].id)
  const [cron, setCron] = useState({
    minute: '*',
    hour: '*',
    dayOfTheMonth: '*',
    monthOfTheYear: '*',
    dayOfTheWeek: '*'
  })
  const [date, setDate] = useState('')
  const [isRecurring, setIsRecurring] = useState('')
  const [recurringState, recurringDispatch] = useReducer(
    recurringReducer,
    initialState
  )
  const [time, setTime] = useState('')

  const startWeek = getWeekStart(decodeLocale(navigator.language))

  const daysOfWeek = getWeekDays(startWeek)

  const generateCronString = cron => {
    return Object.keys(cron).reduce((prev, next, index, arr) => {
      return (prev += arr.length - 1 === index ? cron[next] : cron[next] + ' ')
    }, '')
  }

  const onSchedule = useCallback(() => {
    return generateCronString(cron)
  }, [cron])

  const onHandleDateChange = date => {
    setDate(date)
  }

  const handleDaysOfWeek = day => {
    const {
      scheduleRepeat: { week }
    } = recurringState

    let distinctWeek = week.daysOfTheWeek

    if (week.daysOfTheWeek.indexOf(day) === -1) {
      distinctWeek = week.daysOfTheWeek.concat(day)
    } else {
      distinctWeek = distinctWeek.filter(item => item !== day)
    }

    recurringDispatch({
      type: scheduleActionType.SCHEDULE_REPEAT_DAYS_OF_WEEK,
      payload: distinctWeek
    })
  }

  const onHandleTimeChange = time => {
    const [hour, minute] = time.split(':')

    setTime(time)
    setCron(prev => ({
      ...prev,
      minute,
      hour
    }))
  }

  return (
    <ScheduleJobView
      activeTab={activeTab}
      cron={cron}
      date={date}
      daysOfWeek={daysOfWeek}
      generateCronString={generateCronString}
      handleDaysOfWeek={handleDaysOfWeek}
      isRecurring={isRecurring}
      match={match}
      onSchedule={onSchedule}
      recurringDispatch={recurringDispatch}
      recurringState={recurringState}
      setActiveTab={setActiveTab}
      setDate={onHandleDateChange}
      setIsRecurring={setIsRecurring}
      setTime={onHandleTimeChange}
      time={time}
    />
  )
}

ScheduleJob.propTypes = {
  match: PropTypes.shape({}).isRequired
}

export default ScheduleJob
