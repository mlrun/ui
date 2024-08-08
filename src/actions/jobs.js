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
import { get } from 'lodash'

import jobsApi from '../api/jobs-api'
import functionsApi from '../api/functions-api'
import {
  ABORT_JOB_BEGIN,
  ABORT_JOB_FAILURE,
  ABORT_JOB_SUCCESS,
  DELETE_JOB_BEGIN,
  DELETE_JOB_FAILURE,
  DELETE_JOB_SUCCESS,
  EDIT_JOB_BEGIN,
  EDIT_JOB_FAILURE,
  EDIT_JOB_SUCCESS,
  FETCH_ALL_JOB_RUNS_BEGIN,
  FETCH_ALL_JOB_RUNS_FAILURE,
  FETCH_ALL_JOB_RUNS_SUCCESS,
  FETCH_JOBS_BEGIN,
  FETCH_JOBS_FAILURE,
  FETCH_JOBS_SUCCESS,
  FETCH_JOB_BEGIN,
  FETCH_JOB_FAILURE,
  FETCH_JOB_FUNCTIONS_BEGIN,
  FETCH_JOB_FUNCTIONS_FAILURE,
  FETCH_JOB_FUNCTIONS_SUCCESS,
  FETCH_JOB_FUNCTION_BEGIN,
  FETCH_JOB_FUNCTION_FAILURE,
  FETCH_JOB_FUNCTION_SUCCESS,
  FETCH_JOB_LOGS_BEGIN,
  FETCH_JOB_LOGS_FAILURE,
  FETCH_JOB_LOGS_SUCCESS,
  FETCH_JOB_SUCCESS,
  FETCH_SCHEDULED_JOBS_BEGIN,
  FETCH_SCHEDULED_JOBS_FAILURE,
  FETCH_SCHEDULED_JOBS_SUCCESS,
  REMOVE_JOB,
  REMOVE_JOB_ERROR,
  REMOVE_JOB_FUNCTION,
  REMOVE_NEW_JOB,
  REMOVE_SCHEDULED_JOB_FAILURE,
  RUN_NEW_JOB_BEGIN,
  RUN_NEW_JOB_FAILURE,
  RUN_NEW_JOB_SUCCESS,
  SET_JOBS_DATA,
  SET_LOADING,
  SET_NEW_JOB,
  SET_NEW_JOB_CREDENTIALS_ACCESS_KEY,
  SET_NEW_JOB_ENVIRONMENT_VARIABLES,
  SET_NEW_JOB_HYPER_PARAMETERS,
  SET_NEW_JOB_INPUTS,
  SET_NEW_JOB_NODE_SELECTOR,
  SET_NEW_JOB_PARAMETERS,
  SET_NEW_JOB_PREEMTION_MODE,
  SET_NEW_JOB_PRIORITY_CLASS_NAME,
  SET_NEW_JOB_SECRET_SOURCES,
  SET_NEW_JOB_SELECTOR_CRITERIA,
  SET_NEW_JOB_SELECTOR_RESULT,
  SET_NEW_JOB_VOLUMES,
  SET_NEW_JOB_VOLUME_MOUNTS,
  SET_TUNING_STRATEGY,
  SET_URL,
  DELETE_ALL_JOB__RUNS_BEGIN,
  DELETE_ALL_JOB_RUNS_FAILURE,
  DELETE_ALL_JOB_RUNS_SUCCESS,
  FILTER_ALL_ITEMS
} from '../constants'
import { getNewJobErrorMsg } from '../components/JobWizard/JobWizard.util'
import { showErrorNotification } from '../utils/notifications.util'
import { largeResponseCatchHandler } from '../utils/largeResponseCatchHandler'

