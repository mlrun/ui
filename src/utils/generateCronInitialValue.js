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
export const generateCronInitialValue = (
  activeOption,
  cron,
  scheduleRepeat,
  daysOfWeek,
  setCron
) => {
  let hour, minute

  if (scheduleRepeat[activeOption].time) {
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
