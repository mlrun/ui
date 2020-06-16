import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Input from '../../common/Input/Input'
import { ReactComponent as Alert } from '../../images/unsuccess_alert.svg'
import { ReactComponent as Checkmark } from '../../images/checkmark.svg'

import './scheduleCron.scss'

const ScheduleCron = ({
  cron,
  error,
  generateCronString,
  setCron,
  setError,
  success
}) => {
  const [cronString, setCronString] = useState('')
  const errorClassNames = classnames('cron-error', error && 'show-error')

  useEffect(() => {
    setCronString(generateCronString(cron))
  }, [cron, generateCronString])

  const generateCron = value => {
    let data = value.split(' ')
    let errorMessage = ''

    data = data.map(dataItem => {
      if (
        dataItem.length > 2 ||
        dataItem.match(/(\*+\d)/) ||
        dataItem.match(/(\d\*+)/)
      ) {
        errorMessage = 'Please add spaces after values'
      }

      if (dataItem !== '' && dataItem <= 0) {
        errorMessage = 'Value must be greater than zero'
      }

      if (dataItem === '') dataItem = '*'

      if (!Number(dataItem) && dataItem !== '*')
        errorMessage = 'Value must be a number'

      return dataItem
    })

    const cronObj = {
      minute: data[0] ?? '*',
      hour: data[1] ?? '*',
      dayOfTheMonth: data[2] ?? '*',
      monthOfTheYear: data[3] ?? '*',
      dayOfTheWeek: data[4] ?? '*'
    }

    setCron(cronObj)

    if (data.length > 5) {
      return setError('Unsupported value')
    }

    if (data[0] > 59) {
      return setError('Unsupported value for minutes')
    } else if (data[1] > 24) {
      return setError('Unsupported value for hours')
    } else if (data[2] > 31) {
      return setError('Unsupported value for days of a month')
    } else if (data[3] > 12) {
      return setError('Unsupported value for month')
    } else if (data[4] > 7) {
      return setError('Unsupported value for week days')
    }

    if (errorMessage) {
      return setError(errorMessage)
    } else {
      setError('')
    }
  }

  return (
    <>
      <div className={errorClassNames}>
        <Alert className="error-icon" />
        {error}
      </div>
      <Input
        value={cronString}
        label="15 0-20/2 *"
        floatingLabel
        className="cron-string"
        onChange={setCronString}
        maxLength={13}
        type="text"
      />
      {!error && success && <Checkmark className="success-icon" />}
      <div>
        You can use{' '}
        <a
          className="cron-link"
          href="https://www.freeformatter.com/cron-expression-generator-quartz.html"
        >
          this external website
        </a>{' '}
        to generate cronstring
      </div>
      <button
        className="btn btn_primary cron-btn"
        onClick={() => generateCron(cronString)}
      >
        Generate
      </button>
    </>
  )
}

ScheduleCron.propTypes = {
  cron: PropTypes.shape({}).isRequired,
  error: PropTypes.string.isRequired,
  generateCronString: PropTypes.func.isRequired,
  setCron: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  success: PropTypes.bool.isRequired
}

export default ScheduleCron
