import React, { useState, useRef } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const Tooltip = ({ template, to, name, kind, owner }) => {
  const [show, setShow] = useState(false)
  const [isBottomPosition, setBottomPosition] = useState(false)
  const parentRef = useRef(null)
  useEffect(() => {
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
    if (show) {
      window.addEventListener('scroll', handlerScroll)
      return () => {
        window.removeEventListener('scroll', handlerScroll)
      }
    }
  }, [show])

  const handlerScroll = () => {
    setShow(false)
  }

  const handleMouseOver = () => {
    setShow(true)
    let { bottom } = parentRef.current.getBoundingClientRect()
    let percentToBottom = (window.innerHeight * 0.88).toFixed(0)
    if (bottom >= percentToBottom) {
      setBottomPosition(true)
    } else {
      setBottomPosition(false)
    }
  }
  const handleMouseOut = () => {
    setShow(false)
  }

  return (
    <div className="tooltip">
      {show && (
        <div
          id="tooltip_container"
          className={`tooltip_container ${
            isBottomPosition
              ? 'tooltip_container_bottom'
              : 'tooltip_container_top'
          }`}
        >
          <div className="tooltip_body">
            <div className="tooltip_body_item">
              <span>Kind:</span> {kind}
            </div>
            <div className="tooltip_body_item">
              <span>Owner:</span> {owner}
            </div>
          </div>
        </div>
      )}
      <Link to={to} ref={parentRef}>
        {name}
      </Link>
    </div>
  )
}

export default Tooltip
