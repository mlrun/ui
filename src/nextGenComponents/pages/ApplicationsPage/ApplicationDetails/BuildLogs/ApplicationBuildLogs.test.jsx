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

import ApplicationBuildLogs from './ApplicationBuildLogs'
import {
  BUILD_LOGS_INITIALIZED_MESSAGE,
  BUILD_LOGS_POLLING_INTERVAL_MS,
  COPY_RESET_TIMEOUT_MS,
  LOGS_SECTION_KEY
} from '../applicationDetails.constants'

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockDispatch = vi.fn()

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch
}))

vi.mock('react-router', () => ({
  useParams: () => ({ projectName: 'my-project' })
}))

vi.mock('../../../../../reducers/functionReducer', () => ({
  fetchFunctionLogs: vi.fn(params => ({ type: 'fetchFunctionLogs', ...params })),
  fetchFunctionNuclioLogs: vi.fn(params => ({ type: 'fetchFunctionNuclioLogs', ...params }))
}))

vi.mock('igz-controls/utils/notification.util', () => ({
  showErrorNotification: vi.fn()
}))

vi.mock('igz-controls/nextGenComponents', () => ({
  Loader: function MockLoader(props) {
    return (
      <div
        data-testid={props['data-testid'] || 'loader'}
        role="status"
        aria-label={props['aria-label'] || 'Loading'}
      />
    )
  }
}))

