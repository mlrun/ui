import React, { useState, useRef, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'
import classnames from 'classnames'
import { createPortal } from 'react-dom'

import { ReactComponent as QuestionMarkIcon } from '../../images/question-mark.svg'

import './tip.scss'
import tipStyle from './tip.scss'

const arrowOffset = parseInt(tipStyle.arrowoffset)
const arrowLength = parseInt(tipStyle.arrowlength)
const iconLength = parseInt(tipStyle.iconlength)
const minTextLength = 40

const Tip = ({ className, text }) => {
  const [isShow, setIsShow] = useState(false)
  const [tipClassName, setTipClassName] = useState('tip_top tip_left')

  const iconRef = useRef()
  const tipBodyRef = useRef()

  const tipContainerClassNames = classnames(className, 'tip-container')
  const tipClassNames = classnames(
    'tip',
    tipClassName,
    text.length <= minTextLength ? 'tip_small' : 'tip_big'
  )

  const handleMouseEnter = useCallback(event => {
    setIsShow(true)

    const iconRect = iconRef.current.getBoundingClientRect()
    const tipRect = tipBodyRef.current.getBoundingClientRect()
    const widthPosition =
      iconRect.left > tipRect.width - arrowOffset ? 'tip_left' : 'tip_right'
    const heightPosition =
      iconRect.top > tipRect.height + arrowLength ? 'tip_top' : 'tip_bottom'

    setTipClassName(`${heightPosition} ${widthPosition}`)

    if (widthPosition === 'tip_left') {
      const computedArrowOffset = arrowOffset + (iconLength + arrowLength) / 2
      tipBodyRef.current.style.left = `${iconRect.left -
        (tipRect.width - computedArrowOffset)}px`
    } else {
      const computedArrowOffset = arrowOffset - (iconLength - arrowLength) / 2
      tipBodyRef.current.style.left = `${iconRect.left - computedArrowOffset}px`
    }

    tipBodyRef.current.style.top =
      heightPosition === 'tip_top'
        ? `${iconRect.top - tipRect.height - arrowLength}px`
        : `${iconRect.bottom + arrowLength}px`
  }, [])

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
      <QuestionMarkIcon data-testid="tip-icon" ref={iconRef} />
      {createPortal(
        <CSSTransition
          in={isShow}
          timeout={200}
          classNames="fade"
          unmountOnExit
        >
          <div
            ref={tipBodyRef}
            data-testid="tip-text"
            className={tipClassNames}
          >
            {text}
          </div>
        </CSSTransition>,
        document.getElementById('overlay_container')
      )}
    </div>
  )
}

Tip.defaultProps = {
  className: ''
}

Tip.propTypes = {
  className: PropTypes.string,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired
}

export default Tip
