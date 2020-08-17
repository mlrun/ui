import { formatDatetime } from './datetime'
import measureTime from './measureTime'

const createJobsContent = (content, groupedByWorkflow, scheduled) => {
  return content.map(contentItem => {
    if (contentItem) {
      if (scheduled) {
        return {
          name: {
            value: contentItem.name,
            class: 'jobs_big'
          },
          type: {
            value: contentItem.type,
            class: 'jobs_big',
            type: 'type'
          },
          createdTime: {
            value: formatDatetime(contentItem.createdTime, 'Not yet started'),
            class: 'jobs_big',
            type: 'date'
          },
          nextRun: {
            value: formatDatetime(contentItem.nextRun),
            class: 'jobs_big',
            type: 'date'
          }
        }
      } else {
        let type = contentItem.labels?.find(label => label.includes('kind:'))
        type = type?.slice(type.indexOf(':') + 2)
        const startTime =
          typeof groupedByWorkflow === 'boolean'
            ? contentItem.startTime
            : new Date(contentItem.created_at)

        return {
          name: {
            value: contentItem.name,
            class: 'jobs_medium'
          },
          type: {
            value: typeof groupedByWorkflow !== 'boolean' ? 'workflow' : type,
            class: 'table-body__cell jobs_extra-small',
            type: 'type'
          },
          uid: {
            value: contentItem.uid || contentItem?.id,
            class: 'jobs_small',
            type: 'hidden'
          },
          startTime: {
            value: formatDatetime(startTime, 'Not yet started'),
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
            class: 'jobs_extra-small',
            type: 'duration'
          },
          owner: {
            value: contentItem.owner,
            class: 'jobs_extra-small'
          },
          labels: {
            value: contentItem.labels,
            class: 'jobs_extra-small',
            type: 'labels'
          },
          parameters: {
            value: contentItem.parameters,
            class: 'jobs_extra-small',
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
      }
    }

    return []
  })
}

export default createJobsContent
