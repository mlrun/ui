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
import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

import DetailsTabs from './DetailsTabs'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('igz-controls/nextGenComponents', () => ({
  cn: (...args) => args.filter(Boolean).join(' '),
  Tabs: ({ children, value, onValueChange, ...rest }) => {
    void onValueChange
    return (
      <div data-testid="tabs" data-value={value} {...rest}>
        {children}
      </div>
    )
  },
  TabsList: ({ children, ...rest }) => (
    <div data-testid="tabs-list" {...rest}>
      {children}
    </div>
  ),
  TabsTrigger: ({ children, value, disabled, ...rest }) => (
    <button data-testid={`tab-trigger-${value}`} disabled={disabled} {...rest}>
      {children}
    </button>
  ),
  TabsContent: ({ children, value, ...rest }) => (
    <div data-testid={`tab-content-${value}`} {...rest}>
      {children}
    </div>
  ),
  RefreshButton: ({ onClick }) => (
    <button data-testid="refresh-button" onClick={onClick}>
      Refresh
    </button>
  ),
  DropdownMenu: ({ children }) => <div data-testid="dropdown-menu">{children}</div>,
  DropdownMenuTrigger: ({ children }) => <>{children}</>,
  DropdownMenuContent: ({ children }) => <div data-testid="dropdown-menu-content">{children}</div>,
  DropdownMenuItem: ({ children, onClick, disabled }) => (
    <button data-testid="dropdown-menu-item" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
  Button: ({ children, ...rest }) => <button {...rest}>{children}</button>
}))

// ── Test data ─────────────────────────────────────────────────────────────────

const OverviewTab = () => <div data-testid="overview-content">Overview content</div>
const ConfigTab = () => <div data-testid="config-content">Config content</div>

const SAMPLE_TABS = [
  { id: 'overview', label: 'Overview', component: OverviewTab },
  { id: 'configuration', label: 'Configuration', component: ConfigTab },
  { id: 'logs', label: 'Build Logs', disabled: true }
]

const SAMPLE_ACTIONS = [
  { label: 'View YAML', onClick: vi.fn(), icon: <span data-testid="yaml-icon" /> }
]

// ── Helpers ───────────────────────────────────────────────────────────────────

const defaultProps = {
  title: 'Application_1',
  tabs: SAMPLE_TABS,
  activeTabId: 'overview',
  onTabChange: vi.fn(),
  onClose: vi.fn(),
  actionsMenu: SAMPLE_ACTIONS
}

const renderDetailsTabs = (overrides = {}) => {
  const props = { ...defaultProps, ...overrides }
  return { ...render(<DetailsTabs {...props} />), props }
}

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('DetailsTabs', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(() => vi.restoreAllMocks())

  describe('rendering', () => {
    it('renders the component container', () => {
      renderDetailsTabs()
      expect(screen.getByTestId('details-tabs')).toBeInTheDocument()
    })

    it('renders the title', () => {
      renderDetailsTabs()
      expect(screen.getByTestId('details-title')).toHaveTextContent('Application_1')
    })

    it('renders a back button', () => {
      renderDetailsTabs()
      expect(screen.getByTestId('details-back-button')).toBeInTheDocument()
    })

    it('renders all tab triggers', () => {
      renderDetailsTabs()
      expect(screen.getByTestId('details-tab-overview')).toBeInTheDocument()
      expect(screen.getByTestId('details-tab-configuration')).toBeInTheDocument()
      expect(screen.getByTestId('details-tab-logs')).toBeInTheDocument()
    })

    it('renders disabled tab triggers as disabled', () => {
      renderDetailsTabs()
      expect(screen.getByTestId('details-tab-logs')).toBeDisabled()
    })

    it('renders tab content for each tab', () => {
      renderDetailsTabs()
      expect(screen.getByTestId('details-tab-content-overview')).toBeInTheDocument()
    })

    it('renders the actions menu when actions are provided', () => {
      renderDetailsTabs()
      expect(screen.getByTestId('details-actions-menu')).toBeInTheDocument()
    })

    it('does not render the actions menu when no actions are provided', () => {
      renderDetailsTabs({ actionsMenu: [] })
      expect(screen.queryByTestId('details-actions-menu')).not.toBeInTheDocument()
    })
  })

  describe('interactions', () => {
    it('calls onClose when back button is clicked', () => {
      const { props } = renderDetailsTabs()
      fireEvent.click(screen.getByTestId('details-back-button'))
      expect(props.onClose).toHaveBeenCalledTimes(1)
    })

    it('renders action menu items', () => {
      renderDetailsTabs()
      const items = screen.getAllByTestId('dropdown-menu-item')
      expect(items).toHaveLength(1)
      expect(items[0]).toHaveTextContent('View YAML')
    })

    it('calls action onClick when menu item is clicked', () => {
      renderDetailsTabs()
      const items = screen.getAllByTestId('dropdown-menu-item')
      fireEvent.click(items[0])
      expect(SAMPLE_ACTIONS[0].onClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('header content', () => {
    it('renders custom header content when provided', () => {
      renderDetailsTabs({ headerContent: <span data-testid="custom-header">Status</span> })
      expect(screen.getByTestId('custom-header')).toBeInTheDocument()
    })
  })
})
