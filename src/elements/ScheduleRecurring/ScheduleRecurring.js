import React from 'react'
import PropTypes from 'prop-types'

import RangeInput from '../../common/RangeInput/RangeInput'
import Select from '../../common/Select/Select'
import DatePicker from '../../common/DatePicker/DatePicker'

import { scheduleActionType } from '../../components/ScheduleJob/recurringReducer'

import './scheduleRecurring.scss'

const ScheduleRecurring = ({
  cron,
  daysOfWeek,
  getRangeInputValue,
  handleDaysOfWeek,
  match,
  recurringDispatch,
  recurringState,
  selectOptions,
  setCron
}) => {
  const {
    scheduleRepeat: { activeOption: scheduleRepeatActiveOption, week },
    scheduleRepeatEnd: {
      activeOption: scheduleRepeatEndActiveOption,
      occurrences,
      date
    }
  } = recurringState

  const handleRangeInputChange = item => {
    switch (scheduleRepeatActiveOption) {
      case 'minute':
        setCron({ ...cron, minute: `*/${item}` })
        break
      case 'hour':
        setCron({ ...cron, hour: `*/${item}`, minute: '0' })
        break
      case 'day':
        setCron({ ...cron, day: item, hour: '0', minute: '0' })
        break
      case 'week':
        setCron({ ...cron, day: `*/${item * 7}`, hour: '0', minute: '0' })
        break
      default:
        setCron({
          ...cron,
          day: '1',
          hour: '0',
          minute: '0',
          month: `*/${item}`
        })
    }

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

  return (
    <div className="recurring_container">
      <span>Repeat every</span>
      <div className="repeat_container">
        <RangeInput
          min={scheduleRepeatActiveOption === 'minute' ? 10 : 1}
          onChange={item => handleRangeInputChange(item)}
          value={getRangeInputValue()}
        />
        <Select
          onClick={item => {
            setCron({
              minute: '0',
              hour: '0',
              day: '*',
              month: '*',
              week: '*'
            })
            recurringDispatch({
              type: scheduleActionType.SCHEDULE_REPEAT_ACTIVE_OPTION,
              payload: item
            })
          }}
          options={selectOptions.repeatInterval}
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
      {/* <span>Ends</span> */}
      <div className="repeat_end_container">
        <Select
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
  cron: PropTypes.shape({}).isRequired,
  daysOfWeek: PropTypes.array.isRequired,
  getRangeInputValue: PropTypes.func.isRequired,
  handleDaysOfWeek: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  recurringDispatch: PropTypes.func.isRequired,
  recurringState: PropTypes.shape({}).isRequired,
  selectOptions: PropTypes.shape({}).isRequired,
  setCron: PropTypes.func.isRequired
}

export default React.memo(ScheduleRecurring)
