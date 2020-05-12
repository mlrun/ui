import { functionTemplatesHttpClient, mainHttpClient } from '../httpClient'

export default {
  getAll: project => mainHttpClient.get(`/funcs?project=${project}`),
  getFunctionTemplate: path => functionTemplatesHttpClient.get(path),
  getFunctionTemplatesCatalog: () =>
    functionTemplatesHttpClient.get('catalog.json')
}
