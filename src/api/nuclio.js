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
    let config = project
      ? {
          headers: {
            'x-nuclio-project-name': project
          }
        }
      : {}

    return nuclioHttpClient.get('/api/functions', config)
  }
}
