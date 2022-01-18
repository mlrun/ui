import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { createPortal } from 'react-dom'

import RoundedIcon from '../RoundedIcon/RoundedIcon'
import Tooltip from '../Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

import { POP_UP_CUSTOM_POSITION } from '../../types'
import { ReactComponent as CloseIcon } from '../../images/close.svg'

import './popUpDialog.scss'

const PopUpDialog = ({
  children,
  className,
  closePopUp,
  customPosition,
  headerText,
  style,
  tooltipText
}) => {
  const popUpOverlayRef = useRef(null)
  const popUpClassNames = classnames(
    className,
    'pop-up-dialog__overlay',
    customPosition.element && 'custom-position'
  )

  const calculateCustomPopUpPosition = useCallback(() => {
    if (customPosition.element) {
      const elementRect = customPosition.element.current.getBoundingClientRect()
      const popUpRect = popUpOverlayRef.current.getBoundingClientRect()
      const [
        verticalPosition,
        horizontalPosition
      ] = customPosition.position.split('-')

      const topPosition =
        verticalPosition === 'top'
          ? elementRect.top - popUpRect.height - 5
          : elementRect.bottom + 5
      const leftPosition =
        horizontalPosition === 'left'
          ? elementRect.right - popUpRect.width
          : elementRect.left

      popUpOverlayRef.current.style.top = `${topPosition}px`
      popUpOverlayRef.current.style.left = `${leftPosition}px`
    }
  }, [customPosition])

  useLayoutEffect(() => {
    calculateCustomPopUpPosition()
  }, [calculateCustomPopUpPosition])

  useEffect(() => {
    window.addEventListener('resize', calculateCustomPopUpPosition)

    return () => {
      window.removeEventListener('resize', calculateCustomPopUpPosition)
    }
  })

  return createPortal(
    <div ref={popUpOverlayRef} className={popUpClassNames} style={style}>
      <div data-testid="pop-up-dialog" className="pop-up-dialog">
        <div className="pop-up-dialog__header">
          {headerText && (
            <div
              data-testid="pop-up-dialog-header"
              className="pop-up-dialog__header-text"
            >
              <Tooltip
                template={
                  <TextTooltipTemplate text={tooltipText || headerText} />
                }
              >
                <span>{headerText}</span>
              </Tooltip>
            </div>
          )}
          <RoundedIcon
            className="pop-up-dialog__btn_close"
            onClick={closePopUp}
            tooltipText="Close"
            data-testid="pop-up-close-btn"
          >
            <CloseIcon />
          </RoundedIcon>
        </div>
        {children}
      </div>
    </div>,
    document.getElementById('overlay_container')
  )
}

PopUpDialog.defaultProps = {
  className: '',
  closePopUp: () => {},
  customPosition: {},
  headerText: '',
  style: {},
  tooltipText: ''
}

PopUpDialog.propTypes = {
  className: PropTypes.string,
  closePopUp: PropTypes.func,
  customPosition: POP_UP_CUSTOM_POSITION,
  headerText: PropTypes.string,
  style: PropTypes.object,
  tooltipText: PropTypes.string
}

export default PopUpDialog
