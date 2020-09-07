import React from 'react'
import { Link } from 'react-router-dom'

import logo from '../../images/mlrun-logo-circle-small.png'

import './header.scss'

const Header = () => {
  return (
    <header className="header">
      <Link to="/" className="header__logo">
        <img src={logo} alt="Logo" />
      </Link>
      <h1>MLRun</h1>
      <sup className="header__beta">beta</sup>
      <a
        href="https://github.com/mlrun/mlrun"
        className="header__link"
        target="_blank"
        rel="noopener noreferrer"
      >
        See on GitHub
      </a>
    </header>
  )
}

export default Header
