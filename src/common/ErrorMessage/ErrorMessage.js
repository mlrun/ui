import React from 'react'
import PropTypes from 'prop-types'

import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { ReactComponent as UnsuccessAlert } from 'igz-controls/images/unsuccess_alert.svg'
import { ReactComponent as Close } from 'igz-controls/images/close.svg'

import './errorMessage.scss'

const ErrorMessage = ({ closeError, message }) => {
  return (
    <div data-testid="error-message" className="error">
      <div className="error__data">
        <div>
          <UnsuccessAlert className="error__icon" />
        </div>
        <div className="error__message"> {message}</div>
      </div>
      {closeError && (
        <button data-testid="close" onClick={closeError}>
          <Tooltip template={<TextTooltipTemplate text="Close" />}>
            <Close />
          </Tooltip>
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
