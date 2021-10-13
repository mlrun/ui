import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import ScheduleJobSimple from '../ScheduleJobSimple/ScheduleJobSimple'
import ScheduleCron from '../ScheduleCron/ScheduleCron'
import Button from '../../common/Button/Button'

import { SECONDARY_BUTTON } from '../../constants'
import { tabs } from './scheduleJobData'

import { ReactComponent as Schedule } from '../../images/clock.svg'

import './scheduleJob.scss'
import JobsPanelCredentialsAccessKey from '../../elements/JobsPanelCredentialsAccessKey/JobsPanelCredentialsAccessKey'

const ScheduleJobView = ({
  activeTab,
  cron,
  date,
  daysOfWeek,
  handleDaysOfWeek,
  isRecurring,
  match,
  onSchedule,
  panelDispatch,
  panelState,
  recurringDispatch,
  recurringState,
  setActiveTab,
  setCron,
  setDate,
  setIsRecurring,
  setTime,
  time
}) => {
  return (
    <div className="schedule jobs-panel__schedule">
      <div className="schedule-tabs">
        {tabs.map(tab => {
          const tabItemClassNames = classnames(
            'schedule-tabs__item',
            activeTab === tab.id && 'schedule-tabs__item_active'
          )

          return (
            <div
              className={tabItemClassNames}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
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
        {activeTab === tabs[0].id && (
          <ScheduleJobSimple
            date={date}
            daysOfWeek={daysOfWeek}
            handleDaysOfWeek={handleDaysOfWeek}
            isRecurring={isRecurring}
            match={match}
            recurringDispatch={recurringDispatch}
            recurringState={recurringState}
            setDate={setDate}
            setIsRecurring={setIsRecurring}
            setTime={setTime}
            time={time}
          />
        )}
        {activeTab === tabs[1].id && (
          <ScheduleCron cron={cron} setCron={setCron} />
        )}
      </div>
      <JobsPanelCredentialsAccessKey
        isScheduled
        panelDispatch={panelDispatch}
        panelState={panelState}
      />
      <Button
        variant={SECONDARY_BUTTON}
        label={
          <>
            <Schedule />
            <span>Schedule </span>
          </>
        }
        onClick={onSchedule}
        className="btn__schedule"
      />
    </div>
  )
}

ScheduleJobView.propTypes = {
  activeTab: PropTypes.string.isRequired,
  cron: PropTypes.string.isRequired,
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
  daysOfWeek: PropTypes.array.isRequired,
  handleDaysOfWeek: PropTypes.func.isRequired,
  isRecurring: PropTypes.string.isRequired,
  match: PropTypes.shape({}).isRequired,
  onSchedule: PropTypes.func.isRequired,
  panelDispatch: PropTypes.func.isRequired,
  panelState: PropTypes.shape({}).isRequired,
  recurringDispatch: PropTypes.func.isRequired,
  recurringState: PropTypes.shape({}).isRequired,
  setActiveTab: PropTypes.func.isRequired,
  setCron: PropTypes.func.isRequired,
  setDate: PropTypes.func.isRequired,
  setIsRecurring: PropTypes.func.isRequired,
  setTime: PropTypes.func.isRequired,
  time: PropTypes.string.isRequired
}

export default ScheduleJobView
