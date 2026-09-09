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
/* eslint-disable react/prop-types */
import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

import UrlCell from './UrlCell'
import { buildUrlItems, calculateVisibleCount } from './urlCell.utils'

// ── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('igz-controls/nextGenComponents', () => ({
  Tooltip: ({ children }) => <div>{children}</div>,
  TooltipTrigger: ({ children }) => <div>{children}</div>,
  TooltipContent: ({ children }) => <div data-testid="tooltip-content">{children}</div>
}))

// ── Width / Canvas helpers ────────────────────────────────────────────────────
//
// UrlCell measures text widths with the Canvas 2D API (no DOM elements).
// In JSDOM, canvas.getContext('2d') returns null, so we install a mock that
// returns 8 px per character — a predictable stand-in for a real monospace font.
//
// Container width still comes from offsetWidth, which is always 0 in JSDOM.
// For overflow tests we mock it to a narrow value (100 px) so that long URLs
// (> 12 chars at 8 px/char) trigger the "+N" badge.

const mockContainerWidth = (px = 100) => {
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    get() {
      return this.dataset?.testid === 'url-cell' ? px : 0
    }
  })
}

const resetWidths = () => {
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    get() {
      return 0
    }
  })
}

// ── ResizeObserver mock ───────────────────────────────────────────────────────
// Real browsers queue an initial callback as soon as observe() is called,
// reporting the element's current size - this mock replicates that so the
// leading-edge-throttled recalculation in UrlCell fires during tests too.

