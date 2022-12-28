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
import React from 'react'
import PropTypes from 'prop-types'

import RangeInput from '../../common/RangeInput/RangeInput'
import Select from '../../common/Select/Select'
import DatePicker from '../../common/DatePicker/DatePicker'
import TimePicker from '../../common/TimePicker/TimePicker'

import { scheduleActionType } from '../../components/ScheduleJob/recurringReducer'
import { selectOptions } from './scheduleRecurring.util'

import './scheduleRecurring.scss'

const ScheduleRecurring = ({ daysOfWeek, handleDaysOfWeek, recurringDispatch, recurringState }) => {
  const {
    scheduleRepeat: { activeOption: scheduleRepeatActiveOption, week },
    scheduleRepeatEnd: { activeOption: scheduleRepeatEndActiveOption, occurrences, date }
  } = recurringState

  const handleScheduleRepeatChange = (value, activeOption) => {
    const selectedOption = activeOption ?? scheduleRepeatActiveOption

    recurringDispatch({
      type:
        selectedOption === 'minute'
          ? scheduleActionType.SCHEDULE_REPEAT_MINUTE
          : selectedOption === 'hour'
          ? scheduleActionType.SCHEDULE_REPEAT_HOUR
          : null,
      payload: parseInt(value)
    })
  }

  return (
    <div className="recurring-container">
      <p>
        Note: all times are interpreted in UTC timezone. <br />
        The first day of the week (0) is <b>Monday</b>, and not Sunday.
      </p>
      <div className="repeat_container">
        <Select
          density="chunky"
          onClick={item => {
            recurringDispatch({
              type: scheduleActionType.SCHEDULE_REPEAT_ACTIVE_OPTION,
              payload: item
            })
          }}
          options={selectOptions.repeatInterval}
          selectedId={scheduleRepeatActiveOption}
        />
        {scheduleRepeatActiveOption === 'week' && (
          <div className="schedule-repeat schedule-repeat-week">
            {daysOfWeek.map(day => (
              <span
                className={`schedule-repeat-week_day ${week.days.includes(day.id) && 'active'}`}
                key={day.id}
                onClick={() => handleDaysOfWeek(day.id)}
              >
                {day.label}
              </span>
            ))}
          </div>
        )}

        {['minute', 'hour'].includes(scheduleRepeatActiveOption) && (
          <div className="schedule-repeat">
            <Select
              density="chunky"
              label="Every"
              onClick={option => handleScheduleRepeatChange(option, null)}
              options={selectOptions[scheduleRepeatActiveOption]}
              selectedId={
                selectOptions[scheduleRepeatActiveOption].find(
                  option =>
                    option.id ===
                    recurringState.scheduleRepeat[scheduleRepeatActiveOption].toString()
                )?.id
              }
            />
          </div>
        )}
        <span className="schedule-repeat-text">
          {scheduleRepeatActiveOption === 'minute'
            ? 'minutes'
            : scheduleRepeatActiveOption === 'hour'
            ? 'hours at minute 0 past the hour'
            : scheduleRepeatActiveOption === 'month'
            ? 'on the 1st day in every month at'
            : 'at'}
        </span>
        {['day', 'month', 'week'].includes(scheduleRepeatActiveOption) && (
          <TimePicker
            hideLabel
            value={recurringState.scheduleRepeat[scheduleRepeatActiveOption].time}
            onChange={value => {
              recurringDispatch({
                type:
                  scheduleRepeatActiveOption === 'week'
                    ? scheduleActionType.SCHEDULE_REPEAT_WEEK_TIME
                    : scheduleRepeatActiveOption === 'day'
                    ? scheduleActionType.SCHEDULE_REPEAT_DAY_TIME
                    : scheduleActionType.SCHEDULE_REPEAT_MONTH_TIME,
                payload: value
              })
            }}
          />
        )}
      </div>
      {/* <span>Ends</span> */}
      <div className="repeat_end_container">
        <Select
          density="chunky"
          onClick={item =>
            recurringDispatch({
              type: scheduleActionType.SCHEDULE_REPEAT_END_ACTIVE_OPTION,
              payload: item
            })
          }
          options={selectOptions.repeatEnd}
          selectedId={scheduleRepeatEndActiveOption}
        />
        {scheduleRepeatEndActiveOption === 'onDate' && (
          <DatePicker
            date={date}
            onChange={item =>
              recurringDispatch({
                type: scheduleActionType.SCHEDULE_REPEAT_END_DATE,
                payload: item
              })
            }
          />
        )}
        {scheduleRepeatEndActiveOption === 'after' && (
          <RangeInput
            labelType="infoLabel"
            label={occurrences.length < 10 ? 'occurrences' : ''}
            onChange={item =>
              recurringDispatch({
                type: scheduleActionType.SCHEDULE_REPEAT_END_OCCURRENCES,
                payload: item.toString()
              })
            }
            value={occurrences.toString()}
          />
        )}
      </div>
    </div>
  )
}

ScheduleRecurring.propTypes = {
  daysOfWeek: PropTypes.array.isRequired,
  handleDaysOfWeek: PropTypes.func.isRequired,
  recurringDispatch: PropTypes.func.isRequired,
  recurringState: PropTypes.shape({}).isRequired
}

export default React.memo(ScheduleRecurring)