vi.mock('../../../../shared/LogsBlock/LogsBlock', () => ({
  default: ({ logs, loadingMessage }) => (
    <div data-testid="logs-block">
      {loadingMessage && !logs && (
        <span data-testid="logs-block-loading-message">{loadingMessage}</span>
      )}
      {typeof logs === 'string' ? logs : JSON.stringify(logs ?? null)}
    </div>
  )
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

const SAMPLE_APPLICATION = { name: 'test-app', tag: 'latest' }

// The build-status / deploy endpoints return 404 when the function record does not
// exist yet (Initialized / early Deploying). Other failures are genuine errors.
const NOT_FOUND_ERROR = { response: { status: 404 } }
const SERVER_ERROR = { response: { status: 500 } }

const makeDispatchResponse = ({ data, headers = {} } = {}) => {
  const result = { data, headers }
  const unwrap = vi.fn().mockResolvedValue(result)
  return Object.assign(Promise.resolve(result), { unwrap })
}

const makeRejectedResponse = (error = new Error('Not found')) => {
  const unwrap = vi.fn().mockRejectedValue(error)
  return Object.assign(Promise.resolve(), { unwrap })
}

const renderComponent = (overrides = {}) => {
  const props = { application: SAMPLE_APPLICATION, ...overrides }
  return { ...render(<ApplicationBuildLogs {...props} />), props }
}

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('ApplicationBuildLogs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    vi.clearAllTimers()

    mockDispatch.mockImplementation(() => makeDispatchResponse({ data: '', headers: {} }))
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('rendering', () => {
    it('renders the build logs container', async () => {
      await act(async () => renderComponent())
      expect(screen.getByTestId('application-build-logs')).toBeInTheDocument()
    })

    it('renders the Application section when app logs are present', async () => {
      mockDispatch.mockImplementation(() =>
        makeDispatchResponse({ data: 'some log output', headers: {} })
      )
      await act(async () => renderComponent())
      expect(
        screen.getByTestId(`build-logs-section-${LOGS_SECTION_KEY.APPLICATION}`)
      ).toBeInTheDocument()
    })

    it('hides the Application section when app logs are empty', async () => {
      await act(async () => renderComponent())
      expect(
        screen.queryByTestId(`build-logs-section-${LOGS_SECTION_KEY.APPLICATION}`)
      ).not.toBeInTheDocument()
    })

    it('renders the Function section', async () => {
      await act(async () => renderComponent())
      expect(
        screen.getByTestId(`build-logs-section-${LOGS_SECTION_KEY.FUNCTION}`)
      ).toBeInTheDocument()
    })

    it('renders both LogsBlock components when app logs are present', async () => {
      mockDispatch.mockImplementation(() =>
        makeDispatchResponse({ data: 'some log output', headers: {} })
      )
      await act(async () => renderComponent())
      expect(screen.getAllByTestId('logs-block')).toHaveLength(2)
    })

    it('renders only Function LogsBlock when app logs are empty', async () => {
      await act(async () => renderComponent())
      expect(screen.getAllByTestId('logs-block')).toHaveLength(1)
    })

    it('renders copy buttons for both sections when app logs are present', async () => {
      mockDispatch.mockImplementation(() =>
        makeDispatchResponse({ data: 'some log output', headers: {} })
      )
      await act(async () => renderComponent())
      expect(screen.getByTestId(`copy-logs-${LOGS_SECTION_KEY.APPLICATION}`)).toBeInTheDocument()
      expect(screen.getByTestId(`copy-logs-${LOGS_SECTION_KEY.FUNCTION}`)).toBeInTheDocument()
    })
  })

  describe('data fetching', () => {
    it('dispatches fetchFunctionLogs on mount', async () => {
      await act(async () => renderComponent())
      const { fetchFunctionLogs } = await import('../../../../../reducers/functionReducer')
      expect(fetchFunctionLogs).toHaveBeenCalledWith({
        project: 'my-project',
        name: SAMPLE_APPLICATION.name,
        tag: SAMPLE_APPLICATION.tag
      })
    })

    it('dispatches fetchFunctionNuclioLogs on mount', async () => {
      await act(async () => renderComponent())
      const { fetchFunctionNuclioLogs } = await import('../../../../../reducers/functionReducer')
      expect(fetchFunctionNuclioLogs).toHaveBeenCalledWith({
        project: 'my-project',
        name: SAMPLE_APPLICATION.name,
        tag: SAMPLE_APPLICATION.tag
      })
    })

    it('displays application logs returned from the API', async () => {
      mockDispatch.mockImplementation(action =>
        action?.type === 'fetchFunctionLogs'
          ? makeDispatchResponse({ data: 'Build started...', headers: {} })
          : makeDispatchResponse({ data: { status: { logs: [] } }, headers: {} })
      )

      await act(async () => renderComponent())
      expect(screen.getAllByTestId('logs-block')[0]).toHaveTextContent('Build started...')
    })

    it('displays structured function logs returned from the API', async () => {
      const sampleLogs = [{ level: 'info', message: 'Deploying', time: 1000, name: 'nuclio' }]

      mockDispatch.mockImplementation(action =>
        action?.type === 'fetchFunctionNuclioLogs'
          ? makeDispatchResponse({ data: { status: { logs: sampleLogs } }, headers: {} })
          : makeDispatchResponse({ data: '', headers: {} })
      )

      await act(async () => renderComponent())
      const functionLogsBlock = screen.getByTestId(
        `build-logs-section-${LOGS_SECTION_KEY.FUNCTION}`
      )
      expect(functionLogsBlock.querySelector('[data-testid="logs-block"]')).toHaveTextContent(
        '"Deploying"'
      )
    })
  })

  describe('loading state', () => {
    it('hides the loader in both sections after a non-transient fetch completes', async () => {
      await act(async () => renderComponent())

      expect(
        screen.queryByTestId(`logs-loading-${LOGS_SECTION_KEY.APPLICATION}`)
      ).not.toBeInTheDocument()
      expect(
        screen.queryByTestId(`logs-loading-${LOGS_SECTION_KEY.FUNCTION}`)
      ).not.toBeInTheDocument()
    })

    it('keeps the loader visible while the function status is transient', async () => {
      mockDispatch.mockImplementation(() =>
        makeDispatchResponse({
          data: 'building...',
          headers: { 'x-mlrun-function-status': 'running' }
        })
      )

      await act(async () => renderComponent())

      expect(screen.getByTestId(`logs-loading-${LOGS_SECTION_KEY.APPLICATION}`)).toBeInTheDocument()
      expect(screen.getByTestId(`logs-loading-${LOGS_SECTION_KEY.FUNCTION}`)).toBeInTheDocument()
    })

    it('hides copy buttons while logs are loading', async () => {
      mockDispatch.mockImplementation(() =>
        makeDispatchResponse({
          data: 'building...',
          headers: { 'x-mlrun-function-status': 'running' }
        })
      )

      await act(async () => renderComponent())

      expect(
        screen.queryByTestId(`copy-logs-${LOGS_SECTION_KEY.APPLICATION}`)
      ).not.toBeInTheDocument()
      expect(screen.queryByTestId(`copy-logs-${LOGS_SECTION_KEY.FUNCTION}`)).not.toBeInTheDocument()
    })
  })

  describe('polling', () => {
    it('polls again when the function status header indicates a transient state', async () => {
      const { fetchFunctionLogs } = await import('../../../../../reducers/functionReducer')

      mockDispatch.mockImplementation(() =>
        makeDispatchResponse({
          data: 'building...',
          headers: { 'x-mlrun-function-status': 'running' }
        })
      )

      await act(async () => renderComponent())
      const callCountAfterMount = fetchFunctionLogs.mock.calls.length

      await act(async () => {
        vi.advanceTimersByTime(BUILD_LOGS_POLLING_INTERVAL_MS)
      })

      expect(fetchFunctionLogs.mock.calls.length).toBeGreaterThan(callCountAfterMount)
    })

    it('does not poll when the function status is not transient', async () => {
      const { fetchFunctionLogs } = await import('../../../../../reducers/functionReducer')

      mockDispatch.mockImplementation(() => makeDispatchResponse({ data: 'done', headers: {} }))

      await act(async () => renderComponent())
      const callCountAfterMount = fetchFunctionLogs.mock.calls.length

      await act(async () => {
        vi.advanceTimersByTime(BUILD_LOGS_POLLING_INTERVAL_MS * 2)
      })

      expect(fetchFunctionLogs.mock.calls.length).toBe(callCountAfterMount)
    })

    it('clears polling timers on unmount', async () => {
      mockDispatch.mockImplementation(() =>
        makeDispatchResponse({
          data: 'building...',
          headers: { 'x-mlrun-function-status': 'running' }
        })
      )

      const { unmount } = await act(async () => renderComponent())
      const { fetchFunctionLogs } = await import('../../../../../reducers/functionReducer')

      unmount()
      const callCountAfterUnmount = fetchFunctionLogs.mock.calls.length

      await act(async () => {
        vi.advanceTimersByTime(BUILD_LOGS_POLLING_INTERVAL_MS * 3)
      })

      expect(fetchFunctionLogs.mock.calls.length).toBe(callCountAfterUnmount)
    })
  })

  describe('application state gating', () => {
    it('shows a placeholder message and skips fetching when the application is Initialized', async () => {
      const { fetchFunctionLogs, fetchFunctionNuclioLogs } =
        await import('../../../../../reducers/functionReducer')

      await act(async () =>
        renderComponent({
          application: { ...SAMPLE_APPLICATION, state: { value: 'initialized' } }
        })
      )

      expect(screen.getByTestId('no-data')).toBeInTheDocument()
      expect(screen.getByText(BUILD_LOGS_INITIALIZED_MESSAGE)).toBeInTheDocument()
      expect(screen.queryByTestId('logs-block')).not.toBeInTheDocument()
      expect(fetchFunctionLogs).not.toHaveBeenCalled()
      expect(fetchFunctionNuclioLogs).not.toHaveBeenCalled()
    })

    it('suppresses the error popup and keeps the loader while Deploying when a 404 occurs', async () => {
      const { showErrorNotification } = await import('igz-controls/utils/notification.util')

      mockDispatch.mockImplementation(() => makeRejectedResponse(NOT_FOUND_ERROR))

      await act(async () =>
        renderComponent({
          application: { ...SAMPLE_APPLICATION, state: { value: 'deploying' } }
        })
      )

      expect(showErrorNotification).not.toHaveBeenCalled()
      expect(screen.getByTestId(`logs-loading-${LOGS_SECTION_KEY.FUNCTION}`)).toBeInTheDocument()
    })

    it('shows the deploying placeholder inside the log panel while loading with no logs yet', async () => {
      mockDispatch.mockImplementation(() => makeRejectedResponse(NOT_FOUND_ERROR))

      await act(async () =>
        renderComponent({
          application: { ...SAMPLE_APPLICATION, state: { value: 'deploying' } }
        })
      )

      expect(screen.getAllByTestId('logs-block-loading-message').length).toBeGreaterThan(0)
      expect(screen.getAllByTestId('logs-block').length).toBeGreaterThan(0)
    })

    it('retries fetching while Deploying after a transient 404', async () => {
      const { fetchFunctionLogs } = await import('../../../../../reducers/functionReducer')

      mockDispatch.mockImplementation(() => makeRejectedResponse(NOT_FOUND_ERROR))

      await act(async () =>
        renderComponent({
          application: { ...SAMPLE_APPLICATION, state: { value: 'deploying' } }
        })
      )
      const callCountAfterMount = fetchFunctionLogs.mock.calls.length

      await act(async () => {
        vi.advanceTimersByTime(BUILD_LOGS_POLLING_INTERVAL_MS)
      })

      expect(fetchFunctionLogs.mock.calls.length).toBeGreaterThan(callCountAfterMount)
    })

    it('shows the error popup while Deploying when a non-404 error occurs', async () => {
      const { showErrorNotification } = await import('igz-controls/utils/notification.util')
      const { fetchFunctionLogs } = await import('../../../../../reducers/functionReducer')

      mockDispatch.mockImplementation(() => makeRejectedResponse(SERVER_ERROR))

      await act(async () =>
        renderComponent({
          application: { ...SAMPLE_APPLICATION, state: { value: 'deploying' } }
        })
      )
      const callCountAfterMount = fetchFunctionLogs.mock.calls.length

      await act(async () => {
        vi.advanceTimersByTime(BUILD_LOGS_POLLING_INTERVAL_MS)
      })

      expect(showErrorNotification).toHaveBeenCalled()
      // A genuine (non-404) error must not keep polling silently.
      expect(fetchFunctionLogs.mock.calls.length).toBe(callCountAfterMount)
    })

    it('shows the error popup when a fetch fails in a non-deploying state', async () => {
      const { showErrorNotification } = await import('igz-controls/utils/notification.util')

      mockDispatch.mockImplementation(() => makeRejectedResponse(NOT_FOUND_ERROR))

      await act(async () =>
        renderComponent({
          application: { ...SAMPLE_APPLICATION, state: { value: 'error' } }
        })
      )

      expect(showErrorNotification).toHaveBeenCalled()
    })
  })

  describe('copy to clipboard', () => {
    beforeEach(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: vi.fn().mockResolvedValue(undefined) },
        configurable: true
      })
    })

    it('calls clipboard.writeText with the application logs text', async () => {
      mockDispatch.mockImplementation(() =>
        makeDispatchResponse({ data: 'app log text', headers: {} })
      )

      await act(async () => renderComponent())

      await act(async () => {
        fireEvent.click(screen.getByTestId(`copy-logs-${LOGS_SECTION_KEY.APPLICATION}`))
      })

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('app log text')
    })

    it('calls clipboard.writeText with formatted function logs text', async () => {
      const logTime = 1_000_000_000_000
      const sampleLogs = [{ level: 'info', message: 'Deploying', time: logTime }]

      mockDispatch.mockImplementation(action =>
        action?.type === 'fetchFunctionNuclioLogs'
          ? makeDispatchResponse({ data: { status: { logs: sampleLogs } }, headers: {} })
          : makeDispatchResponse({ data: '', headers: {} })
      )

      await act(async () => renderComponent())

      await act(async () => {
        fireEvent.click(screen.getByTestId(`copy-logs-${LOGS_SECTION_KEY.FUNCTION}`))
      })

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        expect.stringContaining('INFO Deploying')
      )
    })

    it('shows the check icon after copying and reverts to copy icon after timeout', async () => {
      mockDispatch.mockImplementation(() =>
        makeDispatchResponse({ data: 'app log text', headers: {} })
      )
      await act(async () => renderComponent())

      expect(screen.getByTestId(`copy-icon-${LOGS_SECTION_KEY.APPLICATION}`)).toBeInTheDocument()
      expect(
        screen.queryByTestId(`check-icon-${LOGS_SECTION_KEY.APPLICATION}`)
      ).not.toBeInTheDocument()

      await act(async () => {
        fireEvent.click(screen.getByTestId(`copy-logs-${LOGS_SECTION_KEY.APPLICATION}`))
      })

      expect(screen.getByTestId(`check-icon-${LOGS_SECTION_KEY.APPLICATION}`)).toBeInTheDocument()
      expect(
        screen.queryByTestId(`copy-icon-${LOGS_SECTION_KEY.APPLICATION}`)
      ).not.toBeInTheDocument()

      await act(async () => {
        vi.advanceTimersByTime(COPY_RESET_TIMEOUT_MS)
      })

      expect(
        screen.queryByTestId(`check-icon-${LOGS_SECTION_KEY.APPLICATION}`)
      ).not.toBeInTheDocument()
      expect(screen.getByTestId(`copy-icon-${LOGS_SECTION_KEY.APPLICATION}`)).toBeInTheDocument()
    })

    it('only marks the clicked section as copied, not the other', async () => {
      mockDispatch.mockImplementation(() =>
        makeDispatchResponse({ data: 'app log text', headers: {} })
      )
      await act(async () => renderComponent())

      await act(async () => {
        fireEvent.click(screen.getByTestId(`copy-logs-${LOGS_SECTION_KEY.APPLICATION}`))
      })

      expect(screen.getByTestId(`check-icon-${LOGS_SECTION_KEY.APPLICATION}`)).toBeInTheDocument()
      expect(
        screen.queryByTestId(`check-icon-${LOGS_SECTION_KEY.FUNCTION}`)
      ).not.toBeInTheDocument()
      expect(screen.getByTestId(`copy-icon-${LOGS_SECTION_KEY.FUNCTION}`)).toBeInTheDocument()
    })
  })
})
