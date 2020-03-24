import httpClient from '../httpClient'

export default {
  getAll: (project, state, labels) => {
    let _labels = labels
      ?.split(',')
      .map(item => `label=${item}`)
      .join('&')
    return httpClient.get(
      !labels
        ? `/runs?project=${project}`
        : `/runs?project=${project}&${_labels}`
    )
  },
  getJobLogs: (id, project) => httpClient.get(`/log/${project}/${id}`),
  filterByStatus: (project, state) =>
    httpClient.get(`/runs?project=${project}&&state=${state.toLowerCase()}`)
}
