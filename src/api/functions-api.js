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
import { functionTemplatesHttpClient, mainHttpClient, mainHttpClientV2 } from '../httpClient'
import { DATES_FILTER, NAME_FILTER, SHOW_UNTAGGED_FILTER } from '../constants'

const functionsApi = {
  createNewFunction: (project, data) =>
    mainHttpClient.post(`/projects/${project}/functions/${data.metadata.name}`, data, {
      params: {
        tag: data.metadata.tag,
        versioned: true
      }
    }),
  deleteSelectedFunction: (funcName, project) =>
    mainHttpClientV2.delete(`/projects/${project}/functions/${funcName}`),
  deployFunction: data => mainHttpClient.post('/build/function', data),
  getFunctions: (project, filters, config = {}, hash) => {
    const newConfig = {
      ...config,
      params: {
        ...config.params
      }
    }
    const dateFilterValue = filters?.[DATES_FILTER]?.value || {}

    if (filters?.[NAME_FILTER]) {
      newConfig.params.name = `~${filters[NAME_FILTER]}`
    }

    if (dateFilterValue[0]) {
      newConfig.params.since = dateFilterValue[0]
    }

    if (dateFilterValue[1] && !filters?.[DATES_FILTER]?.isPredefined) {
      newConfig.params.until = dateFilterValue[1]
    }

    if (!newConfig.params.tag && !filters?.[SHOW_UNTAGGED_FILTER]) {
      newConfig.params.tag = '*'
    }

    if (hash) {
      newConfig.params.hash_key = hash
    }

    return mainHttpClient.get(`/projects/${project}/functions`, newConfig)
  },
  getFunction: (project, functionName, hash, tag) => {
    const params = {}

    if (hash) {
      params.hash_key = hash
    }

    if (tag) {
      params.tag = tag
    }

    return mainHttpClient.get(`/projects/${project}/functions/${functionName}`, { params })
  },
  getFunctionLogs: (project, name, tag, offset) => {
    const params = {
      project,
      name,
      tag,
      logs: true
    }

    if (offset > 0) {
      params.offset = offset
    }

    return mainHttpClient.get('/build/status', { params })
  },
  getHubFunction: hubFunctionName =>
    mainHttpClient.get(`/hub/sources/default/items/${hubFunctionName}`),
  getHubFunctions: () => mainHttpClient.get('/hub/sources/default/items'),
  getFunctionTemplate: path => {
    if (path.startsWith('http')) {
      return mainHttpClient.get('/hub/sources/default/item-object', {
        params: { url: path }
      })
    } else {
      return functionTemplatesHttpClient.get(path)
    }
  },
  getFunctionTemplatesCatalog: () => functionTemplatesHttpClient.get('catalog.json')
}

export default functionsApi
