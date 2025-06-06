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
import { roundFloats } from 'igz-controls/utils/common.util'

export const generateDriftAnalysis = measures => {
  measures ??= {}
  const tableHeaders = [
    { value: 'Metric', className: 'drift-analysis__table-cell_big' },
    { value: 'TVD', className: 'drift-analysis__table-cell_medium' },
    { value: 'Hellinger', className: 'drift-analysis__table-cell_medium' },
    { value: 'KLD', className: 'drift-analysis__table-cell_medium' }
  ]

  const tableBody = [
    [
      {
        value: 'Sum',
        className: 'drift-analysis__table-cell_big'
      },
      {
        value: roundFloats(measures.tvd_sum, 2) ?? '-',
        className: 'drift-analysis__table-cell_medium'
      },
      {
        value: roundFloats(measures.hellinger_sum, 2) ?? '-',
        className: 'drift-analysis__table-cell_medium'
      },
      {
        value: roundFloats(measures.kld_sum, 2) ?? '-',
        className: 'drift-analysis__table-cell_medium'
      }
    ],
    [
      {
        value: 'Mean',
        className: 'drift-analysis__table-cell_big'
      },
      {
        value: roundFloats(measures.tvd_mean, 2) ?? '-',
        className: 'drift-analysis__table-cell_medium'
      },
      {
        value: roundFloats(measures.hellinger_mean, 2) ?? '-',
        className: 'drift-analysis__table-cell_medium'
      },
      {
        value: roundFloats(measures.kld_mean, 2) ?? '-',
        className: 'drift-analysis__table-cell_medium'
      }
    ]
  ]

  return {
    header: tableHeaders,
    body: tableBody
  }
}
