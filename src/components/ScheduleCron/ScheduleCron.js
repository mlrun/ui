import React from 'react'
import PropTypes from 'prop-types'
import cronstrue from 'cronstrue'

import Input from '../../common/Input/Input'

const ScheduleCron = ({ cron, setCron }) => {
  return (
    <>
      <p>Note: all times are interpreted in UTC timezone</p>
      <Input
        placeholder="10 * * * *"
        value={cron}
        className="cron-string"
        onChange={setCron}
        type="text"
      />
      <p>
        {cronstrue.toString(cron, {
          throwExceptionOnParseError: false
        })}
      </p>
      <div>
        You can use{' '}
        <a
          className="link cron-link"
          rel="noopener noreferrer"
          target="_blank"
          href="https://www.freeformatter.com/cron-expression-generator-quartz.html"
        >
          this external website
        </a>{' '}
        to generate cronstring
      </div>
    </>
  )
}

ScheduleCron.propTypes = {
  cron: PropTypes.string.isRequired,
  setCron: PropTypes.func.isRequired
}

export default ScheduleCron
