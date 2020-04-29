import { functionsTemplatesHTTPClient, mainHTTPClient } from '../httpClient'

export default {
  getAll: project => mainHTTPClient.get(`/funcs?project=${project}`),
  getFunctionsTemplates: () => functionsTemplatesHTTPClient.get('')
}
