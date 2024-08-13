/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React, { useState, useCallback, useReducer, useEffect } from 'react'
import PropTypes from 'prop-types'

import ScheduleJobView from './ScheduleJobView'

import { initialState, recurringReducer, scheduleActionType } from './recurringReducer'
import { decodeLocale, getWeekDays, getWeekStart } from '../../utils/datePicker.util'
import { tabs } from './scheduleJobData'
import { getFormatTime } from '../../utils'
import { generateCronInitialValue } from '../../utils/generateCronInitialValue'
import { getDefaultSchedule } from '../../utils/getDefaultSchedule'

const ScheduleJob = ({
  defaultCron = '',
  handleEditJob = () => {},
  handleRunJob,
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
  const [recurringState, recurringDispatch] = useReducer(recurringReducer, initialState)
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
      recurringState.scheduleRepeat[recurringState.scheduleRepeat.activeOption].time
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
      getDefaultSchedule(defaultCron, recurringDispatch)
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

ScheduleJob.propTypes = {
  defaultCron: PropTypes.string,
  handleEditJob: PropTypes.func,
  handleRunJob: PropTypes.func.isRequired,
  panelDispatch: PropTypes.func.isRequired,
  panelState: PropTypes.shape({}).isRequired,
  setOpenScheduleJob: PropTypes.func.isRequired
}

export default ScheduleJob
