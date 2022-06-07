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
    mainHttpClient.patch(
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
