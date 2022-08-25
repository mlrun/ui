/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
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
