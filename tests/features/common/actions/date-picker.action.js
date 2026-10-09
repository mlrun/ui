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
import { getAllCellsWithAttribute } from './table.action'
import {  openDropdown, selectOptionInDropdownWithoutCheck } from './dropdown.action'

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

export const setPickerTime = async (driver, dateTimePicker, datetimePoint) => {
  const timeToSelect = datetimePoint.slice(-8)
  
  await openDropdown(driver, dateTimePicker)
  await selectOptionInDropdownWithoutCheck(driver, dateTimePicker, timeToSelect)
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
  