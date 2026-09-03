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

import ApplicationConfiguration from './ApplicationConfiguration'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('igz-controls/nextGenComponents', () => ({
  cn: (...args) => args.filter(Boolean).join(' '),
  DataTable: ({ data, columns }) => (
    <table data-testid="data-table">
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.id}>{typeof col.header === 'function' ? 'header' : col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} data-testid={`data-row-${idx}`}>
            {columns.map(col => (
              <td key={col.id}>{row[col.accessorKey] ?? ''}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
  Separator: () => <hr data-testid="separator" />,
  Tooltip: ({ children }) => <>{children}</>,
  TooltipTrigger: ({ children }) => <>{children}</>,
  TooltipContent: ({ children }) => <div data-testid="tooltip-content">{children}</div>,
  Tabs: ({ children, ...props }) => (
    <div data-testid="tabs" {...props}>
      {children}
    </div>
  ),
  TabsList: ({ children, ...props }) => (
    <div data-testid="tabs-list" {...props}>
      {children}
    </div>
  ),
  TabsTrigger: ({ children, value, ...props }) => (
    <button data-testid={`tab-trigger-${value}`} {...props}>
      {children}
    </button>
  ),
  TabsContent: ({ children, value, ...props }) => (
    <div data-testid={`tab-content-${value}`} {...props}>
      {children}
    </div>
  ),
  ScrollArea: ({ children, ...props }) => <div {...props}>{children}</div>,
  Collapsible: ({ children }) => <div>{children}</div>,
  CollapsibleTrigger: ({ children, ...props }) => <button {...props}>{children}</button>,
  CollapsibleContent: ({ children }) => <div>{children}</div>
}))

vi.mock('../../../../shared/DetailsInfoTable/DetailsInfoTable', () => ({
  default: ({ items }) => (
    <div data-testid="details-info-table">
      {items.map((item, index) => {
        const itemKey = item.id || (typeof item.label === 'string' ? item.label : index)
        return (
          <div key={itemKey} data-testid={`info-row-${itemKey}`}>
            <span data-testid="info-label">{item.label}</span>
            <span data-testid="info-value">
              {typeof item.value === 'string' ? item.value : 'node'}
            </span>
          </div>
        )
      })}
    </div>
  )
}))

vi.mock('../../../../shared/NoData/NoData', () => ({
  default: ({ message }) => <div data-testid="no-data">{message}</div>
}))

vi.mock('../../../../shared/VerticalTabsLayout/VerticalTabsLayout', () => ({
  default: ({ sections, defaultSectionId }) => (
    <div data-testid="vertical-tabs-layout">
      <div data-testid="sections-list">
        {sections.map(section => {
          const Component = section.component
          return (
            <div key={section.id} data-testid={`section-${section.id}`}>
              <span>{section.label}</span>
              {Component && <Component {...(section.componentProps || {})} />}
            </div>
          )
        })}
      </div>
      <span data-testid="default-section">{defaultSectionId}</span>
    </div>
  )
}))

// ── Test data ─────────────────────────────────────────────────────────────────

const MOCK_APPLICATION = {
  description: 'Test application',
  preemption_mode: 'prevent',
  priority_class_name: 'igz-workload-medium',
  min_replicas: 1,
  max_replicas: 4,
  image: 'mlrun/mlrun',
  build: { baseImage: 'python:3.9', commands: ['pip install pandas'] },
  env: [
    { name: 'API_KEY', value: 'abc123' },
    { name: 'DB_PASS', valueFrom: { secretKeyRef: { key: 'password', name: 'db-secret' } } }
  ],
  resources: {
    requests: { memory: '1Mi', cpu: '25m' },
    limits: { memory: '20Gi', cpu: '2' }
  },
  volumes: [],
  volume_mounts: [],
  labels: { owner: 'admin' },
  spec: {
    service_account: 'my-sa',
    security_context: { runAsUser: 1000 }
  },
  config: {
    'spec.sidecars': [
      {
        readinessProbe: {
          httpGet: { path: '/health', port: 8080 },
          initialDelaySeconds: 10,
          periodSeconds: 5
        }
      }
    ]
  },
  nuclioFunc: {
    metadata: {
      labels: { 'nuclio.io/project-name': 'default' },
      annotations: { 'nuclio.io/generated_by': 'test' }
    },
    spec: {
      disable: false,
      serviceAccount: 'my-sa',
      securityContext: { runAsUser: 1000 },
      loggerSinks: [{ level: 'debug' }],
      sidecars: [
        {
          readinessProbe: {
            httpGet: { path: '/health', port: 8080 },
            initialDelaySeconds: 10,
            periodSeconds: 5
          }
        }
      ]
    }
  },
  ui: { originalContent: { spec: {} } }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const renderConfiguration = (application = MOCK_APPLICATION) =>
  render(<ApplicationConfiguration application={application} />)

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('ApplicationConfiguration', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(() => vi.restoreAllMocks())

  describe('rendering', () => {
    it('renders the VerticalTabsLayout', () => {
      renderConfiguration()
      expect(screen.getByTestId('vertical-tabs-layout')).toBeInTheDocument()
    })

    it('defaults to basic-settings section', () => {
      renderConfiguration()
      expect(screen.getByTestId('default-section')).toHaveTextContent('basic-settings')
    })

    it('renders all 8 sections', () => {
      renderConfiguration()
      expect(screen.getByTestId('section-basic-settings')).toBeInTheDocument()
      expect(screen.getByTestId('section-resources')).toBeInTheDocument()
      expect(screen.getByTestId('section-environment-variables')).toBeInTheDocument()
      expect(screen.getByTestId('section-labels')).toBeInTheDocument()
      expect(screen.getByTestId('section-annotations')).toBeInTheDocument()
      expect(screen.getByTestId('section-volumes')).toBeInTheDocument()
      expect(screen.getByTestId('section-build')).toBeInTheDocument()
      expect(screen.getByTestId('section-probes')).toBeInTheDocument()
    })
  })

  describe('Basic Settings section', () => {
    it('renders Enabled field', () => {
      renderConfiguration()
      expect(screen.getByTestId('info-row-Enabled')).toBeInTheDocument()
    })

    it('renders Description field', () => {
      renderConfiguration()
      expect(screen.getByTestId('info-row-description')).toBeInTheDocument()
    })

    it('renders Service Account field', () => {
      renderConfiguration()
      expect(screen.getByTestId('info-row-Service Account')).toBeInTheDocument()
    })
  })

  describe('Resources section', () => {
    it('renders memory and CPU fields', () => {
      renderConfiguration()
      expect(screen.getByTestId('info-row-Memory (request)')).toBeInTheDocument()
      expect(screen.getByTestId('info-row-CPU (limit)')).toBeInTheDocument()
    })

    it('renders replica fields', () => {
      renderConfiguration()
      expect(screen.getByTestId('info-row-Replicas (Min)')).toBeInTheDocument()
      expect(screen.getByTestId('info-row-Replicas (Max)')).toBeInTheDocument()
    })
  })

  describe('Environment Variables section', () => {
    it('renders the data table with env vars', () => {
      renderConfiguration()
      const tables = screen.getAllByTestId('data-table')
      expect(tables.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Volumes section', () => {
    it('renders no data when volumes are empty', () => {
      renderConfiguration()
      const noDataElements = screen.getAllByTestId('no-data')
      expect(noDataElements.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Probes section', () => {
    it('renders expandable probe rows', () => {
      renderConfiguration()
      expect(screen.getByTestId('expandable-row-Readiness')).toBeInTheDocument()
    })

    it('renders first probe expanded by default', () => {
      renderConfiguration()
      expect(screen.getByTestId('expanded-content-Readiness')).toBeInTheDocument()
    })
  })

  describe('Build section', () => {
    it('renders Image name field', () => {
      renderConfiguration()
      expect(screen.getByTestId('info-row-image-name')).toBeInTheDocument()
    })

    it('renders Base image field', () => {
      renderConfiguration()
      expect(screen.getByTestId('info-row-base-image')).toBeInTheDocument()
    })
  })
})
