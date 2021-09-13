import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import classnames from 'classnames'

import ActionsMenuItem from '../../elements/ActionMenuItem/ActionsMenuItem'

import { ReactComponent as ActionMenu } from '../../images/elipsis.svg'

import './actionsMenu.scss'

const ActionsMenu = ({ dataItem, menu, time }) => {
  const [isShowMenu, setIsShowMenu] = useState(false)
  const [isIconDisplayed, setIsIconDisplayed] = useState(false)
  const [actionMenu, setActionMenu] = useState(menu)
  const [renderMenu, setRenderMenu] = useState(false)
  const [openToBottom, setOpenToBottom] = useState(false)
  const actionMenuRef = useRef()
  const dropDownMenuRef = useRef()
  const dropDownMenuClassNames = classnames(
    'actions-menu__body',
    openToBottom && 'open-to-bottom',
    isShowMenu && 'show'
  )
  let idTimeout = null

  useEffect(() => {
    if (!isEmpty(dataItem) && typeof menu === 'function') {
      setActionMenu(menu(dataItem))
    }
  }, [dataItem, menu])

  useEffect(() => {
    setIsIconDisplayed(actionMenu.some(menuItem => menuItem.icon))
  }, [actionMenu])

  const showActionsList = () => {
    setIsShowMenu(show => !show)
    setOpenToBottom(
      dropDownMenuRef.current?.offsetHeight +
        actionMenuRef.current?.getBoundingClientRect().bottom <
        window.innerHeight
    )
  }

  const handleMouseLeave = () => {
    if (isShowMenu) {
      idTimeout = setTimeout(() => {
        setIsShowMenu(false)
        setRenderMenu(false)
      }, time)
    }
  }

  const handleMouseOver = () => {
    setRenderMenu(true)

    if (idTimeout) clearTimeout(idTimeout)
  }

  return (
    <div
      className="actions-menu__container"
      onMouseLeave={handleMouseLeave}
      onMouseOver={handleMouseOver}
      ref={actionMenuRef}
    >
      <button onClick={showActionsList}>
        <ActionMenu />
      </button>
      {renderMenu && (
        <div
          data-testid="actions-drop-down-menu"
          className={dropDownMenuClassNames}
          onClick={() => setIsShowMenu(false)}
          ref={dropDownMenuRef}
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
