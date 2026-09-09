/*
Copyright 2022 Iguazio Systems Ltd.
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
import React, { useRef, useState, useEffect, useLayoutEffect, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'
import classnames from 'classnames'
import { debounce } from 'lodash-es'

import { isEveryObjectValueEmpty } from '../../utils/common.util'

import './tooltip.scss'

const VIEWPORT_PADDING = 8

const getTooltipPosition = (anchorRect, tooltipRect, offset) => {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const spaceBelow = viewportHeight - anchorRect.bottom - offset
  const spaceAbove = anchorRect.top - offset
  const showBelow = spaceBelow >= tooltipRect.height || spaceBelow >= spaceAbove

  let top = showBelow ? anchorRect.bottom + offset : anchorRect.top - tooltipRect.height - offset

  top = Math.max(
    VIEWPORT_PADDING,
    Math.min(top, viewportHeight - tooltipRect.height - VIEWPORT_PADDING)
  )

  let left = anchorRect.left
  left = Math.max(
    VIEWPORT_PADDING,
    Math.min(left, viewportWidth - tooltipRect.width - VIEWPORT_PADDING)
  )

  return { top, left }
}

let Tooltip = ({
  children = '',
  className = '',
  tooltipBodyClassName = '',
  hidden = false,
  id = '',
  renderChildAsHtml = false,
  template,
  textShow = false
}) => {
  const [show, setShow] = useState(false)
  const [style, setStyle] = useState({})

  const tooltipWrapperClassNames = classnames('data-ellipsis', 'tooltip-wrapper', className)
  const tooltipBodyClassNames = classnames('tooltip', tooltipBodyClassName)
  const duration = 200
  const parentRef = useRef()
  const tooltipRef = useRef()
  const offset = 10

  const handleScroll = () => {
    setShow(false)
  }

  const handleMouseLeave = useCallback(
    event => {
      if (
        !tooltipRef.current ||
        hidden ||
        (tooltipRef.current &&
          !tooltipRef.current.contains(event.relatedTarget) &&
          parentRef.current &&
          !parentRef.current.contains(event.relatedTarget))
      ) {
        setShow(false)
      }
    },
    [hidden]
  )

  const handleMouseEnter = useCallback(() => {
    if (!show) {
      const [child] = parentRef.current.childNodes
      let show =
        !hidden &&
        (textShow
          ? true
          : !child
            ? false
            : (child.nodeType !== Node.TEXT_NODE &&
                child.childNodes?.[0]?.nodeType !== Node.TEXT_NODE) ||
              /*
                                    If the child node is a text node and the text of the child node inside the container is greater than the width of the container, then show tooltip.
                                  */
              ((child.nodeType === Node.TEXT_NODE ||
                child.childNodes?.[0]?.nodeType === Node.TEXT_NODE) &&
                parentRef.current.scrollWidth > parentRef.current.offsetWidth))

      setShow(show)
    }
  }, [hidden, textShow, show])

  const updateTooltipPosition = useCallback(() => {
    const anchorEl = parentRef.current
    const tooltipEl = tooltipRef.current

    if (!anchorEl || !tooltipEl) {
      return
    }

    const anchorRect = anchorEl.getBoundingClientRect()
    const tooltipRect = tooltipEl.getBoundingClientRect()

    if (tooltipRect.width === 0 && tooltipRect.height === 0) {
      return
    }

    setStyle(getTooltipPosition(anchorRect, tooltipRect, offset))
  }, [offset])

  useLayoutEffect(() => {
    if (!show) {
      return
    }

    updateTooltipPosition()

    const frameId = requestAnimationFrame(() => {
      updateTooltipPosition()
    })

    return () => cancelAnimationFrame(frameId)
  }, [show, updateTooltipPosition])

  const clearStyles = useMemo(
    () =>
      debounce(() => {
        setStyle(prevStyle => (isEveryObjectValueEmpty(prevStyle) ? prevStyle : {}))
      }, 100),
    []
  )

  useEffect(() => () => clearStyles.cancel(), [clearStyles])

  useEffect(() => {
    const parentNode = parentRef.current

    if (parentNode) {
      parentNode.addEventListener('mouseenter', handleMouseEnter)
      parentNode.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        parentNode.removeEventListener('mouseenter', handleMouseEnter)
        parentNode.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [parentRef, handleMouseEnter, handleMouseLeave])

  useEffect(() => {
    const tooltipNode = tooltipRef.current

    if (tooltipNode && show) {
      tooltipNode.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        tooltipNode.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [tooltipRef, handleMouseEnter, handleMouseLeave, show])

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
  }, [clearStyles])

  return (
    <>
      {renderChildAsHtml ? (
        <div
          data-testid={id ? `${id}-tooltip-wrapper` : 'tooltip-wrapper'}
          ref={parentRef}
          className={tooltipWrapperClassNames}
          dangerouslySetInnerHTML={{ __html: children }}
          onClick={handleMouseLeave}
        />
      ) : (
        <div
          data-testid={id ? `${id}-tooltip-wrapper` : 'tooltip-wrapper'}
          ref={parentRef}
          className={tooltipWrapperClassNames}
          onClick={handleMouseLeave}
        >
          {children}
        </div>
      )}
      {!hidden &&
        createPortal(
          <CSSTransition
            nodeRef={tooltipRef}
            classNames="fade"
            in={show}
            timeout={duration}
            unmountOnExit
            onEntered={updateTooltipPosition}
          >
            <div
              data-testid={id ? `${id}-tooltip` : 'tooltip'}
              ref={tooltipRef}
              style={{
                ...style
              }}
              className={tooltipBodyClassNames}
            >
              {template}
            </div>
          </CSSTransition>,
          document.getElementById('overlay_container')
        )}
    </>
  )
}

Tooltip.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  tooltipBodyClassName: PropTypes.string,
  hidden: PropTypes.bool,
  id: PropTypes.string,
  renderChildAsHtml: PropTypes.bool,
  template: PropTypes.element.isRequired,
  textShow: PropTypes.bool
}

Tooltip = React.memo(Tooltip)

export default Tooltip
