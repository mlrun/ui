import React from 'react'
import PropTypes from 'prop-types'

import './scheduleCron.scss'

const ScheduleCron = ({ cron }) => {
  return (
    <div className="schedule-cron-container">
      <div className="cron-string">{cron}</div>
    </div>
  )
}

ScheduleCron.propTypes = {
  cron: PropTypes.string.isRequired
}

export default ScheduleCron
