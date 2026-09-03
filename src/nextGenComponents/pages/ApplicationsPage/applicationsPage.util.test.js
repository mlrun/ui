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
// eslint-disable-next-line import/named
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

import { APPLICATION_STATUS, APPLICATION_STATUS_OPTIONS } from './applications.constants'
import {
  buildApiFilters,
  checkForSelectedApplication,
  filterApplications
} from './applicationsPage.util'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('igz-controls/utils/notification.util', () => ({
  showErrorNotification: vi.fn()
}))

vi.mock('../../../utils/datePicker.util', () => {
  const options = [
    {
      id: 'anyTime',
      label: 'Any time',
      isPredefined: false,
      handler: () => [null]
    },
    {
      id: 'past24hours',
      label: 'Past 24 hours',
      isPredefined: true,
      handler: () => [new Date('2026-05-12T15:00:00.000Z'), new Date('2026-05-13T15:00:00.000Z')]
    },
    {
      id: 'pastWeek',
      label: 'Past week',
      isPredefined: true,
      handler: () => [new Date('2026-05-06T15:00:00.000Z'), new Date('2026-05-13T15:00:00.000Z')]
    },
    {
      id: 'customRange',
      label: 'Custom range'
    }
  ]

  return {
    ANY_TIME_DATE_OPTION: 'anyTime',
    CUSTOM_RANGE_DATE_OPTION: 'customRange',
    datePickerPastOptions: options,
    getDatePickerFilterValue: (opts, optionId) => {
      const match = opts.find(o => o.id === optionId)
      return {
        value: match?.handler?.() ?? [null],
        isPredefined: match?.isPredefined ?? false,
        initialSelectedOptionId: optionId
      }
    }
  }
})

// ── Helpers ────────────────────────────────────────────────────────────────────

const makeApp = (stateValue, owner = '') => ({
  state: { value: stateValue },
  owner
})

