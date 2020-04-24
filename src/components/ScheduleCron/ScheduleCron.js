import React from 'react'

import './scheduleCron.scss'

const ScheduleCron = ({ cron }) => {
  return (
    <div className="schedule-cron-container">
      <div className="cron-string">{cron}</div>
    </div>
  )
}

export default ScheduleCron
