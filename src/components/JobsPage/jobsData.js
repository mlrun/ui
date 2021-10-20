import React from 'react'

import {
  DATE_RANGE_TIME_FILTER,
  FUNCTIONS_PAGE,
  GROUP_BY_FILTER,
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
import { filterSelectOptions } from '../FilterMenu/filterMenu.settings'

export const page = 'JOBS'
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
  { label: 'Iterations', id: 'iterations' }
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

const filtersByTab = (pageTab, isDemoMode) => {
  if (pageTab === MONITOR_JOBS_TAB) {
    return [
      { type: PERIOD_FILTER, label: 'Period:' },
      { type: STATUS_FILTER, label: 'Status:' },
      {
        type: GROUP_BY_FILTER,
        label: 'Group by:',
        options: !isDemoMode && [
          ...filterSelectOptions.groupBy,
          { label: 'Workflow', id: 'workflow' }
        ]
      },
      { type: NAME_FILTER, label: 'Name:' },
      { type: LABELS_FILTER, label: 'Labels:' },
      { type: DATE_RANGE_TIME_FILTER, label: 'Start time:' }
    ]
  } else if (pageTab === MONITOR_WORKFLOWS_TAB) {
    return [
      { type: PERIOD_FILTER, label: 'Period:' },
      { type: STATUS_FILTER, label: 'Status:' },
      { type: NAME_FILTER, label: 'Name:' },
      { type: LABELS_FILTER, label: 'Labels:' },
      { type: DATE_RANGE_TIME_FILTER, label: 'Start time:' }
    ]
  } else if (pageTab === SCHEDULE_TAB) {
    return [
      { type: NAME_FILTER, label: 'Name:' },
      { type: LABELS_FILTER, label: 'Labels:' }
    ]
  }
}

const generateTabs = isDemoMode => {
  return [
    { id: MONITOR_JOBS_TAB, label: 'Monitor Jobs' },
    {
      id: MONITOR_WORKFLOWS_TAB,
      label: 'Monitor Workflows',
      hidden: !isDemoMode
    },
    { id: SCHEDULE_TAB, label: 'Schedule' }
  ]
}

export const generatePageData = (
  pageTab,
  isDemoMode,
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
  handleRemoveFunctionLogs
) => {
  let filterMenuActionButton = {
    label: 'Resource monitoring',
    tooltip: !jobsDashboardUrl ? 'Grafana service unavailable' : '',
    variant: TERTIARY_BUTTON,
    disabled: !jobsDashboardUrl,
    onClick: event => handleMonitoring()
  }

  if (pageTab === SCHEDULE_TAB) {
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
    hideFilterMenu: pageTab === MONITOR_WORKFLOWS_TAB || isSelectedItem,
    filterMenuActionButton,
    filters: filtersByTab(pageTab, isDemoMode),
    page,
    tableHeaders: generateTableHeaders(pageTab, workflowId, isSelectedItem),
    tabs: generateTabs(isDemoMode),
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
