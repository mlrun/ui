import httpClient from '../httpClient'

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

    return httpClient.get(url)
  },
  getJobLogs: (id, project) => httpClient.get(`/log/${project}/${id}`),
  filterByStatus: (project, state) =>
    httpClient.get(`/runs?project=${project}&&state=${state}`)
}
