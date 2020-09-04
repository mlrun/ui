export const selectOptions = {
  repeatInterval: [
    { label: 'Minute', id: 'minute' },
    { label: 'Hourly', id: 'hour' },
    { label: 'Daily', id: 'day' },
    { label: 'Weekly', id: 'week' },
    { label: 'Monthly', id: 'month' }
  ],
  repeatEnd: [
    { label: 'Never', id: 'never' },
    { label: 'On date', id: 'onDate' },
    { label: 'After', id: 'after' }
  ],
  minute: [
    { label: '10', id: '10' },
    { label: '12', id: '12' },
    { label: '15', id: '15' },
    { label: '30', id: '30' }
  ],
  hour: [
    { label: '1', id: '1' },
    { label: '2', id: '2' },
    { label: '3', id: '3' },
    { label: '4', id: '4' },
    { label: '6', id: '6' },
    { label: '12', id: '12' }
  ]
}

export const tabs = [
  { label: 'Simple', id: 'simple' },
  { label: 'Cronstring', id: 'cronstring' }
]
