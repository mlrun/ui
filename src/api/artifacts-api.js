import { mainHttpClient } from '../httpClient'
import {
  FEATURE_SETS_TAB,
  FEATURE_VECTORS_TAB,
  FEATURES_TAB
} from '../constants'

const fetchArtifacts = (path, filters, config = {}, withLatestTag) => {
  const params = {}

  if (filters?.labels) {
    params.label = filters.labels?.split(',')
  }

  if (filters?.iter === 'iter') {
    params['best-iteration'] = true
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
  buildFunction: data => mainHttpClient.post('/build/function', data),
  createFeatureSet: (project, data) =>
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
  getArtifact: (project, artifact) => {
    return mainHttpClient.get('/artifacts', {
      params: { project, name: artifact }
    })
  },
  getArtifacts: (project, filters) => {
    return fetchArtifacts('/artifacts', filters, {
      params: { project }
    })
  },
  getDataSet: (project, dataSet) => {
    return fetchArtifacts(
      '/artifacts',
      {},
      { params: { project, name: dataSet, tag: '*' } }
    )
  },
  getDataSets: (project, filters) => {
    return fetchArtifacts(
      '/artifacts',
      filters,
      { params: { project, category: 'dataset' } },
      true
    )
  },
  getFeatureSets: (project, filters, config) => {
    return fetchArtifacts(
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
    return fetchArtifacts(
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
    fetchArtifacts(`/projects/${project}/${FEATURES_TAB}`, filters, {}, true),
  getFile: (project, file) => {
    return fetchArtifacts(
      '/artifacts',
      {},
      { params: { project, name: file, tag: '*' } }
    )
  },
  getFiles: (project, filters) => {
    return fetchArtifacts(
      '/artifacts',
      filters,
      { params: { project, category: 'other' } },
      true
    )
  },
  getModel: (project, model) => {
    return fetchArtifacts(
      '/artifacts',
      {},
      { params: { project, name: model, tag: '*' } }
    )
  },
  getModelEndpoints: (project, filters) => {
    const params = {}

    if (filters?.labels) {
      params.label = filters.labels?.split(',')
    }

    return mainHttpClient.get(`/projects/${project}/model-endpoints`, {
      params
    })
  },
  getModels: (project, filters) => {
    return fetchArtifacts(
      '/artifacts',
      filters,
      { params: { project, category: 'model' } },
      true
    )
  },
  registerArtifact: (project, data) =>
    mainHttpClient.post(`/artifact/${project}/${data.uid}/${data.key}`, data),
  startIngest: (project, featureSet, reference, source, targets) =>
    mainHttpClient.post(
      `/projects/${project}/feature-sets/${featureSet}/references/${reference}/ingest`,
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
