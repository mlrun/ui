import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import ScheduleJobSimple from '../ScheduleJobSimple/ScheduleJobSimple'
import ScheduleCron from '../ScheduleCron/ScheduleCron'

import { ReactComponent as Schedule } from '../../images/clock.svg'

import scheduleData from './scheduleData.json'

const ScheduleJobView = ({
  activeTab,
  cronString,
  date,
  daysOfWeek,
  error,
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
  setCronString,
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
      <div className="schedule-content">
        <h3>
          {activeTab === scheduleData.tabs[0].id ? 'Simple ' : 'Advanced '}
          Schedule
        </h3>
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
          <ScheduleCron
            cronString={cronString}
            error={error}
            generateCronString={generateCronString}
            setCronString={setCronString}
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
  cronString: PropTypes.string.isRequired,
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
  setCronString: PropTypes.func.isRequired,
  setDate: PropTypes.func.isRequired,
  setIsRecurring: PropTypes.func.isRequired,
  setTime: PropTypes.func.isRequired,
  time: PropTypes.string.isRequired
}

export default ScheduleJobView
