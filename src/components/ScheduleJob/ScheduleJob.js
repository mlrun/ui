import React, { useState, useCallback, useReducer } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import ScheduleJobView from './ScheduleJobView'

import scheduleData from './scheduleData.json'
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
import { SET_NEW_JOB_SCHEDULE } from '../../constants'

import './scheduleJob.scss'

const ScheduleJob = ({ match, setOpenScheduleJob }) => {
  const [activeTab, setActiveTab] = useState(scheduleData.tabs[0].id)
  const [cron, setCron] = useState({
    minute: '*',
    hour: '*',
    dayOfTheMonth: '*',
    monthOfTheYear: '*',
    dayOfTheWeek: '*'
  })
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [isRecurring, setIsRecurring] = useState('')
  const [recurringState, recurringDispatch] = useReducer(
    recurringReducer,
    initialState
  )
  const dispatch = useDispatch()
  const startWeek = getWeekStart(decodeLocale(navigator.language))
  const selectOptions = {
    repeatInterval: [
      { label: 'Minute', id: 'minute' },
      { label: 'Hour', id: 'hour' },
      { label: 'Day', id: 'day' },
      { label: 'Week', id: 'week' },
      { label: 'Month', subLabel: '(every 12th day)', id: 'month' }
    ],
    repeatEnd: [
      { label: 'Never', id: 'never' },
      { label: 'On date', id: 'onDate' },
      { label: 'After', id: 'after' }
    ]
  }
  const daysOfWeek = getWeekDays(startWeek)

  const generateCronString = cron => {
    return Object.keys(cron).reduce((prev, next, index, arr) => {
      return (prev += arr.length - 1 === index ? cron[next] : cron[next] + ' ')
    }, '')
  }

  const getRangeInputValue = () => {
    return recurringState.scheduleRepeat.activeOption === 'week'
      ? recurringState.scheduleRepeat.week.repeat.toString()
      : recurringState.scheduleRepeat[
          recurringState.scheduleRepeat.activeOption
        ].toString()
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

  const onHandleDateChange = date => {
    setDate(date)
    setCron(prev => ({
      ...prev,
      dayOfTheMonth: date.getDate(),
      monthOfTheYear: date.getMonth() + 1
    }))
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

  const onSchedule = useCallback(() => {
    const generateCron = generateCronString(cron)

    dispatch({
      type: SET_NEW_JOB_SCHEDULE,
      payload: generateCron
    })

    setOpenScheduleJob(false)
  }, [cron, dispatch, setOpenScheduleJob])

  return (
    <ScheduleJobView
      activeTab={activeTab}
      cron={cron}
      date={date}
      daysOfWeek={daysOfWeek}
      generateCronString={generateCronString}
      getRangeInputValue={getRangeInputValue}
      handleDaysOfWeek={handleDaysOfWeek}
      isRecurring={isRecurring}
      match={match}
      onSchedule={onSchedule}
      recurringDispatch={recurringDispatch}
      recurringState={recurringState}
      selectOptions={selectOptions}
      setActiveTab={setActiveTab}
      setDate={onHandleDateChange}
      setIsRecurring={setIsRecurring}
      setTime={onHandleTimeChange}
      time={time}
    />
  )
}

ScheduleJob.propTypes = {
  match: PropTypes.shape({}).isRequired,
  setOpenScheduleJob: PropTypes.func.isRequired
}

export default ScheduleJob
