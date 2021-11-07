import React from 'react'
import PropTypes from 'prop-types'

import PopUpDialog from '../PopUpDialog/PopUpDialog'

import './optionsMenu.scss'

import { CSSTransition } from 'react-transition-group'

const OptionsMenu = React.forwardRef(
  ({ children = [], show = false, timeout = 300 }, ref) => {
    return (
      <CSSTransition
        in={show}
        timeout={timeout}
        classNames="options-menu"
        unmountOnExit
      >
        <PopUpDialog
          className="select__options-list"
          customPosition={{
            element: ref,
            position: 'bottom-right'
          }}
          style={{ width: 'auto' }}
        >
          <ul className="options-menu">{children}</ul>
        </PopUpDialog>
      </CSSTransition>
    )
  }
)

OptionsMenu.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
  show: PropTypes.bool.isRequired,
  timout: PropTypes.number
}

export default OptionsMenu
