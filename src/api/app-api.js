import { mainHttpClient } from '../httpClient'

const appApi = {
  getFrontendSpec: () => {
    return mainHttpClient.get('/frontend-spec')
  }
}

export default appApi
