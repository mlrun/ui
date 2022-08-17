import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { Button, PopUpDialog } from 'igz-controls/components'
import ScheduleWizardSimple from './ScheduleWizardSimple'
import ScheduleWizardCronstring from './ScheduleWizardCronstring'

import { tabs } from '../ScheduleJob/scheduleJobData'
import { decodeLocale, getWeekDays, getWeekStart } from '../../utils/datePicker.util'
import { getFormatTime } from '../../utils'
import { generateCronInitialValue } from '../../utils/generateCronInitialValue'
import { SECONDARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'
import { getDefaultSchedule, scheduleDataInitialState } from './scheduleWizard.util'
import { SCHEDULE_DATA } from '../../types'

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
    if (activeTab === tabs[0].id) {
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
          <h3>
            {activeTab === tabs[0].id ? 'Simple ' : 'Advanced '}
            Schedule
          </h3>
          <p>Note: all times are interpreted in UTC timezone</p>

          {activeTab === tabs[0].id && (
            <ScheduleWizardSimple
              scheduleData={scheduleData}
              daysOfWeek={daysOfWeek}
              handleDaysOfWeek={handleDaysOfWeek}
            />
          )}

          {activeTab === tabs[1].id && <ScheduleWizardCronstring scheduleData={scheduleData} />}
        </div>
        <div className="modal__footer-actions">
          <Button label="Cancel" onClick={() => setShowSchedule(false)} variant={TERTIARY_BUTTON} />
          <Button
            variant={SECONDARY_BUTTON}
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
