import React from 'react'
import PropTypes from 'prop-types'

import ErrorMessage from '../ErrorMessage/ErrorMessage'

import './popUpDialog.scss'

const PopUpDialog = ({
  actionBtnText,
  children,
  closePopUp,
  handleSuccess,
  headerText,
  message
}) => {
  return (
    <div className="pop-up-dialog__overlay">
      <div className="pop-up-dialog">
        <div className="pop-up-dialog__header">{headerText}</div>
        {children}
        <div className="pop-up-dialog__btn-container">
          {message && <ErrorMessage message={message} />}
          <button
            className="pop-up-dialog__btn btn_success btn_primary"
            onClick={handleSuccess}
          >
            {actionBtnText}
          </button>
          <button
            className="pop-up-dialog__btn pop-up-dialog__btn_cancel btn_default"
            onClick={closePopUp}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

PopUpDialog.defaultProps = {
  message: ''
}

PopUpDialog.propTypes = {
  actionBtnText: PropTypes.string.isRequired,
  closePopUp: PropTypes.func.isRequired,
  handleSuccess: PropTypes.func.isRequired,
  headerText: PropTypes.string.isRequired,
  message: PropTypes.string
}

export default PopUpDialog
