import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import './scheduleCron.scss'

const ScheduleCron = ({ cron }) => {
  const [cronString, setCronString] = useState('')
  useEffect(() => {
    const generateCron = Object.keys(cron).reduce((prev, next, index, arr) => {
      return (prev += arr.length - 1 === index ? cron[next] : cron[next] + ' ')
    }, '')
    setCronString(generateCron)
  }, [cron])
  return (
    <div className="schedule-cron-container">
      <div className="cron-string">{cronString}</div>
    </div>
  )
}

ScheduleCron.propTypes = {
  cron: PropTypes.shape({}).isRequired
}

export default ScheduleCron
