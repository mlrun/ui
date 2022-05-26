import React from 'react'
import PropTypes from 'prop-types'
import { createPortal } from 'react-dom'
import { CSSTransition } from 'react-transition-group'

import './Backdrop.scss'

const Backdrop = ({ duration = 300, show, onClose }) => {
  return createPortal(
    <CSSTransition
      in={show}
      timeout={duration}
      classNames="backdrop-transition"
      mountOnEnter
      unmountOnExit
    >
      <div className="backdrop" onClick={onClose}></div>
    </CSSTransition>,
    document.getElementById('overlay_container')
  )
}

Backdrop.defaultProps = {
  duration: 300,
  show: false
}

Backdrop.propTypes = {
  show: PropTypes.bool.isRequired
}

export default Backdrop
