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
import { mainHttpClient, mainHttpClientV2 } from '../httpClient'
import {
  ARTIFACT_OTHER_TYPE,
  DATASET_TYPE,
  MODEL_TYPE,
  SHOW_ITERATIONS,
  TAG_FILTER_ALL_ITEMS
} from '../constants'

const fetchArtifacts = (project, filters, config = {}) => {
  const params = {}

  if (filters?.labels) {
    params.label = filters.labels?.split(',')
  }

  if (filters?.iter === SHOW_ITERATIONS) {
    params['best-iteration'] = true
  }

  if (filters?.name) {
    params.name = `~${filters.name}`
  }

  return mainHttpClientV2.get(`/projects/${project}/artifacts`, {
    ...config,
    params: { ...config.params, ...params }
  })
}

const artifactsApi = {
  addTag: (project, tag, data) => mainHttpClient.put(`/projects/${project}/tags/${tag}`, data),
  buildFunction: data => mainHttpClient.post('/build/function', data),
  deleteArtifact: (project, key, tag, uid) => {
    const config = {
      params: {
        key,
        tag
      }
    }

    return mainHttpClient.delete(`/projects/${project}/artifacts/${uid}`, config)
  },
  deleteTag: (project, tag, data) =>
    mainHttpClient.delete(`/projects/${project}/tags/${tag}`, { data }),
  getArtifactPreview: (project, path, user, fileFormat, signal) => {
    const config = {
      params: { path }
    }

    if (user) {
      config.params.user = user
    }

    if (['png', 'jpg', 'jpeg'].includes(fileFormat)) {
      config.responseType = 'blob'
    }

    if (signal) {
      config.signal = signal
    }

    return mainHttpClient.get(`projects/${project}/files`, config)
  },
  getArtifactTags: (project, category) =>
    mainHttpClient.get(`/projects/${project}/artifact-tags`, {
      params: {
        category
      }
    }),
  getArtifact: (project, artifact) => {
    return mainHttpClientV2.get(`/projects/${project}/artifacts?name=${artifact}`)
  },
  getArtifacts: (project, filters, config) => {
    return fetchArtifacts(project, filters, config)
  },
  getDataSet: (project, dataSet, iter, tag) => {
    return fetchArtifacts(
      project,
      {},
      {
        params: {
          category: DATASET_TYPE,
          name: dataSet,
          tag: tag === TAG_FILTER_ALL_ITEMS ? '*' : tag,
          'best-iteration': Boolean(iter)
        }
      }
    )
  },
  getDataSets: (project, filters, config = {}) => {
    const newConfig = {
      ...config,
      params: { category: DATASET_TYPE }
    }

    return fetchArtifacts(project, filters, newConfig)
  },
  getFile: (project, file, iter, tag) => {
    return fetchArtifacts(
      project,
      {},
      {
        params: {
          category: ARTIFACT_OTHER_TYPE,
          name: file,
          tag: tag === TAG_FILTER_ALL_ITEMS ? '*' : tag,
          'best-iteration': Boolean(iter)
        }
      }
    )
  },
  getFiles: (project, filters, config = {}) => {
    const newConfig = {
      ...config,
      params: { category: ARTIFACT_OTHER_TYPE, format: 'full' }
    }

    return fetchArtifacts(project, filters, newConfig)
  },
  getModel: (project, model, iter, tag) => {
    return fetchArtifacts(
      project,
      {},
      {
        params: {
          category: MODEL_TYPE,
          name: model,
          tag: tag === TAG_FILTER_ALL_ITEMS ? '*' : tag,
          'best-iteration': Boolean(iter)
        }
      }
    )
  },
  getModelEndpoints: (project, filters, config = {}, params = {}) => {
    const newConfig = {
      ...config,
      params
    }

    if (filters?.labels) {
      newConfig.params.label = filters.labels?.split(',')
    }

    return mainHttpClient.get(`/projects/${project}/model-endpoints`, newConfig)
  },
  getModels: (project, filters, config = {}) => {
    const newConfig = {
      ...config,
      params: { category: MODEL_TYPE, format: 'full' }
    }

    return fetchArtifacts(project, filters, newConfig)
  },
  registerArtifact: (project, data) => {
    return mainHttpClientV2.post(`/projects/${project}/artifacts`, data)
  },
  replaceTag: (project, tag, data) => mainHttpClient.post(`/projects/${project}/tags/${tag}`, data),
  updateArtifact: (project, data) =>
    mainHttpClientV2.put(`/projects/${project}/artifacts/${data.db_key || data.spec?.db_key}`, data)
}

export default artifactsApi
