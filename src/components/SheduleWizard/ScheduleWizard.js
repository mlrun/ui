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
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { Button, PopUpDialog } from 'igz-controls/components'
import ScheduleWizardSimple from './ScheduleWizardSimple'
import ScheduleWizardCronstring from './ScheduleWizardCronstring'
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage'

import { tabs } from '../ScheduleJob/scheduleJobData'
import { decodeLocale, getWeekDays, getWeekStart } from '../../utils/datePicker.util'
import { getFormatTime } from '../../utils'
import { generateCronInitialValue } from '../../utils/generateCronInitialValue'
import { SECONDARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'
import { getDefaultSchedule, scheduleDataInitialState } from './scheduleWizard.util'
import { SCHEDULE_DATA } from '../../types'
import { SIMPLE_SCHEDULE, CRONSTRING_SCHEDULE } from '../../constants'

import { ReactComponent as Schedule } from 'igz-controls/images/clock.svg'

import './scheduleWizard.scss'

const ScheduleWizard = ({
  onSchedule,
  scheduleButtonRef,
  scheduleData,
  setFieldValue,
  setShowSchedule
}) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id)

  const startWeek = useMemo(() => getWeekStart(decodeLocale(navigator.language)), [])
  const daysOfWeek = useMemo(() => getWeekDays(startWeek), [startWeek])
  const isWeekDaysEmpty = useMemo(() => {
    return (
      activeTab === SIMPLE_SCHEDULE &&
      scheduleData.activeOption === 'week' &&
      !scheduleData.week.days.length
    )
  }, [activeTab, scheduleData.activeOption, scheduleData.week.days.length])

  const setCron = useCallback(
    value => {
      setFieldValue('scheduleData.cron', value)
    },
    [setFieldValue]
  )

  const handleDaysOfWeek = day => {
    const { week, activeOption } = scheduleData

    let distinctWeek = week.days

    distinctWeek = week.days.includes(day)
      ? distinctWeek.filter(item => item !== day)
      : [...week.days, day]

    let days = daysOfWeek
      .filter(day => distinctWeek.includes(day.id))
      .map(day => (day.index + 6) % 7)
      .sort()
      .join(',')

    days = days || '*'

    const { hour, minute } = getFormatTime(scheduleData[activeOption].time ?? '00:00')

    setFieldValue('scheduleData.cron', `${minute} ${hour} * * ${days}`)
    setFieldValue('scheduleData.week.days', distinctWeek)
  }

  useEffect(() => {
    if (activeTab === SIMPLE_SCHEDULE) {
      generateCronInitialValue(
        scheduleData.activeOption,
        scheduleData.cron,
        scheduleData,
        daysOfWeek,
        setCron
      )
    }
  }, [activeTab, daysOfWeek, scheduleData.cron, scheduleData, setCron])

  useEffect(() => {
    return () => {
      setFieldValue(
        'scheduleData',
        scheduleData.defaultCron
          ? getDefaultSchedule(scheduleData.defaultCron)
          : scheduleDataInitialState
      )
    }
  }, [scheduleData.defaultCron, setFieldValue])

  return (
    <PopUpDialog
      className="schedule-wizard"
      headerIsHidden
      customPosition={{
        element: scheduleButtonRef,
        position: 'top-left'
      }}
    >
      <div className="schedule-wizard form">
        <div className="schedule-tabs">
          {tabs.map(tab => {
            const tabItemClassNames = classnames(
              'schedule-tabs__item',
              activeTab === tab.id && 'schedule-tabs__item_active'
            )

            return (
              <div className={tabItemClassNames} key={tab.id} onClick={() => setActiveTab(tab.id)}>
                {tab.label}
              </div>
            )
          })}
        </div>
        <div className="schedule-content">
          <h3>{activeTab === SIMPLE_SCHEDULE ? 'Simple Schedule' : 'Advanced Schedule'}</h3>
          <p>
            Note: all times are interpreted in UTC timezone. <br />
            The first weekday (0) is always <b>Monday</b>.
          </p>

          {activeTab === SIMPLE_SCHEDULE && (
            <ScheduleWizardSimple
              scheduleData={scheduleData}
              daysOfWeek={daysOfWeek}
              handleDaysOfWeek={handleDaysOfWeek}
            />
          )}

          {activeTab === CRONSTRING_SCHEDULE && <ScheduleWizardCronstring />}

          {isWeekDaysEmpty && <ErrorMessage message="Must select at least one day option" />}
        </div>
        <div className="modal__footer-actions">
          <Button label="Cancel" onClick={() => setShowSchedule(false)} variant={TERTIARY_BUTTON} />
          <Button
            variant={SECONDARY_BUTTON}
            disabled={isWeekDaysEmpty}
            label={
              <>
                <Schedule />
                <span>Schedule </span>
              </>
            }
            onClick={onSchedule}
          />
        </div>
      </div>
    </PopUpDialog>
  )
}

ScheduleWizard.propTypes = {
  scheduleData: SCHEDULE_DATA.isRequired,
  scheduleButtonRef: PropTypes.shape({}).isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setShowSchedule: PropTypes.func.isRequired,
  onSchedule: PropTypes.func.isRequired
}

export default ScheduleWizard
