import { formatDatetime } from './datetime'
import measureTime from './measureTime'
import cronstrue from 'cronstrue'

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
            class: 'jobs_medium',
            type: 'type'
          },
          createdTime: {
            value: formatDatetime(contentItem.createdTime, 'Not yet started'),
            class: 'jobs_medium',
            type: 'date'
          },
          nextRun: {
            value: formatDatetime(contentItem.nextRun),
            class: 'jobs_big',
            type: 'date'
          },
          schedule: {
            value: cronstrue.toString(contentItem.scheduled_object.schedule),
            class: 'jobs_big'
          },
          func: {
            value: contentItem.func,
            class: '',
            type: 'hidden'
          }
        }
      } else {
        let type = contentItem.labels?.find(label => label.includes('kind:'))
        type = type?.slice(type.indexOf(':') + 2)

        return {
          name: {
            value: contentItem.name,
            class: 'jobs_medium'
          },
          type: {
            value: typeof groupedByWorkflow !== 'boolean' ? 'workflow' : type,
            class: 'jobs_extra-small',
            type: 'type'
          },
          uid: {
            value: contentItem.uid || contentItem?.id,
            class: 'jobs_small',
            type: 'hidden'
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
