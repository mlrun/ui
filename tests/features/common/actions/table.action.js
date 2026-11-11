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
import { difference } from 'lodash-es'
import {
  getOptionValues,
  openDropdown,
  selectOptionInDropdownWithoutCheck
} from './dropdown.action.js'
import { getElementText, hoverComponent } from './common.action.js'
import {
  click,
  getAttribute,
  getRect,
  getText,
  getTexts,
  normalizeWhitespace,
  retryAssertion,
  scrollIntoView,
  waitUntil
} from '../../common-tools/element.js'

async function getColumnValuesAttribute(page, table, columnName) {
  return await page
    .locator(table.tableColumns[columnName])
    .all()
    .then(function (elements) {
      return Promise.all(elements.map(element => getAttribute(element, 'value')))
    })
}

export const getColumnValues = async (page, table, columnName) => {
  return getTexts(page.locator(table.tableColumns[columnName]))
}

export const getHeaderColumnValue = async (page, table, columnName) => {
  const element = page.locator(table.headerSorters[columnName]).first()

  return await getText(element)
}

export const getTableRows = async (page, table) => {
  return page.locator(table.tableColumns[table.tableCulumnNames[0]]).count()
}

// the number of rows once the table has at least one row: the per-row checks ("in every row ...") would check
// nothing on a table that is empty or not rendered yet
export const waitForTableRows = async (page, table, timeout = 10000) => {
  const rows = await waitUntil(
    () => getTableRows(page, table),
    timeout,
    `The table has no rows: ${table.tableColumns[table.tableCulumnNames[0]]}`
  )

  return rows
}

export const isContainsValueInColumn = async (page, table, columnName, value) =>
  retryAssertion(async () => {
    const arr = await getColumnValues(page, table, columnName)
    expect(arr.includes(value), `Column values [${arr}] is not equal with "${value}" `).toBe(true)
  })

export const isContainsValueInHeaderColumn = async (page, table, columnName, value) =>
  retryAssertion(async () => {
    const actualValue = await getHeaderColumnValue(page, table, columnName)

    expect(
      actualValue.includes(value),
      `Header column "${columnName}" value "${actualValue}" does not include "${value}"`
    ).toBe(true)
  })

// a negative check passes on a table that isn't rendered yet, so the column is given time to render first;
// a table that stays empty is accepted: the value is not in it
export const isNotContainsValueInColumn = async (page, table, columnName, value) => {
  await waitUntil(() => page.locator(table.tableColumns[columnName]).count(), 5000).catch(() => {})

  return retryAssertion(async () => {
    const arr = await getColumnValues(page, table, columnName)
    expect(arr.includes(value), `Column values [${arr}] include "${value}"`).toBe(false)
  })
}

// visible chips are rendered as disabled inputs (DRC FormChipCell -> NewChipForm), `getText()` doesn't return input values
const getCellTextWithChips = async cell => {
  const text = await getText(cell)
  const chips = await cell.locator('.edit-chip-container').all()
  const chipsText = await Promise.all(
    chips.map(async chip => {
      const inputs = await chip.locator('input').all()
      const values = await Promise.all(inputs.map(input => getAttribute(input, 'value')))

      return values.join('\n:\n')
    })
  )

  return [text, ...chipsText].join('\n')
}

// "should contains" checks: by default EVERY value of the column must contain the substring (the column must have values),
// as the steps verify the filtered tables. The previous check passed when a single row matched, so a filter that did
// nothing passed as well. `atLeastOne` - for the tables whose rows differ by design (e.g. the status of one job)
export const expectColumnValuesContain = (values, subString, columnName, atLeastOne = false) => {
  expect(values.length > 0, `"${columnName}" column has no values`).toBe(true)

  if (atLeastOne) {
    expect(
      values.some(item => item.includes(subString)),
      `No value of "${columnName}" column contains "${subString}", values: [${values}]`
    ).toBe(true)
  } else {
    const notMatching = values.filter(item => !item.includes(subString))

    expect(
      notMatching,
      `Not all the values of "${columnName}" column contain "${subString}", not matching: [${notMatching}], values: [${values}]`
    ).toEqual([])
  }
}

export const isContainsSubstringInColumnCells = async (
  page,
  table,
  columnName,
  value,
  atLeastOne = false
) =>
  retryAssertion(async () => {
    const cells = await page.locator(table.tableColumns[columnName]).all()
    const arr = await Promise.all(cells.map(getCellTextWithChips))
    const subString = value.replace('=', '\n:\n')

    expectColumnValuesContain(arr, subString, columnName, atLeastOne)
  })

