import jobsApi from '../api/jobs-api'
import {
  FETCH_JOBS_BEGIN,
  FETCH_JOBS_FAILURE,
  FETCH_JOBS_SUCCESS,
  FETCH_JOB_LOGS_BEGIN,
  FETCH_JOB_LOGS_FAILURE,
  FETCH_JOB_LOGS_SUCCESS,
  REMOVE_JOB_LOGS,
  REMOVE_NEW_JOB,
  SET_LOADING,
  SET_NEW_JOB,
  SET_NEW_JOB_ENVIRONMENT_VARIABLES,
  SET_NEW_JOB_HYPER_PARAMETERS,
  SET_NEW_JOB_INPUTS,
  SET_NEW_JOB_PARAMETERS,
  SET_NEW_JOB_SCHEDULE,
  SET_NEW_JOB_SECRET_SOURCES,
  SET_NEW_JOB_VOLUMES,
  SET_NEW_JOB_VOLUME_MOUNTS,
  SET_TUNING_STRATEGY,
  SET_URL
} from '../constants'

const jobsActions = {
  fetchJobs: (project, status, labels) => dispatch => {
    const getJobs = status ? jobsApi.filterByStatus : jobsApi.getAll

    dispatch(jobsActions.fetchJobsBegin())

    return getJobs(project, status && status, labels)
      .then(({ data }) => {
        const newJobs = (data || {}).runs.filter(
          job => job.metadata.iteration === 0
        )

        dispatch(jobsActions.fetchJobsSuccess(newJobs))

        return newJobs
      })
      .catch(error => dispatch(jobsActions.fetchJobsFailure(error)))
  },
  fetchJobsBegin: () => ({
    type: FETCH_JOBS_BEGIN
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
  fetchJobLogsSuccess: logs => ({
    type: FETCH_JOB_LOGS_SUCCESS,
    payload: logs
  }),
  fetchJobLogsFailure: error => ({
    type: FETCH_JOB_LOGS_FAILURE,
    payload: error
  }),
  fetchJobsSuccess: jobsList => ({
    type: FETCH_JOBS_SUCCESS,
    payload: jobsList
  }),
  fetchJobsFailure: error => ({
    type: FETCH_JOBS_FAILURE,
    payload: error
  }),
  removeJobLogs: () => ({
    type: REMOVE_JOB_LOGS
  }),
  setNewJob: newJob => ({
    type: SET_NEW_JOB,
    payload: newJob
  }),
  setNewJobEnvironmentVariables: environmentVariables => ({
    type: SET_NEW_JOB_ENVIRONMENT_VARIABLES,
    payload: environmentVariables
  }),
  setNewJobInputs: inputs => ({
    type: SET_NEW_JOB_INPUTS,
    payload: inputs
  }),
  setNewJobVolumes: volumes => ({
    type: SET_NEW_JOB_VOLUMES,
    payload: volumes
  }),
  setNewJobVolumeMounts: volume => ({
    type: SET_NEW_JOB_VOLUME_MOUNTS,
    payload: volume
  }),
  removeNewJob: () => ({
    type: REMOVE_NEW_JOB
  }),
  setNewJobParameters: parameters => ({
    type: SET_NEW_JOB_PARAMETERS,
    payload: parameters
  }),
  setNewJobSchedule: schedule => ({
    type: SET_NEW_JOB_SCHEDULE,
    payload: schedule
  }),
  setNewJobSecretSources: secretSources => ({
    type: SET_NEW_JOB_SECRET_SOURCES,
    payload: secretSources
  }),
  setNewJobHyperParameters: parameters => ({
    type: SET_NEW_JOB_HYPER_PARAMETERS,
    payload: parameters
  }),
  setUrl: url => ({
    type: SET_URL,
    payload: url
  }),
  setTuningStrategy: strategy => ({
    type: SET_TUNING_STRATEGY,
    payload: strategy
  }),
  runNewJob: postData => () => jobsApi.runJob(postData),
  setLoading: isLoading => ({
    type: SET_LOADING,
    payload: isLoading
  })
}

export default jobsActions
