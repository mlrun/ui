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
  const queryParams = {
    predicates: []
  }

  if (filter.name) {
    queryParams.predicates.push({
      key: 'name',
      op: 1,
      string_value: filter.name
    })
  }

  if (filter.state !== STATE_FILTER_ALL_ITEMS) {
    queryParams.predicates.push({
      key: 'status',
      op: 1,
      string_value:
        filter.state === 'completed' ? 'Succeeded' : capitalize(filter.state)
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

  return `?filter=${encodeURI(JSON.stringify(queryParams))}`
}

export default {
  getWorkflow: workflowId => {
    return mainHttpClient.get(`/pipelines/${workflowId}`)
  },
  getWorkflows: (project, filter) => {
    let queryParams = ''

    if (filter?.groupBy === GROUP_BY_WORKFLOW) {
      queryParams = generateQueryParams(filter)
    }

    return mainHttpClient.get(`/projects/${project}/pipelines` + queryParams)
  }
}
