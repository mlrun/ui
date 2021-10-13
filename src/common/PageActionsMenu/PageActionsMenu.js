import React from 'react'
import PropTypes from 'prop-types'

import Button from '../Button/Button'

import { PRIMARY_BUTTON } from '../../constants'

const PageActionsMenu = ({ actionsMenuHeader, onClick, showActionsMenu }) => {
  return (
    <>
      {showActionsMenu && (
        <div data-testid="actions-button" className="page-actions-container">
          <Button
            variant={PRIMARY_BUTTON}
            label={actionsMenuHeader}
            className="btn_register"
            onClick={onClick}
          />
        </div>
      )}
    </>
  )
}

PageActionsMenu.defaultProps = {
  actionsMenuHeader: '',
  onClick: () => {},
  showActionsMenu: false
}

PageActionsMenu.propTypes = {
  actionsMenuHeader: PropTypes.string,
  onClick: PropTypes.func,
  showActionsMenu: PropTypes.bool
}

export default PageActionsMenu
