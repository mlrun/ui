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
import { capitalize } from 'lodash'
import classnames from 'classnames'

import { formatDatetime, generateNuclioLink } from '../../../utils'

export const generateOperatingFunctionsTable = functions => {
  const tableHeaders = [
    {
      value: 'Name',
      className: 'table-cell_big'
    },
    { value: 'Status', className: 'table-cell_small' },
    {
      value: 'Started at',
      className: 'table-cell_medium'
    },
    {
      value: 'Lag',
      className: 'table-cell_small',
      tip: "Number of messages currently waiting in the app's queue"
    },
    {
      value: 'Commited offset',
      className: 'table-cell_small',
      tip: 'Total number of messages handled by the app'
    }
  ]

  const tableBody = functions.map(func => {
    return {
      name: {
        value: capitalize(func.name),
        link: generateNuclioLink(`/projects/${func.nuclio_function_uri}`),
        className: 'table-cell_big'
      },
      status: {
        value: func.status,
        className: classnames('table-cell_small', 'status', `state-${func.status}`)
      },
      startedAt: {
        value: formatDatetime(func.started_at, 'N/A'),
        className: 'table-cell_medium'
      },
      lag: {
        value: func.stats.lag,
        className: 'table-cell_small'
      },
      commitedOffset: {
        value: func.stats.committed_offset,
        className: 'table-cell_small'
      }
    }
  })

  return {
    header: tableHeaders,
    body: tableBody
  }
}
