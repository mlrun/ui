import { mainHttpClient } from '../httpClient'

export default {
  getFrontendSpec: () => {
    return mainHttpClient.get('/frontend-spec')
  }
}
