import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import NavbarLink from '../../elements/NavbarLink/NavbarLink'
import { RoundedIcon } from 'igz-controls/components'

import { getLinks } from './Navbar.utils'
import localStorageService from '../../utils/localStorageService'

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
    <nav className={navbarClasses}>
      <div className="navbar__toggler">
        <button className="navbar__toggler-button">
          <span className="navbar__toggler-icon"></span>
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
            {links.map(link => !link.hidden && <NavbarLink key={link.label} {...link} />)}
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
