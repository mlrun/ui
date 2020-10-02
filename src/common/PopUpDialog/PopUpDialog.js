import React from 'react'
import PropTypes from 'prop-types'

import { ReactComponent as Close } from '../../images/close.svg'

import './popUpDialog.scss'

const PopUpDialog = ({ children, closePopUp, headerText }) => {
  return (
    <div className="pop-up-dialog__overlay">
      <div data-testid="pop-up-dialog" className="pop-up-dialog">
        <div className="pop-up-dialog__header">
          {headerText && (
            <div
              data-testid="pop-up-dialog-header"
              className="pop-up-dialog__header-text"
            >
              {headerText}
            </div>
          )}
          <Close
            data-testid="pop-up-close-btn"
            className="pop-up-dialog__header-close"
            onClick={closePopUp}
          />
        </div>
        {children}
      </div>
    </div>
  )
}

PopUpDialog.propTypes = {
  closePopUp: PropTypes.func.isRequired,
  headerText: PropTypes.string
}

export default PopUpDialog
