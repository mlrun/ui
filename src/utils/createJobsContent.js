import { formatDatetime } from './datetime'
import measureTime from './measureTime'
import cronstrue from 'cronstrue'
import { parseKeyValues } from './object'
import { generateLinkToDetailsPanel } from './generateLinkToDetailsPanel'
import { getJobIdentifier } from './getUniqueIdentifier'

import { FUNCTIONS_PAGE, JOBS_PAGE, MONITOR_TAB } from '../constants'

const createJobsContent = (
  content,
  isSelectedItem,
  groupedByWorkflow,
  scheduled
) => {
  return content.map(contentItem => {
    if (contentItem) {
      if (scheduled) {
        const [, , scheduleJobFunctionUid] =
          contentItem.func?.match(/\w(?<!\d)[\w'-]*/g, '') || []
        const [, projectName, jobUid] =
          contentItem.lastRunUri?.match(/(.+)@(.+)#([^:]+)(?::(.+))?/) || []
        const lastRunLink = () =>
          projectName &&
          jobUid &&
          `/projects/${projectName}/jobs/monitor/${jobUid}/overview`

        return {
          name: {
            value: contentItem.name,
            class: 'jobs_big',
            identifier: getJobIdentifier(contentItem),
            identifierUnique: getJobIdentifier(contentItem, true),
            getLink: tab =>
              generateLinkToDetailsPanel(
                contentItem.project,
                FUNCTIONS_PAGE,
                null,
                scheduleJobFunctionUid,
                null,
                tab
              )
          },
          type: {
            value: contentItem.type,
            class: 'jobs_big',
            type: 'type',
            hidden: isSelectedItem
          },
          nextRun: {
            value: formatDatetime(contentItem.nextRun),
            class: 'jobs_big',
            type: 'date',
            hidden: isSelectedItem
          },
          schedule: {
            value: contentItem.scheduled_object
              ? cronstrue.toString(contentItem.scheduled_object?.schedule)
              : null,
            class: 'jobs_big',
            hidden: isSelectedItem
          },
          labels: {
            value: parseKeyValues(
              contentItem.scheduled_object?.task.metadata.labels || {}
            ),
            class: 'jobs_big',
            type: 'labels',
            hidden: isSelectedItem
          },
          lastRun: {
            value: formatDatetime(contentItem.start_time),
            class: 'jobs_big',
            getLink: lastRunLink,
            hidden: isSelectedItem
          },
          createdTime: {
            value: formatDatetime(contentItem.createdTime, 'Not yet started'),
            class: 'jobs_medium',
            type: 'date',
            hidden: isSelectedItem
          },
          func: {
            value: contentItem.func,
            class: '',
            type: 'hidden',
            hidden: isSelectedItem
          }
        }
      } else {
        const type =
          contentItem.labels
            ?.find(label => label.includes('kind:'))
            ?.replace('kind: ', '') ?? ''

        return {
          name: {
            value: contentItem.name,
            class: 'jobs_medium',
            identifier: getJobIdentifier(contentItem),
            identifierUnique: getJobIdentifier(contentItem, true),
            getLink: tab =>
              generateLinkToDetailsPanel(
                contentItem.project,
                JOBS_PAGE,
                MONITOR_TAB,
                contentItem.uid,
                null,
                tab
              )
          },
          type: {
            value: typeof groupedByWorkflow !== 'boolean' ? 'workflow' : type,
            class: 'jobs_extra-small',
            type: 'type',
            hidden: isSelectedItem
          },
          uid: {
            value: contentItem.uid || contentItem?.id,
            class: 'jobs_small',
            type: 'hidden',
            hidden: isSelectedItem
          },
          duration: {
            value: measureTime(
              contentItem.startTime || new Date(contentItem.created_at),
              (contentItem.state?.value !== 'running' && contentItem.updated) ||
                (contentItem.state?.value !== 'error' &&
                  new Date(contentItem.finished_at))
            ),
            class: 'jobs_extra-small',
            type: 'duration',
            hidden: isSelectedItem
          },
          owner: {
            value: contentItem.owner,
            class: 'jobs_extra-small',
            hidden: isSelectedItem
          },
          labels: {
            value: contentItem.labels,
            class: 'jobs_extra-small',
            type: 'labels',
            hidden: isSelectedItem
          },
          parameters: {
            value: contentItem.parameters,
            class: 'jobs_extra-small',
            type: 'parameters',
            hidden: isSelectedItem
          },
          resultsChips: {
            value: contentItem.resultsChips,
            class: 'jobs_big',
            type: 'results',
            hidden: isSelectedItem
          },
          updated: {
            value: contentItem.updated || new Date(contentItem.finished_at),
            class: 'jobs_small',
            type: 'hidden',
            hidden: isSelectedItem
          }
        }
      }
    }

    return []
  })
}

export default createJobsContent
