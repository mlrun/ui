import React from 'react'

import {
  DATE_RANGE_TIME_FILTER,
  FUNCTIONS_PAGE,
  JOBS_PAGE,
  LABELS_FILTER,
  MONITOR_JOBS_TAB,
  MONITOR_WORKFLOWS_TAB,
  NAME_FILTER,
  PERIOD_FILTER,
  SCHEDULE_TAB,
  STATUS_FILTER,
  TERTIARY_BUTTON
} from '../../constants'
import { infoHeaders as functionsInfoHeaders } from '../FunctionsPage/functions.util'
import { detailsMenu as functionsDetailsMenu } from '../FunctionsPage/functions.util'

import { ReactComponent as Delete } from '../../images/delete.svg'
import { ReactComponent as Dropdown } from '../../images/dropdown.svg'
import { ReactComponent as Edit } from '../../images/edit.svg'
import { ReactComponent as Run } from '../../images/run.svg'
import { ReactComponent as Cancel } from '../../images/close.svg'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import jobsActions from '../../actions/jobs'
import functionsActions from '../../actions/functions'
import detailsActions from '../../actions/details'
import workflowsActions from '../../actions/workflow'
import filtersActions from '../../actions/filters'
import notificationActions from '../../actions/notification'
import { generateKeyValues } from '../../utils'

export const page = JOBS_PAGE
export const infoHeaders = [
  { label: 'UID', id: 'uid' },
  { label: 'Start time', id: 'startTime' },
  { label: 'Last Updated', id: 'updated' },
  { label: 'Parameters', id: 'parameters' },
  { label: 'Function', id: 'function' },
  { label: 'Results', id: 'resultsChips' },
  { label: 'Labels', id: 'labels' },
  { label: 'Log level', id: 'logLevel' },
  { label: 'Output path', id: 'outputPath' },
  { label: 'Total iterations', id: 'iterations' }
]
export const actionsMenuHeader = 'New Job'

const JOB_STEADY_STATES = ['completed', 'error', 'aborted']

export const generateTableHeaders = (pageTab, workflowId, isSelectedItem) => {
  if (pageTab === SCHEDULE_TAB) {
    return [
      {
        header: 'Name',
        class: 'jobs_big'
      },
      {
        header: 'Type',
        class: 'jobs_big',
        hidden: isSelectedItem
      },
      {
        header: 'Next run (Local TZ)',
        class: 'jobs_big',
        hidden: isSelectedItem
      },
      {
        header: 'Schedule (UTC)',
        class: 'jobs_big',
        hidden: isSelectedItem
      },
      {
        header: 'Labels',
        class: 'jobs_big',
        hidden: isSelectedItem
      },
      {
        header: 'Last run (Local TZ)',
        class: 'jobs_big',
        hidden: isSelectedItem
      },
      {
        header: 'Created time (Local TZ)',
        class: 'jobs_medium',
        hidden: isSelectedItem
      },
      {
        header: '',
        class: 'action_cell',
        hidden: isSelectedItem
      }
    ]
  }

  if (pageTab === MONITOR_WORKFLOWS_TAB && !workflowId) {
    return [
      {
        header: 'Name',
        class: 'jobs_big'
      },
      {
        header: 'Created at',
        class: 'jobs_small',
        hidden: isSelectedItem
      },
      {
        header: 'Finished at',
        class: 'jobs_small',
        hidden: isSelectedItem
      },
      {
        header: 'Duration',
        class: 'jobs_small',
        hidden: isSelectedItem
      },
      {
        header: '',
        class: 'action_cell',
        hidden: isSelectedItem
      }
    ]
  }

  return [
    {
      header: 'Name',
      class: 'jobs_medium'
    },
    {
      header: 'Type',
      class: 'jobs_extra-small',
      hidden: isSelectedItem
    },
    {
      header: 'Duration',
      class: 'jobs_extra-small',
      hidden: isSelectedItem
    },
    {
      header: 'Owner',
      class: 'jobs_extra-small',
      hidden: isSelectedItem
    },
    {
      header: 'Labels',
      class: 'jobs_extra-small',
      hidden: isSelectedItem
    },
    {
      header: 'Parameters',
      class: 'jobs_extra-small',
      hidden: isSelectedItem
    },
    {
      header: 'Results',
      class: 'jobs_big',
      hidden: isSelectedItem
    },
    {
      header: '',
      class: 'action_cell',
      hidden: isSelectedItem
    }
  ]
}
export const detailsMenu = [
  {
    label: 'overview',
    id: 'overview'
  },
  {
    label: 'inputs',
    id: 'inputs'
  },
  {
    label: 'artifacts',
    id: 'artifacts'
  },
  {
    label: 'results',
    id: 'results'
  },
  {
    label: 'logs',
    id: 'logs'
  },
  {
    label: 'pods',
    id: 'pods'
  }
]

