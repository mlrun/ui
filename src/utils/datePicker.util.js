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

export const getWeekDays = startWeek => {
  const weekDays = [
    { shortLabel: 'S', label: 'Sun' },
    { shortLabel: 'M', label: 'Mon' },
    { shortLabel: 'T', label: 'Tue' },
    { shortLabel: 'W', label: 'Wed' },
    { shortLabel: 'T', label: 'Thu' },
    { shortLabel: 'F', label: 'Fri' },
    { shortLabel: 'S', label: 'Sat' }
  ]

  if (startWeek === 'mon') {
    weekDays.push(weekDays.shift())
  }

  return weekDays
}

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

export const formatDate = (date, splitCharacter = '.') => {
  if (!date) {
    return ''
  }
  return `${
    date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  }${splitCharacter}${
    date.getDate() < 10 ? `0${date?.getDate()}` : date.getDate()
  }${splitCharacter}${date.getFullYear()}`
}
