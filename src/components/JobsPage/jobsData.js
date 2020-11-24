import React from 'react'

import { ReactComponent as Delete } from '../../images/delete.svg'
import { ReactComponent as Dropdown } from '../../images/dropdown.svg'

export const page = 'JOBS'
export const infoHeaders = [
  { label: 'UID', id: 'uid' },
  { label: 'Start time', id: 'startTime' },
  { label: 'Last Updated', id: 'lastUpdates' },
  { label: 'Status', id: 'status' },
  { label: 'Parameters', id: 'parameters' },
  { label: 'Function', id: 'function' },
  { label: 'Results', id: 'results' },
  { label: 'Labels', id: 'labels' },
  { label: 'Log level', id: 'logLevel' },
  { label: 'Output path', id: 'outPutPath' },
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
export const detailsMenu = ['info', 'inputs', 'artifacts', 'results', 'logs']
export const filters = ['period', 'status', 'groupBy', 'labels', 'name']
export const initialStateFilter = 'all'
export const initialGroupFilter = 'name'
export const tabs = ['monitor', 'schedule']
export const generatePageData = (
  scheduled,
  removeScheduledJob,
  handleSubmitJob
) => {
  let jobFilters = []

  if (scheduled) {
    jobFilters = ['name']
  } else {
    jobFilters = [...filters]
  }
  return {
    actionsMenu:
      scheduled && generateActionsMenu(removeScheduledJob, handleSubmitJob),
    detailsMenu,
    filters: jobFilters,
    page,
    tableHeaders: generateTableHeaders(scheduled),
    tabs,
    infoHeaders
  }
}
export const generateActionsMenu = (removeScheduledJob, handleSubmitJob) => [
  {
    label: 'Remove',
    icon: <Delete />,
    onClick: schedule => removeScheduledJob(schedule.name)
  },
  {
    label: 'Run now',
    icon: <Dropdown className="action_cell__run-icon" />,
    onClick: job => handleSubmitJob(job)
  }
]
