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

import { DATES_FILTER } from '../../constants'
import {
  datePickerPastMonthOptions,
  getDatePickerFilterValue,
  PAST_24_HOUR_DATE_OPTION,
  TIME_FRAME_LIMITS
} from '../../utils/datePicker.util'

export const getFiltersConfig = () => ({
  [DATES_FILTER]: {
    customOptions: datePickerPastMonthOptions,
    label: 'Time range:',
    timeFrameLimit: TIME_FRAME_LIMITS.MONTH,
    initialValue: getDatePickerFilterValue(
      datePickerPastMonthOptions,
      PAST_24_HOUR_DATE_OPTION,
      true
    )
  }
})
