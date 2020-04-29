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
  generateCronString,
  isRecurring,
  match,
  onChangeStep,
  onSchedule,
  scheduleRepeatEnd,
  scheduleRepeatInterval,
  scheduleRepeatStep,
  setActiveTab,
  setDate,
  setIsRecurring,
  setScheduleRepeatEnd,
  setScheduleRepeatInterval,
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
          isRecurring={isRecurring}
          match={match}
          onChangeStep={onChangeStep}
          scheduleRepeatEnd={scheduleRepeatEnd}
          scheduleRepeatInterval={scheduleRepeatInterval}
          scheduleRepeatStep={scheduleRepeatStep}
          setDate={setDate}
          setIsRecurring={setIsRecurring}
          setScheduleRepeatEnd={setScheduleRepeatEnd}
          setScheduleRepeatInterval={setScheduleRepeatInterval}
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
  generateCronString: PropTypes.func.isRequired,
  isRecurring: PropTypes.string.isRequired,
  match: PropTypes.shape({}).isRequired,
  onChangeStep: PropTypes.func.isRequired,
  onSchedule: PropTypes.func.isRequired,
  scheduleRepeatEnd: PropTypes.string.isRequired,
  scheduleRepeatInterval: PropTypes.string.isRequired,
  scheduleRepeatStep: PropTypes.shape({}).isRequired,
  setActiveTab: PropTypes.func.isRequired,
  setDate: PropTypes.func.isRequired,
  setIsRecurring: PropTypes.func.isRequired,
  setScheduleRepeatEnd: PropTypes.func.isRequired,
  setScheduleRepeatInterval: PropTypes.func.isRequired,
  setTime: PropTypes.func.isRequired,
  time: PropTypes.string.isRequired
}

export default ScheduleJobView
