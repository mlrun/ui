import React, { useState, useRef } from 'react'
import { useEffect } from 'react'

const Tooltip = ({ children, template }) => {
  const [show, setShow] = useState(false)
  const [isBottomPosition, setBottomPosition] = useState(false)
  const [parentHeight, setParentHeight] = useState(0)
  const parentRef = useRef(null)
  useEffect(() => {
    const handleMouseOver = () => {
      setShow(true)
      let { bottom, height } = parentRef.current.getBoundingClientRect()
      let percentToBottom = Number(window.innerHeight * 0.88).toFixed(0)
      setParentHeight(height)
      if (bottom >= percentToBottom) {
        setBottomPosition(true)
      } else {
        setBottomPosition(false)
      }
    }
    const handleMouseOut = () => setShow(false)
    const node = parentRef.current
    if (node) {
      node.addEventListener('mouseover', handleMouseOver)
      node.addEventListener('mouseout', handleMouseOut)

      return () => {
        node.removeEventListener('mouseover', handleMouseOver)
        node.removeEventListener('mouseout', handleMouseOut)
      }
    }
  }, [parentRef])

  useEffect(() => {
    const handlerScroll = () => {
      setShow(false)
    }
    if (show) {
      window.addEventListener('scroll', handlerScroll)
      return () => {
        window.removeEventListener('scroll', handlerScroll)
      }
    }
  })

  const _children = React.Children.map(children, (child, index) =>
    React.cloneElement(child, { ref: parentRef })
  )

  return (
    <div style={{ position: 'relative' }}>
      {show && isBottomPosition && (
        <div
          id="tooltip_container"
          style={{
            position: 'absolute',
            zIndex: '1000',
            bottom: parentHeight + 5
          }}
        >
          {template}
        </div>
      )}
      {_children}
      {show && !isBottomPosition && (
        <div
          id="tooltip_container"
          style={{
            position: 'absolute',
            zIndex: '1000',
            top: parentHeight + 5
          }}
        >
          {template}
        </div>
      )}
    </div>
  )
}

export default Tooltip
