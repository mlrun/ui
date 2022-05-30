import cronstrue from 'cronstrue'

import {
  FUNCTIONS_PAGE,
  JOBS_PAGE,
  MONITOR_JOBS_TAB,
  MONITOR_WORKFLOWS_TAB
} from '../constants'
import { formatDatetime } from './datetime'
import measureTime from './measureTime'
import { parseKeyValues } from './object'
import { generateLinkToDetailsPanel } from './generateLinkToDetailsPanel'
import { getJobIdentifier } from './getUniqueIdentifier'
import { getWorkflowDetailsLink } from '../components/Workflow/workflow.util'

export const createJobsMonitorTabContent = (jobs, params, isStagingMode) => {
  return jobs.map(job => {
    const identifierUnique = getJobIdentifier(job, true)
    const type = job.labels?.find(label => label.includes('kind:'))?.replace('kind: ', '') ?? ''

    return {
      data: {
        ...job,
        ui: {
          ...job.ui,
          identifier: getJobIdentifier(job),
          identifierUnique: identifierUnique
        }
      },
      content: [
        {
          header: 'Name',
          id: `name.${identifierUnique}`,
          value: params.jobName ? job.uid || job.id : job.name,
          class: 'jobs_medium',
          type: type === 'workflow' && !isStagingMode ? 'hidden' : 'link',
          getLink: tab => {
            return params.jobName
              ? generateLinkToDetailsPanel(
                  job.project,
                  JOBS_PAGE,
                  MONITOR_JOBS_TAB,
                  job.uid,
                  null,
                  tab,
                  null,
                  null,
                  job.name
                )
              : `/projects/${job.project}/${JOBS_PAGE.toLowerCase()}/${MONITOR_JOBS_TAB}/${
                  job.name
                }`
          },
          showStatus: true
        },
        {
          header: 'Type',
          id: `type.${identifierUnique}`,
          value: type,
          class: 'jobs_extra-small',
          type: 'type'
        },
        {
          id: `uid.${identifierUnique}`,
          value: job.uid || job.id,
          class: 'jobs_small',
          type: 'hidden'
        },
        {
          header: 'Duration',
          id: `duration.${identifierUnique}`,
          value: measureTime(
            job.startTime || new Date(job.created_at),
            (job.state?.value !== 'running' && job.updated) ||
              (job.state?.value !== 'error' && new Date(job.finished_at))
          ),
          class: 'jobs_extra-small',
          type: 'duration'
        },
        {
          header: 'Owner',
          id: `owner.${identifierUnique}`,
          value: job.owner,
          class: 'jobs_extra-small'
        },
        {
          header: 'Labels',
          id: `labels.${identifierUnique}`,
          value: job.labels,
          class: 'jobs_extra-small',
          type: 'labels'
        },
        {
          header: 'Parameters',
          id: `parameters.${identifierUnique}`,
          value: job.parameters,
          class: 'jobs_extra-small',
          type: 'parameters'
        },
        {
          header: 'Results',
          id: `resultsChips.${identifierUnique}`,
          value: job.resultsChips,
          class: 'jobs_big',
          type: 'results'
        },
        {
          id: `updated.${identifierUnique}`,
          value: job.updated || new Date(job.finished_at),
          class: 'jobs_small',
          type: 'hidden'
        }
      ]
    }
  })
}

