/*
Copyright 2022 Iguazio Systems Ltd.
Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.
In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'
import classNames from 'classnames'

import Backdrop from '../Backdrop/Backdrop'
import RoundedIcon from '../RoundedIcon/RoundedIcon'

import { MODAL_MD } from '../../constants'
import { MODAL_SIZES } from '../../types'

import CloseIcon from '../../images/close.svg?react'

import './Modal.scss'

const Modal = ({
  actions = [],
  children,
  className = '',
  noHeader = false,
  onClose,
  previewText = '',
  show = false,
  size = MODAL_MD,
  subTitle = null,
  title = ''
}) => {
  const nodeRef = useRef(null)
  const modalClassNames = classNames('modal', className, size && `modal-${size}`)

  return (
    <>
      <Backdrop onClose={onClose} show={show} />
      <CSSTransition
        nodeRef={nodeRef}
        in={show}
        timeout={300}
        classNames="modal-transition"
        unmountOnExit
      >
        <div className={modalClassNames} data-testid="modal" ref={nodeRef}>
          <div className="modal__header-button">
            <RoundedIcon data-testid="pop-up-close-btn" onClick={onClose} tooltipText="Close">
              <CloseIcon />
            </RoundedIcon>
          </div>
          <div className="modal__content">
            {!noHeader && (
              <div className="modal__header">
                {previewText && <div className="modal__header-preview-text">{previewText}</div>}
                <h5 className="modal__header-title">{title}</h5>
                {subTitle && <h6 className="modal__header-sub-title">{subTitle}</h6>}
              </div>
            )}
            <div className="modal__body">{children}</div>
            {actions && actions.length > 0 && (
              <div className="modal__footer">
                <div className="modal__footer-actions">
                  {actions.map((action, idx) => (
                    <div key={idx}>{action}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CSSTransition>
    </>
  )
}

Modal.propTypes = {
  actions: PropTypes.array,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.object,
    PropTypes.node,
    PropTypes.string
  ]).isRequired,
  className: PropTypes.string,
  noHeader: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  previewText: PropTypes.string,
  show: PropTypes.bool,
  size: MODAL_SIZES,
  subTitle: PropTypes.string,
  title: PropTypes.string
}

export default Modal
