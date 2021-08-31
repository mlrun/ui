import { functionTemplatesHttpClient, mainHttpClient } from '../httpClient'

export default {
  checkExistingName: (project, name) =>
    mainHttpClient.get(`/func/${project}/${name}`),
  createNewFunction: (project, data) =>
    mainHttpClient.post(`/func/${project}/${data.metadata.name}`, data, {
      params: {
        tag: data.metadata.tag,
        versioned: true
      }
    }),
  deleteSelectedFunction: (func, project) =>
    mainHttpClient.delete(`/projects/${project}/functions/${func}`),
  deployFunction: func =>
    mainHttpClient.post('/build/function', { function: func }),
  getAll: (project, name) => {
    const params = {
      project
    }

    if (name) {
      params.name = `~${name}`
    }

    return mainHttpClient.get('/funcs', { params })
  },
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
