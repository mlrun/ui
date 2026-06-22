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
import { Tooltip, TooltipContent, TooltipTrigger } from 'igz-controls/nextGenComponents'
import { formatDatetime } from 'igz-controls/utils/datetime.util'

import UrlItem from '../../../../shared/UrlItem'
import { buildGatewayEndpoint } from './applicationApiGateways.util'
import {
  API_GATEWAY_STATE_CLASS,
  API_GATEWAY_STATE_LABEL,
  FORCE_SSL_REDIRECT_ANNOTATION,
  NUCLIO_OWNER_LABEL
} from '../applicationDetails.constants'

export const apiGatewaysColumns = [
  {
    accessorKey: 'metadata.name',
    header: 'Name',
    id: 'name',
    size: 15,
    cell: ({ row }) => {
      const name = row.original.metadata?.name ?? ''
      const state = row.original.status?.state ?? ''
      const stateClass = API_GATEWAY_STATE_CLASS[state] ?? 'state-archived'
      const stateLabel = API_GATEWAY_STATE_LABEL[state] ?? state

      return (
        <div className="flex items-center gap-2">
          <span className="text-igz-primary font-medium truncate">{name}</span>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <i
                className={`${stateClass} cursor-default`}
                data-testid={`gateway-status-dot-${stateLabel.toLowerCase()}`}
              />
            </TooltipTrigger>
            <TooltipContent
              side="top"
              data-testid={`gateway-status-tooltip-${stateLabel.toLowerCase()}`}
            >
              {stateLabel}
            </TooltipContent>
          </Tooltip>
        </div>
      )
    }
  },
  {
    id: 'externalPath',
    header: 'External path',
    size: 25,
    meta: { skipEllipsisTooltip: true },
    accessorFn: row => buildGatewayEndpoint(row),
    cell: ({ row }) => {
      const endpoint = buildGatewayEndpoint(row.original)

      if (!endpoint) {
        return <span className="text-igz-secondary" />
      }

      return <UrlItem url={endpoint} allowCopy openInNewTab />
    }
  },
  {
    id: 'relationship',
    header: 'Direct/Indirect',
    size: 10,
    accessorFn: row => row.relationship ?? '',
    cell: ({ row }) => <span className="text-igz-secondary">{row.original.relationship || ''}</span>
  },
  {
    id: 'authenticationMode',
    header: 'Authentication mode (type)',
    size: 12,
    accessorFn: row => row.spec?.authenticationMode ?? '',
    cell: ({ row }) => (
      <span className="text-igz-secondary">{row.original.spec?.authenticationMode || ''}</span>
    )
  },
  {
    id: 'sslRedirect',
    header: 'SSL redirect',
    size: 8,
    accessorFn: row =>
      row.metadata?.annotations?.[FORCE_SSL_REDIRECT_ANNOTATION] === 'true' ? 'True' : 'False',
    cell: ({ row }) => (
      <span className="text-igz-secondary">
        {row.original.metadata?.annotations?.[FORCE_SSL_REDIRECT_ANNOTATION] === 'true'
          ? 'True'
          : 'False'}
      </span>
    )
  },
  {
    id: 'createdAt',
    header: 'Created at',
    size: 14,
    accessorFn: row => row.metadata?.creationTimestamp ?? '',
    cell: ({ row }) => (
      <span className="text-igz-secondary">
        {formatDatetime(row.original.metadata?.creationTimestamp, '')}
      </span>
    )
  },
  {
    id: 'port',
    header: 'Port',
    size: 6,
    accessorFn: row => row.matchedUpstream?.port ?? '',
    cell: ({ row }) => {
      return (
        <span className="text-igz-secondary">
          {parseInt(row.original.matchedUpstream?.port) || ''}
        </span>
      )
    }
  },
  {
    id: 'owner',
    header: 'Owner',
    size: 10,
    accessorFn: row => row.metadata?.labels?.[NUCLIO_OWNER_LABEL] ?? '',
    cell: ({ row }) => (
      <span className="text-igz-secondary">
        {row.original.metadata?.labels?.[NUCLIO_OWNER_LABEL] || ''}
      </span>
    )
  }
]
