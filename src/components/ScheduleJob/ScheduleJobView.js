import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import ScheduleJobSimple from '../ScheduleJobSimple/ScheduleJobSimple'
import ScheduleCron from '../ScheduleCron/ScheduleCron'

import { ReactComponent as Schedule } from '../../images/clock.svg'

import { selectOptions, tabs } from './scheduleJobData'

const ScheduleJobView = ({
  activeTab,
  cron,
  date,
  daysOfWeek,
  error,
  handleDaysOfWeek,
  isRecurring,
  match,
  onSchedule,
  recurringDispatch,
  recurringState,
  setActiveTab,
  setCron,
  setDate,
  setError,
  setIsRecurring,
  setTime,
  time
}) => {
  const scheduleBtnClassNames = classnames(
    'btn_primary',
    'btn_small',
    'btn__schedule'
  )

  return (
    <div className="schedule_container">
      <div className="schedule_tabs">
        {tabs.map(tab => (
          <div
            className={`schedule_tabs_item ${activeTab === tab.id && 'active'}`}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <div className="schedule-content">
        <h3>
          {activeTab === tabs[0].id ? 'Simple ' : 'Advanced '}
          Schedule
        </h3>
        {activeTab === tabs[0].id && (
          <ScheduleJobSimple
            cron={cron}
            date={date}
            daysOfWeek={daysOfWeek}
            handleDaysOfWeek={handleDaysOfWeek}
            isRecurring={isRecurring}
            match={match}
            recurringDispatch={recurringDispatch}
            recurringState={recurringState}
            selectOptions={selectOptions}
            setCron={setCron}
            setDate={setDate}
            setIsRecurring={setIsRecurring}
            setTime={setTime}
            time={time}
          />
        )}
        {activeTab === tabs[1].id && (
          <ScheduleCron
            cron={cron}
            error={error}
            setCron={setCron}
            setError={setError}
          />
        )}
      </div>
      <button className={scheduleBtnClassNames} onClick={onSchedule}>
        <Schedule />
        Schedule
      </button>
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
