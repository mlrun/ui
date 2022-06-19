import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { ReactComponent as Projects } from 'igz-controls/images/projects.svg'

import './sidebar.scss'

const SideBarView = ({ currentPage }) => {
  const menuList = [{ value: 'projects' }]

  return (
    <div className="sidebar">
      <div className="sidebar__wrapper">
        <ul className="sidebar__menu">
          {menuList.map(item => (
            <li
              key={item.value}
              className={`${currentPage === item.value &&
                'active'} sidebar__menu__item`}
              title={`${item.value[0].toUpperCase()}${item.value.slice(1)}`}
            >
              <Link to={`/${item.value}`}>
                <Projects />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

SideBarView.propTypes = {
  currentPage: PropTypes.string.isRequired
}

export default SideBarView
