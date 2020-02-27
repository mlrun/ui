import { truncateUid } from './string'
import { formatDatetime } from './datetime'
import measureTime from './measureTime'

const createJobsContent = jobs => {
  return jobs.map(job => {
    return {
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
      duration: {
        value: measureTime(
          job.startTime,
          job.state !== 'running' && job.updated
        ),
        size: 'jobs_small',
        type: 'duration'
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
    }
  })
}

export default createJobsContent
