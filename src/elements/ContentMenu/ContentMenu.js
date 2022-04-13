import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import './contentMenu.scss'

const ContentMenu = ({ activeTab, match, screen, tabs, onClick }) => {
  const handleClick = (e, tabId) => {
    e.preventDefault()
    onClick(tabId)
  }

  return (
    <div className="content-menu">
      <ul className="content-menu__list">
        {tabs.map(tab => {
          const tabClassNames = classnames(
            'content-menu__item',
            tab.id === activeTab && 'content-menu__item_active'
          )

          return (
            !tab.hidden && (
              <li data-testid={tab.id} className={tabClassNames} key={tab.id}>
                <Link
                  to={
                    onClick
                      ? '/'
                      : `/projects/${
                          match.params.projectName
                        }/${screen.toLowerCase()}/${tab.id}`
                  }
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

ContentMenu.defaultProps = {
  activeTab: '',
  tabs: []
}

ContentMenu.propTypes = {
  activeTab: PropTypes.string.isRequired,
  tabs: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default ContentMenu
