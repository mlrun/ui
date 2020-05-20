import React from 'react'
import PropTypes from 'prop-types'

import RangeInput from '../../common/RangeInput/RangeInput'
import Select from '../../common/Select/Select'
import DatePicker from '../../common/DatePicker/DatePicker'

import { scheduleActionType } from '../../components/ScheduleJob/recurringReducer'

import './scheduleRecurring.scss'

const ScheduleRecurring = ({
  daysOfWeek,
  getRangeInputValue,
  handleDaysOfWeek,
  match,
  recurringDispatch,
  recurringState,
  selectOptions
}) => {
  const {
    scheduleRepeat: { activeOption: scheduleRepeatActiveOption, week },
    scheduleRepeatEnd: {
      activeOption: scheduleRepeatEndActiveOption,
      occurrences,
      date
    }
  } = recurringState

  return (
    <div className="recurring_container">
      <span>Repeat every</span>
      <div className="repeat_container">
        <RangeInput
          onChange={item =>
            recurringDispatch({
              type:
                scheduleRepeatActiveOption === 'minute'
                  ? scheduleActionType.SCHEDULE_REPEAT_MINUTE
                  : scheduleRepeatActiveOption === 'hour'
                  ? scheduleActionType.SCHEDULE_REPEAT_HOUR
                  : scheduleRepeatActiveOption === 'day'
                  ? scheduleActionType.SCHEDULE_REPEAT_DAY
                  : scheduleRepeatActiveOption === 'week'
                  ? scheduleActionType.SCHEDULE_REPEAT_WEEK
                  : scheduleActionType.SCHEDULE_REPEAT_MONTH,
              payload: item
            })
          }
          value={getRangeInputValue()}
        />
        <Select
          match={match}
          onClick={item => {
            recurringDispatch({
              type: scheduleActionType.SCHEDULE_REPEAT_ACTIVE_OPTION,
              payload: item
            })
          }}
          options={selectOptions.repeatInterval}
          page="jobs"
          selectedId={scheduleRepeatActiveOption}
        />
        {scheduleRepeatActiveOption === 'week' && (
          <div className="schedule-repeat-week">
            {daysOfWeek.map(day => (
              <span
                className={`schedule-repeat-week_day ${week.daysOfTheWeek.includes(
                  day.id
                ) && 'active'}`}
                key={day.id}
                onClick={() => handleDaysOfWeek(day.id)}
              >
                {day.label}
              </span>
            ))}
          </div>
        )}
      </div>
      <span>Ends</span>
      <div className="repeat_end_container">
        <Select
          match={match}
          onClick={item =>
            recurringDispatch({
              type: scheduleActionType.SCHEDULE_REPEAT_END_ACTIVE_OPTION,
              payload: item
            })
          }
          options={selectOptions.repeatEnd}
          page="jobs"
          selectedId={scheduleRepeatEndActiveOption}
        />
        {scheduleRepeatEndActiveOption === 'onDate' && (
          <DatePicker
            onChange={item =>
              recurringDispatch({
                type: scheduleActionType.SCHEDULE_REPEAT_END_DATE,
                payload: item
              })
            }
            splitCharacter="."
            value={date}
          />
        )}
        {scheduleRepeatEndActiveOption === 'after' && (
          <RangeInput
            infoLabel
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

PropTypes.propTypes = {
  daysOfWeek: PropTypes.array.isRequired,
  getRangeInputValue: PropTypes.func.isRequired,
  handleDaysOfWeek: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  recurringDispatch: PropTypes.func.isRequired,
  recurringState: PropTypes.shape({}).isRequired,
  selectOptions: PropTypes.shape({}).isRequired
}

export default React.memo(ScheduleRecurring)
