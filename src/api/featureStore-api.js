import { mainHttpClient } from '../httpClient'
import {
  FEATURE_SETS_TAB,
  FEATURE_VECTORS_TAB,
  FEATURES_TAB
} from '../constants'

const fetchFeatureStoreContent = (
  path,
  filters,
  config = {},
  withLatestTag
) => {
  const params = {}

  if (filters?.labels) {
    params.label = filters.labels?.split(',')
  }

  if (filters?.tag && (withLatestTag || !/latest/i.test(filters.tag))) {
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

export default {
  createFeatureSet: (project, data) =>
    mainHttpClient.post(`/projects/${project}/feature-sets`, data),
  createFeatureVector: data =>
    mainHttpClient.post(
      `/projects/${data.metadata.project}/feature-vectors`,
      data
    ),
  fetchFeatureSetsTags: project =>
    mainHttpClient.get(`/projects/${project}/feature-sets/*/tags`),
  fetchFeatureVectorsTags: project =>
    mainHttpClient.get(`/projects/${project}/feature-vectors/*/tags`),
  getEntity: (project, entity) =>
    mainHttpClient.get(`/projects/${project}/entities`, {
      params: { name: entity }
    }),
  getEntities: (project, filters) =>
    fetchFeatureStoreContent(
      `/projects/${project}/entities`,
      filters,
      {},
      true
    ),
  getFeatureSet: (project, featureSet) =>
    mainHttpClient.get(`/projects/${project}/feature-sets`, {
      params: { name: featureSet }
    }),
  getFeatureSets: (project, filters, config) => {
    return fetchFeatureStoreContent(
      `/projects/${project}/${FEATURE_SETS_TAB}`,
      filters,
      config,
      true
    )
  },
  getFeatureVector: (project, featureVector) =>
    mainHttpClient.get(`/projects/${project}/feature-vectors`, {
      params: { name: featureVector }
    }),
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
  getFeatures: (project, filters) =>
    fetchFeatureStoreContent(
      `/projects/${project}/${FEATURES_TAB}`,
      filters,
      {},
      true
    ),
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
