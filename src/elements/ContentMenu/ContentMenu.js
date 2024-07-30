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
import { Link, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { CONTENT_MENU_TABS } from '../../types'

import './contentMenu.scss'

const ContentMenu = ({ activeTab = '', disabled = false, screen, tabs = [], onClick }) => {
  const params = useParams()
  const handleClick = (e, tabId) => {
    if (!disabled) {
      e.preventDefault()
      onClick(tabId)
    }
  }

  const generateRedirectLink = tabId => {
    if (!disabled) {
      if (onClick) {
        return '/'
      }

      return `/projects${
        params.projectName ? `/${params.projectName}` : ''
      }/${screen.toLowerCase()}/${tabId}`
    }
  }

  return (
    <div className="content-menu">
      <ul className="content-menu__list">
        {tabs.map(tab => {
          const tabClassNames = classnames(
            'content-menu__item',
            tab.id === activeTab && 'content-menu__item_active',
            disabled && 'content-menu__item_disabled'
          )

          return (
            !tab.hidden && (
              <li data-testid={tab.id} className={tabClassNames} key={tab.id}>
                <Link
                  to={generateRedirectLink(tab.id)}
                  className={tab.icon && 'content-menu__item-icon'}
                  onClick={onClick && (e => handleClick(e, tab.id))}
                >
                  {tab.icon && <i>{tab.icon}</i>}
                  {tab.label ?? tab.id}
                  {window.mlrunConfig.betaMode === 'enabled' && tab.preview && (
                    <span className="content-menu__item__preview"> (Beta)</span>
                  )}
                </Link>
              </li>
            )
          )
        })}
      </ul>
    </div>
  )
}

ContentMenu.propTypes = {
  activeTab: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  tabs: CONTENT_MENU_TABS.isRequired
}

export default ContentMenu
