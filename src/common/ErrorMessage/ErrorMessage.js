import React from 'react'
import PropTypes from 'prop-types'

import { ReactComponent as UnsuccessAlert } from '../../images/unsuccess_alert.svg'

import './errorMessage.scss'

const ErrorMessage = ({ message }) => {
  return (
    <div className="error-container">
      <UnsuccessAlert className="error-icon" />
      {message}
    </div>
  )
}

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired
}

export default ErrorMessage
