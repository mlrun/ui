import { expect } from 'chai'
import { getAllCellsWithAttribute } from './table.action'

const currentMonthAttribute = {
  attribute: 'class',
  value: ' current-month'
}

async function selectMonthYear(driver, dateTimePicker, datetimePoint) {
  const datetime = new Date(datetimePoint)
  const prevMonthBtn = await driver.findElement(dateTimePicker.prevMonthBtn)
  const nextMonthBtn = await driver.findElement(dateTimePicker.nextMonthBtn)
  const monthLabel = await driver.findElement(dateTimePicker.monthLabel)
  const yearLabel = await driver.findElement(dateTimePicker.yearLabel)

  let pickYear = await yearLabel.getText()
  let pickMonth = await monthLabel.getText()
  let iterDatetime = new Date(`01 ${pickMonth} ${pickYear}`)

  while (datetime.getFullYear() !== iterDatetime.getFullYear()) {
    if (datetime.getFullYear() > iterDatetime.getFullYear()) {
      nextMonthBtn.click()
    } else {
      prevMonthBtn.click()
    }
    pickYear = await yearLabel.getText()
    pickMonth = await monthLabel.getText()
    iterDatetime = new Date(`01 ${pickMonth} ${pickYear}`)
  }

  while (datetime.getMonth() !== iterDatetime.getMonth()) {
    if (datetime.getMonth() > iterDatetime.getMonth()) {
      nextMonthBtn.click()
    } else {
      prevMonthBtn.click()
    }
    pickMonth = await monthLabel.getText()
    iterDatetime = new Date(`01 ${pickMonth} ${pickYear}`)
  }
}

async function selectCalendarDay(driver, dateTimePicker, datetimePoint) {
  const datetime = new Date(datetimePoint)
  const currentMonthDayIndexes = await getAllCellsWithAttribute(
    driver,
    dateTimePicker.calendar,
    currentMonthAttribute
  )

  for (const item of currentMonthDayIndexes) {
    const dayElement = await driver.findElement(
      dateTimePicker.calendar.tableFields[item[0]](item[1])
    )
    const day = await dayElement.getText()

    if (Number.parseInt(day) === datetime.getDate()) {
      dayElement.click()
    }
  }
}

async function setPickerTime(driver, dateTimePicker, datetimePoint) {
  const datetime = new Date(datetimePoint)
  const timeInput = await driver.findElement(dateTimePicker.timeInput)
  const timeString = `${datetime.getHours()}:${datetime.getMinutes()}`

  await timeInput.clear()
  await timeInput.sendKeys(timeString)
}

const action = {
  verifyTimeFilterBand: async function(driver, dropdown, diff) {
    const selectedBand = await driver.findElement(dropdown.open_button)
    const datetimePointsText = await selectedBand.getAttribute('value')
    const datetimePoints = datetimePointsText.split('-')
    const datetimeDiff =
      Date.parse(datetimePoints[1]) - Date.parse(datetimePoints[0])

    const result = datetimeDiff - diff >= 0
    expect(result).to.equal(true)
  },
  pickUpCustomDatetimeRange: async function(
    driver,
    datetimePicker,
    fromDatetime,
    toDatetime
  ) {
    await selectMonthYear(driver, datetimePicker.fromDatePicker, fromDatetime)
    await selectCalendarDay(driver, datetimePicker.fromDatePicker, fromDatetime)
    await setPickerTime(driver, datetimePicker.fromDatePicker, fromDatetime)

    await selectMonthYear(driver, datetimePicker.toDatePicker, toDatetime)
    await selectCalendarDay(driver, datetimePicker.toDatePicker, toDatetime)
    await setPickerTime(driver, datetimePicker.toDatePicker, toDatetime)
  },
  applyDatetimePickerRange: async function(driver, datetimePicker) {
    const applyButton = await driver.findElement(datetimePicker.applyButton)
    await applyButton.click()
  }
}

module.exports = action
