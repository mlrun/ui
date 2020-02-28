import React, { useRef, useState, useEffect } from 'react'
import { Transition } from 'react-transition-group'

const Tooltip = ({ children, template, className }) => {
  const [show, setShow] = useState(false)
  const [style, setStyle] = useState({})

  const duration = 200
  const parentRef = useRef()
  const tooltipRef = useRef()
  const offset = 10

  const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    position: 'fixed',
    zIndex: 1000
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

  const handleMouseEnter = event => {
    setShow(true)

    let { height, top, bottom } = parentRef.current.getBoundingClientRect()
    const tooltipHeight = tooltipRef.current.getBoundingClientRect().height

    if (top + height + offset + tooltipHeight >= window.innerHeight) {
      setStyle({
        top: bottom - height - offset - tooltipHeight,
        left: event.x
      })
    } else {
      setStyle({
        top: top + height + offset,
        left: event.x
      })
    }
  }

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
  }, [parentRef])

  useEffect(() => {
    if (show) {
      window.addEventListener('scroll', handleScroll, true)
      return () => window.removeEventListener('scroll', handleScroll, true)
    }
  }, [show])

  return (
    <>
      <div ref={parentRef} className={className}>
        {children}
      </div>
      <Transition in={show} timeout={duration} unmountOnExit>
        {state => (
          <div
            ref={tooltipRef}
            style={{
              ...defaultStyle,
              ...transitionStyles[state],
              ...style
            }}
          >
            {template}
          </div>
        )}
      </Transition>
    </>
  )
}

export default Tooltip
