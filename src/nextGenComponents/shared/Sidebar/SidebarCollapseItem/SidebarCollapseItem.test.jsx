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

import SidebarCollapseItem from './SidebarCollapseItem'

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockPathname = vi.fn(() => '/projects/demo/jobs')

vi.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: mockPathname() })
}))

let mockSidebarOpen = true

vi.mock('igz-controls/nextGenComponents', () => ({
  Collapsible: ({ children, open, onOpenChange }) => (
    <div data-testid="collapsible" data-open={open} onClick={() => onOpenChange(!open)}>
      {children}
    </div>
  ),
  CollapsibleTrigger: ({ children, asChild }) =>
    asChild ? <>{children}</> : <button data-testid="collapsible-trigger">{children}</button>,
  CollapsibleContent: ({ children }) => <div data-testid="collapsible-content">{children}</div>,
  SidebarMenuButton: ({ children, isActive, className }) => (
    <button data-testid="sidebar-menu-button" data-active={isActive} className={className}>
      {children}
    </button>
  ),
  SidebarMenuItem: ({ children, className, ...rest }) => (
    <li data-testid="sidebar-menu-item" className={className} {...rest}>
      {children}
    </li>
  ),
  SidebarMenuSub: ({ children }) => <ul data-testid="sidebar-menu-sub">{children}</ul>,
  useSidebar: () => ({ open: mockSidebarOpen })
}))

vi.mock('../SidebarItem', () => ({
  default: ({ label, link }) => (
    <li data-testid={`nested-item-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <a href={link}>{label}</a>
    </li>
  )
}))

// ── Fixtures ──────────────────────────────────────────────────────────────────

const NESTED_LINKS = [
  { id: 'jobs', label: 'Jobs', link: '/projects/demo/jobs/monitor-jobs' },
  { id: 'workflows', label: 'Workflows', link: '/projects/demo/jobs/monitor-workflows' },
  { id: 'schedule', label: 'Schedule', link: '/projects/demo/jobs/schedule' }
]

const DEFAULT_PROPS = {
  label: 'Jobs and workflows',
  icon: <svg data-testid="collapse-icon" />,
  nestedLinks: NESTED_LINKS
}

const renderCollapseItem = (props = {}) =>
  render(<SidebarCollapseItem {...DEFAULT_PROPS} {...props} />)

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('SidebarCollapseItem', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSidebarOpen = true
    mockPathname.mockReturnValue('/projects/demo/other')
  })
  afterEach(() => vi.restoreAllMocks())

  describe('rendering', () => {
    it('renders the collapsible container', () => {
      renderCollapseItem()
      expect(screen.getByTestId('collapsible')).toBeInTheDocument()
    })

    it('renders the menu item with the correct data-testid', () => {
      renderCollapseItem()
      expect(
        screen.getByTestId('sidebar-collapsible-menu-item-jobs-and-workflows')
      ).toBeInTheDocument()
    })

    it('renders the label text', () => {
      renderCollapseItem()
      expect(screen.getByText('Jobs and workflows')).toBeInTheDocument()
    })

    it('renders the icon', () => {
      renderCollapseItem()
      expect(screen.getByTestId('collapse-icon')).toBeInTheDocument()
    })

    it('renders nested items inside collapsible content', () => {
      renderCollapseItem()
      expect(screen.getByTestId('sidebar-menu-sub')).toBeInTheDocument()
      NESTED_LINKS.forEach(({ label }) => {
        expect(
          screen.getByTestId(`nested-item-${label.toLowerCase().replace(/\s+/g, '-')}`)
        ).toBeInTheDocument()
      })
    })

    it('renders all three nested links', () => {
      renderCollapseItem()
      expect(screen.getByTestId('nested-item-jobs')).toBeInTheDocument()
      expect(screen.getByTestId('nested-item-workflows')).toBeInTheDocument()
      expect(screen.getByTestId('nested-item-schedule')).toBeInTheDocument()
    })
  })

  describe('open/close state', () => {
    it('starts closed (open=false)', () => {
      renderCollapseItem()
      expect(screen.getByTestId('collapsible')).toHaveAttribute('data-open', 'false')
    })

    it('toggles open when the collapsible is clicked', () => {
      renderCollapseItem()
      fireEvent.click(screen.getByTestId('collapsible'))
      expect(screen.getByTestId('collapsible')).toHaveAttribute('data-open', 'true')
    })

    it('stays closed when sidebar is collapsed even after clicking', () => {
      mockSidebarOpen = false
      renderCollapseItem()
      fireEvent.click(screen.getByTestId('collapsible'))
      expect(screen.getByTestId('collapsible')).toHaveAttribute('data-open', 'false')
    })
  })

  describe('active state', () => {
    it('is not active when no child route matches', () => {
      mockPathname.mockReturnValue('/projects/demo/functions')
      renderCollapseItem()
      expect(screen.getByTestId('sidebar-menu-button')).toHaveAttribute('data-active', 'false')
    })

    it('is active when a child route is included in the current pathname', () => {
      mockPathname.mockReturnValue('/projects/demo/jobs/monitor-jobs')
      renderCollapseItem()
      expect(screen.getByTestId('sidebar-menu-button')).toHaveAttribute('data-active', 'true')
    })
  })
})
