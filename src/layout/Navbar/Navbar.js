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

const Navbar = ({ headerShown, isPinned, projectName, setIsPinned }) => {
  const navbarClasses = classNames(
    'navbar',
    isPinned && 'pinned',
    headerShown && 'has-header'
  )

  const { links } = useMemo(() => {
    let links = projectName ? getLinks(projectName) : []
    return {
      links
    }
  }, [projectName])

  const handlePinClick = () => {
    setIsPinned(!isPinned)
    localStorageService.setStorageValue('mlrunUi.navbarStatic', !isPinned)
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
            tooltipText={`${isPinned ? 'Unpin' : 'Pin'} Menu`}
          >
            {isPinned ? <UnPinIcon /> : <PinIcon />}
          </RoundedIcon>
          <ul className="navbar-links">
            {links.map(
              link => !link.hidden && <NavbarLink key={link.label} {...link} />
            )}
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
  isPinned: PropTypes.bool.isRequired,
  projectName: PropTypes.string.isRequired,
  setIsPinned: PropTypes.func.isRequired
}

export default Navbar
