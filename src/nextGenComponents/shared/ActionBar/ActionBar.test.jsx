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

import ActionBar from './ActionBar'

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockSetSearchParams = vi.fn()
vi.mock('react-router', () => ({
  useSearchParams: () => [new URLSearchParams(), mockSetSearchParams]
}))

vi.mock('react-redux', () => ({
  useDispatch: () => vi.fn()
}))

vi.mock('igz-controls/nextGenComponents', () => ({
  RefreshButton: ({ onClick }) => (
    <button data-testid="refresh-button" onClick={onClick}>
      Refresh
    </button>
  )
}))

vi.mock('../../../utils/datePicker.util', () => ({
  ANY_TIME_DATE_OPTION: 'anyTime',
  CUSTOM_RANGE_DATE_OPTION: 'customRange',
  datePickerPastOptions: [],
  getDatePickerFilterValue: vi.fn(() => ({
    value: [null],
    isPredefined: false,
    initialSelectedOptionId: 'anyTime'
  }))
}))

vi.mock('../../../reducers/filtersReducer', () => ({
  setFilters: vi.fn(payload => ({ type: 'filters/setFilters', payload }))
}))

// ── Helpers ──────────────────────────────────────────────────────────────────

const FILTERS_CONFIG = {
  name: { initialValue: '' },
  time: { initialValue: 'any' }
}

const DEFAULT_FILTERS = { name: '', time: 'any' }

