/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import { trim } from 'lodash'
import { ANY_TIME, DATE_FILTER_ANY_TIME } from '../constants'

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

export const ANY_TIME_DATE_OPTION = 'anyTime'
export const PAST_HOUR_DATE_OPTION = 'pastHour'
export const PAST_24_HOUR_DATE_OPTION = 'past24hours'
export const PAST_WEEK_DATE_OPTION = 'pastWeek'
export const PAST_MONTH_DATE_OPTION = 'pastMonth'
export const PAST_YEAR_DATE_OPTION = 'pastYear'
export const CUSTOM_RANGE_DATE_OPTION = 'customRange'

export const datePickerOptions = [
  {
    id: ANY_TIME_DATE_OPTION,
    label: ANY_TIME,
    handler: () => DATE_FILTER_ANY_TIME
  },
  {
    id: PAST_HOUR_DATE_OPTION,
    label: 'Past hour',
    isPredefined: true,
    handler: () => {
      return getPastDate((fromDate, toDate) => {
        fromDate.setHours(toDate.getHours() - 1)
      })
    }
  },
  {
    id: PAST_24_HOUR_DATE_OPTION,
    label: 'Past 24 hours',
    isPredefined: true,
    handler: () => {
      return getPastDate((fromDate, toDate) => {
        fromDate.setDate(toDate.getDate() - 1)
      })
    }
  },
  {
    id: PAST_WEEK_DATE_OPTION,
    label: 'Past week',
    isPredefined: true,
    handler: () => {
      return getPastDate((fromDate, toDate) => {
        fromDate.setDate(toDate.getDate() - 7)
      })
    }
  },
  {
    id: PAST_MONTH_DATE_OPTION,
    label: 'Past month',
    isPredefined: true,
    handler: () => {
      return getPastDate((fromDate, toDate) => {
        fromDate.setMonth(toDate.getMonth() - 1)
      })
    }
  },
  {
    id: PAST_YEAR_DATE_OPTION,
    label: 'Past year',
    isPredefined: true,
    handler: () => {
      return getPastDate((fromDate, toDate) => {
        fromDate.setFullYear(toDate.getFullYear() - 1)
      })
    }
  },
  {
    id: CUSTOM_RANGE_DATE_OPTION,
    label: 'Custom range',
    handler: null
  }
]

const getPastDate = setDate => {
  let fromDate = new Date()
  let toDate = new Date()

  setDate(fromDate, toDate)

  return [fromDate]
}

export const formatDate = (isRange, isTime, splitCharacter, date, dateTo) => {
  if (!date) {
    return ''
  }

  let dateString = formatSingleDate(isTime, splitCharacter, date)

  if (isRange) {
    dateString += `${datesDivider}${formatSingleDate(isTime, splitCharacter, dateTo)}`
  }

  return dateString
}

const formatSingleDate = (isTime, splitCharacter, date) => {
  let dateString = `${String(date.getMonth() + 1).padStart(2, '0')}${splitCharacter}${String(
    date.getDate()
  ).padStart(2, '0')}${splitCharacter}${date.getFullYear()}`

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
            (startWeek === 'mon' ? lastDayInPreviousMonth.getDay() : firstDay.getDay()) +
            index +
            1
        )
      )
    })
  }

  return month
}

export const getDateMask = (isRange, isTime, splitCharacter) => {
  let dateMask = [/\d/, /\d/, splitCharacter, /\d/, /\d/, splitCharacter, /\d/, /\d/, /\d/, /\d/]

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
    datePipe += `${datesDivider}${datePipe}`
  }

  return datePipe
}

export const getDateRegEx = dateMask => {
  let regExpString = ''

  dateMask.forEach(value => {
    regExpString +=
      value === ' ' ? '\\s' : typeof value === 'string' ? `\\${value}` : trim(value, '/')
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
