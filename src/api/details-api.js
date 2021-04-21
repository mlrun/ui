import { mainHttpClient } from '../httpClient'

export default {
  getJobPods: project =>
    mainHttpClient.get(`/projects/${project}/runtime-resources?group-by=job`),
  getModelEndpoint: uid =>
    mainHttpClient.get(
      `/projects/iris-demo-michaell/model-endpoints/${uid}?feature_analysis=true`
    )
}
