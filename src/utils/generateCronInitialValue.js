export const generateCronInitialValue = (
  activeOption,
  cron,
  scheduleRepeat,
  daysOfWeek,
  setCron
) => {
  let hour, minute

  if (scheduleRepeat[activeOption]?.time) {
    let [_hour, _minute] = scheduleRepeat[activeOption].time.split(':')

    hour = _hour.replace(/_/, '0').replace(/^0/, '')
    minute = _minute.replace(/_/, '0').replace(/^0/, '')
  }

  switch (activeOption) {
    case 'minute':
      setCron(`*/${scheduleRepeat.minute} * * * *`)
      break
    case 'hour':
      setCron(`0 */${scheduleRepeat.hour} * * *`)
      break
    case 'day':
      setCron(`${minute} ${hour} * * *`)
      break
    case 'week':
      {
        const days = daysOfWeek
          .filter(day => scheduleRepeat.week.days.includes(day.id))
          .map(day => (day.index + 6) % 7) // temporarily make Monday=0, Tuesday=1, ..., Sunday=6
          .sort()
          .join(',')

        setCron(`${minute} ${hour} * * ${days}`)
      }
      break
    case 'month':
      setCron(`${minute} ${hour} 1 * *`)
      break
    default:
      return null
  }
}
