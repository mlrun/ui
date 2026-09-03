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

import SidebarList from './Sidebar'
import { getLinks, getFooterLinks } from './navbarList.util'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('igz-controls/nextGenComponents', () => ({
  Sidebar: ({ children, className, collapsible, ...rest }) => (
    <nav data-testid="sidebar" data-collapsible={collapsible} className={className} {...rest}>
      {children}
    </nav>
  ),
  SidebarHeader: ({ children, className }) => (
    <div data-testid="sidebar-header" className={className}>
      {children}
    </div>
  ),
  SidebarContent: ({ children, className }) => (
    <div data-testid="sidebar-content" className={className}>
      {children}
    </div>
  ),
  SidebarFooter: ({ children, className, ...rest }) => (
    <div data-testid="sidebar-footer" className={className} {...rest}>
      {children}
    </div>
  ),
  SidebarMenu: ({ children }) => <ul data-testid="sidebar-menu">{children}</ul>,
  SidebarSeparator: () => <hr data-testid="sidebar-separator" />
}))

vi.mock('./ProjectDropdown', () => ({
  default: ({ projectName }) => <div data-testid="project-dropdown">{projectName}</div>
}))

vi.mock('./SidebarItem', () => ({
  default: ({ label }) => (
    <li data-testid={`sidebar-item-${label.toLowerCase().replace(/\s+/g, '-')}`}>{label}</li>
  )
}))

vi.mock('./SidebarCollapseItem', () => ({
  default: ({ label }) => (
    <li data-testid={`sidebar-collapse-item-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      {label}
    </li>
  )
}))

const MOCK_LINKS = [
  { id: 'monitoring', label: 'Project monitoring', link: '/projects/demo/monitoring' },
  {
    id: 'jobs',
    label: 'Jobs and workflows',
    nestedLinks: [{ id: 'jobs-tab', label: 'Jobs', link: '/projects/demo/jobs/monitor-jobs' }]
  },
  { id: 'functions', label: 'ML functions', link: '/projects/demo/functions' }
]

const MOCK_FOOTER_LINKS = [
  { id: 'alerts', label: 'Alerts', link: '/projects/demo/alerts' },
  { id: 'settings', label: 'Project settings', link: '/projects/demo/settings' }
]

vi.mock('./navbarList.util', () => ({
  getLinks: vi.fn(() => MOCK_LINKS),
  getFooterLinks: vi.fn(() => MOCK_FOOTER_LINKS)
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

const renderSidebar = (projectName = 'demo') => render(<SidebarList projectName={projectName} />)

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('SidebarList (Sidebar.jsx)', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(() => vi.restoreAllMocks())

  describe('rendering', () => {
    it('renders the sidebar container', () => {
      renderSidebar()
      expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    })

    it('renders the sidebar header', () => {
      renderSidebar()
      expect(screen.getByTestId('sidebar-header')).toBeInTheDocument()
    })

    it('renders the sidebar content', () => {
      renderSidebar()
      expect(screen.getByTestId('sidebar-content')).toBeInTheDocument()
    })

    it('renders the sidebar footer with data-testid', () => {
      renderSidebar()
      expect(screen.getByTestId('sidebar-footer')).toBeInTheDocument()
    })

    it('renders the project dropdown in the header', () => {
      renderSidebar()
      expect(screen.getByTestId('project-dropdown')).toBeInTheDocument()
    })

    it('passes the projectName to ProjectDropdown', () => {
      renderSidebar('my-project')
      expect(screen.getByTestId('project-dropdown')).toHaveTextContent('my-project')
    })

    it('renders separators', () => {
      renderSidebar()
      expect(screen.getAllByTestId('sidebar-separator')).toHaveLength(2)
    })
  })

  describe('nav links', () => {
    it('renders a SidebarItem for each flat link', () => {
      renderSidebar()
      expect(screen.getByTestId('sidebar-item-project-monitoring')).toBeInTheDocument()
      expect(screen.getByTestId('sidebar-item-ml-functions')).toBeInTheDocument()
    })

    it('renders a SidebarCollapseItem for links with nestedLinks', () => {
      renderSidebar()
      expect(screen.getByTestId('sidebar-collapse-item-jobs-and-workflows')).toBeInTheDocument()
    })

    it('renders all nav link labels', () => {
      renderSidebar()
      expect(screen.getByText('Project monitoring')).toBeInTheDocument()
      expect(screen.getByText('Jobs and workflows')).toBeInTheDocument()
      expect(screen.getByText('ML functions')).toBeInTheDocument()
    })
  })

  describe('footer links', () => {
    it('renders all footer items', () => {
      renderSidebar()
      expect(screen.getByTestId('sidebar-item-alerts')).toBeInTheDocument()
      expect(screen.getByTestId('sidebar-item-project-settings')).toBeInTheDocument()
    })

    it('renders footer link labels', () => {
      renderSidebar()
      expect(screen.getByText('Alerts')).toBeInTheDocument()
      expect(screen.getByText('Project settings')).toBeInTheDocument()
    })
  })

  describe('empty state', () => {
    it('renders no nav or footer items when both link lists are empty', () => {
      vi.mocked(getLinks).mockReturnValueOnce([])
      vi.mocked(getFooterLinks).mockReturnValueOnce([])
      renderSidebar('demo')
      expect(screen.queryAllByTestId(/^sidebar-item-/)).toHaveLength(0)
      expect(screen.queryAllByTestId(/^sidebar-collapse-item-/)).toHaveLength(0)
    })
  })

  describe('collapsible mode', () => {
    it('uses icon collapsible mode', () => {
      renderSidebar()
      expect(screen.getByTestId('sidebar')).toHaveAttribute('data-collapsible', 'icon')
    })
  })
})
