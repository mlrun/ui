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
import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import NavbarLink from '../../elements/NavbarLink/NavbarLink'
import { RoundedIcon } from 'igz-controls/components'

import { getLinks } from './Navbar.utils'
import localStorageService from '../../utils/localStorageService'
import { NAVBAR_WIDTH_CLOSED, NAVBAR_WIDTH_OPEN } from '../../constants'

import { ReactComponent as PinIcon } from 'igz-controls/images/pin-icon.svg'
import { ReactComponent as UnPinIcon } from 'igz-controls/images/unpin-icon.svg'
import { ReactComponent as SettingsIcon } from 'igz-controls/images/navbar/mlrun-project-settings.svg'

import './Navbar.scss'
import { useState } from 'react'

const Navbar = ({ projectName, setIsNavbarPinned }) => {
  const [navabrState, setNavbarState] = useState({
    isHovered: false,
    isPinned: localStorageService.getStorageValue('mlrunUi.navbarStatic', true)
  })

  const navbarClasses = classNames(
    'navbar',
    (navabrState.isHovered || navabrState.isPinned) && 'hovered',
    navabrState.isPinned && 'pinned'
  )
  const navbarStyles = {
    flexBasis: `${NAVBAR_WIDTH_OPEN}px`,
    width: `${NAVBAR_WIDTH_OPEN}px`,
    maxWidth:
      navabrState.isHovered || navabrState.isPinned ? NAVBAR_WIDTH_OPEN : NAVBAR_WIDTH_CLOSED + 'px'
  }

  const links = useMemo(() => {
    return projectName ? getLinks(projectName) : []
  }, [projectName])

  const handlePinClick = () => {
    setNavbarState(prevNavbarState => ({ ...prevNavbarState, isPinned: !prevNavbarState.isPinned }))
    localStorageService.setStorageValue('mlrunUi.navbarStatic', !navabrState.isPinned)
  }

  const handleOnMouseEnter = () => {
    if (navabrState.isPinned) return

    setNavbarState(prevNavbarState => ({ ...prevNavbarState, isHovered: true }))
  }

  const handleOnMouseLeave = () => {
    if (navabrState.isPinned) return

    setNavbarState(prevNavbarState => ({ ...prevNavbarState, isHovered: false }))
  }

  useEffect(() => {
    setIsNavbarPinned(navabrState.isPinned)
  }, [navabrState.isPinned, setIsNavbarPinned])

  return (
    <nav
      className={navbarClasses}
      data-testid="navbar"
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
      style={navbarStyles}
    >
      <div className="navbar__body">
        <div className="navbar__content">
          <div className="navbar__pin-icon">
            <RoundedIcon
              onClick={handlePinClick}
              tooltipText={`${navabrState.isPinned ? 'Unpin' : 'Pin'} Menu`}
            >
              {navabrState.isPinned ? <UnPinIcon /> : <PinIcon />}
            </RoundedIcon>
          </div>

          <ul className="navbar-links">
            {links.map(link => !link.hidden && <NavbarLink key={link.id} {...link} />)}
          </ul>
        </div>
        <div className="navbar__additional">
          <ul className="navbar-links">
            <NavbarLink
              icon={<SettingsIcon />}
              label="Project settings"
              link={`/projects/${projectName}/settings`}
            />
          </ul>
        </div>
      </div>
    </nav>
  )
}

Navbar.propTypes = {
  projectName: PropTypes.string.isRequired,
  setIsNavbarPinned: PropTypes.func.isRequired
}

export default React.memo(Navbar)
