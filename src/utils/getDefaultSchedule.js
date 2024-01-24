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
import { scheduleActionType } from '../components/ScheduleJob/recurringReducer'

export const getDefaultSchedule = (defaultCron, recurringDispatch) => {
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
