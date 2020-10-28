import { nuclioHttpClient } from '../httpClient'

export default {
  getFunctions: project => {
    return nuclioHttpClient.get('/api/functions', {
      headers: {
        'x-nuclio-project-name': project
      }
    })
  }
}
