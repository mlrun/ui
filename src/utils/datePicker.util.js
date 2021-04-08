import { trim } from 'lodash'

export const datesDivider = ' - '

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export const formatDate = (isRange, isTime, splitCharacter, date, dateTo) => {
  if (!date) {
    return ''
  }

  let dateString = formatSingleDate(isTime, splitCharacter, date)

  if (isRange) {
    dateString +=
      datesDivider + formatSingleDate(isTime, splitCharacter, dateTo)
  }

  return dateString
}

const formatSingleDate = (isTime, splitCharacter, date) => {
  let dateString = `${
    date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  }${splitCharacter}${
    date.getDate() < 10 ? `0${date?.getDate()}` : date.getDate()
  }${splitCharacter}${date.getFullYear()}`

  if (isTime) {
    dateString += ` ${String(date.getHours()).padStart(2, '0')}:${String(
      date.getMinutes()
    ).padStart(2, '0')}`
  }

  return dateString
}

export const generateCalendar = (date, startWeek) => {
  let firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
  let lastDayInPreviousMonth = new Date(date.getFullYear(), date.getMonth(), 0)
  let month = []
  let week = []
  const maxDays = 42

  for (let index = 0; index <= maxDays; index++) {
    if (index % 7 === 0 && week.length) {
      month.push({
        week: week
      })
      week = []
    }

    week.push({
      day: new Date(
        new Date(lastDayInPreviousMonth).setDate(
          lastDayInPreviousMonth.getDate() -
            (startWeek === 'mon'
              ? lastDayInPreviousMonth.getDay()
              : firstDay.getDay()) +
            index +
            1
        )
      )
    })
  }

  return month
}

export const getDateMask = (isRange, isTime, splitCharacter) => {
  let dateMask = [
    /\d/,
    /\d/,
    splitCharacter,
    /\d/,
    /\d/,
    splitCharacter,
    /\d/,
    /\d/,
    /\d/,
    /\d/
  ]

  if (isTime) {
    dateMask.push(' ', /\d/, /\d/, ':', /\d/, /\d/)
  }

  if (isRange) {
    dateMask.push(...datesDivider.split(''), ...dateMask)
  }

  return dateMask
}

export const getDatePipe = (isRange, isTime) => {
  let datePipe = 'mm/dd/yyyy'

  if (isTime) {
    datePipe += ' HH:MM'
  }

  if (isRange) {
    datePipe += datesDivider + datePipe
  }

  return datePipe
}

export const getDateRegEx = dateMask => {
  let regExpString = ''

  dateMask.forEach(value => {
    regExpString +=
      value === ' '
        ? '\\s'
        : typeof value === 'string'
        ? '\\' + value
        : trim(value, '/')
  })

  return regExpString
}

export const getWeekDays = startWeek => {
  const weekDays = [
    { label: 'S', id: 'Sun', index: 0 },
    { label: 'M', id: 'Mon', index: 1 },
    { label: 'T', id: 'Tue', index: 2 },
    { label: 'W', id: 'Wed', index: 3 },
    { label: 'T', id: 'Thu', index: 4 },
    { label: 'F', id: 'Fri', index: 5 },
    { label: 'S', id: 'Sat', index: 6 }
  ]

  if (startWeek === 'mon') {
    weekDays.push(weekDays.shift())
  }

  return weekDays
}

export const getWeekStart = region => {
  if (
    'AGARASAUBDBRBSBTBWBZCACNCODMDOETGTGUHKHNIDILINJMJPKEKHKRLAMHMMMOMTMXMZNINPPAPEPHPKPRPTPYSASGSVTHTTTWUMUSVEVIWSYEZAZW'
      .match(/../g)
      .includes(region)
  ) {
    return 'sun'
  }
  return 'mon'
}

export const decodeLocale = locale => {
  return locale.match(
    /^([a-zA-Z]{2,3})(?:[_-]+([a-zA-Z]{3})(?=$|[_-]+))?(?:[_-]+([a-zA-Z]{4})(?=$|[_-]+))?(?:[_-]+([a-zA-Z]{2}|\d{3})(?=$|[_-]+))?/
  )[4]
}
