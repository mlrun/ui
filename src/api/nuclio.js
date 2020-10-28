import { nuclioHttpClient } from '../httpClient'

export default {
  getFunctions: (project, name) => {
    return nuclioHttpClient.get('/api/functions', {
      headers: {
        'x-nuclio-project-name': 'default'
      }
    })
  }
}
