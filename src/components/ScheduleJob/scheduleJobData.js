export const selectOptions = {
  repeatInterval: [
    { label: 'Minute', id: 'minute' },
    { label: 'Hour', id: 'hour' },
    { label: 'Day', id: 'day' },
    { label: 'Week', id: 'week' },
    { label: 'Month', subLabel: '(every 12th day)', id: 'month' }
  ],
  repeatEnd: [
    { label: 'Never', id: 'never' },
    { label: 'On date', id: 'onDate' },
    { label: 'After', id: 'after' }
  ]
}

export const tabs = [
  { label: 'Simple', id: 'simple' },
  { label: 'Cronstring', id: 'cronstring' }
]
