import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { FormSelect } from 'igz-controls/components'
import FormTimePicker from '../../common/FormTimePicker/FormTimePicker'

import { selectOptions } from './scheduleWizard.util'
import { DAYS_OF_WEEK, SCHEDULE_DATA } from '../../types'

import './scheduleWizard.scss'

const ScheduleWizardSimple = ({ daysOfWeek, handleDaysOfWeek, scheduleData }) => {
  const activeOption = useMemo(() => scheduleData.activeOption, [scheduleData.activeOption])

  return (
    <>
      <div className="form-row">
        <FormSelect
          label="Time unit"
          options={selectOptions.repeatInterval}
          name="scheduleData.activeOption"
          className="form-col-1"
        />
        {activeOption === 'week' && (
          <div className="schedule-repeat schedule-repeat-week form-col-1">
            {daysOfWeek.map(day => (
              <span
                className={`schedule-repeat-week_day ${
                  scheduleData.week.days.includes(day.id) && 'active'
                }`}
                key={day.id}
                onClick={() => handleDaysOfWeek(day.id)}
              >
                {day.label}
              </span>
            ))}
          </div>
        )}
        {['minute', 'hour'].includes(activeOption) && (
          <FormSelect
            name={`scheduleData.${activeOption}`}
            label="Intervals"
            options={selectOptions[activeOption]}
            className="form-col-1"
          />
        )}
        {['day', 'month', 'week'].includes(activeOption) && (
          <FormTimePicker
            name={`scheduleData.${activeOption}.time`}
            label={activeOption === 'month' ? 'On the 1st day of every month at' : 'At time'}
            className="form-col-1"
          />
        )}
      </div>
    </>
  )
}

ScheduleWizardSimple.propTypes = {
  daysOfWeek: DAYS_OF_WEEK.isRequired,
  handleDaysOfWeek: PropTypes.func.isRequired,
  scheduleData: SCHEDULE_DATA.isRequired
}

export default ScheduleWizardSimple
