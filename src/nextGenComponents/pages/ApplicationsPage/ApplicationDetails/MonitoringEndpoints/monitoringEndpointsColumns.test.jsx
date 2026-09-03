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
import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import PropTypes from 'prop-types'

import { getMonitoringEndpointsColumns } from './monitoringEndpointsColumns'
import {
  DRIFT_RESULT_DRIFT_DETECTED,
  DRIFT_RESULT_NO_DATA,
  DRIFT_RESULT_NO_DRIFT,
  DRIFT_RESULT_POSSIBLE_DRIFT,
  DRIFT_STATUS_LABEL
} from './monitoringEndpoints.constants'

// ── Mocks ─────────────────────────────────────────────────────────────────────

function MockTooltip({ children }) {
  return <>{children}</>
}

MockTooltip.propTypes = {
  children: PropTypes.node.isRequired
}

function MockTooltipTrigger({ children }) {
  return <>{children}</>
}

MockTooltipTrigger.propTypes = {
  children: PropTypes.node.isRequired
}

function MockTooltipContent({ children }) {
  return <div data-testid="tooltip-content">{children}</div>
}

MockTooltipContent.propTypes = {
  children: PropTypes.node.isRequired
}

vi.mock('igz-controls/nextGenComponents', () => ({
  BadgeCell: () => <div data-testid="badge-cell" />,
  Tooltip: MockTooltip,
  TooltipTrigger: MockTooltipTrigger,
  TooltipContent: MockTooltipContent
}))

vi.mock('igz-controls/utils/datetime.util', () => ({
  formatDatetime: vi.fn(() => 'formatted-date')
}))

vi.mock('igz-controls/images/severity-ok.svg?react', () => ({
  default: () => <svg />
}))

vi.mock('igz-controls/images/severity-low.svg?react', () => ({
  default: () => <svg />
}))

vi.mock('igz-controls/images/severity-error.svg?react', () => ({
  default: () => <svg />
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

const getDriftStatusColumn = () => {
  const columns = getMonitoringEndpointsColumns(vi.fn())
  return columns.find(col => col.id === 'driftStatus')
}

const renderDriftStatusCell = (status = {}) => {
  const driftColumn = getDriftStatusColumn()
  const row = { original: { status } }

  return render(driftColumn.cell({ row }))
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('monitoringEndpointsColumns drift status cell', () => {
  it('renders N/A text when result_status is missing', () => {
    renderDriftStatusCell()

    expect(screen.getByTestId('monitoring-endpoint-drift-status')).toHaveTextContent('N/A')
    expect(screen.queryByTestId('tooltip-content')).not.toBeInTheDocument()
  })

  it('renders N/A text when result_status is DRIFT_RESULT_NO_DATA', () => {
    renderDriftStatusCell({ result_status: DRIFT_RESULT_NO_DATA })

    expect(screen.getByTestId('monitoring-endpoint-drift-status')).toHaveTextContent('N/A')
    expect(screen.queryByTestId('tooltip-content')).not.toBeInTheDocument()
  })

  it('renders N/A text for an unknown result_status', () => {
    renderDriftStatusCell({ result_status: 99 })

    expect(screen.getByTestId('monitoring-endpoint-drift-status')).toHaveTextContent('N/A')
    expect(screen.queryByTestId('tooltip-content')).not.toBeInTheDocument()
  })

  it('renders no-drift icon with tooltip', () => {
    renderDriftStatusCell({ result_status: DRIFT_RESULT_NO_DRIFT })

    const statusCell = screen.getByTestId('monitoring-endpoint-drift-status-no-drift')
    expect(statusCell).toHaveAttribute('aria-label', DRIFT_STATUS_LABEL[DRIFT_RESULT_NO_DRIFT])
    expect(statusCell).toHaveAttribute('role', 'img')
    expect(statusCell.querySelector('svg')).toBeInTheDocument()
    expect(screen.getByTestId('tooltip-content')).toHaveTextContent(
      DRIFT_STATUS_LABEL[DRIFT_RESULT_NO_DRIFT]
    )
  })

  it('renders possible-drift icon with warning class and tooltip', () => {
    renderDriftStatusCell({ result_status: DRIFT_RESULT_POSSIBLE_DRIFT })

    const statusCell = screen.getByTestId('monitoring-endpoint-drift-status-possible-drift')
    expect(statusCell).toHaveClass('table-severity-warning-icon')
    expect(statusCell).toHaveAttribute(
      'aria-label',
      DRIFT_STATUS_LABEL[DRIFT_RESULT_POSSIBLE_DRIFT]
    )
    expect(statusCell.querySelector('svg')).toBeInTheDocument()
    expect(screen.getByTestId('tooltip-content')).toHaveTextContent(
      DRIFT_STATUS_LABEL[DRIFT_RESULT_POSSIBLE_DRIFT]
    )
  })

  it('renders drift-detected icon with tooltip', () => {
    renderDriftStatusCell({ result_status: DRIFT_RESULT_DRIFT_DETECTED })

    const statusCell = screen.getByTestId('monitoring-endpoint-drift-status-drift-detected')
    expect(statusCell).not.toHaveClass('table-severity-warning-icon')
    expect(statusCell).toHaveAttribute(
      'aria-label',
      DRIFT_STATUS_LABEL[DRIFT_RESULT_DRIFT_DETECTED]
    )
    expect(statusCell.querySelector('svg')).toBeInTheDocument()
    expect(screen.getByTestId('tooltip-content')).toHaveTextContent(
      DRIFT_STATUS_LABEL[DRIFT_RESULT_DRIFT_DETECTED]
    )
  })

  it('uses result_status for sorting via accessorFn', () => {
    const driftColumn = getDriftStatusColumn()

    expect(driftColumn.accessorFn({ status: { result_status: DRIFT_RESULT_NO_DRIFT } })).toBe(
      DRIFT_RESULT_NO_DRIFT
    )
    expect(driftColumn.accessorFn({ status: {} })).toBe(DRIFT_RESULT_NO_DATA)
  })
})
