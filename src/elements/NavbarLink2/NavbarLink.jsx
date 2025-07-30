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
import { NavLink, useLocation } from 'react-router-dom'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import ArrowIcon from 'igz-controls/images/arrow.svg?react'

import './NavbarLink.scss'


const NavbarLink = ({ externalLink = false, icon = null, index = null, label, link = '', selectedIndex = null, setSelectedIndex, ...props }) => {
  const { pathname } = useLocation()

  const parentLinkClasses = classNames(
    'nav-link__button btn nav-link__parent',
    pathname.includes(props.id || link) && 'active',
    index === selectedIndex && 'expended'
  )

  const handleExpanded = () => {
    if (index !== selectedIndex) {
      setSelectedIndex && setSelectedIndex(index)
    } else {
      setSelectedIndex && setSelectedIndex(null)
    }

  }

  return externalLink ? (
    <a href={link} target="_top" className="nav-link__button btn">
      <span className="nav-link__icon">{icon}</span>
      <span className="nav-link__label">{label}</span>
    </a>
  ) : props.nestedLinks ? (
    <div onClick={handleExpanded} className={parentLinkClasses}>
      <span className="nav-link__icon">{icon}</span>
      <span className="nav-link__label">{label}</span>

      <span className="nav-link__arrow">
        <ArrowIcon />
      </span>
    </div>
  ) : (
    <NavLink to={link} onClick={handleExpanded} className="nav-link__button btn" activeclassname="active">
      <span className="nav-link__icon">{icon}</span>
      <span className="nav-link__label">{label}</span>
    </NavLink>
  )
}

NavbarLink.propTypes = {
  externalLink: PropTypes.bool,
  icon: PropTypes.object,
  id: PropTypes.string,
  index: PropTypes.number,
  label: PropTypes.string.isRequired,
  link: PropTypes.string,
  nestedLinks: PropTypes.array,
  selectedIndex: PropTypes.number,
  setSelectedIndex: PropTypes.func,
}

export default React.memo(NavbarLink)
