import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import cronstrue from 'cronstrue'

import Input from '../../common/Input/Input'
import { ReactComponent as Alert } from '../../images/unsuccess_alert.svg'

import './scheduleCron.scss'

const ScheduleCron = ({ cron, error, setCron, setEditMode }) => {
  const errorClassNames = classnames('cron-error', error && 'show-error')

  return (
    <>
      <div className={errorClassNames}>
        <Alert className="error-icon" />
        {error}
      </div>
      <p>Note: all times are interpreted in UTC timezone</p>
      <Input
        placeholder="10 * * * *"
        value={cron}
        className="cron-string"
        onChange={setCron}
        onFocus={setEditMode}
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
          className="cron-link"
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
  error: PropTypes.string.isRequired,
  setCron: PropTypes.func.isRequired
}

export default ScheduleCron
