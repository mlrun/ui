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
import classnames from 'classnames'

import { parseChipsData } from '../../utils/convertChipsData'
import {
  datePickerPastMonthOptions,
  getDatePickerFilterValue,
  PAST_24_HOUR_DATE_OPTION,
  TIME_FRAME_LIMITS
} from '../../utils/datePicker.util'

import {DATES_FILTER, FILES_PAGE, FILES_TAB, FULL_VIEW_MODE, MONITORING_APP_PAGE} from '../../constants'

export const getFiltersConfig = () => ({
  [DATES_FILTER]: {
    customOptions: datePickerPastMonthOptions,
    label: 'Time range:',
    timeFrameLimit: TIME_FRAME_LIMITS.MONTH,
    initialValue: getDatePickerFilterValue(
      datePickerPastMonthOptions,
      PAST_24_HOUR_DATE_OPTION,
      true
    )
  }
})

export const generateOperatingFunctionsTable = data => {
  const tableHeaders = [
    {
      value: 'Name',
      className: 'table-cell_big'
    },
    { value: 'Labels', className: 'table-cell_medium' },
    { value: 'Status', className: 'table-cell_small' },
    { value: 'Started at', className: 'table-cell_medium' },
    { value: 'Duration', className: 'table-cell_small' }
  ]

  const tableBody = data.map(func => {
    return {
      name: {
        value: func.name,
        className: 'table-cell_big'
      },
      labels: {
        value: parseChipsData(func.labels),
        className: 'table-cell_medium'
      },
      status: {
        value: func.state,
        className: classnames('table-cell_small', 'status', `state-${func.state}`)
      },
      startedAt: {
        value: func.startedAt,
        className: 'table-cell_medium'
      },
      duration: {
        value: func.duration,
        className: 'table-cell_small'
      }
    }
  })

  return {
    header: tableHeaders,
    body: tableBody
  }
}

// export const generateApplicationsTableData = data => {
//   const tableHeaders = [
//     {
//       value: 'Name',
//       className: 'table-cell_big'
//     },
//     { value: 'Invocations', className: 'table-cell_small' },
//     { value: 'Alerts', className: 'table-cell_small' },
//     { value: 'Detections', className: 'table-cell_small' },
//     { value: 'Possible detections', className: 'table-cell_small' },
//     { value: 'Class', className: 'table-cell_medium' },
//     { value: 'Started at', className: 'table-cell_medium' },
//     { value: 'Updated', className: 'table-cell_medium' },
//     { value: 'Duration', className: 'table-cell_medium' },
//     { value: 'Nuclio function', className: 'table-cell_medium' }
//   ]
//
//   const tableBody = data.map(func => {
//     return {
//       name: {
//         value: func.name,
//         className: 'table-cell_big'
//       },
//       invocations: {
//         value: func.invocations,
//         className: 'table-cell_small'
//       },
//       alerts: {
//         value: func.alerts,
//         className: 'table-cell_small'
//       },
//       detections: {
//         value: func.detections,
//         className: 'table-cell_small'
//       },
//       possibleDetections: {
//         value: func.possibleDetections,
//         className: 'table-cell_small'
//       },
//       class: {
//         value: func.class,
//         className: 'table-cell_medium'
//       },
//       startedAt: {
//         value: func.startedAt,
//         className: 'table-cell_medium'
//       },
//       updated: {
//         value: func.updated,
//         className: 'table-cell_medium'
//       },
//       duration: {
//         value: func.duration,
//         className: 'table-cell_medium'
//       },
//       nuclioFunction: {
//         value: func.nuclioFunction,
//         className: 'table-cell_medium',
//         status: func.state
//       }
//     }
//   })
//
//   return {
//     header: tableHeaders,
//     body: tableBody
//   }
// }
