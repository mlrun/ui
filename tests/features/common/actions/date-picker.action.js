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
import { expectTimeout, readTimeout } from '../../../config.js'
import { expect } from '@playwright/test'
import { openDropdown } from './dropdown.action.js'
import {
  click,
  getText,
  getTexts,
  retryAssertion,
  waitForPageQuiet,
  withExactText
} from '../../common-tools/element.js'

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
    await expect
      .poll(
        async () => {
          try {
            return (await getPickerMonthIndex(page, dateTimePicker)) !== previousMonthIndex
          } catch {
            return false
          }
        },
        { timeout: expectTimeout, message: 'The calendar did not switch the month' }
      )
      .toBe(true)
    currentMonthIndex = await getPickerMonthIndex(page, dateTimePicker)
  }
}

// the day is clicked by what it is, not by its position in the grid: the app renders the day grid of a new month one
// render after its label (the grid is generated in an effect), and in between the previous grid marks the days of the
// new month it shows as "current-month" (e.g. Dec 31 in the first row of the January grid). Such a cell found by its
// position and clicked a moment later was another day (Dec 3, the first row of the December grid). A "current-month"
// cell with the day number is that date in both grids; the click waits for it
const selectCalendarDay = async (page, dateTimePicker, datetimePoint) => {
  const day = new Date(datetimePoint).getDate()
  const days = page
    .locator(Object.values(dateTimePicker.calendar.tableColumns).join(', '))
    .and(page.locator('.current-month'))

  await click(withExactText(days, String(day)).first())
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

  const options = page.locator(dateTimePicker.options)
  const optionText = (await getTexts(options)).find(
    text => toMinutesOfDay(text) === minutesToSelect
  )

  if (optionText) {
    await click(withExactText(options, optionText).first())
    await waitForPageQuiet(page)

    return
  }

  throw new Error(`Time option for "${datetimePoint}" was not found in the time picker`)
}

// retried: the band shows the previous range for a moment after the range is applied (a single read got it).
// `expected` - the length of the range (ms, or `{ min, max }`) for a relative range ("Past hour": its ends depend on
// the time), or its ends `{ from, to }` for a custom range: the length only passed a range shifted by a day or a month
export const verifyTimeFilterBand = async (page, dropdown, expected) =>
  retryAssertion(async () => {
    const selectedBand = page.locator(dropdown.open_button).first()
    const datetimePointsText = await getText(selectedBand, { timeout: readTimeout })
    const [from, to] = datetimePointsText.split('-').map(point => Date.parse(point))

    if (expected.from !== undefined) {
      expect(
        [from, to],
        `The filter band "${datetimePointsText}", expected from "${expected.from}" to "${expected.to}"`
      ).toEqual([Date.parse(expected.from), Date.parse(expected.to)])

      return
    }

    const datetimeDiff = to - from
    const result =
      typeof expected === 'object'
        ? datetimeDiff >= expected.min && datetimeDiff <= expected.max
        : datetimeDiff === expected

    expect(
      result,
      `The filter band "${datetimePointsText}" is ${datetimeDiff} ms, expected ${typeof expected === 'object' ? `${expected.min}..${expected.max}` : expected} ms`
    ).toBe(true)
  })

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