const filtersByTab = (pageTab, jobName) => {
  if (pageTab === MONITOR_JOBS_TAB) {
    return [
      { type: PERIOD_FILTER, label: 'Period:' },
      { type: STATUS_FILTER, label: 'Status:' },
      { type: NAME_FILTER, label: 'Name:', hidden: Boolean(jobName) },
      { type: LABELS_FILTER, label: 'Labels:' },
      { type: DATE_RANGE_TIME_FILTER, label: 'Start time:' }
    ]
  } else if (pageTab === MONITOR_WORKFLOWS_TAB) {
    return [
      { type: PERIOD_FILTER, label: 'Period:' },
      { type: STATUS_FILTER, label: 'Status:' },
      { type: NAME_FILTER, label: 'Name:' },
      { type: DATE_RANGE_TIME_FILTER, label: 'Created at:' }
    ]
  } else if (pageTab === SCHEDULE_TAB) {
    return [
      { type: NAME_FILTER, label: 'Name:' },
      { type: LABELS_FILTER, label: 'Labels:' }
    ]
  }
}

const generateTabs = () => {
  return [
    { id: MONITOR_JOBS_TAB, label: 'Monitor Jobs' },
    { id: MONITOR_WORKFLOWS_TAB, label: 'Monitor Workflows' },
    { id: SCHEDULE_TAB, label: 'Schedule' }
  ]
}

export const generatePageData = (
  pageTab,
  isStagingMode,
  removeScheduledJob,
  handleSubmitJob,
  handleEditScheduleJob,
  handleRerunJob,
  handleMonitoring,
  jobsDashboardUrl,
  onAbortJob,
  abortableFunctionKinds,
  fetchJobLogs,
  removeJobLogs,
  isSelectedItem,
  workflowId,
  selectedFunction,
  handleFetchFunctionLogs,
  handleRemoveFunctionLogs,
  jobName
) => {
  let filterMenuActionButton = {
    label: 'Resource monitoring',
    tooltip: !jobsDashboardUrl ? 'Grafana service unavailable' : '',
    variant: TERTIARY_BUTTON,
    disabled: !jobsDashboardUrl,
    onClick: () => handleMonitoring()
  }

  if (pageTab === SCHEDULE_TAB || pageTab === MONITOR_WORKFLOWS_TAB) {
    filterMenuActionButton = null
  }

  return {
    actionsMenu: generateActionsMenu(
      pageTab,
      removeScheduledJob,
      handleSubmitJob,
      handleEditScheduleJob,
      handleRerunJob,
      handleMonitoring,
      jobsDashboardUrl,
      onAbortJob,
      abortableFunctionKinds
    ),
    actionsMenuHeader: actionsMenuHeader,
    details: {
      type: !isEveryObjectValueEmpty(selectedFunction)
        ? FUNCTIONS_PAGE
        : JOBS_PAGE,
      menu: !isEveryObjectValueEmpty(selectedFunction)
        ? functionsDetailsMenu
        : detailsMenu,
      infoHeaders: !isEveryObjectValueEmpty(selectedFunction)
        ? functionsInfoHeaders
        : infoHeaders,
      refreshLogs: !isEveryObjectValueEmpty(selectedFunction)
        ? handleFetchFunctionLogs
        : fetchJobLogs,
      removeLogs: !isEveryObjectValueEmpty(selectedFunction)
        ? handleRemoveFunctionLogs
        : removeJobLogs,
      withLogsRefreshBtn: isEveryObjectValueEmpty(selectedFunction)
    },
    hideFilterMenu: isSelectedItem || workflowId,
    filterMenuActionButton,
    filters: filtersByTab(pageTab, jobName) ?? [],
    page,
    tableHeaders: generateTableHeaders(pageTab, workflowId, isSelectedItem),
    tabs: generateTabs(isStagingMode),
    withoutExpandButton: pageTab === MONITOR_WORKFLOWS_TAB && !workflowId
  }
}

const isJobAbortable = (job, abortableFunctionKinds) =>
  (abortableFunctionKinds ?? [])
    .map(kind => `kind: ${kind}`)
    .some(kindLabel => job?.labels?.includes(kindLabel))

