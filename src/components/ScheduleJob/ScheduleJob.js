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
import { getFormatTime } from '../../utils'
import { generateCronInitialValue } from '../../utils/generateCronInitialValue'

const ScheduleJob = ({
  defaultCron,
  handleEditJob,
  handleRunJob,
  match,
  panelDispatch,
  panelState,
  setOpenScheduleJob,
  setValidation,
  validation
}) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id)
  const [cron, setCron] = useState(defaultCron || '10 * * * *')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [isRecurring, setIsRecurring] = useState('recurring')
  const [recurringState, recurringDispatch] = useReducer(
    recurringReducer,
    initialState
  )
  const startWeek = getWeekStart(decodeLocale(navigator.language))
  const daysOfWeek = getWeekDays(startWeek)

  const handleDaysOfWeek = day => {
    const {
      scheduleRepeat: { week }
    } = recurringState
    let distinctWeek = week.days

    distinctWeek = week.days.includes(day)
      ? distinctWeek.filter(item => item !== day)
      : [...week.days, day]

    let days = daysOfWeek
      .filter(day => distinctWeek.includes(day.id))
      .map(day => (day.index + 6) % 7) // temporarily make Monday=0, Tuesday=1, ..., Sunday=6
      .sort()
      .join(',')

    days = days || '*'

    const { hour, minute } = getFormatTime(
      recurringState.scheduleRepeat[recurringState.scheduleRepeat.activeOption]
        .time
    )

    setCron(`${minute} ${hour} * * ${days}`)

    recurringDispatch({
      type: scheduleActionType.SCHEDULE_REPEAT_DAYS_OF_WEEK,
      payload: distinctWeek
    })
  }

  const onHandleDateChange = dates => {
    setDate(dates[0])
  }

  const onHandleTimeChange = time => {
    setTime(time)
  }

  const onSchedule = useCallback(
    event => {
      if (defaultCron) {
        handleEditJob(event, cron)
      } else {
        handleRunJob(event, cron)
      }

      setOpenScheduleJob(false)
    },
    [cron, defaultCron, handleEditJob, handleRunJob, setOpenScheduleJob]
  )

  useEffect(() => {
    if (activeTab === tabs[0].id) {
      generateCronInitialValue(
        recurringState.scheduleRepeat.activeOption,
        cron,
        recurringState.scheduleRepeat,
        daysOfWeek,
        setCron
      )
    }
  }, [activeTab, cron, daysOfWeek, recurringState.scheduleRepeat])

  useEffect(() => {
    if (defaultCron) {
      let cron = defaultCron.split(' ')

      if (cron[4] !== '*') {
        const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

        recurringDispatch({
          type: scheduleActionType.SCHEDULE_REPEAT_ACTIVE_OPTION,
          payload: 'week'
        })
        recurringDispatch({
          type: scheduleActionType.SCHEDULE_REPEAT_DAYS_OF_WEEK,
          payload: cron[4].split(',').map(day => weekDays[day])
        })
        recurringDispatch({
          type: scheduleActionType.SCHEDULE_REPEAT_WEEK_TIME,
          payload: `${cron[1] >= 10 ? cron[1] : `0${cron[1]}`}:${
            cron[0] >= 10 ? cron[0] : `0${cron[0]}`
          }`
        })
      } else if (cron[2] !== '*') {
        recurringDispatch({
          type: scheduleActionType.SCHEDULE_REPEAT_ACTIVE_OPTION,
          payload: 'month'
        })
        recurringDispatch({
          type: scheduleActionType.SCHEDULE_REPEAT_MONTH_TIME,
          payload: `${cron[1] >= 10 ? cron[1] : `0${cron[1]}`}:${
            cron[0] >= 10 ? cron[0] : `0${cron[0]}`
          }`
        })
      } else if (cron[1] !== '*' && cron[1].match('/')) {
        recurringDispatch({
          type: scheduleActionType.SCHEDULE_REPEAT_ACTIVE_OPTION,
          payload: 'hour'
        })
        recurringDispatch({
          type: scheduleActionType.SCHEDULE_REPEAT_MINUTE,
          payload: 0
        })
        recurringDispatch({
          type: scheduleActionType.SCHEDULE_REPEAT_HOUR,
          payload: Number(cron[1].replace(/.*\*\//g, ''))
        })
      } else if (cron[1] !== '*') {
        recurringDispatch({
          type: scheduleActionType.SCHEDULE_REPEAT_ACTIVE_OPTION,
          payload: 'day'
        })
        recurringDispatch({
          type: scheduleActionType.SCHEDULE_REPEAT_DAY_TIME,
          payload: `${cron[1] >= 10 ? cron[1] : `0${cron[1]}`}:${
            cron[0] >= 10 ? cron[0] : `0${cron[0]}`
          }`
        })
      } else {
        recurringDispatch({
          type: scheduleActionType.SCHEDULE_REPEAT_ACTIVE_OPTION,
          payload: 'minute'
        })
        recurringDispatch({
          type: scheduleActionType.SCHEDULE_REPEAT_MINUTE,
          payload: Number(cron[0].replace(/.*\*\//g, ''))
        })
      }
    }
  }, [defaultCron])

  return (
    <ScheduleJobView
      activeTab={activeTab}
      cron={cron}
      date={date}
      daysOfWeek={daysOfWeek}
      handleDaysOfWeek={handleDaysOfWeek}
      isRecurring={isRecurring}
      match={match}
      onSchedule={onSchedule}
      panelDispatch={panelDispatch}
      panelState={panelState}
      recurringDispatch={recurringDispatch}
      recurringState={recurringState}
      setActiveTab={setActiveTab}
      setCron={setCron}
      setDate={onHandleDateChange}
      setIsRecurring={setIsRecurring}
      setTime={onHandleTimeChange}
      time={time}
      setValidation={setValidation}
      validation={validation}
    />
  )
}

ScheduleJob.defaultProps = {
  defaultCron: '',
  handleEditJob: () => {}
}

ScheduleJob.propTypes = {
  defaultCron: PropTypes.string,
  handleEditJob: PropTypes.func,
  handleRunJob: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  panelDispatch: PropTypes.func.isRequired,
  panelState: PropTypes.shape({}).isRequired,
  setOpenScheduleJob: PropTypes.func.isRequired
}

export default ScheduleJob
