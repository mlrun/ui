import React from 'react'
import PropTypes from 'prop-types'

import Button from '../Button/Button'

import { PRIMARY_BUTTON } from '../../constants'

const PageActionsMenu = ({
  actionsMenuHeader,
  onClick,
  showActionsMenu,
  variant
}) => {
  return (
    <>
      {showActionsMenu && (
        <div data-testid="actions-button" className="page-actions-container">
          <Button
            variant={variant ?? PRIMARY_BUTTON}
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
  showActionsMenu: false,
  variant: PRIMARY_BUTTON
}

PageActionsMenu.propTypes = {
  actionsMenuHeader: PropTypes.string,
  onClick: PropTypes.func,
  showActionsMenu: PropTypes.bool,
  variant: PropTypes.string
}

export default PageActionsMenu
