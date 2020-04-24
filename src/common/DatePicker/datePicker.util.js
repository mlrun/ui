export const generateCalendar = (date, startWeek) => {
  let firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
  let lastDayInPreviousMonth = new Date(date.getFullYear(), date.getMonth(), 0)
  let month = []
  let week = []

  for (let index = 0; index <= 42; index++) {
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

export const weekStart = region => {
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

export const weeksDay = startWeek => {
  const weeksDay = [
    { label: 'S' },
    { label: 'M' },
    { label: 'T' },
    { label: 'W' },
    { label: 'T' },
    { label: 'F' },
    { label: 'S' }
  ]

  if (startWeek === 'mon') {
    weeksDay.shift()
    weeksDay.push({ label: 'S' })
  }

  return weeksDay
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

export const dateFormat = (date, splitCharacter = '.') => {
  if (!date) {
    return ''
  }
  return `${
    date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  }${splitCharacter}${
    date.getDate() < 10 ? `0${date?.getDate()}` : date.getDate()
  }${splitCharacter}${date.getFullYear()}`
}
