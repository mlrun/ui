import React from 'react'
import PropTypes from 'prop-types'

import RangeInput from '../../common/RangeInput/RangeInput'
import Select from '../../common/Select/Select'
import DatePicker from '../../common/DatePicker/DatePicker'

import { scheduleActionType } from '../../components/ScheduleJob/recurringReducer'

import './scheduleRecurring.scss'

const ScheduleRecurring = ({
  daysOfWeek,
  handleDaysOfWeek,
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

  const handleScheduleRepeatChange = (value, activeOption) => {
    const selectedOption = activeOption || scheduleRepeatActiveOption
    switch (selectedOption) {
      case 'minute':
        setCron(`${value} * * * *`)
        break
      case 'hour':
        setCron(`0 ${value} * * *`)
        break
      case 'day':
        setCron('0 0 * * *')
        break
      case 'week':
        {
          const days = daysOfWeek
            .filter(day => week.includes(day.id))
            .map(day => day.index)
            .sort()
            .join(',')

          setCron(`0 0 * * ${days}`)
        }
        break
      case 'month':
        setCron('0 0 1 * *')
        break
      default:
        return null
    }

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
    <div className="recurring_container">
      <div className="repeat_container">
        <Select
          onClick={item => {
            handleScheduleRepeatChange(
              recurringState.scheduleRepeat[item],
              item
            )
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
                className={`schedule-repeat-week_day ${week.includes(day.id) &&
                  'active'}`}
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
            <span className="schedule-repeat__text">Every</span>
            <Select
              onClick={option => handleScheduleRepeatChange(option, null)}
              options={selectOptions[scheduleRepeatActiveOption]}
              selectedId={
                selectOptions[scheduleRepeatActiveOption].find(
                  option =>
                    option.id ===
                    recurringState.scheduleRepeat[
                      scheduleRepeatActiveOption
                    ].toString()
                ).id
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
            ? 'on the 1st day in every month at 00:00'
            : 'at 00:00'}
        </span>
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
  daysOfWeek: PropTypes.array.isRequired,
  handleDaysOfWeek: PropTypes.func.isRequired,
  recurringDispatch: PropTypes.func.isRequired,
  recurringState: PropTypes.shape({}).isRequired,
  selectOptions: PropTypes.shape({}).isRequired,
  setCron: PropTypes.func.isRequired
}

export default React.memo(ScheduleRecurring)
