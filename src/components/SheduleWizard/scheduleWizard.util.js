export const scheduleDataInitialState = {
  cron: '*/10 * * * *',
  defaultCron: null,
  activeOption: 'minute',
  minute: '10',
  hour: '1',
  week: {
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    time: '00:00'
  },
  day: {
    time: '00:00'
  },
  month: {
    time: '00:00'
  }
}

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
    { label: 'Every 10', id: '10' },
    { label: 'Every 15', id: '15' },
    { label: 'Every 20', id: '20' },
    { label: 'Every 30', id: '30' }
  ],
  hour: [
    { label: 'Every 1', id: '1' },
    { label: 'Every 2', id: '2' },
    { label: 'Every 3', id: '3' },
    { label: 'Every 4', id: '4' },
    { label: 'Every 6', id: '6' },
    { label: 'Every 12', id: '12' }
  ]
}

export const getDefaultSchedule = defaultCron => {
  let cron = defaultCron.split(' ')
  let scheduleData = { ...scheduleDataInitialState, defaultCron }

  if (cron[4] !== '*') {
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    scheduleData.activeOption = 'week'
    scheduleData.week.days = cron[4].split(',').map(day => weekDays[day])
    scheduleData.week.time = `${cron[1] >= 10 ? cron[1] : `0${cron[1]}`}:${
      cron[0] >= 10 ? cron[0] : `0${cron[0]}`
    }`
  } else if (cron[2] !== '*') {
    scheduleData.activeOption = 'month'
    scheduleData.month.time = `${cron[1] >= 10 ? cron[1] : `0${cron[1]}`}:${
      cron[0] >= 10 ? cron[0] : `0${cron[0]}`
    }`
  } else if (cron[1] !== '*' && cron[1].match('/')) {
    scheduleData.activeOption = 'hour'
    scheduleData.minute = '0'
    scheduleData.hour = cron[1].replace(/.*\*\//g, '')
  } else if (cron[1] !== '*') {
    scheduleData.activeOption = 'day'
    scheduleData.day.time = `${cron[1] >= 10 ? cron[1] : `0${cron[1]}`}:${
      cron[0] >= 10 ? cron[0] : `0${cron[0]}`
    }`
  } else {
    scheduleData.activeOption = 'minute'
    scheduleData.minute = cron[0].replace(/.*\*\//g, '')
  }

  return scheduleData
}
