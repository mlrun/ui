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
import prettyBytes from 'pretty-bytes'
import { isNumber } from 'lodash'

import { METRIC_TYPE, RESULT_TYPE } from '../../../../constants'
import { formatDatetime } from 'igz-controls/utils/datetime.util'
import { getDriftStatusData } from '../../../../utils/createArtifactsContent'
import { parseChipsData } from '../../../../utils/convertChipsData'

export const generateArtifactsTableContent = (artifacts = []) => {
  const tableHeaders = [
    {
      value: 'Name',
      className: 'table-cell_big'
    },
    { value: 'Type', className: 'table-cell_small' },
    { value: 'Labels', className: 'table-cell_big' },
    { value: 'Producer', className: 'table-cell_small' },
    { value: 'Owner', className: 'table-cell_small' },
    { value: 'Updated', className: 'table-cell_medium' },
    { value: 'Size', className: 'table-cell_small' }
  ]

  const tableBody = artifacts.map(artifact => {
    return {
      name: {
        value: artifact.db_key,
        tag: artifact.tag,
        className: 'table-cell_big table-cell_with-tag'
      },
      artifactType: {
        value: artifact.kind || 'artifact',
        className: 'table-cell_small'
      },
      labels: {
        value: parseChipsData(artifact.labels),
        className: 'table-cell_big'
      },
      producer: {
        value: artifact.producer.name,
        className: 'table-cell_small'
      },
      owner: {
        value: artifact.producer.owner,
        className: 'table-cell_small'
      },
      updated: {
        value: formatDatetime(artifact.updated, 'N/A'),
        className: 'table-cell_medium'
      },
      size: {
        value: isNumber(artifact.size) && artifact.size >= 0 ? prettyBytes(artifact.size) : 'N/A',
        className: 'table-cell_small'
      }
    }
  })

  return {
    header: tableHeaders,
    body: tableBody
  }
}

export const generateResultsTableContent = (metrics = []) => {
  let timeColumnIsHidden = false
  const tableBody = metrics
    .filter(metric => metric.type === RESULT_TYPE)
    .map(result => {
      const driftStatusData = getDriftStatusData(result.status)
      timeColumnIsHidden = !result.time

      return {
        name: {
          value: result.result_name,
          className: 'table-cell_medium'
        },
        kind: {
          value: result.kind,
          className: 'table-cell_medium'
        },
        value: {
          value: result.value,
          className: 'table-cell_medium'
        },
        time: {
          hidden: timeColumnIsHidden,
          value:  formatDatetime(result.time, 'N/A'),
          className: 'table-cell_medium'
        },
        status: {
          value: driftStatusData.value,
          className: 'table-cell_small',
          tooltip: driftStatusData.tooltip
        }
      }
    })
  const tableHeaders = [
    {
      value: 'Name',
      className: 'table-cell_medium'
    },
    { value: 'Kind', className: 'table-cell_medium' },
    { value: 'Value (latest)', className: 'table-cell_medium' },
    { value: 'Time (latest result)', className: 'table-cell_medium', hidden: timeColumnIsHidden },
    { value: 'Status', className: 'table-cell_small' }
  ]

  return {
    header: tableHeaders,
    body: tableBody
  }
}

export const generateMetricsTableContent = (metrics = []) => {
  let timeColumnIsHidden = false
  const tableBody = metrics
    .filter(metric => metric.type === METRIC_TYPE)
    .map(metric => {
      timeColumnIsHidden = !metric.time

      return {
        name: {
          value: metric.metric_name,
          className: 'table-cell_medium'
        },
        value: {
          value: metric.value,
          className: 'table-cell_medium'
        },
        time: {
          hidden: timeColumnIsHidden,
          value: formatDatetime(metric.time, 'N/A'),
          className: 'table-cell_medium'
        }
      }
    })
  const tableHeaders = [
    {
      value: 'Name',
      className: 'table-cell_medium'
    },
    { value: 'Value (latest)', className: 'table-cell_medium' },
    { value: 'Time (latest metric)', className: 'table-cell_medium', hidden: timeColumnIsHidden}
  ]

  return {
    header: tableHeaders,
    body: tableBody
  }
}

export const generateShardsStatusTableContent = (shards = {}) => {
  const tableHeaders = [
    {
      value: 'Name',
      className: 'table-cell_medium'
    },
    {
      value: 'Lag',
      tip: "Number of messages currently waiting in the app's queue",
      className: 'table-cell_medium'
    },
    {
      value: 'Commited offset',
      tip: 'Total number of messages handled by the app',
      className: 'table-cell_medium'
    }
  ]

  const tableBody = Object.entries(shards).map(([name, data]) => {
    return {
      name: {
        value: name,
        className: 'table-cell_medium'
      },
      lag: {
        value: data.lag,
        className: 'table-cell_medium'
      },
      commitedOffset: {
        value: data.committed,
        className: 'table-cell_medium'
      }
    }
  })

  return {
    header: tableHeaders,
    body: tableBody
  }
}
