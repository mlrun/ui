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
import { getJobIdentifier } from '../../../utils/getUniqueIdentifier'
import { validateArguments } from '../../../utils/validateArguments'
import { generateLinkToDetailsPanel } from '../../../utils/generateLinkToDetailsPanel'
import { JOB_KIND_WORKFLOW, JOBS_PAGE, MONITOR_JOBS_TAB } from '../../../constants'
import measureTime from '../../../utils/measureTime'
import { formatDatetime } from '../../../utils'

export const createJobsMonitoringContent = (jobs, jobName, isStagingMode) => {
  return jobs.map(job => {
    const identifierUnique = getJobIdentifier(job, true)
    const type = job.labels?.find(label => label.includes('kind:'))?.replace('kind: ', '') ?? ''
    const getLink = tab => {
      if (jobName) {
        return validateArguments(job.uid, tab, job.name)
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
          : ''
      } else {
        return `/projects/${job.project}/${JOBS_PAGE.toLowerCase()}/${MONITOR_JOBS_TAB}/${job.name}`
      }
    }

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
          value: jobName ? job.uid : job.name,
          className: 'table-cell-name',
          type: type === JOB_KIND_WORKFLOW && !isStagingMode ? 'hidden' : 'link',
          getLink,
          showStatus: true
        },
        {
          headerId: 'projectName',
          headerLabel: 'Project name',
          id: `projectName.${identifierUnique}`,
          value: job.project,
          className: 'table-cell-1'
        },
        {
          headerId: 'type',
          headerLabel: 'Type',
          id: `type.${identifierUnique}`,
          value: type,
          className: 'table-cell-1',
          type: 'type'
        },
        {
          headerId: 'job.uid',
          id: `uid.${identifierUnique}`,
          value: job.uid,
          className: 'table-cell-1',
          type: 'hidden'
        },
        {
          headerId: 'startTime',
          headerLabel: 'Start time',
          id: `startTime.${identifierUnique}`,
          value: formatDatetime(job.startTime),
          className: 'table-cell-1'
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
          className: 'table-cell-1',
          type: 'duration'
        },
        {
          headerId: 'owner',
          headerLabel: 'Owner',
          id: `owner.${identifierUnique}`,
          value: job.owner,
          className: 'table-cell-1'
        },
        {
          headerId: 'parameters',
          headerLabel: 'Parameters',
          id: `parameters.${identifierUnique}`,
          value: job.parametersChips,
          className: 'table-cell-1',
          type: 'parameters'
        },
        {
          headerId: 'labels',
          headerLabel: 'Labels',
          id: `labels.${identifierUnique}`,
          value: job.labels,
          className: 'table-cell-1',
          type: 'labels'
        },

        {
          headerId: 'updated',
          id: `updated.${identifierUnique}`,
          value: job.updated || new Date(job.finished_at),
          className: 'table-cell-1',
          type: 'hidden'
        }
      ]
    }
  })
}
