import jobsApi from '../api/jobs-api'
import {
  FETCH_JOB_LOGS_BEGIN,
  FETCH_JOB_LOGS_FAILURE,
  FETCH_JOB_LOGS_SUCCESS,
  FETCH_JOBS_BEGIN,
  FETCH_JOBS_FAILURE,
  FETCH_JOBS_SUCCESS,
  REMOVE_JOB_LOGS
} from '../constants'
import { handleErrors } from '../utils/handleErrors'

const jobsActions = {
  fetchJobs: (project, status, labels) => dispatch => {
    const getJobs = status ? jobsApi.filterByStatus : jobsApi.getAll

    dispatch(jobsActions.fetchJobsBegin())

    return getJobs(project, status && status, labels)
      .then(handleErrors)
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
      .then(handleErrors)
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
  })
}

export default jobsActions