class MockResizeObserver {
  constructor(callback) {
    this.callback = callback
  }
  observe(element) {
    this.callback([{ target: element, contentRect: element.getBoundingClientRect() }])
  }
  disconnect() {}
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const EXTERNAL_URL_A = 'host-a.example.com:8080'
const EXTERNAL_URL_B = 'host-b.example.com:9090'
const EXTERNAL_URL_C = 'host-c.example.com:7070'
const INTERNAL_URL = 'internal.svc.cluster.local:8080'

const renderUrlCell = (overrides = {}) => {
  const props = { items: [], ...overrides }
  return { ...render(<UrlCell {...props} />), props }
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('UrlCell', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.ResizeObserver = MockResizeObserver

    // 8 px per character — deterministic text-width stand-in for Canvas.
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      font: '',
      measureText: vi.fn(text => ({ width: text.length * 8 }))
    }))

    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) }
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    resetWidths()
  })

  // ── Empty state ─────────────────────────────────────────────────────────────

  describe('empty state', () => {
    it('renders empty element when items is empty', () => {
      renderUrlCell({ items: [] })
      expect(screen.getByTestId('url-cell-empty')).toBeEmptyDOMElement()
    })

    it('does not render the cell wrapper when items is empty', () => {
      renderUrlCell({ items: [] })
      expect(screen.queryByTestId('url-cell')).not.toBeInTheDocument()
    })
  })

  // ── Single item ─────────────────────────────────────────────────────────────

  describe('single item', () => {
    it('renders the url-cell wrapper', () => {
      renderUrlCell({ items: [{ url: EXTERNAL_URL_A, allowCopy: true, openInNewTab: true }] })
      expect(screen.getByTestId('url-cell')).toBeInTheDocument()
    })

    it('renders the primary url link', () => {
      renderUrlCell({ items: [{ url: EXTERNAL_URL_A, allowCopy: true, openInNewTab: true }] })
      expect(screen.getByTestId('url-link')).toHaveTextContent(EXTERNAL_URL_A)
    })

    it('does not render the overflow badge for a single item', () => {
      renderUrlCell({ items: [{ url: EXTERNAL_URL_A, allowCopy: true, openInNewTab: true }] })
      expect(screen.queryByTestId('overflow-badge')).not.toBeInTheDocument()
    })
  })

  // ── Overflow (with mocked widths) ───────────────────────────────────────────
  //
  // Canvas mock: 8 px/char. Container: 100 px.
  // Test URLs are ~24 chars (≈192 px text + 24 px copy btn = 216 px), so even
  // the first item alone exceeds the container — calculateVisibleCount returns
  // Math.max(1,0)=1, forcing overflow for any second item.

  describe('overflow', () => {
    beforeEach(() => mockContainerWidth())

    it('renders the +1 overflow badge when two items do not both fit', () => {
      renderUrlCell({
        items: [
          { url: EXTERNAL_URL_A, allowCopy: true, openInNewTab: true },
          { url: EXTERNAL_URL_B, allowCopy: true, openInNewTab: true }
        ]
      })
      expect(screen.getByTestId('overflow-badge')).toHaveTextContent('+1')
    })

    it('renders the +2 overflow badge when three items are present', () => {
      renderUrlCell({
        items: [
          { url: EXTERNAL_URL_A, allowCopy: true, openInNewTab: true },
          { url: EXTERNAL_URL_B, allowCopy: true, openInNewTab: true },
          { url: EXTERNAL_URL_C, allowCopy: true, openInNewTab: true }
        ]
      })
      expect(screen.getByTestId('overflow-badge')).toHaveTextContent('+2')
    })

    it('puts overflow urls in the tooltip', () => {
      renderUrlCell({
        items: [
          { url: EXTERNAL_URL_A, allowCopy: true, openInNewTab: true },
          { url: EXTERNAL_URL_B, allowCopy: true, openInNewTab: true }
        ]
      })
      const tooltip = screen.getByTestId('tooltip-content')
      expect(tooltip).toHaveTextContent(EXTERNAL_URL_B)
    })

    it('does not put the primary url in the tooltip', () => {
      renderUrlCell({
        items: [
          { url: EXTERNAL_URL_A, allowCopy: true, openInNewTab: true },
          { url: EXTERNAL_URL_B, allowCopy: true, openInNewTab: true }
        ]
      })
      const tooltip = screen.getByTestId('tooltip-content')
      expect(tooltip).not.toHaveTextContent(EXTERNAL_URL_A)
    })

    it('renders the scrollable tooltip list container', () => {
      renderUrlCell({
        items: [
          { url: EXTERNAL_URL_A, allowCopy: true, openInNewTab: true },
          { url: EXTERNAL_URL_B, allowCopy: true, openInNewTab: true }
        ]
      })
      expect(screen.getByTestId('tooltip-url-list')).toBeInTheDocument()
    })

    it('applies cursor-pointer to the overflow badge', () => {
      renderUrlCell({
        items: [
          { url: EXTERNAL_URL_A, allowCopy: true, openInNewTab: true },
          { url: EXTERNAL_URL_B, allowCopy: true, openInNewTab: true }
        ]
      })
      expect(screen.getByTestId('overflow-badge')).toHaveClass('cursor-pointer')
    })
  })

  // ── Copy interaction ────────────────────────────────────────────────────────

  describe('copy interaction', () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => vi.useRealTimers())

    it('writes the url to the clipboard when copy is clicked', () => {
      renderUrlCell({ items: [{ url: EXTERNAL_URL_A, allowCopy: true, openInNewTab: true }] })
      fireEvent.click(screen.getByTestId('copy-button'))
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(EXTERNAL_URL_A)
    })

    it('shows the check icon immediately after copy', () => {
      renderUrlCell({ items: [{ url: EXTERNAL_URL_A, allowCopy: true, openInNewTab: true }] })
      fireEvent.click(screen.getByTestId('copy-button'))
      expect(screen.getByTestId('check-icon')).toBeInTheDocument()
    })

    it('reverts to copy icon after 3 seconds', () => {
      renderUrlCell({ items: [{ url: EXTERNAL_URL_A, allowCopy: true, openInNewTab: true }] })
      fireEvent.click(screen.getByTestId('copy-button'))
      act(() => vi.advanceTimersByTime(3000))
      expect(screen.getByTestId('copy-icon')).toBeInTheDocument()
    })

    it('does not revert early (at 2999 ms)', () => {
      renderUrlCell({ items: [{ url: EXTERNAL_URL_A, allowCopy: true, openInNewTab: true }] })
      fireEvent.click(screen.getByTestId('copy-button'))
      act(() => vi.advanceTimersByTime(2999))
      expect(screen.getByTestId('check-icon')).toBeInTheDocument()
    })
  })

  // ── Internal vs external items ──────────────────────────────────────────────

  describe('allowCopy items', () => {
    it('renders a copy button for items with allowCopy', () => {
      renderUrlCell({ items: [{ url: EXTERNAL_URL_A, allowCopy: true, openInNewTab: true }] })
      expect(screen.getByTestId('copy-button')).toBeInTheDocument()
    })

    it('does not render a copy button for items without allowCopy', () => {
      renderUrlCell({ items: [{ url: INTERNAL_URL }] })
      expect(screen.queryByTestId('copy-button')).not.toBeInTheDocument()
    })
  })

  // ── buildUrlItems helper ────────────────────────────────────────────────────

  describe('buildUrlItems helper', () => {
    it('maps external urls with allowCopy and openInNewTab', () => {
      expect(buildUrlItems([EXTERNAL_URL_A], [])).toEqual([
        { url: EXTERNAL_URL_A, allowCopy: true, openInNewTab: true }
      ])
    })

    it('maps internal urls without allowCopy or openInNewTab', () => {
      expect(buildUrlItems([], [INTERNAL_URL])).toEqual([{ url: INTERNAL_URL }])
    })

    it('places external urls before internal urls', () => {
      const items = buildUrlItems([EXTERNAL_URL_A], [INTERNAL_URL])
      expect(items[0]).toEqual({ url: EXTERNAL_URL_A, allowCopy: true, openInNewTab: true })
      expect(items[1]).toEqual({ url: INTERNAL_URL })
    })

    it('returns an empty array when both inputs are empty', () => {
      expect(buildUrlItems([], [])).toEqual([])
    })

    it('handles missing arguments gracefully', () => {
      expect(() => buildUrlItems()).not.toThrow()
      expect(buildUrlItems()).toEqual([])
    })
  })

  // ── calculateVisibleCount ───────────────────────────────────────────────────

  describe('calculateVisibleCount', () => {
    it('shows all items when they all fit', () => {
      // container=500, items=[100, 100], badge=40
      // i=0: 0+100+40=140 ≤ 500 ✓  i=1: 100+100+0=200 ≤ 500 ✓
      expect(calculateVisibleCount(500, [100, 100], 40)).toBe(2)
    })

    it('shows only the first item when the second does not fit', () => {
      // container=150, items=[200, 200], badge=40
      // i=0: 0+200+40=240 > 150 ✗ → count stays 0 → max(1,0)=1
      expect(calculateVisibleCount(150, [200, 200], 40)).toBe(1)
    })

    it('always shows at least one item even when nothing fits', () => {
      expect(calculateVisibleCount(0, [500], 40)).toBe(1)
    })

    it('does not reserve badge space for the last item', () => {
      // container=120, items=[100], badge=40
      // Last item → no badge reserve → 0+100+0=100 ≤ 120 ✓
      expect(calculateVisibleCount(120, [100], 40)).toBe(1)
    })

    it('shows two out of three items when only two fit', () => {
      // container=260, items=[100, 100, 100], badge=40
      // i=0: 0+100+40=140 ≤ 260 ✓  i=1: 100+100+40=240 ≤ 260 ✓
      // i=2: 200+100+0=300 > 260 ✗
      expect(calculateVisibleCount(260, [100, 100, 100], 40)).toBe(2)
    })

    it('returns 0 items (clamped to 1) for an empty items array', () => {
      expect(calculateVisibleCount(500, [], 40)).toBe(1)
    })
  })
})
