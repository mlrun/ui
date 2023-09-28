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

import { mainHttpClient } from '../httpClient'
import { GROUP_BY_WORKFLOW, STATE_FILTER_ALL_ITEMS } from '../constants'

const generateQueryParams = filter => {
  // Generating encoded JSON query string to send as a value to the filter query param
  // each "predicates" item is a single filter
  // key - type of filter (filter by name, by status, by dates)
  // op === 1 - means that the filtered response should be equal to the "string_value"
  // op === 5 - means that the filtered response should be equal or to be greater to the "timestamp_value"
  // op === 7 - means that the filtered response should be equal or to be less to the "timestamp_value"
  // op === 9 - checks if the value contains |string_value| as a substring match
  const queryParams = {
    predicates: []
  }

  if (filter.name) {
    queryParams.predicates.push({
      key: 'name',
      op: 9,
      string_value: filter.name
    })
  }

  if (filter.state !== STATE_FILTER_ALL_ITEMS) {
    queryParams.predicates.push({
      key: 'status',
      op: 1,
      string_value: filter.state === 'completed' ? 'Succeeded' : capitalize(filter.state)
    })
  }

  if (filter.dates) {
    if (filter.dates.value[0]) {
      queryParams.predicates.push({
        key: 'created_at',
        op: 5,
        timestamp_value: filter.dates.value[0].toISOString()
      })
    }

    if (filter.dates.value[1] && !filter.dates.isPredefined) {
      queryParams.predicates.push({
        key: 'created_at',
        op: 7,
        timestamp_value: filter.dates.value[1].toISOString()
      })
    }
  }

  return `&filter=${encodeURI(JSON.stringify(queryParams))}`
}

const workflowsApi = {
  getWorkflow: (project, workflowId) => {
    return mainHttpClient.get(`/projects/${project}/pipelines/${workflowId}`)
  },
  getWorkflows: (project, filter) => {
    let queryParams = '?sort_by=created_at desc'

    if (filter?.groupBy === GROUP_BY_WORKFLOW) {
      queryParams = generateQueryParams(filter)
    }

    return mainHttpClient.get(`/projects/${project}/pipelines` + queryParams)
  }
}

export default workflowsApi
