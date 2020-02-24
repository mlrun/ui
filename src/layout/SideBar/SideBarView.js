import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

// import jobsIcon from '../../images/check-all.png'
// import artifactsIcon from '../../images/file-chart.png'
import projectsIcon from '../../images/projects.png'

import './sidebar.scss'

const SideBarView = ({ currentPage }) => {
  const menuList = [
    // { img: jobsIcon, value: 'jobs' },
    // { img: artifactsIcon, value: 'artifacts' },
    { img: projectsIcon, value: 'projects' }
  ]
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
                <img src={item.img} alt="Page icon" />
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
