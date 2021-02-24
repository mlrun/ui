import { mainHttpClient } from '../httpClient'
import {
  FEATURE_SETS_TAB,
  FEATURE_VECTORS_TAB,
  FEATURES_TAB
} from '../constants'

const fetchArtifacts = (item, path) => {
  let url = path

  if (item?.labels) {
    let labels = item?.labels
      ?.split(',')
      .map(item => `label=${item}`)
      .join('&')

    url = `${url}&${labels}`
  }

  if (item?.tag && !/latest/i.test(item.tag)) {
    url = `${url}&tag=${item.tag}`
  }

  if (item?.name) {
    url = `${url}&name=${item.name}`
  }

  return mainHttpClient.get(url)
}

const fetchFeatureStoreData = (item, tab, config) => {
  const params = {}

  if (item?.labels) {
    params.labels = item.labels
  }

  if (item?.tag && !/latest/i.test(item.tag)) {
    params.tag = item.tag
  }

  if (item?.name) {
    params.name = item.name
  }

  return mainHttpClient.get(`/projects/${item.project}/${tab}`, {
    ...config,
    params
  })
}

export default {
  getArtifactPreview: (schema, path, user, fileFormat) => {
    const config = {
      params: schema ? { schema, path, user } : { path, user }
    }

    if (['png', 'jpg', 'jpeg'].includes(fileFormat)) {
      config.responseType = 'blob'
    }

    return mainHttpClient.get('/files', config)
  },
  getArtifactTag: project =>
    mainHttpClient.get(`/projects/${project}/artifact-tags`),
  getArtifacts: item => {
    return fetchArtifacts(item, `/artifacts?project=${item.project}`)
  },
  getDataSets: item => {
    return fetchArtifacts(
      item,
      `/artifacts?project=${item.project}&category=dataset`
    )
  },
  getFeatureSets: (item, config) => {
    return fetchFeatureStoreData(item, FEATURE_SETS_TAB, config)
  },
  getFeatureVector: (featureVector, project) =>
    mainHttpClient.get(
      `/projects/${project}/feature-vectors?name=${featureVector}`
    ),
  getFeatureVectors: item => {
    return fetchFeatureStoreData(item, FEATURE_VECTORS_TAB)
  },
  getFeature: (project, feature) =>
    mainHttpClient.get(`/projects/${project}/features?name=${feature}`),
  getFeatures: item => {
    const params = {}

    if (item?.labels) {
      params.labels = item.labels
    }

    if (item?.tag) {
      params.tag = item.tag
    }

    if (item?.name) {
      params.name = item.name
    }

    return mainHttpClient.get(`/projects/${item.project}/${FEATURES_TAB}`, {
      params
    })
  },
  getFiles: item => {
    return fetchArtifacts(
      item,
      `/artifacts?project=${item.project}&category=other`
    )
  },
  getModelEndpoints: item => {
    const params = {}

    if (item?.labels) {
      params.labels = item.labels
    }

    return mainHttpClient.get(`/projects/${item.project}/model-endpoints`, {
      params
    })
  },
  getModels: item => {
    return fetchArtifacts(
      item,
      `/artifacts?project=${item.project}&category=model`
    )
  },
  registerArtifact: (project, data) =>
    mainHttpClient.post(`/artifact/${project}/${data.uid}/${data.key}`, data),
  updateFeatureSetData: (projectName, featureSet, tag, data) =>
    mainHttpClient.patch(
      `/projects/${projectName}/feature-sets/${featureSet}/references/${tag}`,
      data
    )
}
