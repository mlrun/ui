import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'

import ScheduleJobView from './ScheduleJobView'

import scheduleData from './scheduleData.json'
import { getWeekDays } from '../../utils/datePicker.util'

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
  const [scheduleRepeatEnd, setScheduleRepeatEnd] = useState('never')
  const [scheduleRepeatEndValue, setScheduleRepeatEndValue] = useState('')
  const [scheduleRepeatInterval, setScheduleRepeatInterval] = useState('minute')
  const [scheduleRepeatStep, setScheduleRepeatStep] = useState({
    minute: 1,
    hour: 1,
    day: 1,
    week: 1,
    month: 12
  })
  const [time, setTime] = useState('')

  const daysOfWeek = getWeekDays('mon')

  const generateCronString = cron => {
    let cronString = Object.keys(cron).reduce((prev, next, index, arr) => {
      return (prev += arr.length - 1 === index ? cron[next] : cron[next] + ' ')
    }, '')
    return cronString
  }

  const onSchedule = useCallback(() => {
    return generateCronString(cron)
  }, [cron])

  const onHandleDateChange = date => {
    setDate(date)
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

  const onHandleStepChange = step => {
    setScheduleRepeatStep(prev => ({
      ...prev,
      [scheduleRepeatInterval]: step
    }))
  }

  const onHandleScheduleRepeatEnd = value => {
    setScheduleRepeatEnd(value)
    setScheduleRepeatEndValue(value === 'after' ? '1' : '')
  }

  const onHandleScheduleRepeatEndValue = value => {
    setScheduleRepeatEndValue(
      scheduleRepeatEnd === 'after' ? value.toString() : value
    )
  }

  return (
    <ScheduleJobView
      activeTab={activeTab}
      cron={cron}
      date={date}
      daysOfWeek={daysOfWeek}
      generateCronString={generateCronString}
      isRecurring={isRecurring}
      match={match}
      onChangeStep={onHandleStepChange}
      onSchedule={onSchedule}
      scheduleRepeatEnd={scheduleRepeatEnd}
      scheduleRepeatEndValue={scheduleRepeatEndValue}
      scheduleRepeatInterval={scheduleRepeatInterval}
      scheduleRepeatStep={scheduleRepeatStep}
      setActiveTab={setActiveTab}
      setDate={onHandleDateChange}
      setIsRecurring={setIsRecurring}
      setScheduleRepeatEnd={onHandleScheduleRepeatEnd}
      setScheduleRepeatEndValue={onHandleScheduleRepeatEndValue}
      setScheduleRepeatInterval={setScheduleRepeatInterval}
      setTime={onHandleTimeChange}
      time={time}
    />
  )
}

ScheduleJob.propTypes = {
  match: PropTypes.shape({}).isRequired
}

export default ScheduleJob
