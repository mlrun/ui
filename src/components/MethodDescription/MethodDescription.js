import React, { useState, useRef, useEffect } from 'react'
import classnames from 'classnames'

import './methodDescription.scss'

const MethodDescription = ({ description }) => {
  const [isAllDescription, setIsAllDescription] = useState(false)
  const [isClickable, setIsClickable] = useState(false)
  const refDescriptionText = useRef()

  const descriptionClassName = classnames(
    'description-container-text',
    isAllDescription && 'extended-description',
    isClickable && 'cursor-pointer'
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
      <div
        ref={refDescriptionText}
        className={descriptionClassName}
        onClick={() => {
          isClickable && setIsAllDescription(!isAllDescription)
        }}
      >
        {description}
      </div>
    </div>
  )
}

export default MethodDescription
