import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { ReactComponent as Close } from '../../images/close.svg'

import './popUpDialog.scss'

const PopUpDialog = ({ children, className, closePopUp, headerText }) => {
  const popUpClassNames = classnames(className, 'pop-up-dialog__overlay')

  return (
    <div className={popUpClassNames}>
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

PopUpDialog.defaultProps = {
  className: '',
  headerText: ''
}

PopUpDialog.propTypes = {
  className: PropTypes.string,
  closePopUp: PropTypes.func.isRequired,
  headerText: PropTypes.string
}

export default PopUpDialog