export const isContainsSubstringInColumnAttributeCells = async (
  page,
  table,
  columnName,
  value,
  atLeastOne = false
) =>
  retryAssertion(async () => {
    const arr = await getColumnValuesAttribute(page, table, columnName)

    expectColumnValuesContain(arr, value, columnName, atLeastOne)
  })

// every expected item of the comma separated `value` must be one of the column values. The previous check
// (`value.includes(item)` for some item) passed when a single value was a substring of the list, e.g. "a" of "a,c,e"
// (so "c" and "e" were never checked), or an empty value
export const isContainsSubstringInColumnAttributeListCells = async (
  page,
  table,
  columnName,
  value
) =>
  retryAssertion(async () => {
    const arr = await getColumnValuesAttribute(page, table, columnName)
    const missingValues = value.split(',').filter(item => !arr.includes(item))

    expect(arr.length > 0, `"${columnName}" column has no values`).toBe(true)
    expect(
      missingValues,
      `Values [${missingValues}] are not found in "${columnName}" column values: [${arr}]`
    ).toEqual([])
  })

export const isContainsSubstringInColumnDropdownCells = async (page, table, column, value) => {
  const subString = value.replace('=', '\n:\n')
  const rows = await getTableRows(page, table)
  let flag = true

  expect(rows).not.toBe(0)

  for (let i = 1; i <= rows; i++) {
    await openDropdown(page, table.tableFields[column](i))
    const options = await getOptionValues(page, table.tableFields[column](i).options)
    flag = flag && options.some(item => item.includes(subString))
    // TODO: that is a workarround for collapsing labels dropdown
    await selectOptionInDropdownWithoutCheck(page, table.tableFields[column](i), options[0])
  }

  expect(flag).toBe(true)
}

export const isContainsSubstringInColumnDropdownCellsOverlay = async (
  page,
  table,
  overlay,
  column,
  value
) => {
  const subString = value.replace('=', '\n:\n')
  const rows = await getTableRows(page, table)
  let flag = true

  expect(rows).not.toBe(0)

  for (let i = 1; i <= rows; i++) {
    await openDropdown(page, table.tableFields[column](i))
    const optionsRow = await getOptionValues(page, table.tableFields[column](i).options)
    const optionsOverlay = await getOptionValues(page, overlay)
    const options = optionsRow.concat(optionsOverlay)

    flag = flag && options.some(item => item.includes(subString))

    // close the hidden chips (the counter toggles them): the open overlay covered the next clicked element (e.g. the card)
    if (optionsOverlay.length > 0) {
      await click(page.locator(table.tableFields[column](i).open_button).first())
      await waitUntil(
        async () => (await page.locator(overlay).count()) === 0,
        5000,
        'The hidden chips are not closed'
      )
    }
  }

  expect(flag, `"${value}" is not found in "${column}" column hidden chips`).toBe(true)
}

export const isContainsSubstringInColumnTooltipCells = async (
  page,
  table,
  column,
  value,
  atLeastOne = false
) => {
  // the table is rendered after the data is fetched, `wait load page` can pass before the loader appears
  await waitUntil(async () => (await getTableRows(page, table)) > 0, 15000).catch(() => {})
  const rows = await getTableRows(page, table)

  expect(rows).not.toBe(0)

  const arr = []

  for (let i = rows; i >= 1; i--) {
    const label = page.locator(table.tableFields[column](i)['label']).first()

    // centered, so the cell isn't covered by the sticky table header
    await scrollIntoView(label, { block: 'center' })
    await page.waitForTimeout(250)
    await hoverComponent(page, table.tableFields[column](i)['label'], false)
    await page
      .locator(table.tableFields[column](i)['hint'])
      .first()
      .waitFor({ state: 'attached', timeout: 3000 })
    const text = await getElementText(page, table.tableFields[column](i)['hint'])
    arr.push(text)
    await page.waitForTimeout(250)
  }

  expectColumnValuesContain(arr, value, column, atLeastOne)
}

