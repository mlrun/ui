export const selectOptions = {
  period: [
    { label: 'Last 7 days', id: 'last7Days' },
    { label: 'Last 14 days', id: 'last14Days' },
    { label: 'Last months', id: 'lastMonths' },
    { label: 'Last 6 months', id: 'last6Months' }
  ],
  status: [
    { label: 'All', id: 'all', status: 'all' },
    { label: 'Completed', id: 'completed', status: 'completed' },
    { label: 'Running', id: 'running', status: 'running' },
    { label: 'Error', id: 'error', status: 'error' }
  ],
  groupBy: [
    { label: 'None', id: 'none' },
    { label: 'Name', id: 'name' }
  ]
}

export const filterTreeOptions = [
  {
    label: 'Latest',
    id: 'latest'
  }
]
