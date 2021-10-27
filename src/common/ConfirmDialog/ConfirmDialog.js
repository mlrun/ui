import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Button from '../Button/Button'
import PopUpDialog from '../PopUpDialog/PopUpDialog'

import { CONFIRM_DIALOG_BUTTON } from '../../types'

import './confirmDialog.scss'

const ConfirmDialog = ({
  cancelButton,
  className,
  closePopUp,
  confirmButton,
  customPosition,
  header,
  message,
  messageOnly
}) => {
  const messageClassNames = classnames(
    'confirm-dialog__message',
    messageOnly && 'confirm-dialog__message-only'
  )

  return (
    <PopUpDialog
      className={className}
      closePopUp={closePopUp}
      customPosition={customPosition}
      headerText={header}
    >
      <div className="confirm-dialog">
        {message && <div className={messageClassNames}>{message}</div>}
        <div className="confirm-dialog__btn-container">
          {cancelButton && (
            <Button
              className="pop-up-dialog__btn_cancel"
              label={cancelButton.label}
              onClick={cancelButton.handler}
              variant={cancelButton.variant}
            />
          )}
          <Button
            label={confirmButton.label}
            onClick={confirmButton.handler}
            variant={confirmButton.variant}
          />
        </div>
      </div>
    </PopUpDialog>
  )
}

ConfirmDialog.defaultProps = {
  cancelButton: null,
  className: '',
  customPosition: {},
  header: '',
  message: '',
  messageOnly: false
}

ConfirmDialog.propTypes = {
  cancelButton: CONFIRM_DIALOG_BUTTON,
  className: PropTypes.string,
  closePopUp: PropTypes.func.isRequired,
  confirmButton: CONFIRM_DIALOG_BUTTON.isRequired,
  customPosition: PropTypes.object,
  header: PropTypes.string,
  message: PropTypes.string,
  messageOnly: PropTypes.bool
}

export default ConfirmDialog
