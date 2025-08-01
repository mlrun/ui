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
import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import NavbarLink from '../../elements/NavbarLink/NavbarLink'
import { RoundedIcon } from 'igz-controls/components'

import { ALERTS_PAGE_PATH, NAVBAR_WIDTH_CLOSED, NAVBAR_WIDTH_OPENED } from '../../constants'
import localStorageService from '../../utils/localStorageService'
import { getLinks } from './navbar.util'

import Alerts from 'igz-controls/images/navbar/alerts-icon.svg?react'
import PinIcon from 'igz-controls/images/pin-icon.svg?react'
import SettingsIcon from 'igz-controls/images/navbar/mlrun-project-settings.svg?react'
import UnPinIcon from 'igz-controls/images/unpin-icon.svg?react'

import './Navbar.scss'

const Navbar = ({ projectName, setIsNavbarPinned }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isPinned, setIsPinned] = useState(
    localStorageService.getStorageValue('mlrunUi.navbarStatic', false) === 'true'
  )

  const navbarClasses = classNames(
    'navbar',
    isHovered && 'navbar_hovered',
    isPinned && 'navbar_pinned'
  )
  const navbarStyles = {
    flexBasis: NAVBAR_WIDTH_OPENED,
    width: NAVBAR_WIDTH_OPENED,
    maxWidth: isHovered || isPinned ? NAVBAR_WIDTH_OPENED : NAVBAR_WIDTH_CLOSED
  }

  const links = useMemo(() => {
    return projectName ? getLinks(projectName) : []
  }, [projectName])

  const handlePinClick = () => {
    setIsPinned(prevIsPinned => {
      localStorageService.setStorageValue('mlrunUi.navbarStatic', !prevIsPinned)
      return !prevIsPinned
    })
  }

  const handleOnMouseEnter = () => {
    if (!isPinned) setIsHovered(true)
  }

  const handleOnMouseLeave = () => {
    if (!isPinned) setIsHovered(false)
  }

  useEffect(() => {
    setIsNavbarPinned(isPinned)
  }, [isPinned, setIsNavbarPinned])

  return (
    <nav
      className={navbarClasses}
      data-testid="navbar"
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
      style={navbarStyles}
    >
      <div className="navbar__pin-icon">
        <RoundedIcon
          id="navabr-pin"
          onClick={handlePinClick}
          tooltipText={`${isPinned ? 'Unpin' : 'Pin'} Menu`}
        >
          {isPinned ? <UnPinIcon /> : <PinIcon />}
        </RoundedIcon>
      </div>
      <div className="navbar__body">
        <ul className="navbar-links">
          {links.map(link => !link.hidden && <NavbarLink key={link.id} {...link} />)}
        </ul>
      </div>
      <div className="navbar__additional">
        <ul className="navbar-links">
          <NavbarLink
            icon={<Alerts />}
            id="alerts"
            label="Alerts"
            link={`/projects/${projectName}/${ALERTS_PAGE_PATH}`}
          />
          <NavbarLink
            id="project-settings"
            icon={<SettingsIcon />}
            label="Project settings"
            link={`/projects/${projectName}/settings`}
          />
        </ul>
      </div>
    </nav>
  )
}

Navbar.propTypes = {
  projectName: PropTypes.string.isRequired,
  setIsNavbarPinned: PropTypes.func.isRequired
}

export default React.memo(Navbar)