export const createJobsScheduleTabContent = (jobs, params, isStagingMode) => {
  return jobs.map(job => {
    const identifierUnique = getJobIdentifier(job, true)
    const [, , scheduleJobFunctionUid] = job.func?.match(/\w[\w'-]*/g, '') || []
    const [, projectName, jobUid] = job.lastRunUri?.match(/(.+)@(.+)#([^:]+)(?::(.+))?/) || []
    const jobName = job.name
    const lastRunLink = () =>
      projectName &&
      jobName &&
      jobUid &&
      `/projects/${projectName}/jobs/${MONITOR_JOBS_TAB}/${jobName}/${jobUid}/overview`

    return {
      data: {
        ...job,
        ui: {
          ...job.ui,
          identifier: getJobIdentifier(job),
          identifierUnique: identifierUnique
        }
      },
      content: [
        {
          header: 'Name',
          id: `name.${identifierUnique}`,
          value: job.name,
          class: 'jobs_big',
          showStatus: true,
          getLink: tab =>
            generateLinkToDetailsPanel(
              job.project,
              FUNCTIONS_PAGE,
              null,
              scheduleJobFunctionUid,
              null,
              tab
            ),
          type: 'link'
        },
        {
          header: 'Type',
          id: `type.${identifierUnique}`,
          value: job.type,
          class: 'jobs_big',
          type: 'type'
        },
        {
          header: 'Next run (Local TZ)',
          id: `nextRun.${identifierUnique}`,
          value: formatDatetime(job.nextRun),
          class: 'jobs_big',
          type: 'date'
        },
        {
          header: 'Schedule (UTC)',
          id: `schedule.${identifierUnique}`,
          value: job.scheduled_object ? cronstrue.toString(job.scheduled_object?.schedule) : null,
          class: 'jobs_big'
        },
        {
          header: 'Labels',
          id: `labels.${identifierUnique}`,
          value: parseKeyValues(job.scheduled_object?.task.metadata.labels || {}),
          class: 'jobs_big',
          type: 'labels'
        },
        {
          header: 'Last run (Local TZ)',
          id: `lastRun.${identifierUnique}`,
          value: formatDatetime(job.start_time),
          class: 'jobs_big',
          getLink: lastRunLink
        },
        {
          header: 'Created time (Local TZ)',
          id: `createdTime.${identifierUnique}`,
          value: formatDatetime(job.createdTime, 'Not yet started'),
          class: 'jobs_medium',
          type: 'date'
        },
        {
          id: `func.${identifierUnique}`,
          value: job.func,
          class: '',
          type: 'hidden'
        }
      ]
    }
  })
}

export const createJobsWorkflowsTabContent = (jobs, params, isStagingMode, isSelectedItem) => {
  return jobs.map(job => {
    const identifierUnique = getJobIdentifier(job, true)
    const type =
      job.labels?.find(label => label.includes('kind:'))?.replace('kind: ', '') ?? 'workflow'

    return params.workflowId
      ? {
          data: {
            ...job,
            ui: {
              ...job.ui,
              identifier: getJobIdentifier(job),
              identifierUnique: identifierUnique
            }
          },
          content: [
            {
              header: 'Name',
              id: `name.${identifierUnique}`,
              value: job.name,
              class: 'jobs_medium',
              type: type === 'workflow' && !isStagingMode ? 'hidden' : 'link',
              getLink: tab => {
                return getWorkflowDetailsLink(params, job.id, job.uid, tab, MONITOR_WORKFLOWS_TAB)
              },
              showStatus: true
            },
            {
              header: 'Type',
              id: `type.${identifierUnique}`,
              value: type,
              class: 'jobs_extra-small',
              type: 'type',
              hidden: isSelectedItem
            },
            {
              id: `uid.${identifierUnique}`,
              value: job.uid || job.id,
              class: 'jobs_small',
              type: 'hidden',
              hidden: isSelectedItem
            },
            {
              header: 'Duration',
              id: `duration.${identifierUnique}`,
              value: measureTime(
                job.startTime || new Date(job.created_at),
                (job.state?.value !== 'running' && job.updated) ||
                  (job.state?.value !== 'error' && new Date(job.finished_at))
              ),
              class: 'jobs_extra-small',
              type: 'duration',
              hidden: isSelectedItem
            },
            {
              header: 'Owner',
              id: `owner.${identifierUnique}`,
              value: job.owner,
              class: 'jobs_extra-small',
              hidden: isSelectedItem
            },
            {
              header: 'Labels',
              id: `labels.${identifierUnique}`,
              value: job.labels,
              class: 'jobs_extra-small',
              type: 'labels',
              hidden: isSelectedItem
            },
            {
              header: 'Parameters',
              id: `parameters.${identifierUnique}`,
              value: job.parameters,
              class: 'jobs_extra-small',
              type: 'parameters',
              hidden: isSelectedItem
            },
            {
              header: 'Results',
              id: `resultsChips.${identifierUnique}`,
              value: job.resultsChips,
              class: 'jobs_big',
              type: 'results',
              hidden: isSelectedItem
            },
            {
              id: `updated.${identifierUnique}`,
              value: job.updated || new Date(job.finished_at),
              class: 'jobs_small',
              type: 'hidden',
              hidden: isSelectedItem
            }
          ]
        }
      : {
          data: {
            ...job,
            ui: {
              ...job.ui,
              identifier: getJobIdentifier(job),
              identifierUnique: identifierUnique
            }
          },
          content: [
            {
              header: 'Name',
              id: `name.${identifierUnique}`,
              value: job.name,
              class: 'jobs_big',
              getLink: () => {
                return getWorkflowDetailsLink(params, job.id, null, null, MONITOR_WORKFLOWS_TAB)
              },
              type: 'link',
              showStatus: true
            },
            {
              id: `uid.${identifierUnique}`,
              value: job?.id,
              class: 'jobs_small',
              type: 'hidden',
              hidden: isSelectedItem
            },
            {
              header: 'Created at',
              id: `createdAt.${identifierUnique}`,
              value: formatDatetime(new Date(job.created_at), 'N/A'),
              class: 'jobs_small',
              hidden: isSelectedItem
            },
            {
              header: 'Finished at',
              id: `finishedAt.${identifierUnique}`,
              value: formatDatetime(new Date(job.finished_at), 'N/A'),
              class: 'jobs_small',
              hidden: isSelectedItem
            },
            {
              header: 'Duration',
              id: `duration.${identifierUnique}`,
              value: measureTime(
                job.startTime || new Date(job.created_at),
                (job.state?.value !== 'running' && job.updated) ||
                  (job.state?.value !== 'error' && new Date(job.finished_at))
              ),
              class: 'jobs_small',
              type: 'duration',
              hidden: isSelectedItem
            },
            {
              id: `updated.${identifierUnique}`,
              value: job.updated || new Date(job.finished_at),
              class: 'jobs_small',
              type: 'hidden',
              hidden: isSelectedItem
            }
          ]
        }
  })
}
