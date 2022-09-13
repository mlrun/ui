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
  PERIOD_FILTER,
  STATUS_FILTER
} from '../../../constants'
import { detailsMenu, getInfoHeaders, isJobAbortable, JOB_STEADY_STATES } from '../jobs.util'
import jobsActions from '../../../actions/jobs'
import functionsActions from '../../../actions/functions'
import workflowsActions from '../../../actions/workflow'
import filtersActions from '../../../actions/filters'
import notificationActions from '../../../actions/notification'
import {
  detailsMenu as functionsDetailsMenu,
  infoHeaders as functionsInfoHeaders
} from '../../FunctionsPage/functions.util'
import { isEveryObjectValueEmpty } from '../../../utils/isEveryObjectValueEmpty'

import { ReactComponent as Run } from 'igz-controls/images/run.svg'
import { ReactComponent as Cancel } from 'igz-controls/images/close.svg'
import { ReactComponent as Yaml } from 'igz-controls/images/yaml.svg'

export const generateFilters = () => [
  { type: PERIOD_FILTER, label: 'Period:' },
  { type: STATUS_FILTER, label: 'Status:' },
  { type: NAME_FILTER, label: 'Name:' },
  { type: DATE_RANGE_TIME_FILTER, label: 'Created at:' }
]

export const generatePageData = (
  selectedFunction,
  handleFetchFunctionLogs,
  fetchJobLogs,
  handleRemoveFunctionLogs,
  removeJobLogs
) => {
  return {
    page: JOBS_PAGE,
    details: {
      type: !isEveryObjectValueEmpty(selectedFunction) ? FUNCTIONS_PAGE : JOBS_PAGE,
      menu: !isEveryObjectValueEmpty(selectedFunction) ? functionsDetailsMenu : detailsMenu,
      infoHeaders: !isEveryObjectValueEmpty(selectedFunction) ? functionsInfoHeaders : getInfoHeaders(false),
      refreshLogs: !isEveryObjectValueEmpty(selectedFunction)
        ? handleFetchFunctionLogs
        : fetchJobLogs,
      removeLogs: !isEveryObjectValueEmpty(selectedFunction)
        ? handleRemoveFunctionLogs
        : removeJobLogs,
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
  toggleConvertedYaml
) =>
  job?.uid
    ? [
        {
          label: 'Re-run',
          icon: <Run />,
          hidden: ['local', ''].includes(job?.ui?.originalContent.metadata.labels.kind),
          onClick: handleRerunJob
        },
        {
          label: 'Monitoring',
          tooltip: !jobs_dashboard_url
            ? 'Grafana service unavailable'
            : job?.labels?.includes('kind: dask')
            ? 'Unavailable for Dask jobs'
            : '',
          disabled: !jobs_dashboard_url || job?.labels?.includes('kind: dask'),
          onClick: handleMonitoring
        },
        {
          label: 'Abort',
          icon: <Cancel />,
          onClick: handleConfirmAbortJob,
          tooltip: isJobAbortable(job, abortable_function_kinds)
            ? ''
            : 'Cannot abort jobs of this kind',
          disabled: !isJobAbortable(job, abortable_function_kinds),
          hidden: JOB_STEADY_STATES.includes(job?.state?.value)
        },
        {
          label: 'View YAML',
          icon: <Yaml />,
          onClick: toggleConvertedYaml
        }
      ]
    : [
        {
          label: 'View YAML',
          icon: <Yaml />,
          onClick: toggleConvertedYaml
        }
      ]

export const monitorWorkflowsActionCreator = {
  abortJob: jobsActions.abortJob,
  fetchFunctionLogs: functionsActions.fetchFunctionLogs,
  fetchJob: jobsActions.fetchJob,
  fetchJobFunction: jobsActions.fetchJobFunction,
  fetchJobLogs: jobsActions.fetchJobLogs,
  fetchJobs: jobsActions.fetchJobs,
  fetchWorkflow: workflowsActions.fetchWorkflow,
  fetchWorkflows: workflowsActions.fetchWorkflows,
  getFunction: functionsActions.getFunction,
  getFunctionWithHash: functionsActions.getFunctionWithHash,
  removeFunction: functionsActions.removeFunction,
  removeFunctionLogs: functionsActions.removeFunctionLogs,
  removeJobLogs: jobsActions.removeJobLogs,
  removeNewJob: jobsActions.removeNewJob,
  resetWorkflow: workflowsActions.resetWorkflow,
  setFilters: filtersActions.setFilters,
  setNotification: notificationActions.setNotification
}
