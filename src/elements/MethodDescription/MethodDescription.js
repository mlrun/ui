import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

import classnames from 'classnames'

import './methodDescription.scss'

const MethodDescription = ({ description }) => {
  const [showAllDescription, setShowAllDescription] = useState(false)
  const [isClickable, setIsClickable] = useState(false)
  const refDescriptionText = useRef()

  const descriptionClassName = classnames(
    'description-container-text',
    showAllDescription && 'extended-description'
  )

  useEffect(() => {
    if (
      refDescriptionText.current.scrollWidth >
      refDescriptionText.current.offsetWidth
    ) {
      setIsClickable(true)
    }
  }, [])

  return (
    <div className="description-container">
      <div ref={refDescriptionText} className={descriptionClassName}>
        {description}
      </div>
      {isClickable && (
        <button
          className="description__toggle-btn"
          onClick={() => setShowAllDescription(!showAllDescription)}
        >
          ...
        </button>
      )}
    </div>
  )
}

MethodDescription.propTypes = {
  description: PropTypes.string.isRequired
}

export default MethodDescription
