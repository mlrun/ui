import { mainHTTPClient } from '../httpClient'

export default {
  getAll: (project, state, event) => {
    let url = `/runs?project=${project}`

    if (event?.labels) {
      let labels = event?.labels
        ?.split(',')
        .map(item => `label=${item}`)
        .join('&')

      url = `${url}&${labels}`
    }

    if (event?.name) {
      url = `${url}&name=${event.name}`
    }

    return mainHTTPClient.get(url)
  },
  getJobLogs: (id, project) => mainHTTPClient.get(`/log/${project}/${id}`),
  filterByStatus: (project, state) =>
    mainHTTPClient.get(`/runs?project=${project}&&state=${state}`),
  runJob: postData => mainHTTPClient.post('/submit_job', postData)
}
