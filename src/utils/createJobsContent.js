import { formatDatetime } from './datetime'
import measureTime from './measureTime'

const createJobsContent = (content, groupedByWorkflow) => {
  return content.map(contentItem => {
    let type = contentItem.labels?.find(label => label.includes('kind:'))
    type = type?.slice(type.indexOf(':') + 2)

    return {
      name: {
        value: contentItem.name,
        class: 'jobs_medium'
      },
      type: {
        value: groupedByWorkflow ? 'workflow' : type,
        class: 'jobs_type',
        type: 'type'
      },
      uid: {
        value: contentItem.uid || contentItem.id,
        class: 'jobs_small',
        type: 'hidden'
      },
      startTime: {
        value: formatDatetime(
          contentItem.startTime || new Date(contentItem.created_at)
        ),
        class: 'jobs_start-time',
        type: 'date'
      },
      duration: {
        value: measureTime(
          contentItem.startTime || new Date(contentItem.created_at),
          (contentItem.state !== 'running' && contentItem.updated) ||
            (contentItem.status !== 'error' &&
              new Date(contentItem.finished_at))
        ),
        class: 'jobs_duration',
        type: 'duration'
      },
      owner: {
        value: contentItem.owner,
        class: 'jobs_extra-small'
      },
      labels: {
        value: contentItem.labels,
        class: 'jobs_small',
        type: 'labels'
      },
      parameters: {
        value: contentItem.parameters,
        class: 'jobs_small',
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
