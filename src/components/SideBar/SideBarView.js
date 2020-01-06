import React from 'react'
import { Link } from 'react-router-dom'

import './sidebar.scss'

const SideBarView = () => {
  const menuList = ['Jobs', 'Artifacts']
  return (
    <div className="sidebar">
      <div className="sidebar__wrapper">
        <ul className="sidebar__menu">
          {menuList.map(item => (
            <li key={item} className="sidebar__menu__item">
              <Link to={item.toLowerCase()}>{item}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default SideBarView
