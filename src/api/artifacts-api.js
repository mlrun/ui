import { mainHttpClient } from '../httpClient'

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
  getDataSets: (project, filters, config) => {
    return fetchArtifacts(
      '/artifacts',
      filters,
      { ...config, params: { project, category: 'dataset' } },
      true
    )
  },
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
  getModelEndpoints: (project, filters, params = {}) => {
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
    mainHttpClient.post(`/artifact/${project}/${data.uid}/${data.key}`, data)
}
