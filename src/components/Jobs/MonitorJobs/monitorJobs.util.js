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
import React from 'react'
import { isNil, isEmpty } from 'lodash'

import {
  DATE_RANGE_TIME_FILTER,
  FUNCTION_RUN_KINDS,
  JOBS_PAGE,
  LABELS_FILTER,
  NAME_FILTER,
  STATUS_FILTER
} from '../../../constants'
import {
  JOB_STEADY_STATES,
  getInfoHeaders,
  getJobsDetailsMenu,
  isJobKindAbortable,
  isJobKindDask,
  isJobAborting,
  JOB_RUNNING_STATES
} from '../jobs.util'
import { TERTIARY_BUTTON } from 'igz-controls/constants'
import jobsActions from '../../../actions/jobs'
import detailsActions from '../../../actions/details'

import { ReactComponent as MonitorIcon } from 'igz-controls/images/monitor-icon.svg'
import { ReactComponent as Run } from 'igz-controls/images/run.svg'
import { ReactComponent as Cancel } from 'igz-controls/images/close.svg'
import { ReactComponent as Yaml } from 'igz-controls/images/yaml.svg'
import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'

export const generateFilters = jobName => [
  { type: STATUS_FILTER, label: 'Status:' },
  { type: NAME_FILTER, label: 'Name:', hidden: Boolean(jobName) },
  { type: LABELS_FILTER, label: 'Labels:' },
  { type: DATE_RANGE_TIME_FILTER, label: 'Start time:' }
]

export const generatePageData = (
  handleFetchJobLogs,
  selectedJob,
  jobsDashboardUrl,
  handleMonitoring
) => {
  return {
    page: JOBS_PAGE,
    details: {
      menu: getJobsDetailsMenu(selectedJob?.labels),
      type: JOBS_PAGE,
      infoHeaders: getInfoHeaders(!isNil(selectedJob.ui_run)),
      refreshLogs: handleFetchJobLogs,
      removeLogs: () => {},
      withLogsRefreshBtn: true,
      actionButton: {
        label: 'Resource monitoring',
        tooltip: !jobsDashboardUrl ? 'Grafana service unavailable' : '',
        variant: TERTIARY_BUTTON,
        disabled: !jobsDashboardUrl,
        onClick: () => handleMonitoring(selectedJob)
      }
    }
  }
}

export const generateActionsMenu = (
  job,
  handleRerunJob,
  jobs_dashboard_url,
  handleMonitoring,
  abortable_function_kinds,
  handleConfirmAbortJob,
  toggleConvertedYaml,
  selectedJob,
  handleConfirmDeleteJob
) => {
  if (job?.uid) {
    const jobKindIsAbortable = isJobKindAbortable(job, abortable_function_kinds)
    const jobIsAborting = isJobAborting(job)
    const jobKindIsDask = isJobKindDask(job?.labels)

    return [
      [
        {
          label: 'Batch re-run',
          icon: <Run />,
          hidden: !FUNCTION_RUN_KINDS.includes(job?.ui?.originalContent.metadata.labels?.kind),
          onClick: handleRerunJob
        },
        {
          label: 'Monitoring',
          icon: <MonitorIcon />,
          tooltip: !jobs_dashboard_url
            ? 'Grafana service unavailable'
            : jobKindIsDask
            ? 'Unavailable for Dask jobs'
            : '',
          disabled: !jobs_dashboard_url || jobKindIsDask,
          onClick: handleMonitoring,
          hidden: !isEmpty(selectedJob)
        },
        {
          label: 'Abort',
          icon: <Cancel />,
          onClick: handleConfirmAbortJob,
          tooltip: jobKindIsAbortable
            ? jobIsAborting
              ? 'Job is aborting'
              : ''
            : 'Cannot abort jobs of this kind',
          disabled: !jobKindIsAbortable || jobIsAborting,
          hidden: JOB_STEADY_STATES.includes(job?.state?.value)
        },
        {
          label: 'View YAML',
          icon: <Yaml />,
          onClick: toggleConvertedYaml
        },
        {
          label: 'Delete',
          icon: <Delete />,
          className: 'danger',
          onClick: handleConfirmDeleteJob,
          hidden: JOB_RUNNING_STATES.includes(job?.state?.value)
        }
      ]
    ]
  } else {
    return [
      [
        {
          label: 'View YAML',
          icon: <Yaml />,
          onClick: toggleConvertedYaml
        }
      ]
    ]
  }
}

export const monitorJobsActionCreator = {
  abortJob: jobsActions.abortJob,
  deleteAllJobRuns: jobsActions.deleteAllJobRuns,
  deleteJob: jobsActions.deleteJob,
  fetchAllJobRuns: jobsActions.fetchAllJobRuns,
  fetchJob: jobsActions.fetchJob,
  fetchJobFunctions: jobsActions.fetchJobFunctions,
  fetchJobLogs: jobsActions.fetchJobLogs,
  fetchJobPods: detailsActions.fetchJobPods,
  fetchJobs: jobsActions.fetchJobs,
  removeJobLogs: jobsActions.removeJobLogs,
  removePods: detailsActions.removePods
}
