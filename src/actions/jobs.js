import jobsApi from '../api/jobs-api'
import { parseKeyValues } from '../utils'

const jobsActions = {
  fetchJobs: project => dispatch => {
    return jobsApi
      .getAll(project)
      .then(({ data }) => {
        const newJobs = (data || {}).runs
          .filter(job => job.metadata.iteration === 0)
          .map(job => ({
            uid: job.metadata.uid,
            iteration: job.metadata.iteration,
            iterationStats: job.status.iterations || [],
            iterations: [],
            startTime: new Date(job.status.start_time),
            state: job.status.state,
            name: job.metadata.name,
            labels: parseKeyValues(job.metadata.labels || {}),
            logLevel: job.spec.log_level,
            inputs: job.spec.inputs || {},
            parameters: parseKeyValues(job.spec.parameters || {}),
            results: job.status.results || {},
            resultsChips: parseKeyValues(job.status.results || {}),
            artifacts: job.status.artifacts || [],
            outputPath: job.spec.output_path
          }))
        dispatch(jobsActions.setJobs(newJobs))
        return newJobs
      })
      .catch(() => {})
  },
  fetchJobLogs: (id, project) => dispatch => {
    return jobsApi.getJobLogs(id, project).then(result => {
      dispatch(jobsActions.setJobLogs(result.data))
    })
  },
  setJobs: jobsList => ({
    type: 'SET_JOBS',
    payload: jobsList
  }),
  setSelectedJob: job => ({
    type: 'SET_SELECTED_JOB',
    payload: job
  }),
  setJobLogs: logs => ({
    type: 'SET_JOB_LOGS',
    payload: logs
  })
}

export default jobsActions
