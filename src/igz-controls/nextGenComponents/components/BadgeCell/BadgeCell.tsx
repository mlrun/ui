import { useCallback, useEffect, useRef, useState } from 'react'

import Badge, { getBadgeColor } from '../Badge'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { cn } from '../../lib/utils'

export type BadgeItem = {
  key: string
  value?: string
}

export type BadgeCellProps = {
  badges: BadgeItem[]
  delimiter?: string
  maxVisible?: number
  className?: string
}

const badgeColor = getBadgeColor()
const OVERFLOW_BADGE_WIDTH = 36
const BADGE_GAP = 4

const formatLabel = (badge: BadgeItem, delimiter: string) => {
  if (!badge.value) return badge.key
  return `${badge.key}${delimiter}${badge.value}`
}

const BadgeCell = ({ badges, delimiter = ':', maxVisible, className }: BadgeCellProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const lastThrottleCallRef = useRef(0)
  const throttleTimeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [visibleCount, setVisibleCount] = useState(badges.length)

  const calculateVisibleCount = useCallback(() => {
    const container = containerRef.current
    const measure = measureRef.current
    if (!container || !measure) return

    const containerWidth = container.offsetWidth

    if (maxVisible !== undefined) {
      setVisibleCount(Math.min(maxVisible, badges.length))
      return
    }

    const badgeElements = measure.children
    let totalWidth = 0
    let count = 0

    for (let i = 0; i < badgeElements.length; i++) {
      const badgeWidth = (badgeElements[i] as HTMLElement).offsetWidth + BADGE_GAP
      const needsOverflow = i < badges.length - 1
      const availableWidth = needsOverflow
        ? containerWidth - OVERFLOW_BADGE_WIDTH - BADGE_GAP
        : containerWidth

      if (totalWidth + badgeWidth <= availableWidth) {
        totalWidth += badgeWidth
        count++
      } else {
        break
      }
    }

    setVisibleCount(Math.max(count, 0))
  }, [badges.length, maxVisible])

  const cancelThrottledCalculate = useCallback(() => {
    if (throttleTimeoutIdRef.current) {
      clearTimeout(throttleTimeoutIdRef.current)
      throttleTimeoutIdRef.current = null
    }
  }, [])

  const throttledCalculate = useCallback(() => {
    const now = Date.now()
    const remaining = 150 - (now - lastThrottleCallRef.current)

    if (remaining <= 0) {
      lastThrottleCallRef.current = now
      calculateVisibleCount()
    } else if (!throttleTimeoutIdRef.current) {
      throttleTimeoutIdRef.current = setTimeout(() => {
        lastThrottleCallRef.current = Date.now()
        throttleTimeoutIdRef.current = null
        calculateVisibleCount()
      }, remaining)
    }
  }, [calculateVisibleCount])

  useEffect(() => {
    const observer = new ResizeObserver(throttledCalculate)
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      observer.disconnect()
      cancelThrottledCalculate()
    }
  }, [calculateVisibleCount, throttledCalculate, cancelThrottledCalculate])

  if (badges.length === 0) {
    return null
  }

  const visibleBadges = badges.slice(0, visibleCount)
  const hiddenBadges = badges.slice(visibleCount)
  const hiddenCount = hiddenBadges.length

  return (
    <div
      ref={containerRef}
      data-testid="badge-cell"
      className={cn('relative flex items-center gap-1 min-w-0 overflow-hidden', className)}
    >
      <div
        ref={measureRef}
        aria-hidden
        className="absolute top-0 left-0 flex items-center gap-1 invisible pointer-events-none whitespace-nowrap"
      >
        {badges.map((badge, index) => (
          <Badge key={`measure-${badge.key}-${index}`} label={formatLabel(badge, delimiter)} />
        ))}
      </div>

      {visibleBadges.map((badge, index) => (
        <Badge key={`${badge.key}-${index}`} label={formatLabel(badge, delimiter)} />
      ))}

      {hiddenCount > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              data-testid="badge-cell-overflow"
              className={cn(
                'inline-flex items-center justify-center rounded px-2 py-0.5 text-xs font-medium cursor-pointer whitespace-nowrap border-0',
                badgeColor.bg,
                badgeColor.text
              )}
            >
              +{hiddenCount}
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="start"
            className="w-auto max-h-[200px] overflow-y-auto p-2 bg-white text-igz-primary border border-igz-gray-light"
          >
            <div className="flex flex-col gap-1.5">
              {hiddenBadges.map((badge, index) => (
                <span
                  key={`hidden-${badge.key}-${index}`}
                  className={cn(
                    'inline-flex rounded px-2 py-0.5 text-xs font-medium whitespace-nowrap',
                    badgeColor.bg,
                    badgeColor.text
                  )}
                >
                  {formatLabel(badge, delimiter)}
                </span>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}

export default BadgeCell
