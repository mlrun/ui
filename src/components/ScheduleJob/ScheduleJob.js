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
import { validateCronString } from '../JobsPanel/jobsPanel.util'

const ScheduleJob = ({ handleRunJob, match, setOpenScheduleJob }) => {
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
  const [isRecurring, setIsRecurring] = useState('recurring')
  const [recurringState, recurringDispatch] = useReducer(
    recurringReducer,
    initialState
  )
  const [error, setError] = useState('')
  const [cronString, setCronString] = useState('* * * * *')
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

  console.log(isRecurring)

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

  const onSchedule = useCallback(
    event => {
      let generateCron = ''
      if (activeTab === 'cronstring') {
        const data = validateCronString(cronString)

        if (data.errorMessage) {
          return setError(data.errorMessage)
        } else {
          setError('')

          generateCron = data.cron.join(' ')
        }
      } else {
        generateCron = generateCronString(cron)
      }

      dispatch({
        type: SET_NEW_JOB_SCHEDULE,
        payload: generateCron
      })

      handleRunJob(event, activeTab === 'cronstring' && generateCron)
      setOpenScheduleJob(false)
    },
    [activeTab, cron, cronString, dispatch, handleRunJob, setOpenScheduleJob]
  )

  return (
    <ScheduleJobView
      activeTab={activeTab}
      cronString={cronString}
      date={date}
      daysOfWeek={daysOfWeek}
      error={error}
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
      setCronString={setCronString}
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
