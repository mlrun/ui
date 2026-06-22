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

import ProjectDropdown from './ProjectDropdown'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/projects/demo/functions' }),
  Link: ({ to, children, ...rest }) => (
    <a href={to} {...rest}>
      {children}
    </a>
  )
}))

vi.mock('react-redux', () => ({
  useSelector: vi.fn(selector =>
    selector({
      projectStore: {
        projectsNames: {
          data: ['demo', 'alpha', 'beta']
        }
      }
    })
  )
}))

let mockSidebarOpen = true
const mockSetHoverLocked = vi.fn()

vi.mock('igz-controls/nextGenComponents', () => ({
  SidebarMenu: ({ children }) => <ul data-testid="sidebar-menu">{children}</ul>,
  SidebarMenuItem: ({ children, className }) => (
    <li data-testid="sidebar-menu-item" className={className}>
      {children}
    </li>
  ),
  SidebarMenuButton: ({ children, className }) => (
    <button data-testid="sidebar-menu-button" className={className}>
      {children}
    </button>
  ),
  useSidebar: () => ({ open: mockSidebarOpen, setHoverLocked: mockSetHoverLocked }),
  DropdownMenu: ({ children, open, onOpenChange }) => (
    <div data-testid="dropdown-menu" data-open={open} onClick={() => onOpenChange(!open)}>
      {children}
    </div>
  ),
  DropdownMenuTrigger: ({ children, asChild, ...rest }) =>
    asChild ? <>{React.cloneElement(children, rest)}</> : <button {...rest}>{children}</button>,
  DropdownMenuContent: ({ children }) => <div data-testid="dropdown-menu-content">{children}</div>,
  DropdownMenuItem: ({ children, asChild }) =>
    asChild ? <>{children}</> : <div data-testid="dropdown-menu-item">{children}</div>,
  Input: ({ value, onChange, placeholder, ...rest }) => (
    <input
      data-testid="search-input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...rest}
    />
  ),
  Tooltip: ({ children }) => <>{children}</>,
  TooltipTrigger: ({ children }) => <>{children}</>,
  TooltipContent: ({ children }) => <div data-testid="tooltip-content">{children}</div>,
  TooltipProvider: ({ children }) => <>{children}</>
}))

vi.mock('../../../../utils/projects', () => ({
  generateProjectsList: names => (names || []).map(name => ({ id: name, label: name }))
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

const renderDropdown = (projectName = 'demo') =>
  render(<ProjectDropdown projectName={projectName} />)

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('ProjectDropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSidebarOpen = true
  })
  afterEach(() => vi.restoreAllMocks())

  describe('rendering', () => {
    it('renders the sidebar menu', () => {
      renderDropdown()
      expect(screen.getByTestId('sidebar-menu')).toBeInTheDocument()
    })

    it('renders the dropdown trigger button', () => {
      renderDropdown()
      expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument()
    })

    it('renders the current project name in the trigger', () => {
      renderDropdown('demo')
      const names = screen.getAllByText('demo')
      expect(names.length).toBeGreaterThan(0)
    })

    it('renders the tooltip with the project name', () => {
      renderDropdown('demo')
      const tooltips = screen.getAllByTestId('tooltip-content')
      expect(tooltips.some(el => el.textContent === 'demo')).toBe(true)
    })
  })

  describe('dropdown content', () => {
    it('shows the search input in the dropdown', () => {
      renderDropdown()
      expect(screen.getByTestId('search-input')).toBeInTheDocument()
    })

    it('renders all projects as links', () => {
      renderDropdown()
      const links = screen.getAllByRole('link')
      const labels = links.map(l => l.textContent)
      expect(labels).toContain('demo')
      expect(labels).toContain('alpha')
      expect(labels).toContain('beta')
    })

    it('each project link has href pointing to the current path with project replaced', () => {
      renderDropdown('demo')
      const alphaLink = screen.getAllByRole('link').find(l => l.textContent === 'alpha')
      expect(alphaLink).toHaveAttribute('href', '/projects/alpha/functions')
    })
  })

  describe('search filtering', () => {
    it('filters the projects list by the search term', () => {
      renderDropdown()
      const input = screen.getByTestId('search-input')
      fireEvent.change(input, { target: { value: 'alp' } })
      const links = screen.getAllByRole('link')
      const labels = links.map(l => l.textContent)
      expect(labels).toContain('alpha')
      expect(labels).not.toContain('beta')
    })

    it('shows no-projects message when filter matches nothing', () => {
      renderDropdown()
      const input = screen.getByTestId('search-input')
      fireEvent.change(input, { target: { value: 'zzz' } })
      expect(screen.getByText(/no projects/i)).toBeInTheDocument()
    })
  })

  describe('hover lock', () => {
    it('calls setHoverLocked(true) when dropdown opens', () => {
      renderDropdown()
      fireEvent.click(screen.getByTestId('dropdown-menu'))
      expect(mockSetHoverLocked).toHaveBeenCalledWith(true)
    })

    it('calls setHoverLocked(false) when dropdown closes', () => {
      renderDropdown()
      fireEvent.click(screen.getByTestId('dropdown-menu'))
      vi.clearAllMocks()
      fireEvent.click(screen.getByTestId('dropdown-menu'))
      expect(mockSetHoverLocked).toHaveBeenCalledWith(false)
    })
  })
})
