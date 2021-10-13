import jobsApi from '../api/jobs-api'
import {
  ABORT_JOB_BEGIN,
  ABORT_JOB_FAILURE,
  ABORT_JOB_SUCCESS,
  EDIT_JOB_FAILURE,
  FETCH_JOBS_BEGIN,
  FETCH_JOBS_FAILURE,
  FETCH_JOBS_SUCCESS,
  FETCH_JOB_FUNCTION_BEGIN,
  FETCH_JOB_FUNCTION_FAILURE,
  FETCH_JOB_FUNCTION_SUCCESS,
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
  SET_URL,
  SET_NEW_JOB_SELECTOR_CRITERIA,
  SET_NEW_JOB_SELECTOR_RESULT,
  RUN_NEW_JOB_BEGIN,
  RUN_NEW_JOB_SUCCESS,
  SET_NEW_JOB_NODE_SELECTOR,
  FETCH_JOB_SUCCESS,
  FETCH_JOB_BEGIN,
  FETCH_JOB_FAILURE,
  SET_NEW_JOB_CREDENTIALS_ACCESS_KEY,
  FETCH_SCHEDULED_JOB_ACCESS_KEY_BEGIN,
  FETCH_SCHEDULED_JOB_ACCESS_KEY_END,
  REMOVE_JOB
} from '../constants'

const jobsActions = {
  abortJob: (project, job) => dispatch => {
    dispatch(jobsActions.abortJobBegin())

    return jobsApi
      .abortJob(project, job.uid, job.iteration)
      .then(() => dispatch(jobsActions.abortJobSuccess()))
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
  editJob: (postData, project) => () => jobsApi.editJob(postData, project),
  editJobFailure: error => ({
    type: EDIT_JOB_FAILURE,
    payload: error
  }),
  fetchJob: (project, jobId) => dispatch => {
    dispatch(jobsActions.fetchJobBegin())

    return jobsApi
      .getJob(project, jobId)
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

    return jobsApi
      .getJobFunction(project, functionName, hash)
      .then(res => {
        dispatch(jobsActions.fetchJobFunctionSuccess())

        return res.data.func
      })
      .catch(error => {
        dispatch(jobsActions.fetchJobFunctionFailure(error.message))
      })
  },
  fetchJobFunctionBegin: () => ({
    type: FETCH_JOB_FUNCTION_BEGIN
  }),
  fetchJobFunctionFailure: error => ({
    type: FETCH_JOB_FUNCTION_FAILURE,
    payload: error
  }),
  fetchJobFunctionSuccess: () => ({
    type: FETCH_JOB_FUNCTION_SUCCESS
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
  fetchJobs: (project, filters, scheduled) => dispatch => {
    const getJobs = scheduled ? jobsApi.getScheduledJobs : jobsApi.getAllJobs

    dispatch(jobsActions.fetchJobsBegin())

    return getJobs(project, filters)
      .then(({ data }) => {
        const newJobs = scheduled
          ? (data || {}).schedules
          : (data || {}).runs.filter(job => job.metadata.iteration === 0)

        dispatch(jobsActions.fetchJobsSuccess(newJobs))
        dispatch(jobsActions.setAllJobsData(data.runs || {}))

        return newJobs
      })
      .catch(error => {
        dispatch(jobsActions.fetchJobsFailure(error))

        throw error
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
  fetchScheduledJobAccessKey: (projectName, jobName) => dispatch => {
    dispatch(jobsActions.fetchScheduledJobAccessKeyBegin())

    return jobsApi
      .getScheduledJobAccessKey(projectName, jobName)
      .then(result => {
        dispatch(jobsActions.fetchScheduledJobAccessKeyEnd())

        return result
      })
      .catch(error => {
        dispatch(jobsActions.fetchScheduledJobAccessKeyEnd())
        throw error
      })
  },
  fetchScheduledJobAccessKeyBegin: () => ({
    type: FETCH_SCHEDULED_JOB_ACCESS_KEY_BEGIN
  }),
  fetchScheduledJobAccessKeyEnd: () => ({
    type: FETCH_SCHEDULED_JOB_ACCESS_KEY_END
  }),
  handleRunScheduledJob: (postData, project, job) => () =>
    jobsApi.runScheduledJob(postData, project, job),
  removeJob: () => ({
    type: REMOVE_JOB
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
  runNewJob: postData => dispatch => {
    dispatch(jobsActions.runNewJobBegin())

    return jobsApi
      .runJob(postData)
      .then(result => {
        dispatch(jobsActions.runNewJobSuccess())

        return result
      })
      .catch(error => {
        dispatch(jobsActions.runNewJobFailure(error.message))

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
  setAllJobsData: data => ({
    type: SET_ALL_JOBS_DATA,
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
