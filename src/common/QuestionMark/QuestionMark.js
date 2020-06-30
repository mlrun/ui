import React, { useState, useRef, useEffect } from 'react'
import { CSSTransition } from 'react-transition-group'
import classnames from 'classnames'

import { ReactComponent as QuestionMarkIcon } from '../../images/question-mark.svg'

import './questionMark.scss'

const QuestionMark = ({ text }) => {
  const [isShow, setIsShow] = useState(false)
  const questionMarkRef = useRef()

  const handleMouseEnter = () => {
    setIsShow(true)
  }

  const handleMouseLeave = () => {
    setIsShow(false)
  }

  useEffect(() => {
    const node = questionMarkRef.current
    if (node) {
      node.addEventListener('mouseenter', handleMouseEnter)
      node.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        node.removeEventListener('mouseenter', handleMouseEnter)
        node.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [isShow])

  return (
    <div className="question-mark-container">
      <QuestionMarkIcon ref={questionMarkRef} />
      <CSSTransition in={isShow} timeout={200} classNames="fade" unmountOnExit>
        <div
          className={classnames(
            'question-mark-container__tooltip',
            'tooltip-left',
            text.length <= 40 ? 'tooltip-min-content' : 'tooltip-max-content'
          )}
        >
          {text}
        </div>
      </CSSTransition>
    </div>
  )
}

export default QuestionMark
