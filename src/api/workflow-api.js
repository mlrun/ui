import { mainHttpClient } from '../httpClient'

export default {
  getAllWorkflows: pageToken => {
    return mainHttpClient.get(
      `/workflows?page_size=100${pageToken ? `&page_token=${pageToken}` : ''}`
    )
  }
}
