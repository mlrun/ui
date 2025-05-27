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
export const measureTime = (startTime, endTime) => {
  let d, h, m, s
  let now = new Date()
  let time = null
  if (endTime) {
    time = endTime.getTime() - startTime.getTime() > 0 ? endTime.getTime() - startTime.getTime() : 0
  } else {
    time = now.getTime() - startTime.getTime()
  }

  d = time / (1000 * 60 * 60 * 24)
  h = (d - ~~d) * 24
  m = (h - ~~h) * 60
  s = (m - ~~m) * 60

  const hours = generateTime(~~h, ~~m, ~~s)

  return ~~d > 0 ? `${~~d} ${d > 1 ? 'days ' : 'day '}` + hours : hours
}

const generateTime = (...args) => {
  return args.map(el => (el < 10 ? '0' + el : el)).join(':')
}

export const formatMinutesToString = (time = 0) => {
  const minutes = parseInt(time, 10)
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60

  const hourStr = hrs > 0 ? `${hrs} hour${hrs > 1 ? 's' : ''}` : ''
  const minuteStr = mins > 0 ? `${mins} minute${mins > 1 ? 's' : ''}` : ''

  if (hourStr && minuteStr) return `${hourStr} and ${minuteStr}`

  return hourStr || minuteStr || '0 minutes'
}
