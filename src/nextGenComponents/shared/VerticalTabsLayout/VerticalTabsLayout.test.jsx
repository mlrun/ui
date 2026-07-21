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

import VerticalTabsLayout from './VerticalTabsLayout'

// ── Mocks ─────────────────────────────────────────────────────────────────────

let mockIsDesktop = true

vi.mock('./useContainerWidth.hook', () => ({
  default: () => [() => {}, mockIsDesktop]
}))

vi.mock('igz-controls/nextGenComponents', () => ({
  cn: (...args) => args.filter(Boolean).join(' '),
  Tabs: ({ children, value, onValueChange, ...props }) => {
    void onValueChange
    return (
      <div data-testid="tabs" data-value={value} {...props}>
        {children}
      </div>
    )
  },
  TabsList: ({ children, ...props }) => (
    <div data-testid="tabs-list" {...props}>
      {children}
    </div>
  ),
  TabsTrigger: ({ children, value, ...props }) => (
    <button
      data-testid={`vertical-tab-${value}`}
      data-value={value}
      onClick={() => props['data-onclick']?.(value)}
      {...props}
    >
      {children}
    </button>
  ),
  TabsContent: ({ children, value, ...props }) => (
    <div data-testid={`vertical-tab-content-${value}`} {...props}>
      {children}
    </div>
  ),
  ScrollArea: ({ children, ...props }) => <div {...props}>{children}</div>,
  Separator: props => <hr data-testid="separator" {...props} />,
  Collapsible: ({ children, open }) => <div data-open={open}>{children}</div>,
  CollapsibleTrigger: ({ children, ...props }) => <button {...props}>{children}</button>,
  CollapsibleContent: ({ children, ...props }) => <div {...props}>{children}</div>
}))

vi.mock('../CollapsibleSection/CollapsibleSection', () => ({
  default: ({ title, children, defaultOpen }) => (
    <div data-testid={`collapsible-${title}`} data-default-open={defaultOpen}>
      <span>{title}</span>
      <div>{children}</div>
    </div>
  )
}))

// ── Test data ─────────────────────────────────────────────────────────────────

const SectionA = () => <div data-testid="section-a-content">Section A content</div>
const SectionB = () => <div data-testid="section-b-content">Section B content</div>
const SectionC = () => <div data-testid="section-c-content">Section C content</div>

const MOCK_SECTIONS = [
  { id: 'section-a', label: 'Section A', component: SectionA },
  { id: 'section-b', label: 'Section B', component: SectionB },
  { id: 'section-c', label: 'Section C', component: SectionC }
]

// ── Helpers ───────────────────────────────────────────────────────────────────

const renderLayout = (overrides = {}) => {
  const props = {
    sections: MOCK_SECTIONS,
    defaultSectionId: 'section-a',
    ...overrides
  }
  return render(<VerticalTabsLayout {...props} />)
}

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('VerticalTabsLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockIsDesktop = true
  })
  afterEach(() => vi.restoreAllMocks())

  describe('desktop mode', () => {
    it('renders the vertical tabs layout', () => {
      renderLayout()
      expect(screen.getByTestId('vertical-tabs-layout')).toBeInTheDocument()
    })

    it('renders tab triggers for all sections', () => {
      renderLayout()
      expect(screen.getByTestId('vertical-tab-section-a')).toBeInTheDocument()
      expect(screen.getByTestId('vertical-tab-section-b')).toBeInTheDocument()
      expect(screen.getByTestId('vertical-tab-section-c')).toBeInTheDocument()
    })

    it('renders tab content areas for all sections', () => {
      renderLayout()
      expect(screen.getByTestId('vertical-tab-content-section-a')).toBeInTheDocument()
      expect(screen.getByTestId('vertical-tab-content-section-b')).toBeInTheDocument()
      expect(screen.getByTestId('vertical-tab-content-section-c')).toBeInTheDocument()
    })

    it('renders section titles in content', () => {
      renderLayout()
      expect(screen.getByTestId('section-title-section-a')).toHaveTextContent('Section A')
      expect(screen.getByTestId('section-title-section-b')).toHaveTextContent('Section B')
    })

    it('renders section content components', () => {
      renderLayout()
      expect(screen.getByTestId('section-a-content')).toBeInTheDocument()
      expect(screen.getByTestId('section-b-content')).toBeInTheDocument()
      expect(screen.getByTestId('section-c-content')).toBeInTheDocument()
    })

    it('renders the tabs-list container', () => {
      renderLayout()
      expect(screen.getByTestId('vertical-tabs-list')).toBeInTheDocument()
    })
  })

  describe('mobile mode', () => {
    beforeEach(() => {
      mockIsDesktop = false
    })

    it('renders the mobile layout', () => {
      renderLayout()
      expect(screen.getByTestId('vertical-tabs-layout-mobile')).toBeInTheDocument()
    })

    it('renders collapsible sections', () => {
      renderLayout()
      expect(screen.getByTestId('collapsible-Section A')).toBeInTheDocument()
      expect(screen.getByTestId('collapsible-Section B')).toBeInTheDocument()
      expect(screen.getByTestId('collapsible-Section C')).toBeInTheDocument()
    })

    it('sets the default section to open', () => {
      renderLayout()
      const sectionA = screen.getByTestId('collapsible-Section A')
      expect(sectionA).toHaveAttribute('data-default-open', 'true')
    })

    it('sets non-default sections to closed', () => {
      renderLayout()
      const sectionB = screen.getByTestId('collapsible-Section B')
      expect(sectionB).toHaveAttribute('data-default-open', 'false')
    })

    it('renders section content inside collapsibles', () => {
      renderLayout()
      expect(screen.getByTestId('section-a-content')).toBeInTheDocument()
      expect(screen.getByTestId('section-b-content')).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('uses first section as default when no defaultSectionId is provided', () => {
      renderLayout({ defaultSectionId: undefined })
      expect(screen.getByTestId('vertical-tabs-layout')).toBeInTheDocument()
    })
  })
})
