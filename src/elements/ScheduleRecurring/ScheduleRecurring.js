import React from 'react'
import PropTypes from 'prop-types'

import RangeInput from '../../common/RangeInput/RangeInput'
import Select from '../../common/Select/Select'
import DatePicker from '../../common/DatePicker/DatePicker'

import { scheduleActionType } from '../../components/ScheduleJob/recurringReducer'

import './scheduleRecurring.scss'

const ScheduleRecurring = ({ daysOfWeek, dispatch, match, recurringState }) => {
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
            dispatch({
              type: scheduleRepeatActiveOption,
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
          onClick={item =>
            dispatch({
              type: scheduleActionType.SCHEDULE_REPEAT_ACTIVE_OPTION,
              payload: item
            })
          }
          option="repeatInterval"
          page="jobs"
          value={scheduleRepeatActiveOption}
        />
        {scheduleRepeatActiveOption === 'week' && (
          <div className="schedule-repeat-week">
            {daysOfWeek.map(day => (
              <span
                key={day.label}
                className={`schedule-repeat-week_day ${
                  week.daysOfTheWeek.includes(day.label)
                    ? 'active'
                    : 'not-active'
                }`}
                onClick={() =>
                  dispatch({
                    type: scheduleActionType.SCHEDULE_REPEAT_DAYS_OF_WEEK,
                    payload: day.label
                  })
                }
              >
                {day.shortLabel}
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
            dispatch({
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
              dispatch({
                type: scheduleActionType.SCHEDULE_REPEAT_END_DATE,
                payload: item
              })
            }
            splitCharacter="."
            value={date}
          />
        )}
        {scheduleRepeatEndActiveOption === 'after' && (
          <div className="range-input-container">
            <RangeInput
              onChange={item =>
                dispatch({
                  type: scheduleActionType.SCHEDULE_REPEAT_END_OCCURRENCES,
                  payload: item.toString()
                })
              }
              value={occurrences.toString()}
            />
            <span
              className={`range-input-label range-input-label-position-left-${
                occurrences.length <= 0 ? 20 : occurrences.length < 3 ? 40 : 50
              }px`}
            >
              occurrences
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

PropTypes.propTypes = {
  daysOfWeek: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  recurringState: PropTypes.shape({}).isRequired
}

export default React.memo(ScheduleRecurring)
