import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import './NavbarLink.scss'

const NavbarLink = ({ externalLink, icon, label, link }) => {
  if (externalLink) {
    return (
      <li className="nav-link">
        <a
          href={link}
          target="_top"
          key={label}
          className="nav-link__button btn btn-secondary"
        >
          <i className="nav-link__button-icon">{icon}</i>
          {label}
        </a>
      </li>
    )
  }

  return (
    <li className="nav-link">
      <NavLink
        exact
        key={label}
        to={link}
        className="nav-link__button btn btn-secondary"
        activeClassName="active"
      >
        <i className="nav-link__button-icon">{icon}</i>
        {label}
      </NavLink>
    </li>
  )
}

NavbarLink.propTypes = {
  externalLink: PropTypes.bool,
  icon: PropTypes.object,
  label: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  rootLink: PropTypes.bool
}

export default NavbarLink
