import {
  GROUP_BY_FILTER,
  GROUP_BY_NAME,
  GROUP_BY_NONE,
  PERIOD_FILTER,
  SORT_BY,
  STATE_FILTER_ALL_ITEMS,
  STATUS_FILTER,
  TAG_FILTER_ALL_ITEMS,
  TAG_FILTER_LATEST
} from '../../constants'

export const filterSelectOptions = {
  [PERIOD_FILTER]: [
    { label: 'Last 7 days', id: 'last7Days' },
    { label: 'Last 14 days', id: 'last14Days' },
    { label: 'Last months', id: 'lastMonths' },
    { label: 'Last 6 months', id: 'last6Months' }
  ],
  [STATUS_FILTER]: [
    { label: 'All', id: STATE_FILTER_ALL_ITEMS, status: 'all' },
    { label: 'Completed', id: 'completed', status: 'completed' },
    { label: 'Running', id: 'running', status: 'running' },
    { label: 'Pending', id: 'pending', status: 'pending' },
    { label: 'Error', id: 'error', status: 'error' },
    { label: 'Aborted', id: 'aborted', status: 'aborted' }
  ],
  [GROUP_BY_FILTER]: [
    { label: 'None', id: GROUP_BY_NONE },
    { label: 'Name', id: GROUP_BY_NAME }
  ],
  [SORT_BY]: [{ label: 'Name', id: 'name' }]
}

export const tagFilterOptions = [
  { label: 'All', id: TAG_FILTER_ALL_ITEMS },
  { label: 'latest', id: TAG_FILTER_LATEST }
]
