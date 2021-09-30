import { By } from 'selenium-webdriver'
import { locatorBuilder } from '../../common-tools/common-tools'

import { cloneDeep } from 'lodash'

module.exports = function(datepickerStructure) {
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
