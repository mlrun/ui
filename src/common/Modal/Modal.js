import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { createPortal } from 'react-dom'
import { CSSTransition } from 'react-transition-group'
import classNames from 'classnames'

import Backdrop from '../Backdrop.js/Backdrop'
import RoundedIcon from '../RoundedIcon/RoundedIcon'

import { ReactComponent as CloseIcon } from '../../images/close.svg'

import './Modal.scss'

const JSX_MODAL = ({ children, className, onClose, size, show, title }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const modalClassNames = classNames(
    'modal',
    className,
    size && `modal-${size}`
  )

  const handleOnClose = () => {
    setIsModalOpen(false)
    onClose()
  }

  useEffect(() => {
    setIsModalOpen(show)
    return () => {
      setIsModalOpen(false)
    }
  }, [show])
  return (
    <>
      <Backdrop onClose={handleOnClose} show={isModalOpen} />
      <CSSTransition
        in={isModalOpen}
        timeout={300}
        classNames="modal-transition"
        unmountOnExit
      >
        <div className={modalClassNames} data-testid="modal">
          <RoundedIcon
            className="modal__header-button"
            onClick={handleOnClose}
            tooltipText="Close"
            data-testid="pop-up-close-btn"
          >
            <CloseIcon />
          </RoundedIcon>
          <div className="modal__content">
            <div className="modal__header">
              <h5 className="modal__header-title">{title}</h5>
            </div>
            <div className="modal__body">{children}</div>
            <div className="modal__footer"></div>
          </div>
        </div>
      </CSSTransition>
    </>
  )
}
const Modal = props => {
  return createPortal(
    <JSX_MODAL {...props} />,
    document.getElementById('overlay_container')
  )
}

Modal.defaultProps = {
  show: false,
  size: 'normal',
  title: ''
}

Modal.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
    .isRequired,
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  size: PropTypes.oneOf(['normal', 'lg']),
  title: PropTypes.string
}

export default Modal
