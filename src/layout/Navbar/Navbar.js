import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import ProjectLinks from '../../components/Project/ProjectLinks/ProjectLinks'
import NavbarLink from '../../elements/NavbarLink/NavbarLink'
import RoundedIcon from '../../common/RoundedIcon/RoundedIcon'

import { getLinks } from '../../components/Project/project.utils'
import localStorageService from '../../utils/localStorageService'

import { ReactComponent as PinIcon } from '../../images/pin-icon.svg'
import { ReactComponent as UnPinIcon } from '../../images/unpin-icon.svg'
import { ReactComponent as SettingsIcon } from '../../images/pref-icon.svg'

import './Navbar.scss'

const Navbar = ({ match, isPinned, setIsPinned }) => {
  const navbarClasses = classNames('navbar', isPinned && 'pinned')

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
          <RoundedIcon onClick={handlePinClick} className="navbar__pin-icon">
            {isPinned ? <UnPinIcon /> : <PinIcon />}
          </RoundedIcon>
          <ul className="navbar-links">
            <ProjectLinks links={links} />
          </ul>
        </div>
        <div className="navbar__additional">
          <ul className="navbar-links">
            <NavbarLink
              icon={<SettingsIcon />}
              label="Project settings"
              link={`/projects/${match.params.projectName}/settings`}
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
