import React, { useRef, useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'
import classnames from 'classnames'
import { debounce } from 'lodash'
import { createPortal } from 'react-dom'

import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'

import './tooltip.scss'

const Tooltip = ({ children, className, hidden, template, textShow }) => {
  const [show, setShow] = useState(false)
  const [style, setStyle] = useState({})
  const tooltipClassNames = classnames(
    'data-ellipsis',
    'tooltip-wrapper',
    className
  )
  const duration = 200
  const parentRef = useRef()
  const tooltipRef = useRef()
  const offset = 10

  const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out ${duration}ms`
  }

  const handleScroll = () => {
    setShow(false)
  }

  const handleMouseLeave = () => {
    setShow(false)
  }

  const handleMouseEnter = useCallback(
    event => {
      const [child] = parentRef.current.childNodes
      let show =
        !hidden &&
        (textShow
          ? true
          : !child
          ? false
          : child.nodeType !== Node.TEXT_NODE ||
            /*
          If the child node is a text node and the text of the child node inside the container is greater than the width of the container, then show tooltip.
        */
            (child.nodeType === Node.TEXT_NODE &&
              parentRef.current.scrollWidth > parentRef.current.offsetWidth))
      if (show) {
        setShow(true)
        let { height, top, bottom } =
          parentRef?.current?.getBoundingClientRect() ?? {}
        const {
          height: tooltipHeight,
          width: tooltipWidth
        } = tooltipRef.current?.getBoundingClientRect() ?? {
          height: 0,
          width: 0
        }
        const leftPosition =
          event.x - (event.x + tooltipWidth - window.innerWidth + offset)
        const left =
          event.x + tooltipWidth > window.innerWidth
            ? leftPosition > offset
              ? leftPosition
              : offset
            : event.x

        if (top + height + offset + tooltipHeight >= window.innerHeight) {
          setStyle({
            top: bottom - height - offset - tooltipHeight,
            left
          })
        } else {
          setStyle({
            top: top + height + offset,
            left
          })
        }
      }
    },
    [hidden, textShow]
  )

  const clearStyles = debounce(() => {
    if (!isEveryObjectValueEmpty(style)) {
      setStyle({})
    }
  }, 100)

  useEffect(() => {
    const node = parentRef.current
    if (node) {
      node.addEventListener('mouseenter', handleMouseEnter)
      node.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        node.removeEventListener('mouseenter', handleMouseEnter)
        node.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [parentRef, handleMouseEnter])

  useEffect(() => {
    if (show) {
      window.addEventListener('scroll', handleScroll, true)
    }

    return () => window.removeEventListener('scroll', handleScroll, true)
  }, [show])

  useEffect(() => {
    window.addEventListener('resize', clearStyles)

    return () => {
      window.removeEventListener('resize', clearStyles)
    }
  }, [clearStyles, style])

  return (
    <>
      <div
        data-testid="tooltip-wrapper"
        ref={parentRef}
        className={tooltipClassNames}
      >
        {children}
      </div>
      {createPortal(
        <CSSTransition
          in={show}
          timeout={duration}
          classNames="fade"
          unmountOnExit
        >
          <div
            data-testid="tooltip"
            ref={tooltipRef}
            style={{
              ...defaultStyle,
              ...style
            }}
            className="tooltip"
          >
            {template}
          </div>
        </CSSTransition>,
        document.getElementById('overlay_container')
      )}
    </>
  )
}

Tooltip.defaultProps = {
  hidden: false,
  textShow: false
}

Tooltip.propTypes = {
  className: PropTypes.string,
  hidden: PropTypes.bool,
  template: PropTypes.element.isRequired,
  textShow: PropTypes.bool
}

export default React.memo(Tooltip)
