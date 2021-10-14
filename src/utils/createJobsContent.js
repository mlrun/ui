import cronstrue from 'cronstrue'

import {
  FUNCTIONS_PAGE,
  JOBS_PAGE,
  MONITOR_JOBS_TAB,
  SCHEDULE_TAB
} from '../constants'
import { formatDatetime } from './datetime'
import measureTime from './measureTime'
import { parseKeyValues } from './object'
import { generateLinkToDetailsPanel } from './generateLinkToDetailsPanel'
import { getJobIdentifier } from './getUniqueIdentifier'
import { isDemoMode } from './helper'
import { getWorkflowDetailsLink } from '../components/Workflow/workflow.util'

const createJobsContent = (
  content,
  isSelectedItem,
  params,
  search,
  groupedByWorkflow
) => {
  return content.map(contentItem => {
    if (contentItem) {
      if (params.pageTab === SCHEDULE_TAB) {
        const [, , scheduleJobFunctionUid] =
          contentItem.func?.match(/\w(?<!\d)[\w'-]*/g, '') || []
        const [, projectName, jobUid] =
          contentItem.lastRunUri?.match(/(.+)@(.+)#([^:]+)(?::(.+))?/) || []
        const lastRunLink = () =>
          projectName &&
          jobUid &&
          `/projects/${projectName}/jobs/${MONITOR_JOBS_TAB}/${jobUid}/overview`

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
      } else if (params.pageTab === MONITOR_JOBS_TAB || params.workflowId) {
        const type =
          contentItem.labels
            ?.find(label => label.includes('kind:'))
            ?.replace('kind: ', '') ??
          (groupedByWorkflow && 'workflow') ??
          ''

        return {
          name: {
            value: contentItem.name,
            class: 'jobs_medium',
            type: type === 'workflow' && !isDemoMode(search) ? 'hidden' : '',
            identifier: getJobIdentifier(contentItem),
            identifierUnique: getJobIdentifier(contentItem, true),
            getLink: tab => {
              return type === 'workflow' || params.workflowId
                ? getWorkflowDetailsLink(
                    params,
                    contentItem.id,
                    contentItem.uid,
                    tab
                  )
                : generateLinkToDetailsPanel(
                    contentItem.project,
                    JOBS_PAGE,
                    MONITOR_JOBS_TAB,
                    contentItem.uid,
                    null,
                    tab
                  )
            }
          },
          type: {
            value: type,
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
      } else {
        return {
          name: {
            value: contentItem.name,
            class: 'jobs_big',
            identifier: getJobIdentifier(contentItem),
            identifierUnique: getJobIdentifier(contentItem, true),
            getLink: () => {
              return getWorkflowDetailsLink(params, contentItem.id)
            }
          },
          uid: {
            value: contentItem?.id,
            class: 'jobs_small',
            type: 'hidden',
            hidden: isSelectedItem
          },
          createdAt: {
            value: formatDatetime(new Date(contentItem.created_at), 'N/A'),
            class: 'jobs_small',
            hidden: isSelectedItem
          },
          finishedAt: {
            value: formatDatetime(new Date(contentItem.finished_at), 'N/A'),
            class: 'jobs_small',
            hidden: isSelectedItem
          },
          duration: {
            value: measureTime(
              contentItem.startTime || new Date(contentItem.created_at),
              (contentItem.state?.value !== 'running' && contentItem.updated) ||
                (contentItem.state?.value !== 'error' &&
                  new Date(contentItem.finished_at))
            ),
            class: 'jobs_small',
            type: 'duration',
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
