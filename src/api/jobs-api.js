import { mainHttpClient } from '../httpClient'

export default {
  editJob: (postData, project) =>
    mainHttpClient.put(
      `/projects/${project}/schedules/${postData.task.metadata.name}`,
      postData
    ),
  filterByStatus: (project, state) =>
    mainHttpClient.get(`/runs?project=${project}&state=${state}`),
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
  getScheduled: (project, status, event) => {
    const params = {
      include_last_run: 'yes'
    }

    if (event?.owner) {
      params.owner = event.owner
    }

    if (event?.name) {
      params.name = event.name
    }

    if (event?.labels) {
      params.labels = event?.labels
    }

    return mainHttpClient.get(`/projects/${project}/schedules`, { params })
  },
  removeScheduledJob: (project, scheduleName) =>
    mainHttpClient.delete(`/projects/${project}/schedules/${scheduleName}`),
  runJob: postData => mainHttpClient.post('/submit_job', postData),
  runScheduledJob: (postData, project, job) =>
    mainHttpClient.post(
      `/projects/${project}/schedules/${job}/invoke`,
      postData
    )
}
