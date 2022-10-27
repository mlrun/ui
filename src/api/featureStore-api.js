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
import {
  FEATURE_SETS_TAB,
  FEATURE_VECTORS_TAB,
  FEATURES_TAB,
  TAG_FILTER_ALL_ITEMS,
  TAG_FILTER_LATEST
} from '../constants'

const fetchFeatureStoreContent = (path, filters, config = {}, withLatestTag) => {
  const params = {}

  if (filters?.labels) {
    params.label = filters.labels?.split(',')
  }

  if (filters?.entities) {
    params.entity = filters.entities.split(',')
  }

  if (
    filters?.tag &&
    filters.tag !== TAG_FILTER_ALL_ITEMS &&
    (withLatestTag || filters.tag !== TAG_FILTER_LATEST)
  ) {
    params.tag = filters.tag
  }

  if (filters?.name) {
    params.name = `~${filters.name}`
  }

  return mainHttpClient.get(path, {
    ...config,
    params: { ...config.params, ...params }
  })
}

const featureStoreApi = {
  createFeatureSet: (project, data) =>
    mainHttpClient.put(
      `/projects/${project}/feature-sets/${data.metadata.name}/references/${data.metadata.tag}`,
      data
    ),
  createFeatureVector: data =>
    mainHttpClient.post(`/projects/${data.metadata.project}/feature-vectors`, data),
  deleteFeatureVector: (project, featureVector) =>
    mainHttpClient.delete(`/projects/${project}/feature-vectors/${featureVector}`),
  fetchFeatureSetsTags: project => mainHttpClient.get(`/projects/${project}/feature-sets/*/tags`),
  fetchFeatureVectorsTags: project =>
    mainHttpClient.get(`/projects/${project}/feature-vectors/*/tags`),
  getEntity: (project, entity) =>
    mainHttpClient.get(`/projects/${project}/entities`, {
      params: { name: entity }
    }),
  getEntities: (project, filters, config) =>
    fetchFeatureStoreContent(`/projects/${project}/entities`, filters, config ?? {}, true),
  getFeatureSet: (project, featureSet, tag) => {
    const params = {
      name: featureSet
    }

    if (tag !== TAG_FILTER_ALL_ITEMS) {
      params.tag = tag
    }

    return mainHttpClient.get(`/projects/${project}/feature-sets`, {
      params
    })
  },
  getFeatureSets: (project, filters, config) => {
    return fetchFeatureStoreContent(
      `/projects/${project}/${FEATURE_SETS_TAB}`,
      filters,
      config,
      true
    )
  },
  getFeatureVector: (project, featureVector, tag) => {
    const params = {
      name: featureVector
    }

    if (tag !== TAG_FILTER_ALL_ITEMS) {
      params.tag = tag
    }

    return mainHttpClient.get(`/projects/${project}/feature-vectors`, {
      params
    })
  },
  getFeatureVectors: (project, filters, config) => {
    return fetchFeatureStoreContent(
      `/projects/${project}/${FEATURE_VECTORS_TAB}`,
      filters,
      config,
      true
    )
  },
  getFeature: (project, feature) =>
    mainHttpClient.get(`/projects/${project}/features`, {
      params: { name: feature }
    }),
  getFeatures: (project, filters, config) =>
    fetchFeatureStoreContent(`/projects/${project}/${FEATURES_TAB}`, filters, config ?? {}, true),
  startIngest: (project, featureSet, reference, data) =>
    mainHttpClient.post(
      `/projects/${project}/feature-sets/${featureSet}/references/${reference}/ingest`,
      data
    ),
  updateFeatureStoreData: (projectName, featureData, tag, data, pageTab) =>
    mainHttpClient.put(
      `/projects/${projectName}/${pageTab}/${featureData}/references/${tag}`,
      data
    ),
  updateFeatureVectorData: data =>
    mainHttpClient.put(
      `/projects/${data.metadata.project}/feature-vectors/${data.metadata.name}/references/${data.metadata.tag}`,
      data
    )
}

export default featureStoreApi
