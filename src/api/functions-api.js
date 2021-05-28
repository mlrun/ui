import { functionTemplatesHttpClient, mainHttpClient } from '../httpClient'

export default {
  createNewFunction: (project, data) =>
    mainHttpClient.post(
      `/func/${project}/${data.metadata.name}?tag=${data.metadata.tag}&versioned=true`,
      data
    ),
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
  getFunctionTemplate: path => functionTemplatesHttpClient.get(path),
  getFunctionTemplatesCatalog: () =>
    functionTemplatesHttpClient.get('catalog.json')
}
