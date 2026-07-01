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
import { BadgeCell } from 'igz-controls/nextGenComponents'
import { formatDatetime } from 'igz-controls/utils/datetime.util'

import { DRIFT_STATUS_LABEL, DRIFT_RESULT_NO_DATA } from './monitoringEndpoints.constants'

const parseLabelsToBadges = (labels = {}) => {
  return Object.entries(labels).map(([key, value]) => ({
    key,
    value: value === '' ? undefined : String(value)
  }))
}

export const getMonitoringEndpointsColumns = onEndpointClick => [
  {
    accessorKey: 'name',
    header: 'Name',
    id: 'name',
    size: 12,
    cell: ({ row }) => {
      const name = row.original.metadata?.name ?? ''
      const uid = row.original.metadata?.uid

      return (
        <button
          type="button"
          className="text-igz-link hover:underline cursor-pointer bg-transparent border-0 p-0 text-left text-body"
          data-testid="monitoring-endpoint-name"
          onClick={() => onEndpointClick({ uid, name })}
        >
          {name}
        </button>
      )
    }
  },
  {
    id: 'function',
    header: 'Function',
    size: 12,
    accessorFn: row => row.spec?.function_name ?? '',
    cell: ({ row }) => (
      <span data-testid="monitoring-endpoint-function">
        {row.original.spec?.function_name || ''}
      </span>
    )
  },
  {
    id: 'functionTag',
    header: 'Function tag',
    size: 8,
    accessorFn: row => row.spec?.function_tag ?? '',
    cell: ({ row }) => (
      <span data-testid="monitoring-endpoint-function-tag">
        {row.original.spec?.function_tag || ''}
      </span>
    )
  },
  {
    id: 'labels',
    header: 'Labels',
    size: 14,
    meta: { skipEllipsisTooltip: true },
    accessorFn: row => Object.keys(row.metadata?.labels ?? {}).join(','),
    cell: ({ row }) => {
      const badges = parseLabelsToBadges(row.original.metadata?.labels)
      return <BadgeCell badges={badges} data-testid="monitoring-endpoint-labels" />
    }
  },
  {
    id: 'firstInvocation',
    header: 'First invocation',
    size: 10,
    accessorFn: row => row.status?.first_request ?? '',
    cell: ({ row }) => (
      <span data-testid="monitoring-endpoint-first-invocation">
        {formatDatetime(row.original.status?.first_request, '')}
      </span>
    )
  },
  {
    id: 'lastInvocation',
    header: 'Last invocation',
    size: 10,
    accessorFn: row => row.status?.last_request ?? '',
    cell: ({ row }) => (
      <span data-testid="monitoring-endpoint-last-invocation">
        {formatDatetime(row.original.status?.last_request, '')}
      </span>
    )
  },
  {
    id: 'errorCount',
    header: 'Error count',
    size: 8,
    accessorFn: row => row.status?.error_count ?? 0,
    cell: ({ row }) => (
      <span data-testid="monitoring-endpoint-error-count">
        {row.original.status?.error_count ?? 0}
      </span>
    )
  },
  {
    id: 'driftStatus',
    header: 'Drift status',
    size: 10,
    accessorFn: row => row.status?.result_status ?? DRIFT_RESULT_NO_DATA,
    cell: ({ row }) => {
      const resultStatus = row.original.status?.result_status ?? DRIFT_RESULT_NO_DATA
      const label = DRIFT_STATUS_LABEL[resultStatus] ?? 'N/A'

      return <span data-testid="monitoring-endpoint-drift-status">{label}</span>
    }
  }
]
