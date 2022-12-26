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
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import NavbarLink from '../../elements/NavbarLink/NavbarLink'
import { RoundedIcon } from 'igz-controls/components'

import { getLinks } from './Navbar.utils'
import localStorageService from '../../utils/localStorageService'
import { NAVBAR_WIDTH } from '../../constants'

import { ReactComponent as PinIcon } from 'igz-controls/images/pin-icon.svg'
import { ReactComponent as UnPinIcon } from 'igz-controls/images/unpin-icon.svg'
import { ReactComponent as SettingsIcon } from 'igz-controls/images/pref-icon.svg'

import './Navbar.scss'

const Navbar = ({ isHeaderShown, isNavbarPinned, projectName, setIsNavbarPinned }) => {
  const navbarClasses = classNames(
    'navbar',
    isNavbarPinned && 'pinned',
    isHeaderShown && 'has-header'
  )
  const navbarStyles = {
    flex: `1, 0, ${NAVBAR_WIDTH}px`,
    width: `${NAVBAR_WIDTH}px`,
    maxWidth: `${NAVBAR_WIDTH}px`
  }

  const { links } = useMemo(() => {
    let links = projectName ? getLinks(projectName) : []
    return {
      links
    }
  }, [projectName])

  const handlePinClick = () => {
    setIsNavbarPinned(!isNavbarPinned)
    localStorageService.setStorageValue('mlrunUi.navbarStatic', !isNavbarPinned)
  }

  return (
    <nav className={navbarClasses} style={navbarStyles}>
      <div className="navbar__toggler">
        <button className="navbar__toggler-button">
          <span className="navbar__toggler-icon" />
        </button>
      </div>
      <div className="navbar__body">
        <div className="navbar__content">
          <RoundedIcon
            onClick={handlePinClick}
            className="navbar__pin-icon"
            tooltipText={`${isNavbarPinned ? 'Unpin' : 'Pin'} Menu`}
          >
            {isNavbarPinned ? <UnPinIcon /> : <PinIcon />}
          </RoundedIcon>
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
  isHeaderShown: PropTypes.bool.isRequired,
  isNavbarPinned: PropTypes.bool.isRequired,
  projectName: PropTypes.string.isRequired,
  setIsNavbarPinned: PropTypes.func.isRequired
}

export default React.memo(Navbar)
