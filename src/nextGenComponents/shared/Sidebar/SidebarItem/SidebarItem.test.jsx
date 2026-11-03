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

import SidebarItem from './SidebarItem'

// ── Mocks ─────────────────────────────────────────────────────────────────────

const { MockSidebarMenuItem } = vi.hoisted(() => {
  const React = require('react')

  return {
    MockSidebarMenuItem: React.forwardRef(function MockSidebarMenuItem(
      { children, className, ...rest },
      ref
    ) {
      return (
        <li ref={ref} data-testid="sidebar-menu-item" className={className} {...rest}>
          {children}
        </li>
      )
    })
  }
})

const mockMatch = vi.fn()

vi.mock('react-router', () => ({
  Link: ({ to, children, ...rest }) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
  useMatch: pattern => mockMatch(pattern)
}))

vi.mock('igz-controls/nextGenComponents', () => ({
  SidebarMenuButton: ({ children, isActive, asChild, className, ...rest }) =>
    asChild ? (
      <div data-testid="sidebar-menu-button" data-active={isActive} className={className} {...rest}>
        {children}
      </div>
    ) : (
      <button
        data-testid="sidebar-menu-button"
        data-active={isActive}
        className={className}
        {...rest}
      >
        {children}
      </button>
    ),
  SidebarMenuItem: MockSidebarMenuItem,
  useSidebar: () => ({ open: true })
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

const DEFAULT_PROPS = {
  label: 'ML functions',
  link: '/projects/demo/functions',
  icon: <svg data-testid="item-icon" />
}

const renderItem = (props = {}) => render(<SidebarItem {...DEFAULT_PROPS} {...props} />)

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('SidebarItem', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockMatch.mockReturnValue(null)
  })
  afterEach(() => vi.restoreAllMocks())

  describe('rendering', () => {
    it('renders the menu item container', () => {
      renderItem()
      expect(screen.getByTestId('sidebar-menu-item-ml-functions')).toBeInTheDocument()
    })

    it('renders the label text', () => {
      renderItem()
      expect(screen.getByText('ML functions')).toBeInTheDocument()
    })

    it('renders the icon', () => {
      renderItem()
      expect(screen.getByTestId('item-icon')).toBeInTheDocument()
    })

    it('sets the correct data-testid on the menu item', () => {
      renderItem()
      expect(screen.getByTestId('sidebar-menu-item-ml-functions')).toBeInTheDocument()
    })
  })

  describe('internal link', () => {
    it('renders an internal link by default', () => {
      renderItem()
      expect(screen.getByTestId('sidebar-menu-item-ml-functions-internal-link')).toBeInTheDocument()
    })

    it('internal link has the correct href', () => {
      renderItem()
      const link = screen.getByTestId('sidebar-menu-item-ml-functions-internal-link')
      expect(link).toHaveAttribute('href', '/projects/demo/functions')
    })

    it('does not render an external link anchor', () => {
      renderItem()
      expect(
        screen.queryByTestId('sidebar-menu-item-ml-functions-external-link')
      ).not.toBeInTheDocument()
    })
  })

  describe('external link', () => {
    it('renders an external anchor when externalLink is true', () => {
      renderItem({ externalLink: true })
      expect(screen.getByTestId('sidebar-menu-item-ml-functions-external-link')).toBeInTheDocument()
    })

    it('external anchor has target="_top"', () => {
      renderItem({ externalLink: true })
      const anchor = screen.getByTestId('sidebar-menu-item-ml-functions-external-link')
      expect(anchor).toHaveAttribute('target', '_top')
    })

    it('external anchor has the correct href', () => {
      renderItem({ externalLink: true })
      const anchor = screen.getByTestId('sidebar-menu-item-ml-functions-external-link')
      expect(anchor).toHaveAttribute('href', '/projects/demo/functions')
    })

    it('does not render an internal link when externalLink is true', () => {
      renderItem({ externalLink: true })
      expect(
        screen.queryByTestId('sidebar-menu-item-ml-functions-internal-link')
      ).not.toBeInTheDocument()
    })
  })

  describe('active state', () => {
    it('passes isActive=true to menu button when route matches', () => {
      mockMatch.mockReturnValue({ params: {} })
      renderItem()
      expect(screen.getByTestId('sidebar-menu-button')).toHaveAttribute('data-active', 'true')
    })

    it('passes isActive=false to menu button when route does not match', () => {
      mockMatch.mockReturnValue(null)
      renderItem()
      expect(screen.getByTestId('sidebar-menu-button')).toHaveAttribute('data-active', 'false')
    })
  })

  describe('label test id generation', () => {
    it('converts spaces to hyphens in the test id', () => {
      renderItem({ label: 'Jobs and workflows' })
      expect(screen.getByTestId('sidebar-menu-item-jobs-and-workflows')).toBeInTheDocument()
    })

    it('uses lowercase in the test id', () => {
      renderItem({ label: 'Project Monitoring' })
      expect(screen.getByTestId('sidebar-menu-item-project-monitoring')).toBeInTheDocument()
    })
  })
})
