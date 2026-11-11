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
import { expect } from '@playwright/test'
import { getAllCellsWithAttribute } from './table.action.js'
import { openDropdown } from './dropdown.action.js'
import { click, getText, waitUntil } from '../../common-tools/element.js'

const currentMonthAttribute = {
  attribute: 'class',
  value: ' current-month'
}

const getPickerMonthIndex = async (page, dateTimePicker) => {
  const month = await getText(page.locator(dateTimePicker.monthLabel).first())
  const year = await getText(page.locator(dateTimePicker.yearLabel).first())
  const date = new Date(`01 ${month} ${year}`)

  return date.getFullYear() * 12 + date.getMonth()
}

async function selectMonthYear(page, dateTimePicker, datetimePoint) {
  const datetime = new Date(datetimePoint)
  const targetMonthIndex = datetime.getFullYear() * 12 + datetime.getMonth()
  let currentMonthIndex = await getPickerMonthIndex(page, dateTimePicker)

  while (currentMonthIndex !== targetMonthIndex) {
    const button =
      targetMonthIndex > currentMonthIndex
        ? dateTimePicker.nextMonthBtn
        : dateTimePicker.prevMonthBtn
    const previousMonthIndex = currentMonthIndex

    await click(page.locator(button).first())
    // wait for the calendar to switch the month before the next click
    await waitUntil(async () => {
      try {
        return (await getPickerMonthIndex(page, dateTimePicker)) !== previousMonthIndex
      } catch {
        return false
      }
    }, 3000)
    currentMonthIndex = await getPickerMonthIndex(page, dateTimePicker)
  }
}

// locators are re-resolved on each call, so the day cells re-rendered after switching month can't be stale
async function selectCalendarDay(page, dateTimePicker, datetimePoint) {
  const datetime = new Date(datetimePoint)
  const currentMonthDayIndexes = await getAllCellsWithAttribute(
    page,
    dateTimePicker.calendar,
    currentMonthAttribute
  )

  for (const item of currentMonthDayIndexes) {
    const dayElement = page.locator(dateTimePicker.calendar.tableFields[item[0]](item[1])).first()
    const day = await getText(dayElement)

    if (Number.parseInt(day) === datetime.getDate()) {
      await click(dayElement)

      return
    }
  }

  throw new Error(`Day ${datetime.getDate()} was not found in the date picker calendar`)
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
export const setPickerTime = async (page, dateTimePicker, datetimePoint) => {
  const minutesToSelect = toMinutesOfDay(datetimePoint)

  await openDropdown(page, dateTimePicker)

  const options = await page.locator(dateTimePicker.options).all()

  for (const option of options) {
    if (toMinutesOfDay(await getText(option)) === minutesToSelect) {
      await click(option)
      await page.waitForTimeout(500)

      return
    }
  }

  throw new Error(`Time option for "${datetimePoint}" was not found in the time picker`)
}

export const verifyTimeFilterBand = async (page, dropdown, diff) => {
  const selectedBand = page.locator(dropdown.open_button).first()
  const datetimePointsText = await getText(selectedBand)
  const datetimePoints = datetimePointsText.split('-')
  const datetimeDiff = Date.parse(datetimePoints[1]) - Date.parse(datetimePoints[0])

  let result = -1
  if (typeof diff === 'object') {
    result = datetimeDiff >= diff.min && datetimeDiff <= diff.max
  } else {
    result = datetimeDiff - diff === 0
  }
  expect(result).toBe(true)
}

export const pickUpCustomDatetimeRange = async (page, datetimePicker, fromDatetime, toDatetime) => {
  await selectMonthYear(page, datetimePicker.fromDatePicker, fromDatetime)
  await selectCalendarDay(page, datetimePicker.fromDatePicker, fromDatetime)

  await selectMonthYear(page, datetimePicker.toDatePicker, toDatetime)
  await selectCalendarDay(page, datetimePicker.toDatePicker, toDatetime)
}

export const applyDatetimePickerRange = async (page, datetimePicker) => {
  const applyButton = page.locator(datetimePicker.applyButton).first()
  await click(applyButton)
}
