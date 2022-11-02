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
import { mainHttpClient } from '../httpClient'
import { SHOW_ITERATIONS, TAG_FILTER_ALL_ITEMS, TAG_FILTER_LATEST } from '../constants'

const fetchArtifacts = (project, filters, config = {}, withLatestTag) => {
  const params = {}

  if (filters?.labels) {
    params.label = filters.labels?.split(',')
  }

  if (filters?.iter === SHOW_ITERATIONS) {
    params['best-iteration'] = true
  }

  if (filters?.tag && (withLatestTag || filters.tag !== TAG_FILTER_LATEST)) {
    params.tag = filters.tag === TAG_FILTER_ALL_ITEMS ? '*' : filters.tag
  }

  if (filters?.name) {
    params.name = `~${filters.name}`
  }

  return mainHttpClient.get(`/projects/${project}/artifacts`, {
    ...config,
    params: { ...config.params, ...params }
  })
}

const artifactsApi = {
  buildFunction: data => mainHttpClient.post('/build/function', data),
  getArtifactPreview: (path, user, fileFormat) => {
    const config = {
      params: { path }
    }

    if (user) {
      config.params.user = user
    }

    if (['png', 'jpg', 'jpeg'].includes(fileFormat)) {
      config.responseType = 'blob'
    }

    return mainHttpClient.get('/files', config)
  },
  getArtifactTag: project => mainHttpClient.get(`/projects/${project}/artifact-tags`),
  getArtifact: (project, artifact) => {
    return mainHttpClient.get(`/projects/${project}/artifacts?name=${artifact}`)
  },
  getArtifacts: (project, filters) => {
    return fetchArtifacts(project, filters)
  },
  getDataSet: (project, dataSet, tag, iter) => {
    return fetchArtifacts(
      project,
      {},
      {
        params: {
          category: 'dataset',
          name: dataSet,
          tag: tag === TAG_FILTER_ALL_ITEMS ? '*' : tag,
          'best-iteration': Boolean(iter)
        }
      }
    )
  },
  getDataSets: (project, filters, config) => {
    return fetchArtifacts(project, filters, { ...config, params: { category: 'dataset' } }, true)
  },
  getFile: (project, file, tag, iter) => {
    return fetchArtifacts(
      project,
      {},
      {
        params: {
          category: 'other',
          name: file,
          tag: tag === TAG_FILTER_ALL_ITEMS ? '*' : tag,
          'best-iteration': Boolean(iter)
        }
      }
    )
  },
  getFiles: (project, filters) => {
    return fetchArtifacts(project, filters, { params: { category: 'other', format: 'full' } }, true)
  },
  getModel: (project, model, tag, iter) => {
    return fetchArtifacts(
      project,
      {},
      {
        params: {
          category: 'model',
          name: model,
          tag: tag === TAG_FILTER_ALL_ITEMS ? '*' : tag,
          'best-iteration': Boolean(iter)
        }
      }
    )
  },
  getModelEndpoints: (project, filters, params = {}) => {
    if (filters?.labels) {
      params.label = filters.labels?.split(',')
    }

    return mainHttpClient.get(`/projects/${project}/model-endpoints`, {
      params
    })
  },
  getModels: (project, filters) => {
    return fetchArtifacts(project, filters, { params: { category: 'model', format: 'full' } }, true)
  },
  registerArtifact: (project, data) =>
    mainHttpClient.post(`/projects/${project}/artifacts/${data.uid}/${data.key}`, data),
  updateArtifact: (project, data) =>
    mainHttpClient.post(
      `/projects/${project}/artifacts/${data.uid || data.metadata?.tree}/${
        data.db_key || data.spec?.db_key
      }`,
      data
    )
}

export default artifactsApi
