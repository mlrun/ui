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
import { isEmpty, isNil } from 'lodash'
import { mainHttpClient, mainHttpClientV2 } from '../httpClient'
import {
  ARTIFACT_OTHER_TYPE,
  DATASET_TYPE,
  DOCUMENT_TYPE,
  LLM_PROMPT_TYPE,
  MODEL_NAME_FILTER,
  MODEL_TAG_FILTER,
  MODEL_TYPE,
  SHOW_ITERATIONS,
  TAG_FILTER_ALL_ITEMS,
  TAG_FILTER_LATEST
} from '../constants'
import localStorageService from '../utils/localStorageService'

const fetchArtifacts = (project, filters, config = {}, withLatestTag, withExactName) => {
  const params = {}

  if (filters?.labels) {
    params.label = filters.labels?.split(',')
  }

  if (filters?.iter === SHOW_ITERATIONS) {
    params['best-iteration'] = true
  } else if (!isNil(filters?.iter) && !isEmpty(filters?.iter)) {
    params.iter = filters.iter
  }

  if (filters?.tag && (withLatestTag || filters.tag !== TAG_FILTER_LATEST)) {
    params.tag = filters.tag === TAG_FILTER_ALL_ITEMS ? '*' : filters.tag
  }

  if (filters?.name) {
    params.name = `${withExactName ? '' : '~'}${filters.name}`
  }

  if (filters?.tree) {
    params.tree = filters.tree
  }

  if (filters?.[MODEL_NAME_FILTER]) {
    params.parent = `${filters[MODEL_NAME_FILTER]}${filters[MODEL_TAG_FILTER] ? `:${filters[MODEL_TAG_FILTER]}` : ''}`
  }

  return mainHttpClientV2.get(`/projects/${project}/artifacts`, {
    ...config,
    params: { ...config.params, ...params }
  })
}

const artifactsApi = {
  addTag: (project, tag, data) => mainHttpClient.put(`/projects/${project}/tags/${tag}`, data),
  buildFunction: data => {
    const headers = {}
    const mlrunVersion = localStorageService.getStorageValue('mlrunVersion')

    if (mlrunVersion) {
      headers['x-mlrun-client-version'] = mlrunVersion
    }

    return mainHttpClient.post(
      `/projects/${data.function.metadata.project}/nuclio/${data.function.metadata.name}/deploy`,
      data,
      {
        headers
      }
    )
  },
  deleteArtifact: (project, key, uid, deletion_strategy, secrets = {}) => {
    const config = {
      params: {
        'object-uid': uid
      }
    }

    if (deletion_strategy) {
      config.params.deletion_strategy = deletion_strategy
      config.data = secrets
    }

    return mainHttpClientV2.delete(`/projects/${project}/artifacts/${key}`, config)
  },
  deleteArtifacts: (project, name, category) => {
    const config = {
      params: {}
    }

    if (name) config.params.name = name
    if (category) config.params.category = category

    return mainHttpClientV2.delete(`/projects/${project}/artifacts`, config)
  },
  deleteTag: (project, tag, data) =>
    mainHttpClient.delete(`/projects/${project}/tags/${tag}`, { data }),
  getArtifactPreview: (project, config) => {
    return mainHttpClient.get(`projects/${project}/files`, config)
  },
  getArtifactPreviewStats: (project, path, user, signal) => {
    const config = {
      params: { path }
    }

    if (user) {
      config.params.user = user
    }

    if (signal) {
      config.signal = signal
    }

    return mainHttpClient.get(`projects/${project}/filestat`, config)
  },
  getArtifactTags: (project, category, config) =>
    mainHttpClient.get(`/projects/${project}/artifact-tags`, {
      ...config,
      params: {
        ...config.params,
        category
      }
    }),
  getExpandedArtifact: (project, artifactName, artifactTag) => {
    const params = {
      name: artifactName,
      format: 'minimal'
    }

    if (artifactTag) {
      params.tag = artifactTag
    }

    return mainHttpClientV2.get(`/projects/${project}/artifacts`, { params })
  },
  getArtifact: (projectName, artifactName, uid, tree, tag, iter) => {
    const newConfig = {
      params: { tree, 'object-uid': uid }
    }

    if (tag) {
      newConfig.params.tag = tag
    }

    if (!isNil(iter) && !isEmpty(iter)) {
      newConfig.params.iter = iter
    }

    return mainHttpClientV2.get(`/projects/${projectName}/artifacts/${artifactName}`, newConfig)
  },
  getArtifacts: (project, filters, config, withExactName) => {
    return fetchArtifacts(project, filters, config, false, withExactName)
  },
  getDataSets: (project, filters, config = {}) => {
    const newConfig = {
      ...config,
      params: { ...config.params, category: DATASET_TYPE }
    }

    return fetchArtifacts(project, filters, newConfig, true)
  },
  getDocuments: (project, filters, config = {}) => {
    const newConfig = {
      ...config,
      params: { ...config.params, category: DOCUMENT_TYPE }
    }

    return fetchArtifacts(project, filters, newConfig, true)
  },
  getFiles: (project, filters, config = {}) => {
    const newConfig = {
      ...config,
      params: { ...config.params, category: ARTIFACT_OTHER_TYPE }
    }

    return fetchArtifacts(project, filters, newConfig, true)
  },
  getLLMPrompts: (project, filters, config = {}) => {
    const newConfig = {
      ...config,
      params: { ...config.params, category: LLM_PROMPT_TYPE }
    }

    return fetchArtifacts(project, filters, newConfig, true)
  },
  getModels: (project, filters, config = {}) => {
    const newConfig = {
      ...config,
      params: { ...config.params, category: MODEL_TYPE }
    }

    return fetchArtifacts(project, filters, newConfig, true)
  },
  registerArtifact: (project, data) => {
    return mainHttpClientV2.post(`/projects/${project}/artifacts`, data)
  },
  replaceTag: (project, tag, data) => mainHttpClient.post(`/projects/${project}/tags/${tag}`, data),
  updateArtifact: (project, data) =>
    mainHttpClientV2.put(`/projects/${project}/artifacts/${data.db_key || data.spec?.db_key}`, data)
}

export default artifactsApi