export const generateActionsMenu = (
  pageTab,
  removeScheduledJob,
  handleSubmitJob,
  handleEditScheduleJob,
  handleRerunJob,
  handleMonitoring,
  jobsDashboardUrl,
  onAbortJob,
  abortableFunctionKinds
) => job => {
  return pageTab === SCHEDULE_TAB
    ? [
        {
          label: 'Run now',
          icon: <Dropdown className="action_cell__run-icon" />,
          onClick: handleSubmitJob
        },
        {
          label: 'Edit',
          icon: <Edit />,
          onClick: handleEditScheduleJob
        },
        {
          label: 'Delete',
          icon: <Delete />,
          onClick: removeScheduledJob
        }
      ]
    : job?.uid
    ? [
        {
          label: 'Re-run',
          icon: <Run />,
          hidden: ['local', ''].includes(
            job.ui?.originalContent.metadata.labels.kind
          ),
          onClick: handleRerunJob
        },
        {
          label: 'Monitoring',
          tooltip: !jobsDashboardUrl
            ? 'Grafana service unavailable'
            : job.labels?.includes('kind: dask')
            ? 'Unavailable for Dask jobs'
            : '',
          disabled: !jobsDashboardUrl || job.labels?.includes('kind: dask'),
          onClick: handleMonitoring
        },
        {
          label: 'Abort',
          icon: <Cancel />,
          onClick: onAbortJob,
          tooltip: isJobAbortable(job, abortableFunctionKinds)
            ? ''
            : 'Cannot abort jobs of this kind',
          disabled: !isJobAbortable(job, abortableFunctionKinds),
          hidden: JOB_STEADY_STATES.includes(job?.state?.value)
        }
      ]
    : []
}

export const actionCreator = {
  abortJob: jobsActions.abortJob,
  editJob: jobsActions.editJob,
  editJobFailure: jobsActions.editJobFailure,
  fetchAllJobRuns: jobsActions.fetchAllJobRuns,
  fetchFunctionLogs: functionsActions.fetchFunctionLogs,
  fetchJob: jobsActions.fetchJob,
  fetchJobFunction: jobsActions.fetchJobFunction,
  fetchJobLogs: jobsActions.fetchJobLogs,
  fetchJobPods: detailsActions.fetchJobPods,
  fetchJobs: jobsActions.fetchJobs,
  fetchScheduledJobAccessKey: jobsActions.fetchScheduledJobAccessKey,
  fetchWorkflow: workflowsActions.fetchWorkflow,
  fetchWorkflows: workflowsActions.fetchWorkflows,
  getFunction: functionsActions.getFunction,
  getFunctionWithHash: functionsActions.getFunctionWithHash,
  handleRunScheduledJob: jobsActions.handleRunScheduledJob,
  removeFunction: functionsActions.removeFunction,
  removeFunctionLogs: functionsActions.removeFunctionLogs,
  removeJob: jobsActions.removeJob,
  removeJobLogs: jobsActions.removeJobLogs,
  removeNewJob: jobsActions.removeNewJob,
  removePods: detailsActions.removePods,
  removeScheduledJob: jobsActions.removeScheduledJob,
  resetWorkflow: workflowsActions.resetWorkflow,
  setFilters: filtersActions.setFilters,
  setNotification: notificationActions.setNotification
}

export const generateEditableItem = (functionData, job) => {
  return {
    rerun_object: {
      credentials: {
        access_key: functionData?.metadata?.credentials?.access_key ?? ''
      },
      function: {
        spec: {
          env: functionData?.spec.env ?? [],
          resources: functionData?.spec.resources,
          volume_mounts: functionData?.spec.volume_mounts ?? [],
          volumes: functionData?.spec.volumes ?? [],
          node_selector: functionData?.spec.node_selector ?? {},
          preemption_mode: functionData?.spec.preemption_mode ?? '',
          priority_class_name: functionData?.spec.priority_class_name ?? ''
        }
      },
      schedule: null,
      task: {
        metadata: {
          labels: generateKeyValues(job.labels ?? {}),
          name: job.name,
          project: job.project
        },
        spec: {
          function: job.function,
          handler: job?.handler ?? '',
          hyperparams: job.hyperparams,
          input_path: job.input_path ?? '',
          inputs: job.inputs ?? {},
          output_path: job.outputPath,
          param_file: job.param_file ?? '',
          parameters: generateKeyValues(job.parameters ?? {}),
          secret_sources: job.secret_sources ?? [],
          selector: job.selector ?? 'max.',
          tuning_strategy: job.tuning_strategy ?? 'list'
        }
      }
    }
  }
}
