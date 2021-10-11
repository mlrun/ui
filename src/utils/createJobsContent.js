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
      const identifier = getJobIdentifier(contentItem, true)

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
            id: `name${identifier}`,
            value: contentItem.name,
            class: 'jobs_big',
            identifier: getJobIdentifier(contentItem),
            identifierUnique: identifier,
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
            id: `type${identifier}`,
            value: contentItem.type,
            class: 'jobs_big',
            type: 'type',
            hidden: isSelectedItem
          },
          nextRun: {
            id: `nextRun${identifier}`,
            value: formatDatetime(contentItem.nextRun),
            class: 'jobs_big',
            type: 'date',
            hidden: isSelectedItem
          },
          schedule: {
            id: `schedule${identifier}`,
            value: contentItem.scheduled_object
              ? cronstrue.toString(contentItem.scheduled_object?.schedule)
              : null,
            class: 'jobs_big',
            hidden: isSelectedItem
          },
          labels: {
            id: `labels${identifier}`,
            value: parseKeyValues(
              contentItem.scheduled_object?.task.metadata.labels || {}
            ),
            class: 'jobs_big',
            type: 'labels',
            hidden: isSelectedItem
          },
          lastRun: {
            id: `lastRun${identifier}`,
            value: formatDatetime(contentItem.start_time),
            class: 'jobs_big',
            getLink: lastRunLink,
            hidden: isSelectedItem
          },
          createdTime: {
            id: `createdTime${identifier}`,
            value: formatDatetime(contentItem.createdTime, 'Not yet started'),
            class: 'jobs_medium',
            type: 'date',
            hidden: isSelectedItem
          },
          func: {
            id: `func${identifier}`,
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
            id: `name${identifier}`,
            value: contentItem.name,
            class: 'jobs_medium',
            type: type === 'workflow' && !isDemoMode(search) ? 'hidden' : '',
            identifier: getJobIdentifier(contentItem),
            identifierUnique: identifier,
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
            id: `type${identifier}`,
            value: type,
            class: 'jobs_extra-small',
            type: 'type',
            hidden: isSelectedItem
          },
          uid: {
            id: `uid${identifier}`,
            value: contentItem.uid || contentItem?.id,
            class: 'jobs_small',
            type: 'hidden',
            hidden: isSelectedItem
          },
          duration: {
            id: `duration${identifier}`,
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
            id: `owner${identifier}`,
            value: contentItem.owner,
            class: 'jobs_extra-small',
            hidden: isSelectedItem
          },
          labels: {
            id: `labels${identifier}`,
            value: contentItem.labels,
            class: 'jobs_extra-small',
            type: 'labels',
            hidden: isSelectedItem
          },
          parameters: {
            id: `parameters${identifier}`,
            value: contentItem.parameters,
            class: 'jobs_extra-small',
            type: 'parameters',
            hidden: isSelectedItem
          },
          resultsChips: {
            id: `resultsChips${identifier}`,
            value: contentItem.resultsChips,
            class: 'jobs_big',
            type: 'results',
            hidden: isSelectedItem
          },
          updated: {
            id: `updated${identifier}`,
            value: contentItem.updated || new Date(contentItem.finished_at),
            class: 'jobs_small',
            type: 'hidden',
            hidden: isSelectedItem
          }
        }
      } else {
        return {
          name: {
            id: `name${identifier}`,
            value: contentItem.name,
            class: 'jobs_big',
            identifier: getJobIdentifier(contentItem),
            identifierUnique: identifier,
            getLink: () => {
              return getWorkflowDetailsLink(params, contentItem.id)
            }
          },
          uid: {
            id: `uid${identifier}`,
            value: contentItem?.id,
            class: 'jobs_small',
            type: 'hidden',
            hidden: isSelectedItem
          },
          createdAt: {
            id: `createdAt${identifier}`,
            value: formatDatetime(new Date(contentItem.created_at), 'N/A'),
            class: 'jobs_small',
            hidden: isSelectedItem
          },
          finishedAt: {
            id: `finishedAt${identifier}`,
            value: formatDatetime(new Date(contentItem.finished_at), 'N/A'),
            class: 'jobs_small',
            hidden: isSelectedItem
          },
          duration: {
            id: `duration${identifier}`,
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
            id: `updated${identifier}`,
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
