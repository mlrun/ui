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

const ContentMenu = ({
  activeTab = '',
  disabled = false,
  fontSize = 'md',
  onClick = null,
  screen = '',
  tabs = []
}) => {
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
      <ul className="content-menu__tabs">
        {tabs.map(tab => {
          const tabClassNames = classnames(
            'content-menu__tab',
            `content-menu__tab-${fontSize}`,
            tab.id === activeTab && 'content-menu__tab_active',
            disabled && 'content-menu__tab_disabled'
          )

          return (
            !tab.hidden && (
              <Link
                to={generateRedirectLink(tab.id)}
                data-testid={tab.id}
                className={tabClassNames}
                key={tab.id}
              >
                <span
                  className={tab.icon && 'content-menu__tab-icon'}
                  onClick={onClick && (e => handleClick(e, tab.id))}
                >
                  {tab.icon && <i>{tab.icon}</i>}
                  {tab.label ?? tab.id}
                  {window?.mlrunConfig?.betaMode === 'enabled' && tab.preview && (
                    <span className="content-menu__tab__preview"> (Beta)</span>
                  )}
                </span>
              </Link>
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
  fontSize: PropTypes.oneOf(['sm', 'md', 'lg']),
  onClick: PropTypes.func,
  screen: PropTypes.string,
  tabs: CONTENT_MENU_TABS.isRequired
}

export default ContentMenu
