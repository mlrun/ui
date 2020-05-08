import React from 'react'
import PropTypes from 'prop-types'

import RangeInput from '../../common/RangeInput/RangeInput'
import Select from '../../common/Select/Select'
import DatePicker from '../../common/DatePicker/DatePicker'

import { scheduleActionType } from '../../components/ScheduleJob/recurringReducer'
import './scheduleRecurring.scss'

const ScheduleRecurring = ({
  daysOfWeek,
  recurringDispatch,
  match,
  recurringState,
  handleDaysOfWeek
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
          value={
            scheduleRepeatActiveOption === 'week'
              ? week.repeat.toString()
              : recurringState.scheduleRepeat[
                  scheduleRepeatActiveOption
                ].toString()
          }
        />
        <Select
          match={match}
          onClick={item => {
            recurringDispatch({
              type: scheduleActionType.SCHEDULE_REPEAT_ACTIVE_OPTION,
              payload: item
            })
          }}
          option="repeatInterval"
          page="jobs"
          value={scheduleRepeatActiveOption}
        />
        {scheduleRepeatActiveOption === 'week' && (
          <div className="schedule-repeat-week">
            {daysOfWeek.map(day => (
              <span
                key={day.id}
                className={`schedule-repeat-week_day ${week.daysOfTheWeek.includes(
                  day.id
                ) && 'active'}`}
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
          option="repeatEnd"
          page="jobs"
          value={scheduleRepeatEndActiveOption}
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
            onChange={item =>
              recurringDispatch({
                type: scheduleActionType.SCHEDULE_REPEAT_END_OCCURRENCES,
                payload: item.toString()
              })
            }
            label={occurrences.length < 10 ? 'occurrences' : ''}
            infoLabel
            value={occurrences.toString()}
          />
        )}
      </div>
    </div>
  )
}

PropTypes.propTypes = {
  daysOfWeek: PropTypes.array.isRequired,
  handleDaysOfWeek: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  recurringDispatch: PropTypes.func.isRequired,
  recurringState: PropTypes.shape({}).isRequired
}

export default React.memo(ScheduleRecurring)
