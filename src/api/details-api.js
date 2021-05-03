import { mainHttpClient } from '../httpClient'

export default {
  getJobPods: project =>
    mainHttpClient.get(`/projects/${project}/runtime-resources?group-by=job`),
  getModelEndpoint: (project, uid) =>
    mainHttpClient.get(
      `/projects/${project}/model-endpoints/${uid}?feature_analysis=true`
    )
}
