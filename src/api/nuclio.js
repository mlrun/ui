import { nuclioHttpClient } from '../httpClient'

export default {
  getApiGateways: project => {
    return nuclioHttpClient.get('/api/api_gateways', {
      headers: {
        'x-nuclio-project-name': project
      }
    })
  },
  getFunctions: project => {
    return nuclioHttpClient.get('/api/functions', {
      headers: {
        'x-nuclio-project-name': project
      }
    })
  }
}
