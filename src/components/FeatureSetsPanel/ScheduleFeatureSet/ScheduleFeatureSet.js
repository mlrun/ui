import React, { useCallback, useEffect, useReducer, useState } from 'react'
import PropTypes from 'prop-types'

import ScheduleFeatureSetView from './ScheduleFeatureSetView'

import { tabs } from './scheduleFeatureSet.util'
import {
  initialState,
  recurringReducer,
  scheduleActionType
} from './recurringReducer'
import {
  decodeLocale,
  getWeekDays,
  getWeekStart
} from '../../../utils/datePicker.util'
import { getFormatTime } from '../../../utils'
import { generateCronInitialValue } from '../../../utils/generateCronInitialValue'

const ScheduleFeatureSet = ({ setNewFeatureSetSchedule, setShowSchedule }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id)
  const [cron, setCron] = useState('10 * * * *')
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

  const onSchedule = useCallback(
    event => {
      setShowSchedule(false)
      setNewFeatureSetSchedule(cron)
    },
    [cron, setNewFeatureSetSchedule, setShowSchedule]
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

  return (
    <ScheduleFeatureSetView
      activeTab={activeTab}
      cron={cron}
      daysOfWeek={daysOfWeek}
      handleDaysOfWeek={handleDaysOfWeek}
      onSchedule={onSchedule}
      recurringDispatch={recurringDispatch}
      recurringState={recurringState}
      setActiveTab={setActiveTab}
      setCron={setCron}
      setShowSchedule={setShowSchedule}
    />
  )
}

ScheduleFeatureSet.propTypes = {
  setNewFeatureSetSchedule: PropTypes.func.isRequired,
  setShowSchedule: PropTypes.func.isRequired
}

export default ScheduleFeatureSet
