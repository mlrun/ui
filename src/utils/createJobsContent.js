import { formatDatetime } from './datetime'
import measureTime from './measureTime'
import cronstrue from 'cronstrue'
import { parseKeyValues } from './object'
import { SCHEDULE_TAB } from '../constants'

const createJobsContent = (content, groupedByWorkflow, pageTab) => {
  return content.map(contentItem => {
    if (contentItem) {
      if (pageTab === SCHEDULE_TAB) {
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
          nextRun: {
            value: formatDatetime(contentItem.nextRun),
            class: 'jobs_big',
            type: 'date'
          },
          schedule: {
            value: cronstrue.toString(contentItem.scheduled_object.schedule),
            class: 'jobs_big'
          },
          labels: {
            value: parseKeyValues(
              contentItem.scheduled_object.task.metadata.labels || {}
            ),
            class: 'jobs_big',
            type: 'labels'
          },
          lastRun: {
            value: {
              date: formatDatetime(contentItem.start_time),
              state: contentItem.state
            },
            class: 'jobs_big',
            type: 'date with state'
          },
          createdTime: {
            value: formatDatetime(contentItem.createdTime, 'Not yet started'),
            class: 'jobs_medium',
            type: 'date'
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
