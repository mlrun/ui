import React, { useState, useRef, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'
import classnames from 'classnames'

import { ReactComponent as QuestionMarkIcon } from '../../images/question-mark.svg'

import './tip.scss'

const Tip = ({ className, text }) => {
  const [isShow, setIsShow] = useState(false)
  const [style, setStyle] = useState({
    left: -10
  })
  const [tipClassName, setTipClassName] = useState('tip_top tip_left')

  const tipRef = useRef()
  const parentRef = useRef()
  const tipBodyRef = useRef()

  const offset = 25
  const minTextLength = 40
  const initialLeftStyle = -10

  const tipContainerClassNames = classnames(className, 'tip-container')
  const tipCLassNames = classnames(
    'tip',
    tipClassName,
    text.length <= minTextLength ? 'tip_small' : 'tip_big'
  )

  const handleMouseEnter = useCallback(
    event => {
      setIsShow(true)
      let { height, top } = parentRef?.current
        ? parentRef?.current.getBoundingClientRect()
        : {}

      const {
        height: tipHeight,
        width: tipWidth
      } = tipBodyRef?.current?.getBoundingClientRect() ?? {
        height: 0,
        width: 0
      }

      const left =
        event.x + tipWidth > window.innerWidth
          ? event.x - (tipWidth + event.x - offset)
          : style.left

      if (top - height - tipHeight <= 10) {
        setTipClassName(
          left !== initialLeftStyle
            ? 'tip_bottom tip_right'
            : 'tip_bottom tip_left'
        )
        setStyle({
          top: offset,
          left
        })
      } else {
        setTipClassName(
          left !== initialLeftStyle ? 'tip_top tip_right' : 'tip_top tip_left'
        )
        setStyle({
          top: 'unset',
          left
        })
      }
    },
    [initialLeftStyle, style.left]
  )

  const handleMouseLeave = () => {
    setIsShow(false)
  }

  useEffect(() => {
    const node = tipRef.current
    if (node) {
      node.addEventListener('mouseenter', handleMouseEnter)
      node.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        node.removeEventListener('mouseenter', handleMouseEnter)
        node.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [handleMouseEnter, isShow])

  return (
    <div data-testid="tip" className={tipContainerClassNames} ref={parentRef}>
      <QuestionMarkIcon data-testid="tip-icon" ref={tipRef} />
      <CSSTransition in={isShow} timeout={200} classNames="fade" unmountOnExit>
        <div
          ref={tipBodyRef}
          data-testid="tip-text"
          className={tipCLassNames}
          style={{ ...style }}
        >
          {text}
        </div>
      </CSSTransition>
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
