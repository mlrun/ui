import { functionTemplatesHttpClient, mainHttpClient } from '../httpClient'

const functionsApi = {
  createNewFunction: (project, data) =>
    mainHttpClient.post(`/func/${project}/${data.metadata.name}`, data, {
      params: {
        tag: data.metadata.tag,
        versioned: true
      }
    }),
  deleteSelectedFunction: (func, project) =>
    mainHttpClient.delete(`/projects/${project}/functions/${func}`),
  deployFunction: data => mainHttpClient.post('/build/function', data),
  getFunctions: (project, filters) => {
    const params = {
      project
    }

    if (filters?.name) {
      params.name = `~${filters.name}`
    }

    return mainHttpClient.get('/funcs', { params })
  },
  getFunction: (project, name) =>
    mainHttpClient.get(`/func/${project}/${name}`),
  getFunctionWithHash: (project, name, hash) =>
    mainHttpClient.get(`/func/${project}/${name}?hash_key=${hash}`),
  getFunctionLogs: (project, name, tag, offset) => {
    const params = {
      project,
      name,
      tag,
      logs: true
    }

    if (offset > 0) {
      params.offset = offset
    }

    return mainHttpClient.get('/build/status', { params })
  },
  getFunctionTemplate: path => functionTemplatesHttpClient.get(path),
  getFunctionTemplatesCatalog: () =>
    functionTemplatesHttpClient.get('catalog.json')
}

export default functionsApi
