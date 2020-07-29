import React, { useState, useCallback, useReducer, useEffect } from 'react'
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
  const [cron, setCron] = useState({
    minute: '*',
    hour: '*',
    day: '*',
    month: '*',
    week: '*'
  })
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [isRecurring, setIsRecurring] = useState('recurring')
  const [recurringState, recurringDispatch] = useReducer(
    recurringReducer,
    initialState
  )
  const [error, setError] = useState('')
  const [cronString, setCronString] = useState('*/10 * * * *')
  const startWeek = getWeekStart(decodeLocale(navigator.language))
  const daysOfWeek = getWeekDays(startWeek)

  useEffect(() => {
    if (
      cron[recurringState.scheduleRepeat.activeOption] === '*' &&
      recurringState.scheduleRepeat.activeOption !== 'week'
    ) {
      setCron(state => ({
        ...state,
        [recurringState.scheduleRepeat
          .activeOption]: `*/${recurringState.scheduleRepeat[
          recurringState.scheduleRepeat.activeOption
        ].toString()}`
      }))
    } else if (
      recurringState.scheduleRepeat.activeOption === 'week' &&
      cron.day === '*'
    ) {
      setCron(state => ({
        ...state,
        day: `*/${recurringState.scheduleRepeat[
          recurringState.scheduleRepeat.activeOption
        ].repeat * 7}`
      }))
    }
  }, [cron, recurringState.scheduleRepeat])

  useEffect(() => {
    if (
      recurringState.scheduleRepeat.activeOption === 'week' &&
      cron.week === '*'
    ) {
      setCron(state => ({
        ...state,
        week: recurringState.scheduleRepeat.week.daysOfTheWeek.reduce(
          (prev, next, index, arr) => {
            const indexOfWeekDay = daysOfWeek.find(day => day.id === next).index

            return (prev +=
              arr.length - 1 === index ? indexOfWeekDay : indexOfWeekDay + ',')
          },
          ''
        )
      }))
    }
  }, [
    cron.week,
    daysOfWeek,
    recurringState.scheduleRepeat.activeOption,
    recurringState.scheduleRepeat.week.daysOfTheWeek
  ])

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
    const indexOfWeekDay = daysOfWeek.find(weekDay => weekDay.id === day).index

    if (week.daysOfTheWeek.indexOf(day) === -1) {
      distinctWeek = week.daysOfTheWeek.concat(day)

      setCron(state => ({
        ...state,
        week: state.week
          .split(',')
          .concat(indexOfWeekDay)
          .sort()
          .join(',')
      }))
    } else {
      distinctWeek = distinctWeek.filter(item => item !== day)

      setCron(state => ({
        ...state,
        week: state.week
          .split(',')
          .filter(weekDay => +weekDay !== indexOfWeekDay)
          .join(',')
      }))
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
      day: date.getDate(),
      month: date.getMonth() + 1
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
      const generateCron =
        activeTab === 'cronstring' ? cronString : generateCronString(cron)

      handleRunJob(event, generateCron)
      setOpenScheduleJob(false)
    },
    [activeTab, cron, cronString, handleRunJob, setOpenScheduleJob]
  )

  return (
    <ScheduleJobView
      activeTab={activeTab}
      cron={cron}
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
      setActiveTab={setActiveTab}
      setCron={setCron}
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
