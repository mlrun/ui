import React from 'react'
import PropTypes from 'prop-types'

import { ReactComponent as UnsuccessAlert } from '../../images/unsuccess_alert.svg'
import { ReactComponent as Close } from '../../images/close.svg'

import './errorMessage.scss'

const ErrorMessage = ({ message, closeError }) => {
  return (
    <div className="error-container">
      <UnsuccessAlert className="error-icon" />
      {message}
      <button onClick={closeError}>
        <Close />
      </button>
    </div>
  )
}

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
  closeError: PropTypes.func.isRequired
}

export default ErrorMessage
