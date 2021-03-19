import { mainHttpClient } from '../httpClient'
import {
  FEATURE_SETS_TAB,
  FEATURE_VECTORS_TAB,
  FEATURES_TAB
} from '../constants'

const fetchArtifacts = (item, path, config, withLatestTag) => {
  const params = {}

  if (item?.labels) {
    params.label = item.labels?.split(',')
  }

  if (item?.tag) {
    if (withLatestTag) {
      params.tag = item.tag
    } else if (!/latest/i.test(item.tag)) {
      params.tag = item.tag
    }
  }

  if (item?.name) {
    params.name = item.name
  }

  return mainHttpClient.get(path, { ...config, params })
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
  getDataSet: item => {
    return fetchArtifacts(
      item,
      `/artifacts?project=${item.project}&name=${item.db_key}&tag=*`
    )
  },
  getDataSets: item => {
    return fetchArtifacts(
      item,
      `/artifacts?project=${item.project}&category=dataset`,
      {},
      true
    )
  },
  getFeatureSets: (item, config) => {
    return fetchArtifacts(
      item,
      `/projects/${item.project}/${FEATURE_SETS_TAB}`,
      config
    )
  },
  getFeatureVector: (featureVector, project) =>
    mainHttpClient.get(
      `/projects/${project}/feature-vectors?name=${featureVector}`
    ),
  getFeatureVectors: item => {
    return fetchArtifacts(
      item,
      `/projects/${item.project}/${FEATURE_VECTORS_TAB}`
    )
  },
  getFeature: (project, feature) =>
    mainHttpClient.get(`/projects/${project}/features?name=${feature}`),
  getFeatures: item =>
    fetchArtifacts(item, `/projects/${item.project}/${FEATURES_TAB}`, {}, true),
  getFile: item => {
    return fetchArtifacts(
      item,
      `/artifacts?project=${item.project}&name=${item.db_key}&tag=*`
    )
  },
  getFiles: item => {
    return fetchArtifacts(
      item,
      `/artifacts?project=${item.project}&category=other`
    )
  },
  getModel: item => {
    return fetchArtifacts(
      item,
      `/artifacts?project=${item.project}&name=${item.db_key}&tag=*`
    )
  },
  getModelEndpoints: item => {
    const params = {}

    if (item?.labels) {
      params.label = item.labels?.split(',')
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
