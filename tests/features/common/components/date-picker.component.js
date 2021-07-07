import { By } from 'selenium-webdriver'
import { locatorBuilder } from '../../common-tools/common-tools'

import { cloneDeep } from 'lodash'

module.exports = function(datepickerStructure) {
  const datepickerRoot = locatorBuilder`${0} ${1}`
  const options = locatorBuilder`${0} ${1}`

  const fromRoot = datepickerRoot(
    datepickerStructure.root,
    datepickerStructure.fromDatePicker.root
  )
  const toRoot = datepickerRoot(
    datepickerStructure.root,
    datepickerStructure.toDatePicker.root
  )

  const applyButton = By.css(
    options(datepickerStructure.root, datepickerStructure.apply_button)
  )
  const errorMessage = By.css(
    options(datepickerStructure.root, datepickerStructure.error_message)
  )

  const fromCalendarTable = cloneDeep(
    datepickerStructure.fromDatePicker.elements.calendar.structure
  )
  fromCalendarTable.root = options(fromRoot, fromCalendarTable.root)
  const fromDatePicker = {
    prevMonthBtn: By.css(
      options(
        fromRoot,
        datepickerStructure.fromDatePicker.elements.month_prev_btn
      )
    ),
    nextMonthBtn: By.css(
      options(
        fromRoot,
        datepickerStructure.fromDatePicker.elements.month_next_btn
      )
    ),
    monthLabel: By.css(
      options(fromRoot, datepickerStructure.fromDatePicker.elements.month_label)
    ),
    yearLabel: By.css(
      options(fromRoot, datepickerStructure.fromDatePicker.elements.year_label)
    ),
    timeInput: By.css(
      options(fromRoot, datepickerStructure.toDatePicker.elements.time_input)
    ),
    calendar: datepickerStructure.fromDatePicker.elements.calendar.componentType(
      fromCalendarTable
    )
  }

  const toCalendarTable = cloneDeep(
    datepickerStructure.toDatePicker.elements.calendar.structure
  )
  toCalendarTable.root = options(toRoot, toCalendarTable.root)
  const toDatePicker = {
    prevMonthBtn: By.css(
      options(toRoot, datepickerStructure.toDatePicker.elements.month_prev_btn)
    ),
    nextMonthBtn: By.css(
      options(toRoot, datepickerStructure.toDatePicker.elements.month_next_btn)
    ),
    monthLabel: By.css(
      options(toRoot, datepickerStructure.toDatePicker.elements.month_label)
    ),
    yearLabel: By.css(
      options(toRoot, datepickerStructure.toDatePicker.elements.year_label)
    ),
    timeInput: By.css(
      options(toRoot, datepickerStructure.toDatePicker.elements.time_input)
    ),
    calendar: datepickerStructure.toDatePicker.elements.calendar.componentType(
      toCalendarTable
    )
  }

  return {
    root: By.css(datepickerStructure.root),
    applyButton: applyButton,
    fromDatePicker: fromDatePicker,
    toDatePicker: toDatePicker,
    errorMessage: errorMessage
  }
}
