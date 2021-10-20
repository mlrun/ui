import React from 'react'
import PropTypes from 'prop-types'

import './optionsMenu.scss'

import { CSSTransition } from 'react-transition-group'

const OptionsMenu = ({ children = [], show = false, timeout = 300 }) => {
  return (
    <CSSTransition
      in={show}
      timeout={timeout}
      classNames="options-menu"
      unmountOnExit
    >
      <ul className="options-menu">{children}</ul>
    </CSSTransition>
  )
}

OptionsMenu.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
  show: PropTypes.bool.isRequired,
  timout: PropTypes.number
}

export default OptionsMenu
