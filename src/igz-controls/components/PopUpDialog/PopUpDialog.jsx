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
import React, { forwardRef, useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { createPortal } from 'react-dom'
import { throttle } from 'lodash'

import RoundedIcon from '../RoundedIcon/RoundedIcon'
import Tooltip from '../Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

import { POP_UP_CUSTOM_POSITION } from '../../types'
import CloseIcon from '../../images/close.svg?react'

import './popUpDialog.scss'

let PopUpDialog = (
  {
    children,
    className = '',
    closePopUp = null,
    customPosition = {},
    headerIsHidden = false,
    headerText = '',
    isOpen = true,
    onResolve = null,
    style = {},
    tooltipText = ''
  },
  ref
) => {
  const popUpOverlayRef = useRef(null)
  ref ??= popUpOverlayRef
  const popUpClassNames = classnames(
    className,
    'pop-up-dialog__overlay',
    customPosition.element && 'custom-position'
  )

  const handleClosePopUp = useCallback(() => {
    closePopUp && closePopUp()
    onResolve && onResolve()
  }, [closePopUp, onResolve])

  const calculateCustomPopUpPosition = useCallback(() => {
    if (customPosition?.element?.current && ref?.current) {
      const elementRect = customPosition.element.current.getBoundingClientRect()
      const popUpRect = ref.current.getBoundingClientRect()
      const [verticalPosition, horizontalPosition] = customPosition.position.split('-')
      const popupMargin = 15
      const elementMargin = 5
      const isEnoughSpaceFromLeft = elementRect.right >= popUpRect.width + popupMargin
      const isEnoughSpaceFromRight =
        window.innerWidth - elementRect.left >= popUpRect.width + popupMargin
      const isEnoughSpaceFromTop = elementRect.top > popUpRect.height + popupMargin + elementMargin
      const isEnoughSpaceFromBottom =
        elementRect.bottom + popUpRect.height + popupMargin + elementMargin <= window.innerHeight
      let leftPosition =
        horizontalPosition === 'left' ? elementRect.right - popUpRect.width : elementRect.left

      let topPosition

      if (verticalPosition === 'top') {
        topPosition = isEnoughSpaceFromTop
          ? elementRect.top - popUpRect.height - elementMargin
          : popupMargin
      } else {
        topPosition = isEnoughSpaceFromBottom
          ? elementRect.bottom + elementMargin
          : window.innerHeight - popUpRect.height - popupMargin
      }

      if (customPosition.autoVerticalPosition) {
        if (verticalPosition === 'top') {
          if (!isEnoughSpaceFromTop && isEnoughSpaceFromBottom) {
            topPosition = elementRect.bottom + elementMargin
          }
        } else {
          if (isEnoughSpaceFromTop && !isEnoughSpaceFromBottom) {
            topPosition = elementRect.top - popUpRect.height - elementMargin
          }
        }
      }

      if (customPosition.autoHorizontalPosition) {
        if (verticalPosition === 'left') {
          if (!isEnoughSpaceFromLeft && isEnoughSpaceFromRight) {
            leftPosition = elementRect.left
          } else if (!isEnoughSpaceFromLeft && !isEnoughSpaceFromRight) {
            leftPosition = popupMargin
          }
        } else {
          if (isEnoughSpaceFromLeft && !isEnoughSpaceFromRight) {
            leftPosition = elementRect.right - popUpRect.width
          } else if (!isEnoughSpaceFromLeft && !isEnoughSpaceFromRight) {
            leftPosition = window.innerWidth - popUpRect.width - popupMargin
          }
        }
      }

      ref.current.style.top = `${topPosition}px`

      if (style.left && !(customPosition.autoHorizontalPosition && isEnoughSpaceFromRight)) {
        ref.current.style.left = `calc(${leftPosition}px + ${style.left})`
      } else {
        ref.current.style.left = `${leftPosition}px`
      }
    }
  }, [customPosition, style.left, ref])

  useLayoutEffect(() => {
    calculateCustomPopUpPosition()
  }, [calculateCustomPopUpPosition])

  useEffect(() => {
    if (isOpen) {
      const throttledCalculatedCustomPopUpPosition = throttle(calculateCustomPopUpPosition, 100, {
        trailing: true,
        leading: true
      })
      const popupObserver = new ResizeObserver(throttledCalculatedCustomPopUpPosition)
      const popupElement = ref.current

      popupObserver.observe(popupElement)
      window.addEventListener('resize', throttledCalculatedCustomPopUpPosition)

      return () => {
        popupObserver.unobserve(popupElement)
        window.removeEventListener('resize', throttledCalculatedCustomPopUpPosition)
      }
    }
  }, [calculateCustomPopUpPosition, ref, isOpen])

  return isOpen
    ? createPortal(
        <div ref={ref} className={popUpClassNames} style={style}>
          <div data-testid="pop-up-dialog" className="pop-up-dialog">
            {!headerIsHidden && (
              <div className="pop-up-dialog__header">
                {headerText && (
                  <div data-testid="pop-up-dialog-header" className="pop-up-dialog__header-text">
                    <Tooltip template={<TextTooltipTemplate text={tooltipText || headerText} />}>
                      <span>{headerText}</span>
                    </Tooltip>
                  </div>
                )}
                <RoundedIcon
                  className="pop-up-dialog__btn_close"
                  onClick={handleClosePopUp}
                  tooltipText="Close"
                  data-testid="pop-up-close-btn"
                >
                  <CloseIcon />
                </RoundedIcon>
              </div>
            )}
            {children}
          </div>
        </div>,
        document.getElementById('overlay_container')
      )
    : null
}

PopUpDialog = forwardRef(PopUpDialog)

PopUpDialog.displayName = 'PopUpDialog'

PopUpDialog.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  closePopUp: PropTypes.func,
  customPosition: POP_UP_CUSTOM_POSITION,
  isOpen: PropTypes.bool,
  headerIsHidden: PropTypes.bool,
  headerText: PropTypes.string,
  onResolve: PropTypes.func,
  showPopUpDialog: PropTypes.bool,
  style: PropTypes.object,
  tooltipText: PropTypes.string
}

export default PopUpDialog
