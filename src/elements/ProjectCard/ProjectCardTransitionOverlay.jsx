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
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { TextTooltipTemplate } from 'igz-controls/components'

const TOOLTIP_GAP = 8
// Below this much room above the card the tooltip would run off the top of the viewport, so it is
// placed underneath instead.
const MIN_SPACE_ABOVE = 96

/**
 * Covers a transitional project card to swallow its clicks, and names the operation in progress
 * above the card on hover.
 *
 * The tooltip is portaled out to the overlay container rather than positioned within the card: the
 * cards sit in a grid inside a scrolling wrapper, so a tooltip anchored inside the card would be
 * clipped for the whole first row. The shared `Tooltip` component is not used because it always
 * opens below its trigger and follows the pointer horizontally, whereas this one has to sit above
 * the card and stay centred on it.
 */
const ProjectCardTransitionOverlay = ({ tooltip }) => {
  const overlayRef = useRef()
  const [position, setPosition] = useState(null)

  const hide = useCallback(() => setPosition(null), [])

  const show = useCallback(() => {
    const rect = overlayRef.current?.getBoundingClientRect()

    if (!rect) return

    const below = rect.top < MIN_SPACE_ABOVE

    setPosition({
      below,
      left: rect.left + rect.width / 2,
      top: below ? rect.bottom + TOOLTIP_GAP : rect.top - TOOLTIP_GAP
    })
  }, [])

  // The tooltip is fixed to viewport coordinates, so it would drift away from its card on scroll.
  useEffect(() => {
    if (!position) return

    window.addEventListener('scroll', hide, true)

    return () => window.removeEventListener('scroll', hide, true)
  }, [position, hide])

  const portalTarget = document.getElementById('overlay_container')

  return (
    <>
      <div
        className="project-card__transition-overlay"
        ref={overlayRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        data-testid="project-card__transition-overlay"
      />
      {position &&
        portalTarget &&
        createPortal(
          <div
            className={classnames(
              'tooltip',
              'project-card__transition-tooltip',
              position.below && 'project-card__transition-tooltip_below'
            )}
            style={{ left: position.left, top: position.top }}
            data-testid="project-card__transition-tooltip"
          >
            <TextTooltipTemplate text={tooltip} />
          </div>,
          portalTarget
        )}
    </>
  )
}

ProjectCardTransitionOverlay.propTypes = {
  tooltip: PropTypes.string.isRequired
}

export default ProjectCardTransitionOverlay
