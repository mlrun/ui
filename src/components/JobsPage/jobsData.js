import React from 'react'

import { JOB_STEADY_STATES } from './jobsPage.utils'

import { ReactComponent as Delete } from '../../images/delete.svg'
import { ReactComponent as Dropdown } from '../../images/dropdown.svg'
import { ReactComponent as Edit } from '../../images/edit.svg'
import { ReactComponent as Run } from '../../images/run.svg'
import { ReactComponent as Cancel } from '../../images/close.svg'

export const page = 'JOBS'
export const infoHeaders = [
  { label: 'UID', id: 'uid' },
  { label: 'Start time', id: 'startTime' },
  { label: 'Last Updated', id: 'updated' },
  { label: 'Status', id: 'state' },
  { label: 'Parameters', id: 'parameters' },
  { label: 'Function', id: 'function' },
  { label: 'Results', id: 'resultsChips' },
  { label: 'Labels', id: 'labels' },
  { label: 'Log level', id: 'logLevel' },
  { label: 'Output path', id: 'outputPath' },
  { label: 'Iterations', id: 'iterations' }
]
export const generateTableHeaders = scheduled => {
  if (scheduled) {
    return [
      {
        header: 'Name',
        class: 'jobs_big'
      },
      {
        header: 'Type',
        class: 'jobs_big'
      },
      {
        header: 'Next run (Local TZ)',
        class: 'jobs_big'
      },
      {
        header: 'Schedule (UTC)',
        class: 'jobs_big'
      },
      {
        header: 'Labels',
        class: 'jobs_big'
      },
      {
        header: 'Last run (Local TZ)',
        class: 'jobs_big'
      },
      {
        header: 'Created time (Local TZ)',
        class: 'jobs_medium'
      },
      {
        header: '',
        class: 'action_cell'
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
      class: 'jobs_extra-small'
    },
    {
      header: 'Duration',
      class: 'jobs_extra-small'
    },
    {
      header: 'Owner',
      class: 'jobs_extra-small'
    },
    {
      header: 'Labels',
      class: 'jobs_extra-small'
    },
    {
      header: 'Parameters',
      class: 'jobs_extra-small'
    },
    {
      header: 'Results',
      class: 'jobs_big'
    },
    {
      header: '',
      class: 'action_cell'
    }
  ]
}
export const detailsMenu = [
  'overview',
  'inputs',
  'artifacts',
  'results',
  'logs',
  'pods'
]
export const filters = [
  { type: 'period', label: 'Period:' },
  { type: 'status', label: 'Status:' },
  { type: 'groupBy', label: 'Group by:' },
  { type: 'name', label: 'Name:' },
  { type: 'labels', label: 'Labels:' },
  { type: 'date-range-time', label: 'Start time:' }
]
export const initialGroupFilter = 'name'
export const tabs = [
  { id: 'monitor', label: 'Monitor' },
  { id: 'schedule', label: 'Schedule' }
]
export const generatePageData = (
  scheduled,
  removeScheduledJob,
  handleSubmitJob,
  setEditableItem,
  handleRerunJob,
  handleMonitoring,
  jobsDashboardUrl,
  onAbortJob
) => {
  let jobFilters = []
  let filterMenuActionButton = {
    label: 'Resource monitoring',
    tooltip: !jobsDashboardUrl ? 'Grafana service unavailable' : '',
    variant: 'tertiary',
    disabled: !jobsDashboardUrl,
    onClick: event => handleMonitoring()
  }

  if (scheduled) {
    jobFilters = [
      { type: 'name', label: 'Name:' },
      { type: 'labels', label: 'Labels:' }
    ]
    filterMenuActionButton = null
  } else {
    jobFilters = [...filters]
  }
  return {
    actionsMenu: generateActionsMenu(
      scheduled,
      removeScheduledJob,
      handleSubmitJob,
      setEditableItem,
      handleRerunJob,
      handleMonitoring,
      jobsDashboardUrl,
      onAbortJob
    ),
    detailsMenu,
    filterMenuActionButton,
    filters: jobFilters,
    page,
    tableHeaders: generateTableHeaders(scheduled),
    tabs,
    infoHeaders
  }
}
export const generateActionsMenu = (
  scheduled,
  removeScheduledJob,
  handleSubmitJob,
  setEditableItem,
  handleRerunJob,
  handleMonitoring,
  jobsDashboardUrl,
  onAbortJob
) => job =>
  scheduled
    ? [
        {
          label: 'Remove',
          icon: <Delete />,
          onClick: removeScheduledJob
        },
        {
          label: 'Run now',
          icon: <Dropdown className="action_cell__run-icon" />,
          onClick: handleSubmitJob
        },
        {
          label: 'Edit',
          icon: <Edit />,
          onClick: setEditableItem
        }
      ]
    : [
        {
          label: 'Re-run',
          icon: <Run />,
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
          tooltip: job.labels?.includes('kind: dask')
            ? 'Cannot abort dask jobs'
            : '',
          disabled: job.labels?.includes('kind: dask'),
          hidden: JOB_STEADY_STATES.includes(job.state)
        }
      ]
