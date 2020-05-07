import React from 'react'
import PropTypes from 'prop-types'

import ScheduleJobSimple from '../ScheduleJobSimple/ScheduleJobSimple'
import ScheduleCron from '../ScheduleCron/ScheduleCron'

import { ReactComponent as Schedule } from '../../images/clock.svg'

import scheduleData from './scheduleData.json'

const ScheduleJobView = ({
  activeTab,
  cron,
  date,
  daysOfWeek,
  dispatch,
  generateCronString,
  isRecurring,
  match,
  onSchedule,
  recurringState,
  setActiveTab,
  setDate,
  setIsRecurring,
  setTime,
  time
}) => {
  return (
    <div className="schedule_container">
      <div className="schedule_tabs">
        {scheduleData.tabs.map(tab => (
          <div
            key={tab.id}
            className={`schedule_tabs_item ${activeTab === tab.id && 'active'}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>
      {activeTab === scheduleData.tabs[0].id && (
        <ScheduleJobSimple
          date={date}
          daysOfWeek={daysOfWeek}
          dispatch={dispatch}
          isRecurring={isRecurring}
          match={match}
          recurringState={recurringState}
          setDate={setDate}
          setIsRecurring={setIsRecurring}
          setTime={setTime}
          time={time}
        />
      )}
      {activeTab === scheduleData.tabs[1].id && (
        <ScheduleCron generateCronString={generateCronString} cron={cron} />
      )}
      <button className="btn btn_primary btn__schedule" onClick={onSchedule}>
        <Schedule />
        Schedule
      </button>
    </div>
  )
}

ScheduleJobView.propTypes = {
  activeTab: PropTypes.string.isRequired,
  cron: PropTypes.shape({}).isRequired,
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
  daysOfWeek: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
  generateCronString: PropTypes.func.isRequired,
  isRecurring: PropTypes.string.isRequired,
  match: PropTypes.shape({}).isRequired,
  onSchedule: PropTypes.func.isRequired,
  recurringState: PropTypes.shape({}).isRequired,
  setActiveTab: PropTypes.func.isRequired,
  setDate: PropTypes.func.isRequired,
  setIsRecurring: PropTypes.func.isRequired,
  setTime: PropTypes.func.isRequired,
  time: PropTypes.string.isRequired
}

export default ScheduleJobView
