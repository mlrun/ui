import React from 'react'
import { Link } from 'react-router-dom'

import logo from '../../images/iguazio-logo-corner.png'

import './header.scss'

const Header = () => {
  return (
    <header className="header">
      <Link to="/" className="header__logo">
        <img src={logo} alt="Logo" />
      </Link>
      <h1>
        MLRun<span>UI</span>
      </h1>
      <Link to="https://github.com/mlrun/mlrun" className="header__link">
        See on GitHub
      </Link>
    </header>
  )
}

export default Header
