import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Tooltip from '../Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

import { ReactComponent as ActionMenu } from '../../images/elipsis.svg'
import './tableActionsMenu.scss'

const TableActionsMenu = ({ item, menu, time }) => {
  const [isShowMenu, setIsShowMenu] = useState(false)
  const [isIconDisplayed, setIsIconDisplayed] = useState(false)
  let idTimeout = null

  useEffect(() => {
    setIsIconDisplayed(menu.some(menuItem => menuItem.icon))
  }, [menu])

  const iconClassNames = classnames(
    'table-actions-container__icon',
    isIconDisplayed && 'table-actions-container__icon_visible'
  )

  const showActionsList = () => {
    setIsShowMenu(!isShowMenu)
  }

  const handleMouseLeave = () => {
    if (isShowMenu) {
      idTimeout = setTimeout(() => {
        setIsShowMenu(false)
      }, time)
    }
  }

  const handleMouseEnter = () => {
    if (idTimeout) clearTimeout(idTimeout)
  }

  return (
    <div
      data-testid="actions-menu"
      className="table-actions-container"
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <button data-testid="actions-menu-btn" onClick={showActionsList}>
        <ActionMenu />
      </button>
      {isShowMenu && (
        <div
          data-testid="actions-drop-down-menu"
          className="table-actions-container__body"
          onClick={() => setIsShowMenu(false)}
        >
          {menu.map(menuItem => {
            return (
              (menuItem.visible ?? true) && (
                <Tooltip
                  template={<TextTooltipTemplate text={menuItem.tooltip} />}
                  hidden={!menuItem.tooltip}
                  key={menuItem.label}
                >
                  <div
                    data-testid="actions-menu-item"
                    className={classnames(
                      'table-actions-container__option',
                      menuItem.disabled &&
                        'table-actions-container__option_disabled'
                    )}
                    onClick={() => {
                      !menuItem.disabled && menuItem.onClick(item)
                    }}
                  >
                    <span className={iconClassNames}>{menuItem.icon}</span>
                    {menuItem.label}
                  </div>
                </Tooltip>
              )
            )
          })}
        </div>
      )}
    </div>
  )
}

TableActionsMenu.defaultProps = {
  item: {},
  time: 100
}

TableActionsMenu.propTypes = {
  item: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string]),
  menu: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  time: PropTypes.number
}

export default TableActionsMenu
