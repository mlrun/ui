/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import { mainBaseUrl, mainHttpClient } from '../httpClient'
import { STATE_FILTER_ALL_ITEMS } from '../constants'

const generateRequestParams = filters => {
  const params = {
    iter: false
  }

  if (filters?.labels) {
    params.label = filters.labels.split(',')
  }

  if (filters?.name) {
    params.name = `~${filters.name}`
  }

  if (filters?.state && filters.state !== STATE_FILTER_ALL_ITEMS) {
    params.state = filters.state
  }

  if (filters?.dates) {
    if (filters.dates.value[0]) {
      params.start_time_from = filters.dates.value[0].toISOString()
    }

    if (filters.dates.value[1] && !filters.dates.isPredefined) {
      params.start_time_to = filters.dates.value[1].toISOString()
    }
  }

  return params
}

const jobsApi = {
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
  deleteJob: (project, jobUid) => {
    return mainHttpClient.delete(`/projects/${project}/runs/${jobUid}`)
  },
  editJob: (postData, project) =>
    mainHttpClient.put(
      `/projects/${project}/schedules/${postData.scheduled_object.task.metadata.name}`,
      postData
    ),
  getJobs: (project, filters, setLargeRequestErrorMessage, isAllJobs) => {
    const config = {
      params: {
        project,
        ...generateRequestParams(filters)
      },
      ui: {
        setLargeRequestErrorMessage
      }
    }

    if (!isAllJobs) {
      config.params['partition-by'] = 'name'
      config.params['partition-sort-by'] = 'updated'
    }

    return mainHttpClient.get('/runs', config)
  },
  getSpecificJobs: (project, filters, jobList) => {
    const params = {
      project,
      ...generateRequestParams(filters)
    }

    const jobListQuery = jobList.map(value => `uid=${value}`).join('&')

    return mainHttpClient.get(`/runs?${jobListQuery}`, { params })
  },
  getAllJobRuns: (project, jobName, filters, setLargeRequestErrorMessage) => {
    const config = {
      params: {
        project,
        name: jobName,
        ...generateRequestParams(filters)
      },
      ui: {
        setLargeRequestErrorMessage
      }
    }

    return mainHttpClient.get('/runs', config)
  },
  getJob: (project, jobId, iter) => {
    const params = {}

    if (!isNaN(iter)) {
      params.iter = iter
    }

    return mainHttpClient.get(`/run/${project}/${jobId}`, { params })
  },
  getJobLogs: (id, project) =>
    fetch(`${mainBaseUrl}/log/${project}/${id}`, {
      method: 'get'
    }),
  getScheduledJobs: (project, filters, setLargeRequestErrorMessage) => {
    const config = {
      params: {
        include_last_run: 'yes'
      },
      ui: {
        setLargeRequestErrorMessage
      }
    }

    if (filters?.owner) {
      config.params.owner = filters.owner
    }

    if (filters?.name) {
      config.params.name = `~${filters.name}`
    }

    if (filters?.labels) {
      config.params.labels = filters.labels?.split(',')
    }

    return mainHttpClient.get(`/projects/${project}/schedules`, config)
  },
  removeScheduledJob: (project, scheduleName) =>
    mainHttpClient.delete(`/projects/${project}/schedules/${scheduleName}`),
  runJob: postData => mainHttpClient.post('/submit_job', postData),
  runScheduledJob: (postData, project, job) =>
    mainHttpClient.post(`/projects/${project}/schedules/${job}/invoke`, postData)
}

export default jobsApi
