import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import NavbarLink from '../../elements/NavbarLink/NavbarLink'
import RoundedIcon from '../../common/RoundedIcon/RoundedIcon'

import { getLinks } from './Navbar.utils'
import localStorageService from '../../utils/localStorageService'

import { PROJECTS_SETTINGS_GENERAL_TAB } from '../../constants'

import { ReactComponent as PinIcon } from '../../images/pin-icon.svg'
import { ReactComponent as UnPinIcon } from '../../images/unpin-icon.svg'
import { ReactComponent as SettingsIcon } from '../../images/pref-icon.svg'

import './Navbar.scss'

const Navbar = ({ headerShown, match, isPinned, setIsPinned }) => {
  const navbarClasses = classNames(
    'navbar',
    isPinned && 'pinned',
    headerShown && 'has-header'
  )

  const { links } = useMemo(() => {
    let links = match ? getLinks(match) : []
    return {
      links
    }
  }, [match])

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
              link={`/projects/${match.params.projectName}/settings/${PROJECTS_SETTINGS_GENERAL_TAB}`}
            />
          </ul>
        </div>
      </div>
    </nav>
  )
}

Navbar.propTypes = {
  isPinned: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
  setIsPinned: PropTypes.func.isRequired
}

export default Navbar
