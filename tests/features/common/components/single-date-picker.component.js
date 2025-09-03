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
import { By } from 'selenium-webdriver'
import { locatorBuilder } from '../../common-tools/common-tools'

import { cloneDeep } from 'lodash'

export default function(datepickerStructure) {
  const datepickerRoot = locatorBuilder`${0} ${1}`
  const options = locatorBuilder`${0} ${1}`

  const datePickerRoot = datepickerRoot(
    datepickerStructure.root,
    datepickerStructure.datePicker.root
  )

  const applyButton = By.css(
    options(datepickerStructure.root, datepickerStructure.apply_button)
  )
  const errorMessage = By.css(
    options(datepickerStructure.root, datepickerStructure.error_message)
  )

  const calendarTable = cloneDeep(
    datepickerStructure.datePicker.elements.calendar.structure
  )
  calendarTable.root = options(datePickerRoot, calendarTable.root)
  const fromDatePicker = {
    prevMonthBtn: By.css(
      options(
        datePickerRoot,
        datepickerStructure.datePicker.elements.month_prev_btn
      )
    ),
    nextMonthBtn: By.css(
      options(
        datePickerRoot,
        datepickerStructure.datePicker.elements.month_next_btn
      )
    ),
    monthLabel: By.css(
      options(
        datePickerRoot,
        datepickerStructure.datePicker.elements.month_label
      )
    ),
    yearLabel: By.css(
      options(
        datePickerRoot,
        datepickerStructure.datePicker.elements.year_label
      )
    ),
    calendar: datepickerStructure.datePicker.elements.calendar.componentType(
      calendarTable
    )
  }

  return {
    root: By.css(datepickerStructure.root),
    applyButton: applyButton,
    fromDatePicker: fromDatePicker,
    errorMessage: errorMessage
  }
}
