import { formatDatetime } from './datetime'
import measureTime from './measureTime'

const createJobsContent = content => {
  return content.map(contentItem => {
    let type = contentItem.labels?.filter(
      item => item.indexOf('kind:') >= 0 && item
    )
    type = type && type[0]?.slice(type[0].indexOf(':') + 2)
    return {
      name: {
        value: contentItem.name,
        class: 'jobs_medium'
      },
      type: {
        value: type ? type : 'workflow',
        class: 'jobs_small',
        type: 'type'
      },
      uid: {
        value: contentItem.uid || contentItem.id,
        class: 'jobs_small',
        type: 'uid'
      },
      startTime: {
        value: formatDatetime(
          contentItem.startTime || new Date(contentItem.created_at)
        ),
        class: 'jobs_small',
        type: 'date'
      },
      duration: {
        value: measureTime(
          contentItem.startTime || new Date(contentItem.created_at),
          (contentItem.state !== 'running' && contentItem.updated) ||
            (contentItem.status !== 'error' &&
              new Date(contentItem.finished_at))
        ),
        class: 'jobs_small',
        type: 'duration'
      },
      owner: {
        value: contentItem.owner,
        class: 'jobs_small'
      },
      parameters: {
        value: contentItem.parameters,
        class: 'jobs_big',
        type: 'parameters'
      },
      resultsChips: {
        value: contentItem.resultsChips,
        class: 'jobs_big',
        type: 'results'
      },
      updated: {
        value: contentItem.updated || new Date(contentItem.finished_at),
        class: 'jobs_small',
        type: 'hidden'
      }
    }
  })
}

export default createJobsContent
