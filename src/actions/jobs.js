import jobsApi from '../api/jobs-api'
import { parseKeyValues } from '../utils'

const jobsActions = {
  fetchJobs: () => dispatch => {
    return jobsApi
      .getAll()
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
  fetchJobLogs: id => dispatch => {
    return jobsApi.getJobLogs(id).then(result => {
      dispatch(jobsActions.setJobLogs(result.data))
    })
  },
  getArtifacts: (schema, path) => dispatch => {
    return jobsApi.getJobArtifacts(schema, path).then(res => {
      const artifacts = {}
      if (res.headers['content-type'].includes('text/csv')) {
        const data = res.data.split('\n')
        let content = data.slice(1)
        content = content.map(item => item.split(','))
        content.pop()
        artifacts.type = 'table'
        artifacts.data = {
          headers: data[0].split(','),
          content: content
        }
      }
      if (res.headers['content-type'].includes('text/plain')) {
        artifacts.type = 'text'
        artifacts.data = {
          content: res.data
        }
      }
      if (res.headers['content-type'].includes('text/html')) {
        artifacts.type = 'html'
        artifacts.data = {
          content: res.data
        }
      }
      dispatch(jobsActions.setJobArtifacts(artifacts))
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
  }),
  setJobArtifacts: artifacts => ({
    type: 'SET_JOB_ARTIFACTS',
    payload: artifacts
  })
}

export default jobsActions