export const isDatetimeCelsValueInRange = async (
  page,
  table,
  columnName,
  fromDateTime,
  toDateTime
) =>
  retryAssertion(async () => {
    const arr = await getColumnValues(page, table, columnName)

    // the old slicing of Date.toString() dropped the year (parsed as 2001)
    const minStamp = Date.parse(fromDateTime)
    const maxStamp = Date.parse(toDateTime)

    // `every` of no values is true: an empty (or not rendered) table passed
    expect(arr.length > 0, `"${columnName}" column has no values`).toBe(true)

    const flag = arr.every(item => minStamp < Date.parse(item) && maxStamp > Date.parse(item))
    expect(flag, `values "${arr}" is not in range: (${fromDateTime}..${toDateTime})`).toBe(true)
  })

export const findRowIndexesByColumnValue = async (page, table, columnName, value) => {
  const arr = await getColumnValues(page, table, columnName)
  const indexes = []

  for (let indx in arr) {
    if (arr[indx] === value) {
      indexes.push(parseInt(indx) + 1)
    }
  }
  return indexes
}

// tables/tabs are rendered asynchronously, wait until the value appears instead of failing with index `undefined`
export const waitForRowIndexesByColumnValue = async (
  page,
  table,
  columnName,
  value,
  waitTimeout = 10000
) => {
  let indexes = []

  await waitUntil(async () => {
    try {
      indexes = await findRowIndexesByColumnValue(page, table, columnName, value)
    } catch {
      indexes = []
    }

    return indexes.length > 0
  }, waitTimeout).catch(() => {})

  expect(indexes.length > 0, `Value "${value}" was not found in "${columnName}" column`).toBe(true)

  return indexes
}

export const findRowIndexesByColumnValueExpand = async (page, table, columnName, value) => {
  const columnValues = await getColumnValues(page, table, columnName)

  return columnValues.reduce((acc, currentValue, index) => {
    if (currentValue === value) {
      acc.push(index)
    }

    return acc
  }, [])
}

export const findRowIndexesByColumnValueAttribute = async (page, table, columnName, value) => {
  const arr = await getColumnValuesAttribute(page, table, columnName)
  const indexes = []

  for (let indx in arr) {
    if (arr[indx] === value) {
      indexes.push(parseInt(indx) + 1)
    }
  }
  return indexes
}

// as `waitForRowIndexesByColumnValue`, by the `value` attribute of the cells (inputs): clicking a not found row used
// the NaN index (an invalid selector) instead of telling which value was not found
export const waitForRowIndexesByColumnValueAttribute = async (
  page,
  table,
  columnName,
  value,
  waitTimeout = 10000
) => {
  let indexes = []

  await waitUntil(async () => {
    indexes = await findRowIndexesByColumnValueAttribute(page, table, columnName, value)

    return indexes.length > 0
  }, waitTimeout).catch(() => {})

  expect(
    indexes.length > 0,
    `Value "${value}" was not found in "${columnName}" column, values: [${await getColumnValuesAttribute(page, table, columnName)}]`
  ).toBe(true)

  return indexes
}

export const findRowIndexesByColumnTooltipsValue = async (page, table, columnName, value) => {
  const indexes = []
  const rowsNumber = await getTableRows(page, table)
  for (let row = rowsNumber; row >= 1; row--) {
    const temp = await getElementText(page, table.tableFields[columnName](row)['label'])
    if (temp) {
      if (temp === value) {
        indexes.push(row)
      }
    } else {
      const label = page.locator(table.tableFields[columnName](row)['label']).first()

      // centered, so the cell isn't covered by the sticky table header
      await scrollIntoView(label, { block: 'center' })
      await page.waitForTimeout(250)
      await hoverComponent(page, table.tableFields[columnName](row)['label'], false)
      await page
        .locator(table.tableFields[columnName](row)['hint'])
        .first()
        .waitFor({ state: 'attached', timeout: 3000 })
        .catch(() => {})
      const text = await getElementText(page, table.tableFields[columnName](row)['hint'])
      if (text === value) {
        indexes.push(row)
      }
    }
  }

  return indexes.reverse()
}

export const openActionMenuByIndex = async (page, table, index) => {
  const elements = await page.locator(table.tableFields['action_menu'](index)).all()
  if (elements.length === 0) {
    const element = page.locator(table.tableFields['action_menu_button'](index)).first()

    if (element) {
      await click(element)

      return table.tableFields['action_menu'](index)
    }
  }
}

export const getCellByIndexColumn = async (page, table, index, column) => {
  return await table.tableFields[column](index)
}

