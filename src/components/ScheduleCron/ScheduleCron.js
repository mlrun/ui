import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import './scheduleCron.scss'

const ScheduleCron = ({ cron, generateCronString }) => {
  const [cronString, setCronString] = useState('')
  useEffect(() => {
    const generateCron = generateCronString(cron)
    setCronString(generateCron)
  }, [cron, generateCronString])
  return (
    <div className="schedule-cron-container">
      <div className="cron-string">{cronString}</div>
    </div>
  )
}

ScheduleCron.propTypes = {
  cron: PropTypes.shape({}).isRequired,
  generateCronString: PropTypes.func.isRequired
}

export default ScheduleCron
