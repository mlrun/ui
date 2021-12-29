import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import './NavbarLink.scss'

const NavbarLink = ({ externalLink, icon, label, link, rootPath }) => {
  return (
    <li className="nav-link">
      {externalLink ? (
        <a
          href={link}
          target="_top"
          key={label}
          className="nav-link__button btn btn-secondary"
        >
          {icon}
          <span>{label}</span>
        </a>
      ) : (
        <NavLink
          to={link}
          className="nav-link__button btn btn-secondary"
          activeClassName="active"
        >
          {icon}
          <span>{label}</span>
        </NavLink>
      )}
    </li>
  )
}

NavbarLink.defaultProps = {
  externalLink: false,
  icon: {},
  label: '',
  link: '',
  rootPath: ''
}

NavbarLink.propTypes = {
  externalLink: PropTypes.bool,
  icon: PropTypes.object,
  label: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  rootPath: PropTypes.string
}

export default NavbarLink
