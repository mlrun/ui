import { truncateUid } from './string'
import { formatDatetime } from './datetime'

const createJobsContent = jobs => {
  return jobs.map(job => ({
    name: {
      value: job.name,
      size: 'jobs_medium'
    },
    uid: {
      value: truncateUid(job.uid),
      size: 'jobs_small'
    },
    startTime: {
      value: formatDatetime(job.startTime),
      size: 'jobs_small'
    },
    state: {
      value: job.state,
      size: 'jobs_small',
      type: 'state'
    },
    owner: {
      value: job.owner,
      size: 'jobs_small'
    },
    parameters: {
      value: job.parameters,
      size: 'jobs_big',
      type: 'parameters'
    },
    resultsChips: {
      value: job.resultsChips,
      size: 'jobs_big',
      type: 'results'
    }
  }))
}

export default createJobsContent
