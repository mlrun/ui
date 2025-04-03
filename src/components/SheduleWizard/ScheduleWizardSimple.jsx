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
        <div className="form-col-1 simple-schedule-item">
          <FormSelect
            label="Time unit"
            options={selectOptions.repeatInterval}
            name="scheduleData.activeOption"
          />
        </div>
        {activeOption === 'week' && (
          <div className="form-col-1 simple-schedule-item">
            <div className="schedule-repeat schedule-repeat-week">
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
          </div>
        )}
        {['minute', 'hour'].includes(activeOption) && (
          <div className="form-col-1 simple-schedule-item">
            <FormSelect
              name={`scheduleData.${activeOption}`}
              label="Intervals"
              options={selectOptions[activeOption]}
            />
          </div>
        )}
        {['day', 'month', 'week'].includes(activeOption) && (
          <div className="form-col-1">
            <FormTimePicker
              name={`scheduleData.${activeOption}.time`}
              label={activeOption === 'month' ? 'On the 1st day of every month at' : 'At time'}
            />
          </div>
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
