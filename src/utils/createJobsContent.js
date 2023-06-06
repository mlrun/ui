/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/

import { every, isNil } from 'lodash'

import { FUNCTIONS_PAGE, JOBS_PAGE, MONITOR_JOBS_TAB, MONITOR_WORKFLOWS_TAB } from '../constants'
import { formatDatetime } from './datetime'
import measureTime from './measureTime'
import { parseKeyValues } from './object'
import { generateLinkToDetailsPanel } from './generateLinkToDetailsPanel'
import { getJobIdentifier, getWorkflowJobIdentifier } from './getUniqueIdentifier'
import { getWorkflowDetailsLink } from '../components/Workflow/workflow.util'

const getIsArgumentsValid = (...args) => every(args, arg => !isNil(arg) && arg !== '')

export const createJobsMonitorTabContent = (jobs, jobName, isStagingMode) => {
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
          headerId: jobName ? 'uid' : 'name',
          headerLabel: jobName ? 'UID' : 'Name',
          id: `name.${identifierUnique}`,
          value: jobName ? job.uid || job.id : job.name,
          class: 'table-cell-name',
          type: type === 'workflow' && !isStagingMode ? 'hidden' : 'link',
          getLink: tab => {
            return jobName
              ? getIsArgumentsValid(job.uid, tab, job.name) ? generateLinkToDetailsPanel(
                  job.project,
                  JOBS_PAGE,
                  MONITOR_JOBS_TAB,
                  job.uid,
                  null,
                  tab,
                  null,
                  null,
                  job.name
                ) : ''
              : `/projects/${job.project}/${JOBS_PAGE.toLowerCase()}/${MONITOR_JOBS_TAB}/${
                  job.name
                }`
          },
          showStatus: true
        },
        {
          headerId: 'type',
          headerLabel: 'Type',
          id: `type.${identifierUnique}`,
          value: type,
          class: 'table-cell-1',
          type: 'type'
        },
        {
          headerId: 'job.uid',
          id: `uid.${identifierUnique}`,
          value: job.uid || job.id,
          class: 'table-cell-1',
          type: 'hidden'
        },
        {
          headerId: 'duration',
          headerLabel: 'Duration',
          id: `duration.${identifierUnique}`,
          value: measureTime(
            job.startTime || new Date(job.created_at),
            (job.state?.value !== 'running' && job.updated) ||
              (job.state?.value !== 'error' && new Date(job.finished_at))
          ),
          class: 'table-cell-1',
          type: 'duration'
        },
        {
          headerId: 'owner',
          headerLabel: 'Owner',
          id: `owner.${identifierUnique}`,
          value: job.owner,
          class: 'table-cell-1'
        },
        {
          headerId: 'labels',
          headerLabel: 'Labels',
          id: `labels.${identifierUnique}`,
          value: job.labels,
          class: 'table-cell-1',
          type: 'labels'
        },
        {
          headerId: 'parameters',
          headerLabel: 'Parameters',
          id: `parameters.${identifierUnique}`,
          value: job.parametersChips,
          class: 'table-cell-1',
          type: 'parameters'
        },
        {
          headerId: 'results',
          headerLabel: 'Results',
          id: `resultsChips.${identifierUnique}`,
          value: job.resultsChips,
          class: 'table-cell-3',
          type: 'results'
        },
        {
          headerId: 'updated',
          id: `updated.${identifierUnique}`,
          value: job.updated || new Date(job.finished_at),
          class: 'table-cell-1',
          type: 'hidden'
        }
      ]
    }
  })
}

export const createJobsScheduleTabContent = jobs => {
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
          headerId: 'name',
          headerLabel: 'Name',
          id: `name.${identifierUnique}`,
          value: job.name,
          class: 'table-cell-name',
          showStatus: true,
          getLink: tab => getIsArgumentsValid(scheduleJobFunctionUid, tab)
            ? generateLinkToDetailsPanel(
                job.project,
                FUNCTIONS_PAGE,
                null,
                scheduleJobFunctionUid,
                null,
                tab
              )
            : '',
          type: 'link'
        },
        {
          headerId: 'type',
          headerLabel: 'Type',
          id: `type.${identifierUnique}`,
          value: job.type,
          class: 'table-cell-small',
          type: 'type'
        },
        {
          headerId: 'nextrun',
          headerLabel: 'Next run (Local TZ)',
          id: `nextRun.${identifierUnique}`,
          value: formatDatetime(job.nextRun),
          class: 'table-cell-1',
          type: 'date'
        },
        {
          headerId: 'schedule',
          headerLabel: 'Schedule (UTC)',
          id: `schedule.${identifierUnique}`,
          value: job.scheduled_object?.schedule || null,
          class: 'table-cell-1',
          tip: 'The first day of the week (0) is Monday, and not Sunday.'
        },
        {
          headerId: 'labels',
          headerLabel: 'Labels',
          id: `labels.${identifierUnique}`,
          value: parseKeyValues(job.scheduled_object?.task.metadata.labels || {}),
          class: 'table-cell-1',
          type: 'labels'
        },
        {
          headerId: 'lastrun',
          headerLabel: 'Last run (Local TZ)',
          id: `lastRun.${identifierUnique}`,
          value: formatDatetime(job.startTime),
          class: 'table-cell-1',
          getLink: lastRunLink
        },
        {
          headerId: 'createdtime',
          headerLabel: 'Created time (Local TZ)',
          id: `createdTime.${identifierUnique}`,
          value: formatDatetime(job.createdTime, 'Not yet started'),
          class: 'table-cell-1',
          type: 'date'
        },
        {
          headerId: 'function',
          id: `func.${identifierUnique}`,
          value: job.func,
          class: '',
          type: 'hidden'
        }
      ]
    }
  })
}