const makeDateFilter = (dates, isPredefined = true) => ({
  value: dates,
  isPredefined,
  initialSelectedOptionId: isPredefined ? 'past24hours' : 'customRange'
})

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('applicationsPage.util', () => {
  beforeEach(() => vi.clearAllMocks())

  // ── APPLICATION_STATUS ─────────────────────────────────────────────────────

  describe('APPLICATION_STATUS', () => {
    it('has a RUNNING key with value "running"', () => {
      expect(APPLICATION_STATUS.RUNNING).toBe('running')
    })

    it('has a READY key with value "ready"', () => {
      expect(APPLICATION_STATUS.READY).toBe('ready')
    })

    it('has a BUILDING key with value "building"', () => {
      expect(APPLICATION_STATUS.BUILDING).toBe('building')
    })

    it('has a FAILED key with value "failed"', () => {
      expect(APPLICATION_STATUS.FAILED).toBe('failed')
    })

    it('has an ERROR key with value "error"', () => {
      expect(APPLICATION_STATUS.ERROR).toBe('error')
    })
  })

  // ── APPLICATION_STATUS_OPTIONS ──────────────────────────────────────────────

  describe('APPLICATION_STATUS_OPTIONS', () => {
    it('does not include a separate "ready" option (ready is grouped with running)', () => {
      const optionValues = APPLICATION_STATUS_OPTIONS.map(o => o.value)
      expect(optionValues).not.toContain(APPLICATION_STATUS.READY)
    })

    it('includes running, building, failed and error options', () => {
      const optionValues = APPLICATION_STATUS_OPTIONS.map(o => o.value)
      expect(optionValues).toContain(APPLICATION_STATUS.RUNNING)
      expect(optionValues).toContain(APPLICATION_STATUS.BUILDING)
      expect(optionValues).toContain(APPLICATION_STATUS.FAILED)
    })

    it('each option has value, label and color', () => {
      APPLICATION_STATUS_OPTIONS.forEach(option => {
        expect(option).toHaveProperty('value')
        expect(option).toHaveProperty('label')
        expect(option).toHaveProperty('color')
      })
    })
  })

  // ── APPLICATION_STATUS_OPTIONS colors ─────────────────────────────────────

  describe('APPLICATION_STATUS_OPTIONS colors', () => {
    it('uses CSS variable for running color', () => {
      const opt = APPLICATION_STATUS_OPTIONS.find(o => o.value === APPLICATION_STATUS.RUNNING)
      expect(opt.color).toBe('var(--igz-status-running)')
    })

    it('uses CSS variable for building/deploying color', () => {
      const opt = APPLICATION_STATUS_OPTIONS.find(o => o.value === APPLICATION_STATUS.BUILDING)
      expect(opt.color).toBe('var(--igz-status-deploying)')
    })

    it('uses CSS variable for failed color', () => {
      const opt = APPLICATION_STATUS_OPTIONS.find(o => o.value === APPLICATION_STATUS.FAILED)
      expect(opt.color).toBe('var(--igz-status-failed)')
    })
  })

  // ── buildApiFilters ────────────────────────────────────────────────────────

  describe('buildApiFilters', () => {
    it('returns an empty object when no filters are active', () => {
      expect(buildApiFilters({ name: '', dates: { value: [null], isPredefined: false } })).toEqual(
        {}
      )
    })

    it('includes name with ~ prefix when provided', () => {
      const result = buildApiFilters({
        name: 'my-app',
        dates: { value: [null], isPredefined: false }
      })
      expect(result.name).toBe('~my-app')
    })

    it('does not include name when empty', () => {
      const result = buildApiFilters({ name: '', dates: { value: [null], isPredefined: false } })
      expect(result).not.toHaveProperty('name')
    })

    it('includes since for a predefined date filter', () => {
      const sinceDate = new Date('2026-05-12T15:00:00.000Z')
      const untilDate = new Date('2026-05-13T15:00:00.000Z')
      const result = buildApiFilters({
        name: '',
        dates: makeDateFilter([sinceDate, untilDate], true)
      })
      expect(result.since).toBe('2026-05-12T15:00:00.000Z')
    })

    it('does not include until for predefined date filters', () => {
      const sinceDate = new Date('2026-05-12T15:00:00.000Z')
      const untilDate = new Date('2026-05-13T15:00:00.000Z')
      const result = buildApiFilters({
        name: '',
        dates: makeDateFilter([sinceDate, untilDate], true)
      })
      expect(result).not.toHaveProperty('until')
    })

    it('includes both since and until for custom range', () => {
      const sinceDate = new Date('2026-01-01T00:00:00.000Z')
      const untilDate = new Date('2026-01-02T00:00:00.000Z')
      const result = buildApiFilters({
        name: '',
        dates: makeDateFilter([sinceDate, untilDate], false)
      })
      expect(result.since).toBe('2026-01-01T00:00:00.000Z')
      expect(result.until).toBe('2026-01-02T00:00:00.000Z')
    })

    it('does not include since when date value is null', () => {
      const result = buildApiFilters({ name: '', dates: { value: [null], isPredefined: false } })
      expect(result).not.toHaveProperty('since')
    })

    it('includes both name and since when both are set', () => {
      const sinceDate = new Date('2026-05-12T15:00:00.000Z')
      const result = buildApiFilters({
        name: 'app',
        dates: makeDateFilter([sinceDate], true)
      })
      expect(result.name).toBe('~app')
      expect(result.since).toBe('2026-05-12T15:00:00.000Z')
    })

    it('maps running status to ready for the API', () => {
      const result = buildApiFilters({
        name: '',
        dates: { value: [null], isPredefined: false },
        state: ['running']
      })
      expect(result.state).toEqual(['ready'])
    })

    it('excludes "all" from status filter', () => {
      const result = buildApiFilters({
        name: '',
        dates: { value: [null], isPredefined: false },
        state: ['all', 'building']
      })
      expect(result.state).toEqual(['building'])
    })
  })

  // ── filterApplications ─────────────────────────────────────────────────────

  describe('filterApplications', () => {
    const apps = [
      makeApp('running', 'alice'),
      makeApp('failed', 'bob'),
      makeApp('building', 'alice'),
      makeApp('error', '')
    ]

    it('returns all apps when status filter is "all"', () => {
      expect(filterApplications(apps, { state: ['all'] })).toHaveLength(4)
    })

    it('returns all apps when status filter is empty', () => {
      expect(filterApplications(apps, { state: [] })).toHaveLength(4)
    })

    it('filters by a single status', () => {
      const result = filterApplications(apps, { state: ['running'] })
      expect(result).toHaveLength(1)
      expect(result[0].state.value).toBe('running')
    })

    it('filters by multiple statuses', () => {
      const result = filterApplications(apps, { state: ['running', 'failed'] })
      expect(result).toHaveLength(2)
    })

    it('returns no apps when the selected status matches nothing', () => {
      const result = filterApplications(apps, { state: ['ready'] })
      expect(result).toHaveLength(0)
    })

    it('handles undefined status gracefully (treats as empty)', () => {
      const result = filterApplications(apps, { state: undefined })
      expect(result).toHaveLength(4)
    })

    it('returns empty array for empty applications list', () => {
      expect(filterApplications([], { state: ['running'] })).toHaveLength(0)
    })

    it('filters by exact owner match', () => {
      const result = filterApplications(apps, { state: ['all'], owner: 'alice' })
      expect(result).toHaveLength(2)
      expect(result.every(app => app.owner === 'alice')).toBe(true)
    })

    it('filters by owner case-insensitively', () => {
      const result = filterApplications(apps, { state: ['all'], owner: 'ALICE' })
      expect(result).toHaveLength(2)
      expect(result.every(app => app.owner === 'alice')).toBe(true)
    })

    it('filters by owner substring', () => {
      const result = filterApplications(apps, { state: ['all'], owner: 'ali' })
      expect(result).toHaveLength(2)
    })

    it('trims whitespace from owner search', () => {
      const result = filterApplications(apps, { state: ['all'], owner: '  bob  ' })
      expect(result).toHaveLength(1)
      expect(result[0].owner).toBe('bob')
    })

    it('returns all apps when owner filter is empty', () => {
      const result = filterApplications(apps, { state: ['all'], owner: '' })
      expect(result).toHaveLength(4)
    })

    it('returns all apps when owner filter is whitespace only', () => {
      const result = filterApplications(apps, { state: ['all'], owner: '   ' })
      expect(result).toHaveLength(4)
    })

    it('applies owner and status filters together', () => {
      const result = filterApplications(apps, { state: ['running'], owner: 'alice' })
      expect(result).toHaveLength(1)
      expect(result[0].state.value).toBe('running')
      expect(result[0].owner).toBe('alice')
    })

    it('returns no apps when owner filter matches nothing', () => {
      const result = filterApplications(apps, { state: ['all'], owner: 'nobody' })
      expect(result).toHaveLength(0)
    })

    it('handles apps with missing owner field', () => {
      const appsWithMissing = [...apps, { state: { value: 'running' } }]
      const result = filterApplications(appsWithMissing, { state: ['all'], owner: 'alice' })
      expect(result).toHaveLength(2)
    })
  })

  // ── checkForSelectedApplication ────────────────────────────────────────────

  describe('checkForSelectedApplication', () => {
    const DEBOUNCE_MS = 30
    const flushMicrotasks = async () => {
      for (let i = 0; i < 5; i++) await Promise.resolve()
    }

    let navigate, setSelectedApplication, fetchSingleEnrichedFunction, dispatch
    let lastCheckedApplicationIdRef, showErrorNotification

    beforeEach(async () => {
      vi.useFakeTimers()
      navigate = vi.fn()
      setSelectedApplication = vi.fn()
      dispatch = vi.fn()
      fetchSingleEnrichedFunction = vi.fn()
      lastCheckedApplicationIdRef = { current: null }
      const notifModule = await import('igz-controls/utils/notification.util')
      showErrorNotification = notifModule.showErrorNotification
      vi.clearAllMocks()
      checkForSelectedApplication.cancel?.()
    })

    afterEach(() => {
      checkForSelectedApplication.cancel?.()
      vi.useRealTimers()
    })

    const flush = () => vi.advanceTimersByTime(DEBOUNCE_MS)

    const makeArgs = (overrides = {}) => ({
      applicationName: 'my-app',
      applicationId: '@hash123',
      applications: [{ hash: 'hash123', tag: 'v1', nuclio_name: 'proj-my-app' }],
      navigate,
      projectName: 'my-project',
      setSelectedApplication,
      fetchSingleEnrichedFunction,
      dispatch,
      lastCheckedApplicationIdRef,
      ...overrides
    })

    it('calls setSelectedApplication({}) when applicationId is absent', async () => {
      checkForSelectedApplication(makeArgs({ applicationId: null }))
      flush()
      await flushMicrotasks()
      expect(setSelectedApplication).toHaveBeenCalledWith({})
      expect(fetchSingleEnrichedFunction).not.toHaveBeenCalled()
    })

    it('does nothing when applications list is empty', async () => {
      checkForSelectedApplication(makeArgs({ applications: [] }))
      flush()
      await flushMicrotasks()
      expect(fetchSingleEnrichedFunction).not.toHaveBeenCalled()
      expect(setSelectedApplication).not.toHaveBeenCalled()
    })

    it('does nothing when lastCheckedApplicationIdRef already matches applicationId', async () => {
      lastCheckedApplicationIdRef.current = '@hash123'
      checkForSelectedApplication(makeArgs())
      flush()
      await flushMicrotasks()
      expect(fetchSingleEnrichedFunction).not.toHaveBeenCalled()
    })

    it('fetches using found-app data when application is in the filtered list', async () => {
      fetchSingleEnrichedFunction.mockResolvedValue({ name: 'my-app', hash: 'hash123' })
      checkForSelectedApplication(makeArgs())
      flush()
      await flushMicrotasks()
      expect(fetchSingleEnrichedFunction).toHaveBeenCalledWith({
        name: 'my-app',
        hash: 'hash123',
        tag: 'v1',
        nuclioName: 'proj-my-app'
      })
    })

    it('fetches using URL-parsed hash/tag when application is NOT in the filtered list', async () => {
      fetchSingleEnrichedFunction.mockResolvedValue({ name: 'my-app', hash: 'hash123' })
      checkForSelectedApplication(
        makeArgs({
          applications: [{ hash: 'other-hash', tag: 'v2', nuclio_name: 'proj-other' }]
        })
      )
      flush()
      await flushMicrotasks()
      expect(fetchSingleEnrichedFunction).toHaveBeenCalledWith({
        name: 'my-app',
        hash: 'hash123',
        tag: undefined,
        nuclioName: undefined
      })
    })

    it('uses tag from identifier when app is filtered out and identifier contains a tag', async () => {
      fetchSingleEnrichedFunction.mockResolvedValue({ name: 'my-app', hash: 'hash123' })
      checkForSelectedApplication(
        makeArgs({
          applicationId: ':latest@hash123',
          applications: [{ hash: 'other-hash', tag: 'v2', nuclio_name: 'proj-other' }]
        })
      )
      flush()
      await flushMicrotasks()
      expect(fetchSingleEnrichedFunction).toHaveBeenCalledWith({
        name: 'my-app',
        hash: 'hash123',
        tag: 'latest',
        nuclioName: undefined
      })
    })

    it('calls setSelectedApplication with fetched data on success', async () => {
      const enriched = { name: 'my-app', hash: 'hash123' }
      fetchSingleEnrichedFunction.mockResolvedValue(enriched)
      checkForSelectedApplication(makeArgs())
      flush()
      await flushMicrotasks()
      expect(setSelectedApplication).toHaveBeenCalledWith(expect.any(Function))
    })

    it('navigates to the list page when fetch resolves with null', async () => {
      fetchSingleEnrichedFunction.mockResolvedValue(null)
      checkForSelectedApplication(makeArgs())
      flush()
      await flushMicrotasks()
      expect(navigate).toHaveBeenCalledWith('/projects/my-project/applications', { replace: true })
    })

    it('navigates and shows error notification when fetch rejects', async () => {
      const error = new Error('network error')
      fetchSingleEnrichedFunction.mockRejectedValue(error)
      checkForSelectedApplication(makeArgs())
      flush()
      await flushMicrotasks()
      expect(navigate).toHaveBeenCalledWith('/projects/my-project/applications', { replace: true })
      expect(showErrorNotification).toHaveBeenCalledWith(
        dispatch,
        error,
        '',
        'Failed to retrieve application data'
      )
    })

    it('resets setSelectedApplication({}) on error before navigating', async () => {
      fetchSingleEnrichedFunction.mockRejectedValue(new Error('fail'))
      checkForSelectedApplication(makeArgs())
      flush()
      await flushMicrotasks()
      expect(setSelectedApplication).toHaveBeenCalledWith({})
    })
  })
})
