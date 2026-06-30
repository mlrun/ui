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
import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import classnames from 'classnames'

import ActionsMenuItem from '../../elements/ActionsMenuItem/ActionsMenuItem'
import PopUpDialog from '../PopUpDialog/PopUpDialog'
import RoundedIcon from '../RoundedIcon/RoundedIcon'

import { ACTIONS_MENU } from '../../types'

import ActionMenuIcon from '../../images/elipsis.svg?react'

import './actionsMenu.scss'

const ActionsMenu = ({
  dataItem = {},
  menu,
  menuPosition = '',
  time = 100,
  withQuickActions = false
}) => {
  const [[actionMenu, quickActions], setActionMenuContent] = useState(menu)
  const [isIconDisplayed, setIsIconDisplayed] = useState(false)
  const [isShowMenu, setIsShowMenu] = useState(false)
  const actionMenuRef = useRef()
  const actionMenuBtnRef = useRef()
  const dropDownMenuRef = useRef()
  const mainActionsWrapperRef = useRef()

  let idTimeout = null

  const actionMenuClassNames = classnames(
    'actions-menu__container',
    withQuickActions &&
      (actionMenu.length > 0 || quickActions.length > 1) &&
      'actions-menu__container_extended',
    isShowMenu && 'actions-menu__container-active'
  )

  const clickHandler = useCallback(
    event => {
      if (!event.target.closest('.actions-menu-button')) {
        setIsShowMenu(false)
      }
    },
    [setIsShowMenu]
  )

  const scrollHandler = useCallback(
    event => {
      if (!event.target.closest('.actions-menu__body')) {
        setIsShowMenu(false)
      }
    },
    [setIsShowMenu]
  )

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

  useEffect(() => {
    if (!isEmpty(dataItem)) {
      setActionMenuContent(typeof menu === 'function' ? menu(dataItem, menuPosition) : menu)
    }
  }, [dataItem, menu, menuPosition])

  useEffect(() => {
    setIsIconDisplayed(actionMenu?.some(menuItem => menuItem.icon))
  }, [actionMenu])

  useEffect(() => {
    window.addEventListener('click', clickHandler)
    window.addEventListener('scroll', scrollHandler, true)

    return () => {
      window.removeEventListener('click', clickHandler)
      window.removeEventListener('scroll', scrollHandler, true)
    }
  }, [clickHandler, scrollHandler])

  return (
    <div
      className={actionMenuClassNames}
      onMouseOut={onMouseOut}
      onMouseOver={handleMouseOver}
      ref={actionMenuRef}
    >
      {withQuickActions && (
        <div className="actions-menu__main-actions-wrapper" ref={mainActionsWrapperRef}>
          {quickActions.map(
            mainAction =>
              !mainAction.hidden && (
                <RoundedIcon
                  disabled={mainAction.disabled}
                  id={`quick-link-${mainAction.id}`}
                  onClick={() => mainAction.onClick(dataItem)}
                  tooltipText={mainAction.label}
                  key={mainAction.label}
                >
                  {mainAction.icon}
                </RoundedIcon>
              )
          )}
        </div>
      )}
      {actionMenu.length > 0 && (
        <div className="actions-menu" data-testid="actions-menu">
          <RoundedIcon
            className="actions-menu-button"
            isActive={isShowMenu}
            id="actions-menu-button"
            onClick={() => {
              setIsShowMenu(prevValue => !prevValue)
            }}
            ref={actionMenuBtnRef}
            tooltipText="More actions"
          >
            <ActionMenuIcon />
          </RoundedIcon>
          {isShowMenu && (
            <PopUpDialog
              className="actions-menu__body"
              customPosition={{
                element: actionMenuBtnRef,
                position: 'bottom-left',
                autoVerticalPosition: true
              }}
              headerIsHidden
              ref={dropDownMenuRef}
            >
              <ul data-testid="actions-drop-down-menu" className="actions-menu__list">
                {actionMenu.map(
                  (menuItem, idx) =>
                    !menuItem.hidden && (
                      <ActionsMenuItem
                        dataItem={dataItem}
                        index={idx}
                        isIconDisplayed={isIconDisplayed}
                        key={menuItem.label}
                        menuItem={menuItem}
                      />
                    )
                )}
              </ul>
            </PopUpDialog>
          )}
        </div>
      )}
    </div>
  )
}

ActionsMenu.propTypes = {
  dataItem: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  menu: ACTIONS_MENU.isRequired,
  menuPosition: PropTypes.string,
  time: PropTypes.number,
  withQuickActions: PropTypes.bool
}

export default ActionsMenu
