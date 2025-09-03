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
import { useState, useRef, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'

import './expandableText.scss'

const ExpandableText = ({
  children,
  context = null,
  collapsedHeight = 95,
  forceExpand = false
}) => {
  const [expanded, setExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const contentRef = useRef(null)
  const { contextForceExpand } = useContext(context)

  useEffect(() => {
    if (forceExpand || contextForceExpand) {
      setExpanded(forceExpand || contextForceExpand)
    }
  }, [contextForceExpand, forceExpand])

  useEffect(() => {
    const element = contentRef.current

    if (element) {
      setIsOverflowing(element.scrollHeight > collapsedHeight + 1)
    }
  }, [children, collapsedHeight])

  return (
    <div className="expandable-wrapper">
      <div
        ref={contentRef}
        className="expandable-text"
        style={{
          maxHeight: expanded ? 'none' : `${collapsedHeight}px`
        }}
      >
        {children}
      </div>
      {!expanded && isOverflowing && (
        <>
          <div className="fade-overlay" />
          <div className="see-more-button-overlay">
            <span className="dots">...</span>
            <button className="see-more-button" onClick={() => setExpanded(true)}>
              See more
            </button>
          </div>
        </>
      )}
      {expanded && isOverflowing && (
        <div className="see-less-container">
          <button className="see-less-button" onClick={() => setExpanded(false)}>
            See less
          </button>
        </div>
      )}
    </div>
  )
}

ExpandableText.propTypes = {
  children: PropTypes.node.isRequired,
  context: PropTypes.object,
  collapsedHeight: PropTypes.number,
  forceExpand: PropTypes.bool
}

export default ExpandableText
