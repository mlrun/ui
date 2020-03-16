import jobsApi from '../api/jobs-api'
import {
  FETCH_JOBS_BEGIN,
  FETCH_JOBS_FAILURE,
  FETCH_JOBS_SUCCESS
} from '../constants'

const jobsActions = {
  fetchJobs: (project, status) => dispatch => {
    const getJobs = status ? jobsApi.filterByStatus : jobsApi.getAll

    dispatch(jobsActions.fetchJobsBegin())

    return getJobs(project, status && status)
      .then(handleErrors)
      .then(({ data }) => {
        const newJobs = (data || {}).runs.filter(
          job => job.metadata.iteration === 0
        )

        dispatch(jobsActions.fetchJobsSuccess(newJobs))

        return newJobs
      })
      .catch(() => dispatch(jobsActions.fetchJobsFailure()))
  },
  fetchJobsBegin: () => ({
    type: FETCH_JOBS_BEGIN
  }),
  fetchJobLogs: (id, project) => dispatch => {
    return jobsApi.getJobLogs(id, project).then(result => {
      dispatch(jobsActions.setJobLogs(result.data))
    })
  },
  fetchJobsSuccess: jobsList => ({
    type: FETCH_JOBS_SUCCESS,
    payload: jobsList
  }),
  fetchJobsFailure: error => ({
    type: FETCH_JOBS_FAILURE,
    payload: error
  }),
  setJobLogs: logs => ({
    type: 'SET_JOB_LOGS',
    payload: logs
  })
}

function handleErrors(response) {
  if (!response.data.ok) {
    throw Error(response.statusText)
  }
  return response
}

export default jobsActions
