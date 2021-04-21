import React from 'react'
import PropTypes from 'prop-types'

import ScheduleRecurring from '../../../elements/ScheduleRecurring/ScheduleRecurring'

const ScheduleFeatureSetSimple = ({
  daysOfWeek,
  handleDaysOfWeek,
  recurringDispatch,
  recurringState
}) => {
  return (
    <>
      <ScheduleRecurring
        daysOfWeek={daysOfWeek}
        handleDaysOfWeek={handleDaysOfWeek}
        recurringDispatch={recurringDispatch}
        recurringState={recurringState}
      />
    </>
  )
}

ScheduleFeatureSetSimple.propTypes = {
  daysOfWeek: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleDaysOfWeek: PropTypes.func.isRequired,
  recurringDispatch: PropTypes.func.isRequired,
  recurringState: PropTypes.shape({}).isRequired
}

export default ScheduleFeatureSetSimple
