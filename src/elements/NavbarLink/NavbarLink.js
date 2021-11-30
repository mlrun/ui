import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

import Button from '../../common/Button/Button'

import './NavbarLink.scss'

const NavbarLink = ({ externalLink, icon, label, link }) => {
  const history = useHistory()
  const location = useLocation()

  if (externalLink) {
    return (
      <li className="nav-link">
        <a
          href={link}
          target="_top"
          key={label}
          className="nav-link__button btn btn-secondary"
        >
          {icon}
          <span>{label}</span>
        </a>
      </li>
    )
  }

  return (
    <li className="nav-link">
      <Button
        className={`nav-link__button ${
          link === location.pathname ? 'active' : ''
        }`}
        label={label}
        icon={icon}
        onClick={() => history.push(link)}
        variant="secondary"
      />
    </li>
  )
}

NavbarLink.propTypes = {
  externalLink: PropTypes.bool,
  icon: PropTypes.object,
  label: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired
}

export default NavbarLink
