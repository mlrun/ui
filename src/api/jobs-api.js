import { mainHttpClient } from '../httpClient'

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

    return mainHttpClient.get(url)
  },
  getJobLogs: (id, project) => mainHttpClient.get(`/log/${project}/${id}`),
  filterByStatus: (project, state) =>
    mainHttpClient.get(`/runs?project=${project}&&state=${state}`),
  runJob: postData => mainHttpClient.post('/submit_job', postData)
}