// the column values must be ordered by `sortKey(value)` (the value itself by default), compared as the app's lodash
// `orderBy` does (`<`/`>`). The previous check sorted the values in place and compared the array with itself
export const isTableColumnSorted = async (
  page,
  table,
  columnName,
  order = 'asc',
  sortKey = value => value
) =>
  retryAssertion(async () => {
    const values = await getColumnValues(page, table, columnName)
    const keys = values.map(sortKey)

    expect(
      values.length > 1,
      `At least 2 rows are needed to check the order, values: [${values}]`
    ).toBe(true)

    const unorderedIndex = keys.findIndex(
      (key, index) =>
        index > 0 && (order === 'desc' ? keys[index - 1] < key : keys[index - 1] > key)
    )

    expect(
      unorderedIndex,
      `"${columnName}" column is not sorted in ${order} order: "${values[unorderedIndex - 1]}" (${keys[unorderedIndex - 1]}) ` +
        `is before "${values[unorderedIndex]}" (${keys[unorderedIndex]}), values: [${values}]`
    ).toBe(-1)
  })

export const checkTableColumnValues = async (page, table, columnName, values) =>
  retryAssertion(async () => {
    const arr = await getColumnValues(page, table, columnName)
    if (arr.length === 0) {
      throw new Error('Array is empty, nothing to compare')
    }

    // find missing and extra values
    const missingValues = difference(values, arr) // items in values but NOT in arr
    const extraValues = difference(arr, values) // items in arr but NOT in values

    if (missingValues.length > 0 || extraValues.length > 0) {
      throw new Error(
        `Arrays not equal: \nMissing values: ${missingValues} \nExtra values: ${extraValues}`
      )
    }

    return true
  })

export const getAllCellsWithAttribute = async (page, table, attribute) => {
  const result = []

  for (const column of table.tableCulumnNames) {
    const classes = await page
      .locator(table.tableColumns[column])
      .all()
      .then(days => Promise.all(days.map(day => getAttribute(day, attribute.attribute))))

    result.push(
      ...classes
        .map((item, index) => {
          if (item.includes(attribute.value)) {
            return index
          }
        })
        .filter(element => element >= 0)
        .map(dayNum => [column, dayNum])
    )
  }

  return result
}

export const getRowsGeometry = async (page, table) => {
  const rowsNumber = await getTableRows(page, table)
  const result = []

  for (let i = 1; i <= rowsNumber; i++) {
    const rowRoot = page.locator(table.rowRoot(i)).first()
    const position = await getRect(rowRoot)

    result.push(position)
  }

  return result
}

export const getFieldsGeometry = async (page, table, column, attribute) => {
  const rowsNumber = await getTableRows(page, table)
  const result = []

  for (let i = 1; i <= rowsNumber; i++) {
    const rowRoot = page.locator(table.tableFields[column](i)).first()
    const coord = await getRect(rowRoot)
    result.push(coord)
  }

  return result
}

export const getNamedRowsGeometry = async (page, table, name = 'name') => {
  const rowsNumber = await getTableRows(page, table)
  const result = []

  for (let i = 1; i <= rowsNumber; i++) {
    const rowRoot = page.locator(table.rowRoot(i)).first()
    const rowName = await getText(page.locator(table.tableFields[name](i)).first())
    const position = await getRect(rowRoot)

    position['name'] = rowName
    result.push(position)
  }

  return result
}

export const getNamedFieldsGeometry = async (page, table, column) => {
  const rowsNumber = await getTableRows(page, table)
  const result = []

  for (let i = 1; i <= rowsNumber; i++) {
    const rowRoot = page.locator(table.tableFields[column](i)).first()
    const coord = await getRect(rowRoot)
    result.push(coord)
  }

  return result
}

export const putToTestContextCellParameters = async (
  page,
  testContext,
  table,
  index,
  column,
  attribute
) => {
  const cellElement = page.locator(table.tableFields[column](index)).first()

  testContext[column] = await getText(cellElement)
  if (attribute) {
    testContext[attribute] = await getAttribute(cellElement, attribute)
  }
}

export const checkCellHintText = async (page, table, hintComponent, hintValue, index) => {
  await hoverComponent(page, table.tableFields['hintButton'](index))
  await page.waitForTimeout(250)
  const hint = page.locator(hintComponent).first()
  const text = await getText(hint)

  expect(normalizeWhitespace(text)).toBe(normalizeWhitespace(hintValue))
}
