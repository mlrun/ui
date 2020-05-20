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
  generateCronString,
  getRangeInputValue,
  handleDaysOfWeek,
  isRecurring,
  match,
  onSchedule,
  recurringDispatch,
  recurringState,
  selectOptions,
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
            className={`schedule_tabs_item ${activeTab === tab.id && 'active'}`}
            key={tab.id}
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
          getRangeInputValue={getRangeInputValue}
          handleDaysOfWeek={handleDaysOfWeek}
          isRecurring={isRecurring}
          match={match}
          recurringDispatch={recurringDispatch}
          recurringState={recurringState}
          selectOptions={selectOptions}
          setDate={setDate}
          setIsRecurring={setIsRecurring}
          setTime={setTime}
          time={time}
        />
      )}
      {activeTab === scheduleData.tabs[1].id && (
        <ScheduleCron cron={cron} generateCronString={generateCronString} />
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
  generateCronString: PropTypes.func.isRequired,
  getRangeInputValue: PropTypes.func.isRequired,
  handleDaysOfWeek: PropTypes.func.isRequired,
  isRecurring: PropTypes.string.isRequired,
  match: PropTypes.shape({}).isRequired,
  onSchedule: PropTypes.func.isRequired,
  recurringDispatch: PropTypes.func.isRequired,
  recurringState: PropTypes.shape({}).isRequired,
  selectOptions: PropTypes.shape({}).isRequired,
  setActiveTab: PropTypes.func.isRequired,
  setDate: PropTypes.func.isRequired,
  setIsRecurring: PropTypes.func.isRequired,
  setTime: PropTypes.func.isRequired,
  time: PropTypes.string.isRequired
}

export default ScheduleJobView
