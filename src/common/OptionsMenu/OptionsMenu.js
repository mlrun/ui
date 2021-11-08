import React from 'react'
import PropTypes from 'prop-types'

import PopUpDialog from '../PopUpDialog/PopUpDialog'

import { CSSTransition } from 'react-transition-group'
import './optionsMenu.scss'

const OptionsMenu = React.forwardRef(({ children, show, timeout }, ref) => {
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
      >
        <ul className="options-menu">{children}</ul>
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
