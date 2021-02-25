import React from 'react'
import PropTypes from 'prop-types'

import { ReactComponent as UnsuccessAlert } from '../../images/unsuccess_alert.svg'
import { ReactComponent as Close } from '../../images/close.svg'

import './errorMessage.scss'

const ErrorMessage = ({ closeError, message }) => {
  return (
    <div data-testid="error-message" className="error-message">
      <UnsuccessAlert className="error-icon" />
      {message}
      {closeError && (
        <button data-testid="close" onClick={closeError}>
          <Close />
        </button>
      )}
    </div>
  )
}

ErrorMessage.defaultProps = {
  closeError: null
}

ErrorMessage.propTypes = {
  closeError: PropTypes.func,
  message: PropTypes.string.isRequired
}

export default ErrorMessage
