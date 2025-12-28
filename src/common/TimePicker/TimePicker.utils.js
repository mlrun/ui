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

import { getSupportedLocale } from 'igz-controls/utils/datetime.util'

export function is12HourFormat() {
  const locale = getSupportedLocale()
  const options = new Intl.DateTimeFormat(locale, {
    hour: 'numeric'
  }).resolvedOptions()

  return options.hour12
}

export function generateTimeOptions(is12HourFormat = false) {
  const times = []
  const interval = 30
  const current = moment().startOf('day')
  const end = current.clone().add(1, 'day')

  while (current.isBefore(end)) {
    times.push(current.format(is12HourFormat ? 'hh:mm A' : 'HH:mm'))
    current.add(interval, 'minutes')
  }

  return times
}
