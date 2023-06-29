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
import moment from 'moment'

export const formatDatetime = (datetime, invalidDateMessage) => {
  if (!datetime) {
    return invalidDateMessage
  }

  const date = new Date(datetime)

  return typeof date !== 'object' || !(date instanceof Date) || isNaN(date)
    ? invalidDateMessage
    : new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(date)
}

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
  moment.updateLocale('en', {
    relativeTime: {
      future: 'in %s',
      past: '%s ago',
      s: 'a few seconds',
      ss: '%d seconds',
      m: 'a minute',
      mm: '%d minutes',
      h: 'an hour',
      hh: '%d hours',
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

  const time = moment.utc(creationDate)

  return time.fromNow()
}

export const getDateAndTimeByFormat = (date, dateFormat) => {
  return moment(date).format(dateFormat)
}

export const sortListByDate = (list, field, isAscending = true) => {
  return [...list].sort((prevElem, nextElem) => {
    const prev = Date.parse(prevElem[field])
    const next = Date.parse(nextElem[field])

    return isAscending ? prev - next : next - prev
  })
}
