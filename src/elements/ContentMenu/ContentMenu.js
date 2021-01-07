import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import './contentMenu.scss'

const ContentMenu = ({ activeTab, match, screen, tabs }) => {
  return (
    <div className="content__menu">
      <ul className="content__menu__list">
        {tabs.map(tab => {
          const tabClassNames = classnames(
            'content__menu__list_item',
            tab.id === activeTab && 'active'
          )

          return (
            <li data-testid={tab.id} className={tabClassNames} key={tab.id}>
              <Link
                to={`/projects/${
                  match.params.projectName
                }/${screen.toLowerCase()}/${tab.id}`}
              >
                {tab.label ?? tab.id}
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
