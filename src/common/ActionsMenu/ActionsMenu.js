import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import ActionsMenuItem from '../../elements/ActionMenuItem/ActionsMenuItem'
import Button from '../Button/Button'

import { ReactComponent as ActionMenu } from '../../images/elipsis.svg'

import './actionsMenu.scss'

const ActionsMenu = ({ dataItem, menu, time }) => {
  const [isShowMenu, setIsShowMenu] = useState(false)
  const [isIconDisplayed, setIsIconDisplayed] = useState(false)
  const [actionMenu, setActionMenu] = useState([])
  let idTimeout = null

  useEffect(() => {
    setActionMenu(typeof menu === 'function' ? menu(dataItem) : menu)
  }, [dataItem, menu])

  useEffect(() => {
    setIsIconDisplayed(actionMenu.some(menuItem => menuItem.icon))
  }, [actionMenu])

  const showActionsList = () => {
    setIsShowMenu(show => !show)
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
      className="actions-menu__container"
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <Button
        className="actions-menu__btn"
        label={<ActionMenu />}
        onClick={showActionsList}
      />
      {isShowMenu && (
        <div
          data-testid="actions-drop-down-menu"
          className="actions-menu__body"
          onClick={() => setIsShowMenu(false)}
        >
          {actionMenu.map(
            menuItem =>
              !menuItem.hidden && (
                <ActionsMenuItem
                  dataItem={dataItem}
                  isIconDisplayed={isIconDisplayed}
                  key={menuItem.label}
                  menuItem={menuItem}
                />
              )
          )}
        </div>
      )}
    </div>
  )
}

ActionsMenu.defaultProps = {
  dataItem: {},
  time: 100
}

ActionsMenu.propTypes = {
  dataItem: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string]),
  menu: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({})),
    PropTypes.func
  ]).isRequired,
  time: PropTypes.number
}

export default ActionsMenu
