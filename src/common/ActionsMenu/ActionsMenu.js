import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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
  const actionMenuRef = useRef()
  const dropDownMenuRef = useRef()
  const dropDownMenuClassNames = classnames(
    'actions-menu__body',
    isShowMenu && 'show'
  )
  let idTimeout = null
  const offset = 15

  useEffect(() => {
    if (!isEmpty(dataItem)) {
      setActionMenu(typeof menu === 'function' ? menu(dataItem) : menu)
    }
  }, [dataItem, menu])

  useEffect(() => {
    setIsIconDisplayed(actionMenu.some(menuItem => menuItem.icon))
  }, [actionMenu])

  const showActionsList = () => {
    setIsShowMenu(show => !show)
    const actionMenuRect = actionMenuRef.current.getBoundingClientRect()
    const dropDownMenuRect = dropDownMenuRef.current.getBoundingClientRect()

    if (
      actionMenuRect.top +
        actionMenuRect.height +
        offset +
        dropDownMenuRect.height >=
      window.innerHeight
    ) {
      dropDownMenuRef.current.style.top = `${actionMenuRect.top -
        dropDownMenuRect.height}px`
      dropDownMenuRef.current.style.left = `${actionMenuRect.left -
        dropDownMenuRect.width +
        offset}px`
    } else {
      dropDownMenuRef.current.style.top = `${actionMenuRect.bottom}px`
      dropDownMenuRef.current.style.left = `${actionMenuRect.left -
        (dropDownMenuRect.width - offset)}px`
    }
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

  const handleScroll = () => {
    setIsShowMenu(false)
  }

  useEffect(() => {
    if (isShowMenu) {
      window.addEventListener('scroll', handleScroll, true)
    }

    return () => window.removeEventListener('scroll', handleScroll, true)
  }, [isShowMenu])

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
      {renderMenu &&
        createPortal(
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
          </div>,
          document.getElementById('overlay_container')
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
