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
import { debounce } from 'lodash'

import {
  FUNCTIONS_PAGE,
  FUNCTION_RUNNING_STATE,
  GROUP_BY_NONE,
  GROUP_BY_WORKFLOW,
  JOBS_PAGE,
  PENDING_STATE,
  UNKNOWN_STATE
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
import {
  detailsMenu as functionsDetailsMenu,
  infoHeaders as functionsInfoHeaders
} from '../../FunctionsPage/functions.util'
import { isEveryObjectValueEmpty } from '../../../utils/isEveryObjectValueEmpty'

import MonitorIcon from 'igz-controls/images/monitor-icon.svg?react'
import Run from 'igz-controls/images/run.svg?react'
import Cancel from 'igz-controls/images/cancel.svg?react'
import Close from 'igz-controls/images/close.svg?react'
import Yaml from 'igz-controls/images/yaml.svg?react'
import Delete from 'igz-controls/images/delete.svg?react'
import Rerun from 'igz-controls/images/rerun.svg?react'

export const generatePageData = (
  selectedFunction,
  handleFetchFunctionLogs,
  handleFetchJobLogs,
  handleRemoveFunctionLogs,
  selectedJob
) => {
  return {
    page: JOBS_PAGE,
    details: {
      type: !isEveryObjectValueEmpty(selectedFunction) ? FUNCTIONS_PAGE : JOBS_PAGE,
      menu: !isEveryObjectValueEmpty(selectedFunction)
        ? functionsDetailsMenu
        : getJobsDetailsMenu(selectedJob),
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
  ce,
  handleConfirmAbortJob,
  handleConfirmDeleteJob,
  handleConfirmTerminateWorkflow,
  accessibleProjectsMap,
  toggleConvertedYaml,
  handleRerun,
  rerunIsDisabled
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
          icon: <Close />,
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
    const runningStates = ['running', 'pending', 'terminating']

    return [
      [
        {
          label: 'View YAML',
          icon: <Yaml />,
          onClick: toggleConvertedYaml
        },
        {
          disabled: rerunIsDisabled || [PENDING_STATE, UNKNOWN_STATE].includes(job?.state?.value),
          hidden: runningStates.includes(job?.state?.value),
          icon: <Rerun />,
          label: 'Retry',
          onClick: () => handleRerun(job),
          tooltip: [PENDING_STATE, UNKNOWN_STATE].includes(job?.state?.value)
            ? 'Retry is unavailable while workflow status is pending, refresh the display to check for updates.'
            : ''
        },
        {
          label: 'Terminate',
          icon: <Cancel />,
          className: 'danger',
          onClick: handleConfirmTerminateWorkflow,
          hidden: ce || !accessibleProjectsMap[job?.project],
          disabled: job?.state?.value !== FUNCTION_RUNNING_STATE
        }
      ]
    ]
  }
}

export const fetchInitialWorkflows = debounce(
  (filters, params, getWorkflows, setFilters, dispatch, workflowsAreInitializedRef) => {
    if (!workflowsAreInitializedRef.current) {
      if (params.workflowId) {
        dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
      } else {
        getWorkflows({ ...filters, groupBy: GROUP_BY_WORKFLOW })
        dispatch(setFilters({ groupBy: GROUP_BY_WORKFLOW }))
        workflowsAreInitializedRef.current = true
      }
    }
  }
)
