import React from 'react'
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

export default PopUpDialog
