import { mainHttpClient } from '../httpClient'

export default {
  abortJob: (project, jobId, iter) => {
    const params = {}

    if (!isNaN(iter)) {
      params.iter = iter
    }

    return mainHttpClient.patch(
      `/run/${project}/${jobId}`,
      {
        'status.state': 'aborted'
      },
      { params }
    )
  },
  editJob: (postData, project) =>
    mainHttpClient.put(
      `/projects/${project}/schedules/${postData.scheduled_object.task.metadata.name}`,
      postData
    ),
  filterByStatus: (project, state) =>
    mainHttpClient.get(`/runs?project=${project}&state=${state}`),
  getAll: (project, state, event) => {
    const params = {
      project
    }

    if (event?.labels) {
      params.label = event.labels.split(',')
    }

    if (event?.name) {
      params.name = event.name
    }

    return mainHttpClient.get('/runs', { params })
  },
  getJobFunction: (project, functionName, hash) =>
    mainHttpClient.get(`/func/${project}/${functionName}?hash_key=${hash}`),
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
      params.labels = event.labels?.split(',')
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
