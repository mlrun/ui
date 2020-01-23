import React from 'react'
import { Link } from 'react-router-dom'

import jobsIcon from '../../images/check-all.png'
import artifactsIcon from '../../images/file-chart.png'

import './sidebar.scss'

const SideBarView = ({ currentPage, onClick }) => {
  const menuList = [
    { img: jobsIcon, value: 'jobs' },
    { img: artifactsIcon, value: 'artifacts' }
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
            >
              <Link
                to={item.value}
                onClick={() =>
                  onClick(item.img === jobsIcon ? 'jobs' : 'artifacts')
                }
              >
                <img src={item.img} alt="Page icon" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default SideBarView
