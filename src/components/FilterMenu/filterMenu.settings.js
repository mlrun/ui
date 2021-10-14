import {
  GROUP_BY_FILTER,
  PERIOD_FILTER,
  SORT_BY,
  STATUS_FILTER
} from '../../constants'

export const filterSelectOptions = {
  [PERIOD_FILTER]: [
    { label: 'Last 7 days', id: 'last7Days' },
    { label: 'Last 14 days', id: 'last14Days' },
    { label: 'Last months', id: 'lastMonths' },
    { label: 'Last 6 months', id: 'last6Months' }
  ],
  [STATUS_FILTER]: [
    { label: 'All', id: 'all', status: 'all' },
    { label: 'Completed', id: 'completed', status: 'completed' },
    { label: 'Running', id: 'running', status: 'running' },
    { label: 'Pending', id: 'pending', status: 'pending' },
    { label: 'Error', id: 'error', status: 'error' },
    { label: 'Aborted', id: 'aborted', status: 'aborted' }
  ],
  [GROUP_BY_FILTER]: [
    { label: 'None', id: 'none' },
    { label: 'Name', id: 'name' }
  ],
  [SORT_BY]: [{ label: 'Name', id: 'name' }]
}

export const tagFilterOptions = [
  {
    label: 'latest',
    id: 'latest'
  }
]
