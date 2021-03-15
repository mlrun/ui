import jobsApi from '../api/jobs-api'
import {
  EDIT_JOB_FAILURE,
  FETCH_JOBS_BEGIN,
  FETCH_JOBS_FAILURE,
  FETCH_JOBS_SUCCESS,
  FETCH_JOB_LOGS_BEGIN,
  FETCH_JOB_LOGS_FAILURE,
  FETCH_JOB_LOGS_SUCCESS,
  REMOVE_JOB_ERROR,
  REMOVE_JOB_LOGS,
  REMOVE_NEW_JOB,
  REMOVE_SCHEDULED_JOB_FAILURE,
  RUN_NEW_JOB_FAILURE,
  SET_ALL_JOBS_DATA,
  SET_LOADING,
  SET_NEW_JOB,
  SET_NEW_JOB_ENVIRONMENT_VARIABLES,
  SET_NEW_JOB_HYPER_PARAMETERS,
  SET_NEW_JOB_INPUTS,
  SET_NEW_JOB_PARAMETERS,
  SET_NEW_JOB_SECRET_SOURCES,
  SET_NEW_JOB_VOLUMES,
  SET_NEW_JOB_VOLUME_MOUNTS,
  SET_TUNING_STRATEGY,
  SET_URL
} from '../constants'

const jobsActions = {
  editJob: (postData, project) => () => jobsApi.editJob(postData, project),
  editJobFailure: error => ({
    type: EDIT_JOB_FAILURE,
    payload: error
  }),
  fetchJobLogs: (id, project) => dispatch => {
    dispatch(jobsActions.fetchJobLogsBegin())

    return jobsApi
      .getJobLogs(id, project)
      .then(result => {
        dispatch(jobsActions.fetchJobLogsSuccess(result.data))
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
  fetchJobLogsSuccess: logs => ({
    type: FETCH_JOB_LOGS_SUCCESS,
    payload: logs
  }),
  fetchJobs: (project, status, event, scheduled) => dispatch => {
    const getJobs = scheduled
      ? jobsApi.getScheduled
      : status
      ? jobsApi.filterByStatus
      : jobsApi.getAll

    dispatch(jobsActions.fetchJobsBegin())

    return getJobs(project, status && status, event)
      .then(({ data }) => {
        const newJobs = scheduled
          ? (data || {}).schedules
          : (data || {}).runs.filter(job => job.metadata.iteration === 0)

        dispatch(jobsActions.fetchJobsSuccess(newJobs))
        dispatch(jobsActions.setAllJobsData(data.runs || {}))

        return newJobs
      })
      .catch(error => dispatch(jobsActions.fetchJobsFailure(error)))
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
  removeJobError: () => ({
    type: REMOVE_JOB_ERROR
  }),
  removeJobLogs: () => ({
    type: REMOVE_JOB_LOGS
  }),
  removeNewJob: () => ({
    type: REMOVE_NEW_JOB
  }),
  removeScheduledJob: (project, scheduleName) => dispatch => {
    return jobsApi
      .removeScheduledJob(project, scheduleName)
      .then(result => result.data)
      .catch(error => dispatch(jobsActions.removeScheduledJobFailure(error)))
  },
  removeScheduledJobFailure: error => ({
    type: REMOVE_SCHEDULED_JOB_FAILURE,
    payload: error
  }),
  runNewJob: postData => () => jobsApi.runJob(postData),
  runNewJobFailure: error => ({
    type: RUN_NEW_JOB_FAILURE,
    payload: error
  }),
  handleRunScheduledJob: (postData, project, job) => () =>
    jobsApi.runScheduledJob(postData, project, job),
  setAllJobsData: data => ({
    type: SET_ALL_JOBS_DATA,
    payload: data
  }),
  setNewJob: newJob => ({
    type: SET_NEW_JOB,
    payload: newJob
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
  setNewJobParameters: parameters => ({
    type: SET_NEW_JOB_PARAMETERS,
    payload: parameters
  }),
  setNewJobSecretSources: secretSources => ({
    type: SET_NEW_JOB_SECRET_SOURCES,
    payload: secretSources
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
  setLoading: isLoading => ({
    type: SET_LOADING,
    payload: isLoading
  }),
  setUrl: url => ({
    type: SET_URL,
    payload: url
  })
}

export default jobsActions
