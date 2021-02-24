import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import './contentMenu.scss'

const ContentMenu = ({ activeTab, match, screen, tabs }) => {
  return (
    <div className="content-menu">
      <ul className="content-menu__list">
        {tabs.map(tab => {
          const tabClassNames = classnames(
            'content-menu__item',
            tab.id === activeTab && 'content-menu__item_active'
          )

          return (
            <li data-testid={tab.id} className={tabClassNames} key={tab.id}>
              <Link
                to={`/projects/${
                  match.params.projectName
                }/${screen.toLowerCase()}/${tab.id}`}
              >
                {tab.label ?? tab.id}
                {window.mlrunConfig.betaMode === 'enabled' && tab.preview && (
                  <span className="content-menu__item__preview"> (Beta)</span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

ContentMenu.propTypes = {
  activeTab: PropTypes.string.isRequired,
  tabs: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default ContentMenu
