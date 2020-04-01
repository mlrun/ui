import jobsApi from '../api/jobs-api'
import {
  FETCH_JOB_LOGS_BEGIN,
  FETCH_JOB_LOGS_FAILURE,
  FETCH_JOB_LOGS_SUCCESS,
  FETCH_JOBS_BEGIN,
  FETCH_JOBS_FAILURE,
  FETCH_JOBS_SUCCESS,
  REMOVE_JOB_LOGS,
  SET_NEW_JOB_INPUTS,
  SET_NEW_JOB_VOLUMES,
  SET_NEW_JOB,
  SET_NEW_JOB_VOLUME_MOUNTS,
  SET_NEW_JOB_INPUT_PATH,
  SET_NEW_JOB_OUTPUT_PATH
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
  setNewJob: newJob => ({
    type: SET_NEW_JOB,
    payload: newJob
  }),
  setNewJobInputPath: path => ({
    type: SET_NEW_JOB_INPUT_PATH,
    payload: path
  }),
  setNewJobOutputPath: path => ({
    type: SET_NEW_JOB_OUTPUT_PATH,
    payload: path
  })
}

export default jobsActions
