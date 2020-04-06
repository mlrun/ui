import { formatDatetime } from './datetime'
import measureTime from './measureTime'

const createJobsContent = jobs => {
  return jobs.map(job => {
    let type = job.labels.filter(item => item.indexOf('kind:') >= 0 && item)
    type = type[0].slice(type[0].indexOf(':') + 2)
    return {
      name: {
        value: job.name,
        class: 'jobs_medium'
      },
      type: {
        value: type,
        class: 'jobs_small',
        type: 'type'
      },
      uid: {
        value: job.uid,
        class: 'jobs_small',
        type: 'uid'
      },
      startTime: {
        value: formatDatetime(job.startTime),
        class: 'jobs_small',
        type: 'date'
      },
      duration: {
        value: measureTime(
          job.startTime,
          job.state !== 'running' && job.updated
        ),
        class: 'jobs_small',
        type: 'duration'
      },
      owner: {
        value: job.owner,
        class: 'jobs_small'
      },
      parameters: {
        value: job.parameters,
        class: 'jobs_big',
        type: 'parameters'
      },
      resultsChips: {
        value: job.resultsChips,
        class: 'jobs_big',
        type: 'results'
      },
      updated: {
        value: job.updated,
        class: 'jobs_small',
        type: 'hidden'
      }
    }
  })
}

export default createJobsContent
