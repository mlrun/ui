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
import moment from 'moment'

import { generateNuclioLink } from '../../../utils'
import { formatDatetime } from 'igz-controls/utils/datetime.util'

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

export function groupDataToBins(data, startTime, endTime) {
  const grouped = new Map()
  const endDate = new Date(endTime).setMinutes(0, 0, 0)
  const basePeriod =
    (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60) > 24 ? 'day' : 'hour'

  const roundDate = date => {
    const dateToRound = new Date(date)
    basePeriod === 'hour' ? dateToRound.setMinutes(0, 0, 0) : dateToRound.setHours(0, 0, 0, 0)

    return dateToRound
  }

  // generate bins
  for (
    const period = roundDate(startTime);
    period.getTime() <= endDate && grouped.size < 33;
    basePeriod === 'hour'
      ? period.setHours(period.getHours() + 1)
      : period.setDate(period.getDate() + 1)
  ) {
    grouped.set(period.toISOString(), 0)
  }

  data.forEach(([timestamp, value]) => {
    const date = roundDate(timestamp)
    const dateKey = date.toISOString()

    grouped.set(dateKey, grouped.get(dateKey) + value)
  })

  const getLabel = (from, to) => {
    const fromDate = moment(from)
    const toDate = moment(to || from)
    const shortFormatString = basePeriod === 'hour' ? 'HH-mm' : 'MM-DD'
    const fullFormatString = 'YY/MM/DD, hh:mm A'

    if (!to) {
      toDate.add(1, basePeriod)
    }

    return {
      label: `${fromDate.format(shortFormatString)} - ${toDate.format(shortFormatString)}`,
      fullDate: `${fromDate.format(fullFormatString)} - ${toDate.format(fullFormatString)}`
    }
  }

  const groupedData = Array.from(grouped.entries())
  const dataset = groupedData.reduce((dataset, [date, value]) => {
    const labelData = getLabel(date)
    dataset.push({
      x: labelData.label,
      y: value,
      fullDate: labelData.fullDate
    })

    return dataset
  }, [])

  if (dataset.length) {
    // update first and last label to include more specific time
    const firstLabel = getLabel(startTime, groupedData.length > 1 ? groupedData[1][0] : startTime)

    dataset[0].x = firstLabel.label
    dataset[0].fullDate = firstLabel.fullDate

    if (groupedData.length > 1) {
      const lastLabel = getLabel(endDate, endTime)

      dataset[dataset.length - 1].x = lastLabel.label
      dataset[dataset.length - 1].fullDate = lastLabel.fullDate
    }
  }

  return dataset
}