export const createJobsWorkflowsTabContent = (jobs, projectName, isStagingMode, isSelectedItem) => {
  return jobs.map(job => {
    const identifierUnique = getJobIdentifier(job, true)
    const jobName = job.name.replace(`${projectName}-`, '')

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
          headerId: 'name',
          headerLabel: 'Name',
          id: `name.${identifierUnique}`,
          value: jobName,
          class: 'table-cell-name',
          type: 'link',
          getLink: () => {
            return getWorkflowDetailsLink(projectName, job.id, null, null, MONITOR_WORKFLOWS_TAB)
          },
          showStatus: true
        },
        {
          headerId: 'uid',
          id: `uid.${identifierUnique}`,
          value: job?.id,
          class: 'table-cell-1',
          type: 'hidden',
          hidden: isSelectedItem
        },
        {
          headerId: 'createdat',
          headerLabel: 'Created at',
          id: `createdAt.${identifierUnique}`,
          value: formatDatetime(job.created_at, 'N/A'),
          class: 'table-cell-1',
          hidden: isSelectedItem
        },
        {
          headerId: 'finishedat',
          headerLabel: 'Finished at',
          id: `finishedAt.${identifierUnique}`,
          value: formatDatetime(job.finished_at, 'N/A'),
          class: 'table-cell-1',
          hidden: isSelectedItem
        },
        {
          headerId: 'duration',
          headerLabel: 'Duration',
          id: `duration.${identifierUnique}`,
          value: measureTime(
            job.startTime || new Date(job.created_at),
            (job.state?.value !== 'running' && job.updated) ||
              (job.state?.value !== 'error' && new Date(job.finished_at))
          ),
          class: 'table-cell-1',
          type: 'duration',
          hidden: isSelectedItem
        },
        {
          headerId: 'updated',
          id: `updated.${identifierUnique}`,
          value: job.updated || new Date(job.finished_at),
          class: 'table-cell-1',
          type: 'hidden',
          hidden: isSelectedItem
        }
      ]
    }
  })
}

export const createJobsWorkflowContent = (
  jobs,
  projectName,
  workflowId,
  isStagingMode,
  isSelectedItem
) => {
  return jobs.map(job => {
    const identifierUnique = getWorkflowJobIdentifier(job, true)
    const jobName = job.name.replace(`${projectName}-`, '')

    return {
      data: {
        ...job,
        ui: {
          ...job.ui,
          identifier: getWorkflowJobIdentifier(job),
          identifierUnique: identifierUnique
        }
      },
      content: [
        {
          headerId: 'name',
          headerLabel: 'Name',
          id: `name.${identifierUnique}`,
          value: jobName,
          class: 'table-cell-name',
          type: 'link',
          getLink: tab => {
            return getWorkflowDetailsLink(
              projectName,
              workflowId,
              job.customData,
              tab,
              MONITOR_WORKFLOWS_TAB
            )
          },
          showStatus: true
        },
        {
          headerId: 'kind',
          headerLabel: 'Kind',
          id: `kind.${identifierUnique}`,
          value: job.run_type,
          class: 'table-cell-1',
          type: 'type',
          hidden: isSelectedItem
        },
        {
          headerId: 'uid',
          id: `uid.${identifierUnique}`,
          value: job.uid || job.id,
          class: 'table-cell-1',
          type: 'hidden',
          hidden: isSelectedItem
        },
        {
          headerId: 'startedAt',
          headerLabel: 'Started at',
          id: `startedAt.${identifierUnique}`,
          value: formatDatetime(job.startedAt, 'N/A'),
          class: 'table-cell-1',
          hidden: isSelectedItem
        },
        {
          headerId: 'finishedat',
          headerLabel: 'Finished at',
          id: `finishedAt.${identifierUnique}`,
          value: formatDatetime(job.finishedAt, 'N/A'),
          class: 'table-cell-1',
          hidden: isSelectedItem
        },
        {
          headerId: 'duration',
          headerLabel: 'Duration',
          id: `duration.${identifierUnique}`,
          value: measureTime(
            new Date(job.startedAt),
            job.state?.value !== 'error' && new Date(job.finishedAt)
          ),
          class: 'table-cell-1',
          type: 'duration',
          hidden: isSelectedItem
        }
      ]
    }
  })
}
