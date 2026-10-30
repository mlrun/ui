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
import { expect } from 'chai'
import { getAllCellsWithAttribute } from './table.action.js'
import { openDropdown } from './dropdown.action.js'

const currentMonthAttribute = {
  attribute: 'class',
  value: ' current-month'
}

const getPickerMonthIndex = async (driver, dateTimePicker) => {
  const month = await driver.findElement(dateTimePicker.monthLabel).getText()
  const year = await driver.findElement(dateTimePicker.yearLabel).getText()
  const date = new Date(`01 ${month} ${year}`)

  return date.getFullYear() * 12 + date.getMonth()
}

async function selectMonthYear(driver, dateTimePicker, datetimePoint) {
  const datetime = new Date(datetimePoint)
  const targetMonthIndex = datetime.getFullYear() * 12 + datetime.getMonth()
  let currentMonthIndex = await getPickerMonthIndex(driver, dateTimePicker)

  while (currentMonthIndex !== targetMonthIndex) {
    const button =
      targetMonthIndex > currentMonthIndex ? dateTimePicker.nextMonthBtn : dateTimePicker.prevMonthBtn
    const previousMonthIndex = currentMonthIndex

    await driver.findElement(button).click()
    // wait for the calendar to switch the month before the next click
    await driver.wait(async () => {
      try {
        return (await getPickerMonthIndex(driver, dateTimePicker)) !== previousMonthIndex
      } catch {
        return false
      }
    }, 3000)
    currentMonthIndex = await getPickerMonthIndex(driver, dateTimePicker)
  }
}

async function selectCalendarDay(driver, dateTimePicker, datetimePoint) {
  const datetime = new Date(datetimePoint)

  // day cells are re-rendered after switching month, retry on stale references
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
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
          await dayElement.click()

          return
        }
      }

      throw new Error(`Day ${datetime.getDate()} was not found in the date picker calendar`)
    } catch (error) {
      if (error.name !== 'StaleElementReferenceError' || attempt === 2) throw error

      await driver.sleep(250)
    }
  }
}

// "MM/DD/YYYY HH:mm", "MM/DD/YYYY hh:mm AM", "hh:mm PM"... -> minutes since midnight
const toMinutesOfDay = text => {
  const match = /(\d{1,2}):(\d{2})(?:\s*([AaPp][Mm]))?\s*$/.exec(String(text).trim())

  if (!match) return null

  let hours = Number(match[1]) % (match[3] ? 12 : 24)

  if (match[3]?.toUpperCase() === 'PM') hours += 12

  return hours * 60 + Number(match[2])
}

// time options are "hh:mm AM/PM", the steps can use "HH:mm" as well - match the options by the time value
export const setPickerTime = async (driver, dateTimePicker, datetimePoint) => {
  const minutesToSelect = toMinutesOfDay(datetimePoint)

  await openDropdown(driver, dateTimePicker)

  const options = await driver.findElements(dateTimePicker.options)

  for (const option of options) {
    if (toMinutesOfDay(await option.getText()) === minutesToSelect) {
      await option.click()
      await driver.sleep(500)

      return
    }
  }

  throw new Error(`Time option for "${datetimePoint}" was not found in the time picker`)
}

export const verifyTimeFilterBand = async (driver, dropdown, diff) => {
    const selectedBand = await driver.findElement(dropdown.open_button)
    const datetimePointsText = await selectedBand.getText()
    const datetimePoints = datetimePointsText.split('-')
    const datetimeDiff =
      Date.parse(datetimePoints[1]) - Date.parse(datetimePoints[0])

    let result = -1
    if (typeof diff === 'object') {
      result = datetimeDiff >= diff.min && datetimeDiff <= diff.max
    } else {
      result = datetimeDiff - diff === 0
    }
    expect(result).to.equal(true)
  }

export const pickUpCustomDatetimeRange = async (
    driver,
    datetimePicker,
    fromDatetime,
    toDatetime
  ) => {
    await selectMonthYear(driver, datetimePicker.fromDatePicker, fromDatetime)
    await selectCalendarDay(driver, datetimePicker.fromDatePicker, fromDatetime)

    await selectMonthYear(driver, datetimePicker.toDatePicker, toDatetime)
    await selectCalendarDay(driver, datetimePicker.toDatePicker, toDatetime)
  }

export const applyDatetimePickerRange = async (driver, datetimePicker) => {
    const applyButton = await driver.findElement(datetimePicker.applyButton)
    await applyButton.click()
  }
  