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
import moment from 'moment'

import { generateNuclioLink } from '../../../utils'
import { formatDatetime } from 'igz-controls/utils/datetime.util'

export const generateOperatingFunctionsTable = (functions, projectName) => {
  const tableHeaders = [
    {
      value: 'Name',
      className: 'table-cell_big'
    },
    { value: 'Status', className: 'table-cell_small' },
    {
      value: 'Updated',
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
    const nuclioFunctionName = `${projectName}-${func.name.toLowerCase()}`.slice(0, 63)

    return {
      name: {
        value: func.name,
        href: generateNuclioLink(`/projects/${projectName}/functions/${nuclioFunctionName}`),
        className: 'table-cell_big'
      },
      status: {
        value: func.status,
        className: classnames('table-cell_small', 'status', `state-${func.status}`)
      },
      updatedTime: {
        value: formatDatetime(func.updated_time, 'N/A'),
        className: 'table-cell_medium'
      },
      lag: {
        value: func.stats.stream_stats.lag,
        className: 'table-cell_small'
      },
      commitedOffset: {
        value: func.stats.stream_stats.committed,
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
  const allowedDeviation = 1000
  const DAY = 'day'
  const HOUR = 'hour'
  const MINUTES = 'minutes' // "minutes" represents 10 minutes
  const timeDiffInHours = (new Date(endTime) - new Date(startTime) - allowedDeviation) / (1000 * 60 * 60)
  const basePeriod = timeDiffInHours > 72 ? DAY : timeDiffInHours > 6 ? HOUR : MINUTES

  const roundDate = date => {
    const dateToRound = new Date(date)

    if (basePeriod === HOUR) {
      dateToRound.setMinutes(0, 0, 0)
    } else if (basePeriod === MINUTES) {
      const mins = dateToRound.getMinutes()
      const roundedMins = Math.floor(mins / 10) * 10
      dateToRound.setMinutes(roundedMins, 0, 0)
    } else {
      dateToRound.setHours(0, 0, 0, 0)
    }

    return dateToRound
  }

  const incrementPeriod = period => {
    if (basePeriod === HOUR) {
      period.setHours(period.getHours() + 1)
    } else if (basePeriod === MINUTES) {
      period.setMinutes(period.getMinutes() + 10)
    } else {
      period.setDate(period.getDate() + 1)
    }

    return period
  }
  // generate bins
  for (const period = roundDate(startTime); period.getTime() <= endTime; incrementPeriod(period)) {
    grouped.set(period.toISOString(), 0)
  }

  data.forEach(([timestamp, value]) => {
    const timestampDate = new Date(timestamp)

    // ignore potential data beyond selected time range
    if (timestampDate >= startTime && timestampDate <= endTime) {
      const date = roundDate(timestamp)
      const dateKey = date.toISOString()

      grouped.set(dateKey, grouped.get(dateKey) + value)
    }
  })

  const getLabel = (from, to) => {
    const fromDate = moment(from)
    const toDate = moment(to || from)
    const shortFormatString =
      basePeriod === MINUTES ? 'hh:mm A' : basePeriod === HOUR ? 'MM/DD, hh:mm A' : 'MM/DD/YY'
    const fullFormatString = 'MM/DD/YY, hh:mm A'

    if (!to) {
      toDate.add(basePeriod === MINUTES ? 10 : 1, basePeriod)
    }

    return {
      label: `${fromDate.format(shortFormatString)}`,
      fullDate: `${fromDate.format(fullFormatString)} - ${toDate.format(fullFormatString)}`
    }
  }

  const groupedData = Array.from(grouped.entries())
  const dataset = groupedData.reduce(
    (dataset, [date, value], index) => {
      if (index === 0) {
        // cut the first bin if it is not full
        if (startTime > new Date(date)) return dataset
      }

      const labelData = getLabel(date)

      dataset.values.push(value)
      dataset.labels.push(labelData.label)
      dataset.dates.push(labelData.fullDate)

      return dataset
    },
    { values: [], labels: [], dates: [] }
  )

  // cut the last bin if it is not full
  if (dataset.values.length && endTime > new Date(groupedData[groupedData.length - 1][0])) {
    dataset.values.pop()
    dataset.labels.pop()
    dataset.dates.pop()
  }

  return dataset
}
