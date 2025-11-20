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
import { capitalize, set } from 'lodash'

import { mainHttpClient } from '../httpClient'
import { GROUP_BY_WORKFLOW, FILTER_ALL_ITEMS, COMPLETED_STATE } from '../constants'

const generateQueryParams = (project, filter) => {
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
  const stateFilter = Array.isArray(filter.state) ? filter.state : [filter.state]

  if (project !== '*') {
    queryParams.predicates.push({
      key: 'name',
      op: 9,
      string_value: project
    })
  }

  if (filter.name) {
    queryParams.predicates.push({
      key: 'name',
      op: 9,
      string_value: filter.name
    })
  }

  if (!filter.state.includes(FILTER_ALL_ITEMS)) {
    queryParams.predicates.push({
      key: 'status',
      op: 8,
      string_values: {
        values: stateFilter.map(state =>
          state === COMPLETED_STATE ? 'Succeeded' : capitalize(state)
        )
      }
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

  return JSON.stringify(queryParams)
}

const workflowsApi = {
  getWorkflow: (project, workflowId) => {
    return mainHttpClient.get(`/projects/${project}/pipelines/${workflowId}`)
  },
  getWorkflows: (project, filter, config = {}, page_token) => {
    let newConfig = {}

    if (page_token) {
      newConfig.params = { page_token }
    } else {
      newConfig = {
        ...config
      }

      if (filter?.groupBy === GROUP_BY_WORKFLOW) {
        set(newConfig, ['params', 'filter'], generateQueryParams(project, filter))
      }

      if (filter?.name) {
        set(newConfig, ['params', 'name-contains'], filter.name)
      }

      set(newConfig, ['params', 'sort_by'], 'created_at desc')
    }

    return mainHttpClient.get(`/projects/${project}/pipelines`, newConfig)
  },
  rerunWorkflow: (project, workflowId) => {
    return mainHttpClient.post(`projects/${project}/pipelines/${workflowId}/retry`)
  },
  terminateWorkflow: (project, workflowId) => {
    return mainHttpClient.post(`/projects/${project}/pipelines/${workflowId}/terminate`)
  }
}

export default workflowsApi
