import React from 'react'
import PropTypes from 'prop-types'

import RangeInput from '../../common/RangeInput/RangeInput'
import Select from '../../common/Select/Select'

import './scheduleRecurring.scss'

const ScheduleRecurring = ({
  match,
  scheduleRepeatEnd,
  scheduleRepeatInterval,
  scheduleRepeatStep,
  setScheduleRepeatEnd,
  setScheduleRepeatInterval,
  setScheduleRepeatStep
}) => {
  return (
    <div className="recurring_container">
      <span>Repeat every</span>
      <div className="repeat_container">
        <RangeInput
          onChange={setScheduleRepeatStep}
          value={scheduleRepeatStep.toString()}
        />
        <Select
          match={match}
          onClick={setScheduleRepeatInterval}
          option="repeatInterval"
          page="jobs"
          value={scheduleRepeatInterval}
        />
      </div>
      <span>Ends</span>
      <div className="repeat_end_container">
        <Select
          match={match}
          onClick={setScheduleRepeatEnd}
          option="repeatEnd"
          page="jobs"
          value={scheduleRepeatEnd}
        />
      </div>
    </div>
  )
}

PropTypes.propTypes = {
  match: PropTypes.shape({}).isRequired,
  scheduleRepeatEnd: PropTypes.string.isRequired,
  scheduleRepeatInterval: PropTypes.string.isRequired,
  scheduleRepeatStep: PropTypes.number.isRequired,
  setScheduleRepeatEnd: PropTypes.func.isRequired,
  setScheduleRepeatInterval: PropTypes.func.isRequired,
  setScheduleRepeatStep: PropTypes.func.isRequired
}

export default React.memo(ScheduleRecurring)
