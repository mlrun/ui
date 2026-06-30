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
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'
import classnames from 'classnames'
import { createPortal } from 'react-dom'

import { getScssVariableValue } from '../../utils/common.util'

import QuestionMarkIcon from '../../images/question-mark.svg?react'
import ExclamationMarkIcon from '../../images/exclamation-mark.svg?react'

import './tip.scss'

const Tip = ({ className = '', text, withExclamationMark = false }) => {
  const [isShow, setIsShow] = useState(false)
  const [tipClassName, setTipClassName] = useState('tip_top tip_left')

  const arrowLength = useMemo(() => parseInt(getScssVariableValue('--tipArrowLength')), [])
  const arrowOffset = useMemo(() => parseInt(getScssVariableValue('--tipArrowOffset')), [])
  const iconLength = useMemo(() => parseInt(getScssVariableValue('--tipIconLength')), [])

  const minTextLength = 40

  const iconRef = useRef()
  const tipBodyRef = useRef()

  const tipContainerClassNames = classnames(className, 'tip-container')
  const tipClassNames = classnames(
    'tip',
    tipClassName,
    text.length <= minTextLength ? 'tip_small' : 'tip_big'
  )

  const handleMouseEnter = useCallback(() => {
    setIsShow(true)
  }, [])

  useEffect(() => {
    if (isShow) {
      const iconRect = iconRef.current.getBoundingClientRect()
      const tipRect = tipBodyRef.current.getBoundingClientRect()
      const widthPosition = iconRect.left > tipRect.width - arrowOffset ? 'tip_left' : 'tip_right'
      const heightPosition = iconRect.top > tipRect.height + arrowLength ? 'tip_top' : 'tip_bottom'

      setTipClassName(`${heightPosition} ${widthPosition}`)

      if (widthPosition === 'tip_left') {
        const computedArrowOffset = arrowOffset + (iconLength + arrowLength) / 2
        tipBodyRef.current.style.left = `${iconRect.left - (tipRect.width - computedArrowOffset)}px`
      } else {
        const computedArrowOffset = arrowOffset - (iconLength - arrowLength) / 2
        tipBodyRef.current.style.left = `${iconRect.left - computedArrowOffset}px`
      }

      tipBodyRef.current.style.top =
        heightPosition === 'tip_top'
          ? `${iconRect.top - tipRect.height - arrowLength}px`
          : `${iconRect.bottom + arrowLength}px`
    }
  }, [arrowLength, arrowOffset, iconLength, isShow])

  const handleMouseLeave = () => {
    setIsShow(false)
  }

  useEffect(() => {
    const node = iconRef.current

    if (iconRef.current) {
      node.addEventListener('mouseenter', handleMouseEnter)
      node.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        node.removeEventListener('mouseenter', handleMouseEnter)
        node.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [handleMouseEnter, isShow])

  return (
    <div data-testid="tip" className={tipContainerClassNames}>
      <div ref={iconRef} className="tip-wrapper">
        {withExclamationMark ? (
          <ExclamationMarkIcon data-testid="tip-icon" />
        ) : (
          <QuestionMarkIcon data-testid="tip-icon" />
        )}
      </div>
      {createPortal(
        <CSSTransition
          nodeRef={tipBodyRef}
          in={isShow}
          timeout={200}
          classNames="fade"
          unmountOnExit
        >
          <div ref={tipBodyRef} data-testid="tip-text" className={tipClassNames}>
            {text}
          </div>
        </CSSTransition>,
        document.getElementById('overlay_container')
      )}
    </div>
  )
}

Tip.propTypes = {
  className: PropTypes.string,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  withExclamationMark: PropTypes.bool
}

export default Tip
