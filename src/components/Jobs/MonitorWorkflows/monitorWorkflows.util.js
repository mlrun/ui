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

import {
  DATE_RANGE_TIME_FILTER,
  FUNCTIONS_PAGE,
  JOBS_PAGE,
  NAME_FILTER,
  STATUS_FILTER
} from '../../../constants'
import {
  getJobsDetailsMenu,
  getInfoHeaders,
  isJobKindAbortable,
  JOB_STEADY_STATES,
  isJobKindDask,
  isJobAborting,
  JOB_RUNNING_STATES,
  isJobKindLocal
} from '../jobs.util'
import jobsActions from '../../../actions/jobs'
import functionsActions from '../../../actions/functions'
import workflowsActions from '../../../actions/workflow'
import detailsActions from '../../../actions/details'
import {
  detailsMenu as functionsDetailsMenu,
  infoHeaders as functionsInfoHeaders
} from '../../FunctionsPage/functions.util'
import { isEveryObjectValueEmpty } from '../../../utils/isEveryObjectValueEmpty'
import { generateStatusFilter } from '../../FilterMenu/filterMenu.settings'

import { ReactComponent as MonitorIcon } from 'igz-controls/images/monitor-icon.svg'
import { ReactComponent as Run } from 'igz-controls/images/run.svg'
import { ReactComponent as Cancel } from 'igz-controls/images/close.svg'
import { ReactComponent as Yaml } from 'igz-controls/images/yaml.svg'
import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'

export const generateFilters = () => [
  {
    type: STATUS_FILTER,
    label: 'Status:',
    options: generateStatusFilter(true)
  },
  { type: NAME_FILTER, label: 'Name:' },
  { type: DATE_RANGE_TIME_FILTER, label: 'Created at:' }
]

export const generatePageData = (
  selectedFunction,
  handleFetchFunctionLogs,
  handleFetchJobLogs,
  handleRemoveFunctionLogs,
  selectedJobLabels
) => {
  return {
    page: JOBS_PAGE,
    details: {
      type: !isEveryObjectValueEmpty(selectedFunction) ? FUNCTIONS_PAGE : JOBS_PAGE,
      menu: !isEveryObjectValueEmpty(selectedFunction)
        ? functionsDetailsMenu
        : getJobsDetailsMenu(selectedJobLabels),
      infoHeaders: !isEveryObjectValueEmpty(selectedFunction)
        ? functionsInfoHeaders
        : getInfoHeaders(false),
      refreshLogs: !isEveryObjectValueEmpty(selectedFunction)
        ? handleFetchFunctionLogs
        : handleFetchJobLogs,
      removeLogs: !isEveryObjectValueEmpty(selectedFunction) ? handleRemoveFunctionLogs : () => {},
      withLogsRefreshBtn: isEveryObjectValueEmpty(selectedFunction)
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
  handleConfirmDeleteJob,
  toggleConvertedYaml
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
          hidden: isJobKindLocal(job),
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
          onClick: handleMonitoring
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

export const monitorWorkflowsActionCreator = {
  abortJob: jobsActions.abortJob,
  deleteJob: jobsActions.deleteJob,
  fetchFunctionLogs: functionsActions.fetchFunctionLogs,
  fetchJob: jobsActions.fetchJob,
  fetchJobFunctions: jobsActions.fetchJobFunctions,
  fetchJobLogs: jobsActions.fetchJobLogs,
  fetchJobPods: detailsActions.fetchJobPods,
  fetchWorkflow: workflowsActions.fetchWorkflow,
  fetchWorkflows: workflowsActions.fetchWorkflows,
  getFunction: functionsActions.getFunction,
  removePods: detailsActions.removePods,
  resetWorkflow: workflowsActions.resetWorkflow
}
