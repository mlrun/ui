import React from 'react'

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

export default ErrorMessage
