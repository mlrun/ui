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
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Tooltip, TooltipContent, TooltipTrigger } from 'igz-controls/nextGenComponents'

import UrlItem from '../UrlItem'
import { URL_ITEM_VARIANT } from '../UrlItem/urlItem.constants'
import {
  COPY_BTN_WIDTH_PX,
  COPY_SUCCESS_DURATION_MS,
  RESIZE_THROTTLE_MS
} from './urlCell.constants'
import { calculateVisibleCount, measureTextWidth } from './urlCell.utils'

const UrlCell = ({ items = [] }) => {
  const [copiedUrl, setCopiedUrl] = useState(null)
  const [visibleCount, setVisibleCount] = useState(items.length)
  const [containerEl, setContainerEl] = useState(null)
  const throttleTimerRef = useRef(null)
  const copyTimerRef = useRef(null)

  const recalculate = useCallback(() => {
    if (!containerEl) return

    const containerWidth = containerEl.offsetWidth
    const { fontWeight, fontFamily } = getComputedStyle(containerEl)
    const font = `${fontWeight} 15px ${fontFamily}`

    const sep = measureTextWidth(', ', font)

    const itemWidths = items.map(
      ({ url, allowCopy }, i) =>
        (i > 0 ? sep : 0) + measureTextWidth(url, font) + (allowCopy ? COPY_BTN_WIDTH_PX : 0)
    )

    const badgeWidth = items.length > 1 ? sep + measureTextWidth(`+${items.length - 1}`, font) : 0

    setVisibleCount(calculateVisibleCount(containerWidth, itemWidths, badgeWidth))
  }, [containerEl, items])

  useEffect(() => {
    if (!containerEl) return

    const throttledRecalculate = () => {
      if (throttleTimerRef.current) return

      recalculate()
      throttleTimerRef.current = setTimeout(() => {
        throttleTimerRef.current = null
      }, RESIZE_THROTTLE_MS)
    }

    const observer = new ResizeObserver(throttledRecalculate)
    observer.observe(containerEl)

    return () => {
      observer.disconnect()
      clearTimeout(throttleTimerRef.current)
      throttleTimerRef.current = null
    }
  }, [containerEl, recalculate])

  useEffect(() => {
    return () => clearTimeout(copyTimerRef.current)
  }, [])

  const handleCopy = useCallback(url => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    clearTimeout(copyTimerRef.current)
    copyTimerRef.current = setTimeout(() => {
      setCopiedUrl(previous => (previous === url ? null : previous))
    }, COPY_SUCCESS_DURATION_MS)
  }, [])

  if (!items.length) {
    return <span data-testid="url-cell-empty" />
  }

  const visibleItems = items.slice(0, visibleCount)
  const overflowItems = items.slice(visibleCount)

  return (
    <div ref={setContainerEl} className="flex items-center min-w-0" data-testid="url-cell">
      {visibleItems.map(({ url, allowCopy, openInNewTab }, index) => (
        <Fragment key={`${url}-${index}`}>
          {index > 0 && <span className="text-[15px] text-igz-gray shrink-0 mr-2 ml-1">,</span>}
          <UrlItem
            url={url}
            allowCopy={allowCopy}
            openInNewTab={openInNewTab}
            isCopied={copiedUrl === url}
            onCopy={handleCopy}
          />
        </Fragment>
      ))}
      {overflowItems.length > 0 && (
        <>
          <span className="text-[15px] text-igz-gray shrink-0 mr-2 ml-1">,</span>

          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <span
                className="text-[15px] text-igz-link shrink-0 cursor-pointer select-none"
                data-testid="overflow-badge"
              >
                +{overflowItems.length}
              </span>
            </TooltipTrigger>

            <TooltipContent side="top" align="start" className="p-2 max-w-sm">
              <div
                className="flex flex-col gap-1.5 overflow-y-auto max-h-[260px]"
                data-testid="tooltip-url-list"
              >
                {overflowItems.map(({ url, allowCopy, openInNewTab }, index) => (
                  <UrlItem
                    key={`${url}-overflow-${index}`}
                    url={url}
                    allowCopy={allowCopy}
                    openInNewTab={openInNewTab}
                    isCopied={copiedUrl === url}
                    onCopy={handleCopy}
                    variant={URL_ITEM_VARIANT.DARK}
                  />
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </>
      )}
    </div>
  )
}

UrlCell.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      allowCopy: PropTypes.bool,
      openInNewTab: PropTypes.bool,
      url: PropTypes.string.isRequired
    })
  )
}

export default UrlCell
