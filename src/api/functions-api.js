import { functionTemplatesHttpClient, mainHttpClient } from '../httpClient'

export default {
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
  getAll: (project, name) => {
    const params = {
      project
    }

    if (name) {
      params.name = `~${name}`
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
