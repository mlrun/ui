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
import { Link } from 'react-router-dom'
import { Tooltip, TooltipContent, TooltipTrigger } from 'igz-controls/nextGenComponents'
import { formatDatetime } from 'igz-controls/utils/datetime.util'

import UrlCell, { buildUrlItems } from '../../shared/UrlCell'
import { APPLICATIONS_PAGE_PATH } from '../../../constants'
import {
  APPLICATION_DETAILS_TAB,
  DEFAULT_APPLICATION_DETAILS_TAB
} from './ApplicationDetails/applicationDetails.constants'
import { UNKNOWN_STATE_LABEL, UNKNOWN_STATE_CLASS } from './applications.constants'

export const getApplicationsColumns = projectName => [
  {
    accessorKey: 'name',
    header: 'Name',
    id: 'name',
    size: 15,
    cell: ({ row }) => {
      const state = row.original.state ?? {}
      const stateLabel = state.label ?? state.value ?? UNKNOWN_STATE_LABEL
      const tag = row.original.tag || ''
      const hash = row.original.hash || ''
      const identifier = tag ? `:${tag}@${hash}` : `@${hash}`

      return (
        <div className="flex items-center gap-2">
          <Link
            to={`/projects/${projectName}/${APPLICATIONS_PAGE_PATH}/${row.original.name}/${identifier}/${DEFAULT_APPLICATION_DETAILS_TAB}`}
            className="text-igz-primary text-body font-medium hover:underline"
            data-testid="application-name-link"
          >
            {row.original.name}
          </Link>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <i
                className={`${state.className ?? UNKNOWN_STATE_CLASS} cursor-default`}
                role="img"
                aria-label={`Status: ${stateLabel}`}
                data-testid={`application-status-dot-${stateLabel.toLowerCase()}`}
              />
            </TooltipTrigger>
            <TooltipContent
              side="top"
              data-testid={`application-status-tooltip-${stateLabel.toLowerCase()}`}
            >
              {stateLabel}
            </TooltipContent>
          </Tooltip>
        </div>
      )
    }
  },
  {
    id: 'urls',
    header: 'URLs',
    size: 58,
    meta: { skipEllipsisTooltip: true },
    accessorFn: row => [...(row.directUrls ?? []), ...(row.indirectUrls ?? [])],
    cell: ({ row }) => {
      const gatewayUrls = [...(row.original.directUrls ?? []), ...(row.original.indirectUrls ?? [])]

      return <UrlCell items={buildUrlItems(gatewayUrls)} />
    }
  },
  {
    id: 'endpoints',
    header: 'Endpoints',
    size: 10,
    accessorFn: row => row.endpointsCount ?? 0,
    cell: ({ row }) => {
      const count = row.original.endpointsCount ?? 0
      const tag = row.original.tag || ''
      const hash = row.original.hash || ''
      const identifier = tag ? `:${tag}@${hash}` : `@${hash}`

      return (
        <Link
          to={`/projects/${projectName}/${APPLICATIONS_PAGE_PATH}/${row.original.name}/${identifier}/${APPLICATION_DETAILS_TAB.MONITORING_ENDPOINTS}`}
          className="!text-igz-link text-body hover:underline"
          data-testid="endpoints-count"
        >
          {count}
        </Link>
      )
    }
  },
  {
    accessorKey: 'updated',
    id: 'updated',
    size: 15,
    header: 'Updated',
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-igz-secondary text-body" data-testid="updated-cell">
        {formatDatetime(row.original.updated, '')}
      </span>
    )
  },
  {
    id: 'owner',
    header: 'Owner',
    size: 12,
    accessorFn: row => row.owner ?? '',
    cell: ({ row }) => (
      <span className="text-igz-secondary text-body" data-testid="owner-cell">
        {row.original.owner || ''}
      </span>
    )
  }
]
