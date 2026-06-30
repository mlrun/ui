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
import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'

import Tooltip from '../../components/Tooltip/Tooltip'
import TextTooltipTemplate from '../../components/TooltipTemplate/TextTooltipTemplate'

import { performDetailsActionHelper } from '../../utils/common.util'

import './actionsMenuItem.scss'

const ActionsMenuItem = ({ dataItem = {}, index, isIconDisplayed, menuItem }) => {
  const dispatch = useDispatch()
  const changes = useSelector(store => store.commonDetailsStore.changes)

  const iconClassNames = classnames(
    'actions-menu__icon',
    isIconDisplayed && 'actions-menu__icon_visible'
  )
  const menuClassNames = classnames(
    'actions-menu__option',
    menuItem.className && `actions-menu__option_${menuItem.className}`,
    menuItem.disabled && 'actions-menu__option_disabled'
  )

  const handleActionClick = async () => {
    if (!menuItem.disabled) {
      if (menuItem.allowLeaveWarning) {
        const actionCanBePerformed = await performDetailsActionHelper(changes, dispatch)

        if (actionCanBePerformed) {
          menuItem.onClick(dataItem)
        }
      } else {
        menuItem.onClick(dataItem)
      }
    }
  }

  return (
    <li
      data-testid={`actions-menu__option-${index}`}
      className={menuClassNames}
      onClick={handleActionClick}
    >
      <Tooltip
        template={<TextTooltipTemplate text={menuItem.tooltip} />}
        hidden={!menuItem.tooltip}
        key={menuItem.label}
      >
        <span className={iconClassNames}>{menuItem.icon}</span>
        {menuItem.label}
      </Tooltip>
    </li>
  )
}

ActionsMenuItem.propTypes = {
  dataItem: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  index: PropTypes.number.isRequired,
  isIconDisplayed: PropTypes.bool.isRequired,
  menuItem: PropTypes.object.isRequired
}

export default ActionsMenuItem