const generateRequestParams = (filters, jobName) => {
  const params = {
    iter: false
  }

  if (filters?.labels) {
    params.label = filters.labels.split(',')
  }

  if (jobName) {
    params.name = jobName
  } else if (filters?.name) {
    params.name = `~${filters.name}`
  }

  if (
    filters?.state &&
    filters.state !== FILTER_ALL_ITEMS &&
    !filters.state.includes(FILTER_ALL_ITEMS)
  ) {
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

const jobsActions = {
  abortJob: (project, job) => dispatch => {
    return jobsApi
      .abortJob(project, job.uid, job.iteration)
      .then(response => {
        dispatch(jobsActions.abortJobSuccess())

        return get(response, 'data', {})
      })
      .catch(error => {
        dispatch(jobsActions.abortJobFailure(error.message))

        throw error
      })
  },
  abortJobBegin: () => ({
    type: ABORT_JOB_BEGIN
  }),
  abortJobFailure: error => ({
    type: ABORT_JOB_FAILURE,
    payload: error
  }),
  abortJobSuccess: () => ({
    type: ABORT_JOB_SUCCESS
  }),
  deleteAllJobRuns: (project, job) => dispatch => {
    dispatch(jobsActions.deleteAllJobRunsBegin())

    return jobsApi
      .deleteAllJobRuns(project, job.name)
      .then(() => dispatch(jobsActions.deleteAllJobRunsSuccess()))
      .catch(error => {
        dispatch(jobsActions.deleteAllJobRunsFailure(error.message))

        throw error
      })
  },
  deleteJob: (project, job) => dispatch => {
    dispatch(jobsActions.deleteJobBegin())

    return jobsApi
      .deleteJob(project, job.uid)
      .then(() => dispatch(jobsActions.deleteJobSuccess()))
      .catch(error => {
        dispatch(jobsActions.deleteJobFailure(error.message))

        throw error
      })
  },
  deleteAllJobRunsBegin: () => ({
    type: DELETE_ALL_JOB__RUNS_BEGIN
  }),
  deleteAllJobRunsFailure: error => ({
    type: DELETE_ALL_JOB_RUNS_FAILURE,
    payload: error
  }),
  deleteAllJobRunsSuccess: () => ({
    type: DELETE_ALL_JOB_RUNS_SUCCESS
  }),
  deleteJobBegin: () => ({
    type: DELETE_JOB_BEGIN
  }),
  deleteJobFailure: error => ({
    type: DELETE_JOB_FAILURE,
    payload: error
  }),
  deleteJobSuccess: () => ({
    type: DELETE_JOB_SUCCESS
  }),
  editJob: (postData, project) => dispatch => {
    dispatch(jobsActions.editJobBegin())

    return jobsApi
      .editJob(postData, project)
      .then(response => {
        dispatch(jobsActions.editJobSuccess())

        return response
      })
      .catch(error => {
        dispatch(jobsActions.editJobFailure(error))

        throw error
      })
  },
  editJobBegin: () => ({
    type: EDIT_JOB_BEGIN
  }),
  editJobSuccess: () => ({
    type: EDIT_JOB_SUCCESS
  }),
  editJobFailure: error => ({
    type: EDIT_JOB_FAILURE,
    payload: error
  }),
  fetchAllJobRuns: (project, filters, config, jobName) => dispatch => {
    const newConfig = {
      ...config,
      params: {
        ...config?.params,
        ...generateRequestParams(filters, jobName)
      }
    }

    dispatch(jobsActions.fetchAllJobRunsBegin())
    config?.ui?.setRequestErrorMessage?.('')

    return jobsApi
      .getAllJobRuns(project, newConfig)
      .then(({ data }) => {
        dispatch(jobsActions.fetchAllJobRunsSuccess(data.runs || []))

        return data.runs
      })
      .catch(error => {
        dispatch(jobsActions.fetchAllJobRunsFailure(error))
        largeResponseCatchHandler(
          error,
          'Failed to fetch jobs',
          dispatch,
          config?.ui?.setRequestErrorMessage
        )
      })
  },
  fetchAllJobRunsBegin: () => ({
    type: FETCH_ALL_JOB_RUNS_BEGIN
  }),
  fetchAllJobRunsFailure: error => ({
    type: FETCH_ALL_JOB_RUNS_FAILURE,
    payload: error
  }),
  fetchAllJobRunsSuccess: jobsList => ({
    type: FETCH_ALL_JOB_RUNS_SUCCESS,
    payload: jobsList
  }),
  fetchJob: (project, jobId, iter) => dispatch => {
    dispatch(jobsActions.fetchJobBegin())

    return jobsApi
      .getJob(project, jobId, iter)
      .then(res => {
        dispatch(jobsActions.fetchJobSuccess(res.data.data))

        return res.data.data
      })
      .catch(error => {
        dispatch(jobsActions.fetchJobFailure(error.message))
      })
  },
  fetchJobBegin: () => ({
    type: FETCH_JOB_BEGIN
  }),
  fetchJobFailure: error => ({
    type: FETCH_JOB_FAILURE,
    payload: error
  }),
  fetchJobSuccess: () => ({
    type: FETCH_JOB_SUCCESS
  }),
  fetchJobFunction: (project, functionName, hash) => dispatch => {
    dispatch(jobsActions.fetchJobFunctionBegin())

    return functionsApi
      .getFunction(project, functionName, hash)
      .then(res => {
        dispatch(jobsActions.fetchJobFunctionSuccess(res.data.func))

        return res.data.func
      })
      .catch(error => {
        dispatch(jobsActions.fetchJobFunctionFailure(error))
        showErrorNotification(dispatch, error, 'Job’s function failed to load')
      })
  },
  fetchJobFunctionBegin: () => ({
    type: FETCH_JOB_FUNCTION_BEGIN
  }),
  fetchJobFunctionFailure: error => ({
    type: FETCH_JOB_FUNCTION_FAILURE,
    payload: error
  }),
  fetchJobFunctionSuccess: func => ({
    type: FETCH_JOB_FUNCTION_SUCCESS,
    payload: func
  }),
  fetchJobFunctions: (project, hash) => dispatch => {
    dispatch(jobsActions.fetchJobFunctionsBegin())

    return functionsApi
      .getFunctions(project, null, {}, hash)
      .then(res => {
        dispatch(jobsActions.fetchJobFunctionsSuccess())

        return res.data?.funcs
      })
      .catch(error => {
        dispatch(jobsActions.fetchJobFunctionsFailure(error.message))
      })
  },
  fetchJobFunctionsBegin: () => ({
    type: FETCH_JOB_FUNCTIONS_BEGIN
  }),
  fetchJobFunctionsFailure: error => ({
    type: FETCH_JOB_FUNCTIONS_FAILURE,
    payload: error
  }),
  fetchJobFunctionsSuccess: () => ({
    type: FETCH_JOB_FUNCTIONS_SUCCESS
  }),
  fetchJobLogs: (id, project) => dispatch => {
    dispatch(jobsActions.fetchJobLogsBegin())

    return jobsApi
      .getJobLogs(id, project)
      .then(result => {
        dispatch(jobsActions.fetchJobLogsSuccess())

        return result
      })
      .catch(error => dispatch(jobsActions.fetchJobLogsFailure(error)))
  },
  fetchJobLogsBegin: () => ({
    type: FETCH_JOB_LOGS_BEGIN
  }),
  fetchJobLogsFailure: error => ({
    type: FETCH_JOB_LOGS_FAILURE,
    payload: error
  }),
  fetchJobLogsSuccess: () => ({
    type: FETCH_JOB_LOGS_SUCCESS
  }),
  fetchJobs: (project, filters, config) => dispatch => {
    dispatch(jobsActions.fetchJobsBegin())
    config?.ui?.setRequestErrorMessage?.('')

    const newConfig = {
      ...config,
      params: {
        ...config?.params,
        ...generateRequestParams(filters)
      }
    }

    return jobsApi
      .getJobs(project, newConfig)
      .then(({ data }) => {
        const newJobs = (data || {}).runs.filter(job => job.metadata.iteration === 0)

        dispatch(jobsActions.fetchJobsSuccess(newJobs))
        dispatch(jobsActions.setJobsData(data.runs || []))

        return newJobs
      })
      .catch(error => {
        dispatch(jobsActions.fetchJobsFailure(error))
        largeResponseCatchHandler(
          error,
          'Failed to fetch jobs',
          dispatch,
          config?.ui?.setRequestErrorMessage
        )
      })
  },
  fetchScheduledJobs: (project, filters, config) => dispatch => {
    dispatch(jobsActions.fetchScheduledJobsBegin())
    config?.ui?.setRequestErrorMessage?.('')

    const newConfig = {
      ...config,
      params: {
        ...config?.params,
        include_last_run: 'yes'
      }
    }

    if (filters?.owner) {
      newConfig.params.owner = filters.owner
    }

    if (filters?.name) {
      newConfig.params.name = `~${filters.name}`
    }

    if (filters?.labels) {
      newConfig.params.labels = filters.labels?.split(',')
    }

    return jobsApi
      .getScheduledJobs(project, newConfig)
      .then(({ data }) => {
        const newJobs = (data || {}).schedules

        dispatch(jobsActions.fetchScheduledJobsSuccess(newJobs))

        return newJobs
      })
      .catch(error => {
        dispatch(jobsActions.fetchScheduledJobsFailure(error))
        largeResponseCatchHandler(
          error,
          'Failed to fetch scheduled jobs',
          dispatch,
          config?.ui?.setRequestErrorMessage
        )
      })
  },
  fetchSpecificJobs: (project, filters, jobList) => () => {
    const params = {
      ...generateRequestParams(filters)
    }

    return jobsApi.getSpecificJobs(project, params, jobList).then(({ data }) => {
      return data.runs
    })
  },
  fetchJobsBegin: () => ({
    type: FETCH_JOBS_BEGIN
  }),
  fetchJobsFailure: error => ({
    type: FETCH_JOBS_FAILURE,
    payload: error
  }),
  fetchJobsSuccess: jobsList => ({
    type: FETCH_JOBS_SUCCESS,
    payload: jobsList
  }),
  fetchScheduledJobsBegin: () => ({
    type: FETCH_SCHEDULED_JOBS_BEGIN
  }),
  fetchScheduledJobsFailure: error => ({
    type: FETCH_SCHEDULED_JOBS_FAILURE,
    payload: error
  }),
  fetchScheduledJobsSuccess: jobsList => ({
    type: FETCH_SCHEDULED_JOBS_SUCCESS,
    payload: jobsList
  }),
  handleRunScheduledJob: (postData, project, job) => () =>
    jobsApi.runScheduledJob(postData, project, job),
  removeJob: () => ({
    type: REMOVE_JOB
  }),
  removeJobFunction: () => ({
    type: REMOVE_JOB_FUNCTION
  }),
  removeJobError: () => ({
    type: REMOVE_JOB_ERROR
  }),
  removeNewJob: () => ({
    type: REMOVE_NEW_JOB
  }),
  removeScheduledJob: (project, scheduleName) => dispatch => {
    return jobsApi
      .removeScheduledJob(project, scheduleName)
      .catch(error => dispatch(jobsActions.removeScheduledJobFailure(error)))
  },
  removeScheduledJobFailure: error => ({
    type: REMOVE_SCHEDULED_JOB_FAILURE,
    payload: error
  }),
  runNewJob: postData => dispatch => {
    dispatch(jobsActions.runNewJobBegin())

    return jobsApi
      .runJob(postData)
      .then(result => {
        dispatch(jobsActions.runNewJobSuccess())

        return result
      })
      .catch(error => {
        dispatch(jobsActions.runNewJobFailure(getNewJobErrorMsg(error)))

        throw error
      })
  },
  runNewJobBegin: () => ({
    type: RUN_NEW_JOB_BEGIN
  }),
  runNewJobFailure: error => ({
    type: RUN_NEW_JOB_FAILURE,
    payload: error
  }),
  runNewJobSuccess: () => ({
    type: RUN_NEW_JOB_SUCCESS
  }),
  setJobsData: data => ({
    type: SET_JOBS_DATA,
    payload: data
  }),
  setLoading: isLoading => ({
    type: SET_LOADING,
    payload: isLoading
  }),
  setNewJob: newJob => ({
    type: SET_NEW_JOB,
    payload: newJob
  }),
  setNewJobCredentialsAccessKey: access_key => ({
    type: SET_NEW_JOB_CREDENTIALS_ACCESS_KEY,
    payload: access_key
  }),
  setNewJobEnvironmentVariables: environmentVariables => ({
    type: SET_NEW_JOB_ENVIRONMENT_VARIABLES,
    payload: environmentVariables
  }),
  setNewJobHyperParameters: parameters => ({
    type: SET_NEW_JOB_HYPER_PARAMETERS,
    payload: parameters
  }),
  setNewJobInputs: inputs => ({
    type: SET_NEW_JOB_INPUTS,
    payload: inputs
  }),
  setNewJobNodeSelector: nodeSelector => ({
    type: SET_NEW_JOB_NODE_SELECTOR,
    payload: nodeSelector
  }),
  setNewJobParameters: parameters => ({
    type: SET_NEW_JOB_PARAMETERS,
    payload: parameters
  }),
  setNewJobPreemtionMode: mode => ({
    type: SET_NEW_JOB_PREEMTION_MODE,
    payload: mode
  }),
  setNewJobPriorityClassName: className => ({
    type: SET_NEW_JOB_PRIORITY_CLASS_NAME,
    payload: className
  }),
  setNewJobSecretSources: secretSources => ({
    type: SET_NEW_JOB_SECRET_SOURCES,
    payload: secretSources
  }),
  setNewJobSelectorCriteria: criteria => ({
    type: SET_NEW_JOB_SELECTOR_CRITERIA,
    payload: criteria
  }),
  setNewJobSelectorResult: result => ({
    type: SET_NEW_JOB_SELECTOR_RESULT,
    payload: result
  }),
  setNewJobVolumes: volumes => ({
    type: SET_NEW_JOB_VOLUMES,
    payload: volumes
  }),
  setNewJobVolumeMounts: volume => ({
    type: SET_NEW_JOB_VOLUME_MOUNTS,
    payload: volume
  }),
  setTuningStrategy: strategy => ({
    type: SET_TUNING_STRATEGY,
    payload: strategy
  }),
  setUrl: url => ({
    type: SET_URL,
    payload: url
  })
}

export default jobsActions
