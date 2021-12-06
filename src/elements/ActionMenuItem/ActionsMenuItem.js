import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import './actionsMenuItem.scss'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

const ActionsMenuItem = ({ dataItem, isIconDisplayed, menuItem }) => {
  const iconClassNames = classnames(
    'actions-menu__icon',
    isIconDisplayed && 'actions-menu__icon_visible'
  )
  const menuClassNames = classnames(
    'actions-menu__option',
    menuItem.disabled && 'actions-menu__option_disabled'
  )

  return (
    <Tooltip
      template={<TextTooltipTemplate text={menuItem.tooltip} />}
      hidden={!menuItem.tooltip}
      key={menuItem.label}
    >
      <div
        className={menuClassNames}
        onClick={event => {
          event.stopPropagation()
          !menuItem.disabled && menuItem.onClick(dataItem)
        }}
      >
        {menuItem.label}
        <span className={iconClassNames}>{menuItem.icon}</span>
      </div>
    </Tooltip>
  )
}

ActionsMenuItem.defaultProps = {
  dataItem: {}
}

ActionsMenuItem.propTypes = {
  dataItem: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string]),
  isIconDisplayed: PropTypes.bool.isRequired,
  menuItem: PropTypes.shape({}).isRequired
}

export default ActionsMenuItem
