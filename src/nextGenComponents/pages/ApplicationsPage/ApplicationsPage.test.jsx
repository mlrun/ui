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
import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

import ApplicationsPage from './ApplicationsPage'
import { DEFAULT_UPDATED_SORTING } from './applications.constants'
import { DataTable } from 'igz-controls/nextGenComponents'

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockNavigate = vi.fn()
const mockDispatch = vi.fn(() => ({ unwrap: () => Promise.resolve(null) }))

vi.mock('react-router-dom', () => ({
  Link: props => <a href={props.to}>{props.children}</a>,
  useParams: () => ({ projectName: 'my-project' }),
  useNavigate: () => mockNavigate
}))

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: vi.fn(selector =>
    selector({
      functionsStore: { funcLoading: false },
      nuclioStore: { nuclioFunctionLoading: false }
    })
  )
}))

vi.mock('igz-controls/nextGenComponents', () => ({
  DataTable: vi.fn(props => (
    <table data-testid="data-table">
      <tbody>
        {props.data.map((row, rowIndex) => (
          <tr key={rowIndex} data-testid="table-row">
            {props.columns.map(col => (
              <td key={col.id ?? col.accessorKey} data-testid={`cell-${col.id ?? col.accessorKey}`}>
                {typeof col.cell === 'function'
                  ? col.cell({ row: { original: row } })
                  : row[col.accessorKey]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )),
  Loader: () => <div data-testid="loader" />,
  Tooltip: props => <>{props.children}</>,
  TooltipTrigger: props => <>{props.children}</>,
  TooltipContent: props => <div data-testid="tooltip-content">{props.children}</div>,
  TooltipProvider: ({ children }) => <>{children}</>
}))

const SAMPLE_APPLICATIONS = [
  {
    name: 'app-alpha',
    hash: 'abc123',
    tag: 'latest',
    state: { value: 'running', label: 'Running', className: 'state-running-nuclioFunctions' },
    external_invocation_urls: ['host-a.example.com:8080'],
    internal_invocation_urls: [],
    updated: '2026-05-10T12:00:00.000Z',
    labels: { owner: 'alice' },
    owner: 'alice'
  },
  {
    name: 'app-beta',
    hash: 'def456',
    tag: '',
    state: { value: 'failed', label: 'Error', className: 'state-failed-nuclioFunctions' },
    external_invocation_urls: [],
    internal_invocation_urls: [],
    updated: null,
    labels: {},
    owner: ''
  }
]

vi.mock('../../../hooks/useFiltersFromSearchParams.hook', () => ({
  useFiltersFromSearchParams: () => ({})
}))

vi.mock('../../../hooks/useNuclioEnrichedFunctions.hook', () => ({
  useNuclioEnrichedFunctions: () => ({
    fetchData: vi.fn(),
    fetchSingleEnrichedFunction: vi.fn(() => Promise.resolve(null)),
    filteredData: SAMPLE_APPLICATIONS,
    counters: { total: 2, running: 1, failed: 1, deploying: 0 },
    isLoading: false
  })
}))

vi.mock('../../shared/UrlCell', () => ({
  default: ({ items }) => <div data-testid="url-cell">{items.map(i => i.url).join(', ')}</div>,
  buildUrlItems: (external = [], internal = []) => [
    ...external.map(url => ({ url, allowCopy: true, openInNewTab: true })),
    ...internal.map(url => ({ url }))
  ]
}))

vi.mock('./ApplicationCounters/ApplicationCounters', () => ({
  default: () => <div data-testid="application-counters" />
}))

vi.mock('./ApplicationsFilters/ApplicationsFilters', () => ({
  default: () => <div data-testid="applications-filters" />
}))

vi.mock('../../shared/ActionBar/ActionBar', () => ({
  default: ({ children }) => (
    <div data-testid="action-bar">
      {children?.({
        filters: {},
        applyFilter: vi.fn(),
        applyMultipleFilters: vi.fn()
      })}
    </div>
  )
}))

vi.mock('../../../common/Breadcrumbs/Breadcrumbs', () => ({
  default: () => <div data-testid="breadcrumbs" />
}))

vi.mock('./ApplicationDetails/ApplicationDetails', () => ({
  default: ({ application, onClose }) => (
    <div data-testid="application-details">
      <span data-testid="details-app-name">{application.name}</span>
      <button data-testid="details-close" onClick={onClose}>
        Close
      </button>
    </div>
  )
}))

vi.mock('../../shared/YamlModal/YamlModal', () => ({
  default: ({ open }) => (open ? <div data-testid="yaml-modal" /> : null)
}))

vi.mock('./applicationsPage.util', () => {
  const mockCheckForSelectedApplication = vi.fn()
  mockCheckForSelectedApplication.cancel = vi.fn()
  return {
    checkForSelectedApplication: mockCheckForSelectedApplication,
    buildApiFilters: vi.fn(() => ({})),
    filterApplications: vi.fn(apps => apps),
    parseApplicationsQueryParams: vi.fn()
  }
})

vi.mock('../../shared/NoData/NoData', () => ({
  default: ({ message }) => <div data-testid="no-data">{message}</div>
}))

vi.mock('../../../utils/getNoDataMessage', () => ({
  getNoDataMessage: vi.fn(() => 'No data')
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

const renderPage = () => render(<ApplicationsPage />)

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('ApplicationsPage', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(() => vi.restoreAllMocks())

  describe('rendering', () => {
    it('renders the data table', () => {
      renderPage()
      expect(screen.getByTestId('data-table')).toBeInTheDocument()
    })

    it('renders one row per application', () => {
      renderPage()
      expect(screen.getAllByTestId('table-row')).toHaveLength(SAMPLE_APPLICATIONS.length)
    })

    it('renders "All Applications" heading', () => {
      renderPage()
      expect(screen.getByText('All Applications')).toBeInTheDocument()
    })

    it('renders owner cells for each application', () => {
      renderPage()
      const ownerCells = screen.getAllByTestId('owner-cell')
      expect(ownerCells).toHaveLength(SAMPLE_APPLICATIONS.length)
    })

    it('renders owner name when present', () => {
      renderPage()
      expect(screen.getByText('alice')).toBeInTheDocument()
    })

    it('renders empty cell when owner is empty', () => {
      renderPage()
      const ownerCells = screen.getAllByTestId('owner-cell')
      expect(ownerCells[1]).toHaveTextContent('')
    })

    it('renders breadcrumbs', () => {
      renderPage()
      expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument()
    })

    it('renders application counters', () => {
      renderPage()
      expect(screen.getByTestId('application-counters')).toBeInTheDocument()
    })

    it('renders action bar', () => {
      renderPage()
      expect(screen.getByTestId('action-bar')).toBeInTheDocument()
    })

    it('passes default sorting by "updated" descending to DataTable', () => {
      renderPage()
      const dataTableCalls = DataTable.mock.calls
      const lastCallProps = dataTableCalls[dataTableCalls.length - 1][0]
      expect(lastCallProps.initialSorting).toEqual(DEFAULT_UPDATED_SORTING)
    })
  })

  describe('name cell', () => {
    it('renders application names as links', () => {
      renderPage()
      expect(screen.getByText('app-alpha')).toBeInTheDocument()
      expect(screen.getByText('app-beta')).toBeInTheDocument()
    })

    it('links to the application detail page with tag and hash identifier', () => {
      renderPage()
      const link = screen.getByText('app-alpha').closest('a')
      expect(link).toHaveAttribute(
        'href',
        '/projects/my-project/applications/app-alpha/:latest@abc123/overview'
      )
    })

    it('links with hash-only identifier when tag is empty', () => {
      renderPage()
      const link = screen.getByText('app-beta').closest('a')
      expect(link).toHaveAttribute(
        'href',
        '/projects/my-project/applications/app-beta/@def456/overview'
      )
    })

    it('renders a status dot for each row', () => {
      renderPage()
      expect(screen.getAllByTestId(/^application-status-dot-/)).toHaveLength(
        SAMPLE_APPLICATIONS.length
      )
    })
  })

  describe('updated cell', () => {
    it('renders a formatted date when updated is provided', () => {
      renderPage()
      expect(screen.getByText(/May 10, 2026/)).toBeInTheDocument()
    })

    it('renders empty cell when updated is null', () => {
      renderPage()
      const updatedCell = screen.getAllByTestId('cell-updated')[1]
      expect(updatedCell).toHaveTextContent('')
    })
  })

  describe('status dot class', () => {
    it('applies the nuclioFunctions state className for the running app', () => {
      renderPage()
      expect(screen.getByTestId('application-status-dot-running')).toHaveClass(
        'state-running-nuclioFunctions'
      )
    })

    it('applies the nuclioFunctions state className for the failed app', () => {
      renderPage()
      expect(screen.getByTestId('application-status-dot-error')).toHaveClass(
        'state-failed-nuclioFunctions'
      )
    })

    it('renders dots as <i> elements styled by main.scss state classes', () => {
      renderPage()
      const dots = screen.getAllByTestId(/^application-status-dot-/)
      dots.forEach(dot => expect(dot.tagName).toBe('I'))
    })
  })

  describe('status tooltip', () => {
    it('renders the state label as tooltip content for the running app', () => {
      renderPage()
      const tooltipContents = screen.getAllByTestId('tooltip-content')
      const labels = tooltipContents.map(el => el.textContent)
      expect(labels).toContain('Running')
    })

    it('renders the state label as tooltip content for the failed app', () => {
      renderPage()
      const tooltipContents = screen.getAllByTestId('tooltip-content')
      const labels = tooltipContents.map(el => el.textContent)
      expect(labels).toContain('Error')
    })
  })

  describe('help icon tooltip', () => {
    it('renders the help icon', () => {
      renderPage()
      expect(screen.getByTestId('help-icon')).toBeInTheDocument()
    })

    it('renders the help tooltip description text', () => {
      renderPage()
      const tooltipContents = screen.getAllByTestId('tooltip-content')
      const descriptions = tooltipContents.map(el => el.textContent)
      expect(descriptions).toContain('List of all deployed applications in the project')
    })
  })
})
