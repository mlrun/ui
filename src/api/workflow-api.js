import { mainHttpClient } from '../httpClient'

export default {
  getAllWorkflows: pageToken => {
    const params = {
      page_size: 100
    }
    if (pageToken) {
      params.page_token = pageToken
    }
    return mainHttpClient.get('/workflows', { params })
  }
}
