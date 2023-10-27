/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import classnames from 'classnames'

import ActionsMenuItem from '../../elements/ActionMenuItem/ActionsMenuItem'
import { RoundedIcon } from 'igz-controls/components'

import { ACTIONS_MENU } from '../../types'

import { ReactComponent as ActionMenuIcon } from 'igz-controls/images/elipsis.svg'

import './actionsMenu.scss'

const ActionsMenu = ({ dataItem, menu, time, withQuickActions }) => {
  const [isShowMenu, setIsShowMenu] = useState(false)
  const [isIconDisplayed, setIsIconDisplayed] = useState(false)
  const [actionMenu, setActionMenu] = useState(menu)
  const actionMenuRef = useRef()
  const actionMenuBtnRef = useRef()
  const dropDownMenuRef = useRef()
  const mainActionsWrapperRef = useRef()

  const actionMenuClassNames = classnames(
    'actions-menu__container',
    withQuickActions && 'actions-menu__container_extended',
    isShowMenu && 'actions-menu__container-active'
  )

  let idTimeout = null
  const offset = 34

  const hideActionMenu = useCallback(event => {
    if (
      !event.target.closest('.actions-menu-button') &&
      !event.target.closest('.actions-menu__body')
    ) {
      setIsShowMenu(false)
    }
  }, [])

  const onMouseOut = () => {
    if (isShowMenu) {
      idTimeout = setTimeout(() => {
        setIsShowMenu(false)
      }, time)
    }
  }

  const handleMouseOver = event => {
    if (mainActionsWrapperRef.current?.contains(event.target)) {
      setIsShowMenu(false)
    }

    if (idTimeout) clearTimeout(idTimeout)
  }

  useLayoutEffect(() => {
    if (isShowMenu) {
      const actionMenuBtnRect =
        actionMenuBtnRef && actionMenuBtnRef.current?.getBoundingClientRect()
      const dropDownMenuRect = dropDownMenuRef && dropDownMenuRef.current?.getBoundingClientRect()

      if (
        actionMenuBtnRect.top + actionMenuBtnRect.height + offset + dropDownMenuRect.height >=
        window.innerHeight
      ) {
        dropDownMenuRef.current.style.top = `${actionMenuBtnRect.top - dropDownMenuRect.height}px`
        dropDownMenuRef.current.style.left = `${
          actionMenuBtnRect.left - dropDownMenuRect.width + offset
        }px`
        dropDownMenuRef.current.style.marginTop = '-2px'
      } else {
        dropDownMenuRef.current.style.top = `${actionMenuBtnRect.bottom}px`
        dropDownMenuRef.current.style.left = `${
          actionMenuBtnRect.left - (dropDownMenuRect.width - offset)
        }px`
        dropDownMenuRef.current.style.marginTop = '2px'
      }
    }
  }, [isShowMenu])

  useEffect(() => {
    if (!isEmpty(dataItem)) {
      setActionMenu(typeof menu === 'function' ? menu(dataItem) : menu)
    }
  }, [dataItem, menu])

  useEffect(() => {
    setIsIconDisplayed(actionMenu[0].some(menuItem => menuItem.icon))
  }, [actionMenu])

  useEffect(() => {
    window.addEventListener('click', hideActionMenu)
    window.addEventListener('scroll', hideActionMenu, true)

    return () => {
      window.removeEventListener('click', hideActionMenu)
      window.removeEventListener('scroll', hideActionMenu, true)
    }
  }, [hideActionMenu])

  return (
    <div
      className={actionMenuClassNames}
      onMouseOut={onMouseOut}
      onMouseOver={handleMouseOver}
      ref={actionMenuRef}
    >
      {withQuickActions && (
        <div className="actions-menu__main-actions-wrapper" ref={mainActionsWrapperRef}>
          {actionMenu[1].map(mainAction => (
            <RoundedIcon
              disabled={mainAction.disabled}
              id={`quick-link-${mainAction.id}`}
              onClick={() => mainAction.onClick(dataItem)}
              tooltipText={mainAction.label}
              key={mainAction.label}
            >
              {mainAction.icon}
            </RoundedIcon>
          ))}
        </div>
      )}
      <div className="actions-menu" data-testid="actions-menu">
        <RoundedIcon
          className="actions-menu-button"
          isActive={isShowMenu}
          id="actions-menu-button"
          onClick={() => {
            setIsShowMenu(prevValue => !prevValue)
          }}
          ref={actionMenuBtnRef}
        >
          <ActionMenuIcon />
        </RoundedIcon>
        {isShowMenu && (
          <ul
            data-testid="actions-drop-down-menu"
            className="actions-menu__list"
            ref={dropDownMenuRef}
          >
            {actionMenu[0].map(
              (menuItem, idx) =>
                !menuItem.hidden && (
                  <ActionsMenuItem
                    dataItem={dataItem}
                    isIconDisplayed={isIconDisplayed}
                    index={idx}
                    key={menuItem.label}
                    menuItem={menuItem}
                  />
                )
            )}
          </ul>
        )}
      </div>
    </div>
  )
}

ActionsMenu.defaultProps = {
  dataItem: {},
  time: 100,
  withQuickActions: false
}

ActionsMenu.propTypes = {
  dataItem: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string]),
  menu: ACTIONS_MENU.isRequired,
  time: PropTypes.number,
  withQuickActions: PropTypes.bool
}

export default ActionsMenu
