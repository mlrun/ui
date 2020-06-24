import { functionTemplatesHttpClient, mainHttpClient } from '../httpClient'

export default {
  getAll: (project, name) => {
    const params = {
      project
    }

    if (name) {
      params.name = name
    }

    return mainHttpClient.get('/funcs', { params })
  },
  getFunctionTemplate: path => functionTemplatesHttpClient.get(path),
  getFunctionTemplatesCatalog: () =>
    functionTemplatesHttpClient.get('catalog.json')
}
