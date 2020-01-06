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
      .catch(error => console.error(error))
  },
  setJobs: jobsList => ({
    type: 'SET_JOBS',
    payload: jobsList
  })
}

export default jobsActions
