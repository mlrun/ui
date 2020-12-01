import React, { useRef, useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Transition } from 'react-transition-group'
import classnames from 'classnames'

import './tooltip.scss'

const Tooltip = ({ children, template, className, textShow = false }) => {
  const [show, setShow] = useState(false)
  const [style, setStyle] = useState({})
  const tooltipClassNames = classnames('data-ellipsis', className)
  const duration = 200
  const parentRef = useRef()
  const tooltipRef = useRef()
  const offset = 10

  const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`
  }

  const transitionStyles = {
    entering: { opacity: 0 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 }
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
      let show = textShow
        ? true
        : !child
        ? false
        : child.nodeType !== Node.TEXT_NODE ||
          /*
          If the child node is a text node and the text of the child node inside the container is greater than the width of the container, then show tooltip.
        */
          (child.nodeType === Node.TEXT_NODE &&
            parentRef.current.scrollWidth > parentRef.current.offsetWidth)
      if (show) {
        setShow(true)
        let {
          height,
          top,
          bottom
        } = parentRef?.current?.getBoundingClientRect()
        const {
          height: tooltipHeight,
          width: tooltipWidth
        } = tooltipRef.current?.getBoundingClientRect() ?? {
          height: 0,
          width: 0
        }
        const left =
          event.x + tooltipWidth > window.innerWidth
            ? event.x - (event.x + tooltipWidth - window.innerWidth + offset)
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
    [textShow]
  )

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
      return () => window.removeEventListener('scroll', handleScroll, true)
    }
  }, [show])

  return (
    <>
      <div
        data-testid="tooltip-wrapper"
        ref={parentRef}
        className={tooltipClassNames}
      >
        {children}
      </div>
      <Transition in={show} timeout={duration} unmountOnExit>
        {state => (
          <div
            data-testid="tooltip"
            ref={tooltipRef}
            style={{
              ...defaultStyle,
              ...transitionStyles[state],
              ...style
            }}
            className="tooltip"
          >
            {template}
          </div>
        )}
      </Transition>
    </>
  )
}

Tooltip.propTypes = {
  template: PropTypes.element.isRequired,
  className: PropTypes.string
}

export default React.memo(Tooltip)
