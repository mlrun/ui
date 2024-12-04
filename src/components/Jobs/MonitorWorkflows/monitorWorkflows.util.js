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

import { FUNCTIONS_PAGE, GROUP_BY_NONE, GROUP_BY_WORKFLOW, JOBS_PAGE } from '../../../constants'
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
import functionsActions from '../../../actions/functions'
import {
  detailsMenu as functionsDetailsMenu,
  infoHeaders as functionsInfoHeaders
} from '../../FunctionsPage/functions.util'
import { isEveryObjectValueEmpty } from '../../../utils/isEveryObjectValueEmpty'

import { ReactComponent as MonitorIcon } from 'igz-controls/images/monitor-icon.svg'
import { ReactComponent as Run } from 'igz-controls/images/run.svg'
import { ReactComponent as Cancel } from 'igz-controls/images/close.svg'
import { ReactComponent as Yaml } from 'igz-controls/images/yaml.svg'
import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'
import { ReactComponent as Rerun } from 'igz-controls/images/rerun.svg'

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
  handleConfirmAbortJob,
  handleConfirmDeleteJob,
  toggleConvertedYaml,
  handleRerun
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
    const runningStates = ['running', 'pending']

    return [
      [
        {
          label: 'View YAML',
          icon: <Yaml />,
          onClick: toggleConvertedYaml
        },
        {
          hidden: runningStates.includes(job?.state?.value),
          icon: <Rerun />,
          label: 'Retry',
          onClick: () => handleRerun(job)
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

export const monitorWorkflowsActionCreator = {
  fetchFunctionLogs: functionsActions.fetchFunctionLogs
}
