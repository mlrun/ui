import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Input from '../../common/Input/Input'

import './scheduleCron.scss'

const ScheduleCron = ({ cron, generateCronString, setCron }) => {
  const [cronString, setCronString] = useState('')
  const [error, setError] = useState('')
  // const emptyCronString = '* * * * *'

  useEffect(() => {
    setCronString(generateCronString(cron))
  }, [cron, generateCronString])

  const handleChange = value => {
    let data = value.split(' ')
    let errorMessage = ''

    if (data.length > 6) {
      errorMessage = 'Unsupported value'

      return setError(errorMessage)
    }

    data = data.map((dataItem, index) => {
      if (
        dataItem.length > 2 ||
        dataItem.match(/(\*+\d)/) ||
        dataItem.match(/(\d\*+)/)
      ) {
        errorMessage = 'Please add spaces after values'
      }

      if (index === 0 || dataItem > 60) {
        return setError('Unsupported value for minutes')
      }

      if (dataItem === '') dataItem = '*'

      return dataItem
    })

    if (errorMessage) {
      return setError(errorMessage)
    }

    const cronObj = {
      minute: data[0],
      hour: data[1],
      dayOfTheMonth: data[2],
      monthOfTheYear: data[3],
      dayOfTheWeek: data[4]
    }

    setCron(cronObj)
    setError('')
  }

  return (
    <>
      <div>{error}</div>
      <Input
        value={cronString}
        label="15 0-20/2 *"
        floatingLabel
        className="cron-string"
        onChange={setCronString}
        maxLength={13}
        type="text"
      />
      <button onClick={() => handleChange(cronString)}>Generate</button>
    </>
  )
}

ScheduleCron.propTypes = {
  cron: PropTypes.shape({}).isRequired,
  generateCronString: PropTypes.func.isRequired
}

export default ScheduleCron
