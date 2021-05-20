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

  if (item?.tag && (withLatestTag || !/latest/i.test(item.tag))) {
    params.tag = item.tag
  }

  if (item?.name) {
    params.name = item.name
  }

  return mainHttpClient.get(path, { ...config, params })
}

export default {
  buildFunction: data => mainHttpClient.post('/build/function', data),
  createFeatureSet: (data, project) =>
    mainHttpClient.post(`/projects/${project}/feature-sets`, data),
  createFeatureVector: data =>
    mainHttpClient.post(
      `/projects/${data.metadata.project}/feature-vectors`,
      data
    ),
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
  getArtifactTag: project =>
    mainHttpClient.get(`/projects/${project}/artifact-tags`),
  getArtifacts: item => {
    return fetchArtifacts(item, `/artifacts?project=${item.project}`)
  },
  getDataSet: item => {
    return fetchArtifacts(
      {},
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
      config,
      true
    )
  },
  getFeatureVector: (featureVector, project) =>
    mainHttpClient.get(
      `/projects/${project}/feature-vectors?name=${featureVector}`
    ),
  getFeatureVectors: (item, config) => {
    return fetchArtifacts(
      item,
      `/projects/${item.project}/${FEATURE_VECTORS_TAB}`,
      config,
      true
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
      `/artifacts?project=${item.project}&category=other`,
      {},
      true
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
      `/artifacts?project=${item.project}&category=model`,
      {},
      true
    )
  },
  registerArtifact: (project, data) =>
    mainHttpClient.post(`/artifact/${project}/${data.uid}/${data.key}`, data),
  startIngest: (project, featureSet, uid, source, targets) =>
    mainHttpClient.post(
      `/projects/${project}/feature-sets/${featureSet}/references/${uid}/ingest`,
      {
        source: { ...source, name: 'source' },
        targets
      }
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