const renderActionBar = (overrides = {}) => {
  const props = {
    filtersConfig: FILTERS_CONFIG,
    filters: DEFAULT_FILTERS,
    setFilters: vi.fn(),
    onRefresh: vi.fn(),
    ...overrides
  }

  let capturedCtx = null
  const result = render(
    <ActionBar {...props}>
      {ctx => {
        capturedCtx = ctx
        return <div data-testid="children" />
      }}
    </ActionBar>
  )
  return { ...result, props, getCtx: () => capturedCtx }
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('ActionBar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ── Rendering ──────────────────────────────────────────────────────────────

  describe('rendering', () => {
    it('renders the action bar container', () => {
      renderActionBar()
      expect(screen.getByTestId('action-bar')).toBeInTheDocument()
    })

    it('renders children via render prop', () => {
      renderActionBar()
      expect(screen.getByTestId('children')).toBeInTheDocument()
    })

    it('renders the RefreshButton', () => {
      renderActionBar()
      expect(screen.getByTestId('refresh-button')).toBeInTheDocument()
    })

    it('does not render when hidden=true', () => {
      renderActionBar({ hidden: true })
      expect(screen.queryByTestId('action-bar')).not.toBeInTheDocument()
    })

    it('passes current filters to render-prop children', () => {
      const filters = { name: 'test', time: '24h' }
      const { getCtx } = renderActionBar({ filters })
      expect(getCtx().filters).toEqual(filters)
    })

    it('exposes setFilterValue, applyFilter, applyMultipleFilters in render prop', () => {
      const { getCtx } = renderActionBar()
      const ctx = getCtx()
      expect(typeof ctx.setFilterValue).toBe('function')
      expect(typeof ctx.applyFilter).toBe('function')
      expect(typeof ctx.applyMultipleFilters).toBe('function')
    })
  })

  // ── setFilterValue ─────────────────────────────────────────────────────────

  describe('setFilterValue', () => {
    it('calls setFilters with the merged filter', () => {
      const setFilters = vi.fn()
      const { getCtx } = renderActionBar({ setFilters })
      act(() => getCtx().setFilterValue('name', 'hello'))
      expect(setFilters).toHaveBeenCalledWith({ name: 'hello', time: 'any' })
    })

    it('updates the URL via setSearchParams', () => {
      const { getCtx } = renderActionBar()
      act(() => getCtx().setFilterValue('name', 'hello'))
      expect(mockSetSearchParams).toHaveBeenCalled()
    })

    it('does NOT call onRefresh', () => {
      const onRefresh = vi.fn()
      const { getCtx } = renderActionBar({ onRefresh })
      act(() => getCtx().setFilterValue('name', 'hello'))
      expect(onRefresh).not.toHaveBeenCalled()
    })
  })

  // ── applyFilter ────────────────────────────────────────────────────────────

  describe('applyFilter', () => {
    it('calls setFilters with the merged filter', () => {
      const setFilters = vi.fn()
      const { getCtx } = renderActionBar({ setFilters })
      act(() => getCtx().applyFilter('time', '24h'))
      expect(setFilters).toHaveBeenCalledWith({ name: '', time: '24h' })
    })

    it('updates the URL via setSearchParams', () => {
      const { getCtx } = renderActionBar()
      act(() => getCtx().applyFilter('time', '24h'))
      expect(mockSetSearchParams).toHaveBeenCalled()
    })

    it('calls onRefresh with the updated filters', () => {
      const onRefresh = vi.fn()
      const { getCtx } = renderActionBar({ onRefresh })
      act(() => getCtx().applyFilter('time', '24h'))
      expect(onRefresh).toHaveBeenCalledWith({ name: '', time: '24h' }, true)
    })

    it('fires onRefresh exactly once per call', () => {
      const onRefresh = vi.fn()
      const { getCtx } = renderActionBar({ onRefresh })
      act(() => getCtx().applyFilter('name', 'foo'))
      expect(onRefresh).toHaveBeenCalledTimes(1)
    })
  })

  // ── applyMultipleFilters ───────────────────────────────────────────────────

  describe('applyMultipleFilters', () => {
    it('merges multiple keys and calls setFilters', () => {
      const setFilters = vi.fn()
      const { getCtx } = renderActionBar({ setFilters })
      act(() => getCtx().applyMultipleFilters({ name: 'app', time: '7d' }))
      expect(setFilters).toHaveBeenCalledWith({ name: 'app', time: '7d' })
    })

    it('calls onRefresh with merged filters', () => {
      const onRefresh = vi.fn()
      const { getCtx } = renderActionBar({ onRefresh })
      act(() => getCtx().applyMultipleFilters({ name: 'app', time: '7d' }))
      expect(onRefresh).toHaveBeenCalledWith({ name: 'app', time: '7d' }, true)
    })
  })

  // ── Refresh button ─────────────────────────────────────────────────────────

  describe('RefreshButton', () => {
    it('calls onRefresh with current filters when clicked', () => {
      const onRefresh = vi.fn()
      const filters = { name: 'app-x', time: '24h' }
      renderActionBar({ onRefresh, filters })
      fireEvent.click(screen.getByTestId('refresh-button'))
      expect(onRefresh).toHaveBeenCalledWith(filters)
    })

    it('calls setFilters with current filters when refresh is clicked', () => {
      const setFilters = vi.fn()
      const filters = { name: 'app-x', time: '24h' }
      renderActionBar({ setFilters, filters })
      fireEvent.click(screen.getByTestId('refresh-button'))
      expect(setFilters).toHaveBeenCalledWith(filters)
    })
  })

  // ── URL serialisation ──────────────────────────────────────────────────────

  describe('URL serialisation', () => {
    it('removes keys from the URL when value equals initialValue', () => {
      let capturedUpdater = null
      mockSetSearchParams.mockImplementation(updater => {
        capturedUpdater = updater
      })

      const { getCtx } = renderActionBar()
      act(() => getCtx().applyFilter('name', ''))

      const prev = new URLSearchParams('name=old')
      const next = capturedUpdater(prev)
      expect(next.has('name')).toBe(false)
    })

    it('sets non-default values in the URL', () => {
      let capturedUpdater = null
      mockSetSearchParams.mockImplementation(updater => {
        capturedUpdater = updater
      })

      const { getCtx } = renderActionBar()
      act(() => getCtx().applyFilter('name', 'my-app'))

      const prev = new URLSearchParams()
      const next = capturedUpdater(prev)
      expect(next.get('name')).toBe('my-app')
    })

    it('removes keys when initialValue is nil (no baseline to compare)', () => {
      let capturedUpdater = null
      mockSetSearchParams.mockImplementation(updater => {
        capturedUpdater = updater
      })

      const config = {
        name: { initialValue: '' },
        extra: {}
      }
      const { getCtx } = renderActionBar({
        filtersConfig: config,
        filters: { name: '', extra: 'value' }
      })
      act(() => getCtx().applyFilter('extra', 'value'))

      const prev = new URLSearchParams('extra=old')
      const next = capturedUpdater(prev)
      expect(next.has('extra')).toBe(false)
    })
  })

  // ── Auto-refresh ──────────────────────────────────────────────────────────

  describe('auto-refresh', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('fires onRefresh on the given interval', () => {
      const onRefresh = vi.fn()
      renderActionBar({ onRefresh, autoRefreshInterval: 5000 })
      act(() => vi.advanceTimersByTime(5000))
      expect(onRefresh).toHaveBeenCalledTimes(1)
      act(() => vi.advanceTimersByTime(5000))
      expect(onRefresh).toHaveBeenCalledTimes(2)
    })

    it('does not fire when autoRefreshInterval is 0 (default)', () => {
      const onRefresh = vi.fn()
      renderActionBar({ onRefresh })
      act(() => vi.advanceTimersByTime(60000))
      expect(onRefresh).not.toHaveBeenCalled()
    })

    it('clears the interval on unmount', () => {
      const onRefresh = vi.fn()
      const { unmount } = renderActionBar({ onRefresh, autoRefreshInterval: 5000 })
      unmount()
      act(() => vi.advanceTimersByTime(10000))
      expect(onRefresh).not.toHaveBeenCalled()
    })
  })
})
