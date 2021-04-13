import { mainHttpClient } from '../httpClient'

export default {
  getJobPods: project =>
    mainHttpClient.get(`/projects/${project}/runtime-resources?group-by=job`)
}
