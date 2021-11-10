import React from 'react'
import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'

import PopUpDialog from '../PopUpDialog/PopUpDialog'

import './optionsMenu.scss'

const OptionsMenu = React.forwardRef(({ children, show, timeout }, ref) => {
  return (
    <CSSTransition
      in={show}
      timeout={timeout}
      classNames="options-menu-transition"
      unmountOnExit
    >
      <PopUpDialog
        className="options-menu"
        customPosition={{
          element: ref,
          position: 'bottom-right'
        }}
      >
        <ul className="options-menu__body">{children}</ul>
      </PopUpDialog>
    </CSSTransition>
  )
})

OptionsMenu.defaultProps = {
  children: [],
  show: false,
  timeout: 300
}

OptionsMenu.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
  show: PropTypes.bool.isRequired,
  timout: PropTypes.number
}

export default OptionsMenu
