import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { ReactComponent as ActionMenu } from '../../images/elipsis.svg'

import './tableActionsMenu.scss'

const TableActionsMenu = ({ item, time, menu, onClick }) => {
  const [isShowMenu, setIsShowMenu] = useState(false)
  let idTimeout = null

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
      className="table-actions-container"
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <button onClick={showActionsList}>
        <ActionMenu />
      </button>
      {isShowMenu && (
        <div
          className="table-actions-container__body"
          onClick={() => setIsShowMenu(false)}
        >
          {menu.map(menuItem => (
            <div
              className="table-actions-container__option"
              onClick={() => {
                onClick(item)
              }}
            >
              <span className="table-actions-container__icon">
                {menuItem.icon}
              </span>
              {menuItem.label}
            </div>
          ))}
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
  onClick: PropTypes.func.isRequired,
  item: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string]),
  time: PropTypes.number
}

export default TableActionsMenu
