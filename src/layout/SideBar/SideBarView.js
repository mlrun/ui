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
