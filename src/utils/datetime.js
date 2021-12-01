import moment from 'moment'

export const formatDatetime = (datetime, invalidDateMessage) =>
  typeof datetime !== 'object' || !(datetime instanceof Date) || isNaN(datetime)
    ? invalidDateMessage
    : new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(new Date(datetime))

export const getFormatTime = time => {
  const [hour, minute] = time.split(':')
  if (!minute) {
    return {
      hour: '0',
      minute: '0'
    }
  }
  return {
    hour: hour.replace(/_/g, '0'),
    minute: minute.replace(/_/g, '0')
  }
}

export const getTimeElapsedByDate = creationDate => {
  return moment(creationDate)
    .locale(
      'en',
      moment.updateLocale('en', {
        relativeTime: {
          future: 'in %s',
          past: '%s ago',
          s: 'a few seconds',
          ss: '%d seconds',
          m: 'a minute',
          mm: '%d minutes',
          h: 'an hour',
          hh: '%d hrs.',
          d: 'a day',
          dd: '%d days',
          w: 'a week',
          ww: '%d weeks',
          M: 'a month',
          MM: '%d months',
          y: 'a year',
          yy: '%d years'
        }
      })
    )
    .fromNow()
}
