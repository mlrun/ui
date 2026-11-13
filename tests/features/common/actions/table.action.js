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
import { expectTimeout } from '../../../config.js'
import { expect } from '@playwright/test'
import {
  getOptionValues,
  openDropdown,
  selectOptionInDropdownWithoutCheck
} from './dropdown.action.js'
import { getElementText, hoverComponent, readNonEmptyText } from './common.action.js'
import {
  click,
  expectSameItems,
  expectText,
  getAttribute,
  getAttributes,
  getRect,
  getText,
  getTexts,
  pollOptions,
  pollText,
  readOrNull,
  retryAssertion,
  scrollIntoView,
  waitForPageQuiet
} from '../../common-tools/element.js'

const getColumnValuesAttribute = (page, table, columnName) =>
  getAttributes(page.locator(table.tableColumns[columnName]), 'value')

export const getColumnValues = async (page, table, columnName) => {
  return getTexts(page.locator(table.tableColumns[columnName]))
}

export const getTableRows = async (page, table) => {
  return page.locator(table.tableColumns[table.tableCulumnNames[0]]).count()
}

// the number of rows once the table has at least one row: the per-row checks ("in every row ...") would check
// nothing on a table that is empty or not rendered yet
export const waitForTableRows = async (page, table, timeout = expectTimeout) => {
  await expect
    .poll(() => getTableRows(page, table), {
      timeout,
      message: `The table has no rows: ${table.tableColumns[table.tableCulumnNames[0]]}`
    })
    .toBeGreaterThan(0)

  return getTableRows(page, table)
}

const pollColumnValues = (page, table, columnName) =>
  expect.poll(
    readOrNull(() => getColumnValues(page, table, columnName)),
    pollOptions(`Values of "${columnName}" column`)
  )

// one of the values is `value` (the whole value, not a substring)
export const isContainsValueInColumn = async (page, table, columnName, value) =>
  pollColumnValues(page, table, columnName).toContain(value)

export const isContainsValueInHeaderColumn = async (page, table, columnName, value) =>
  pollText(page.locator(table.headerSorters[columnName]).first(), {
    message: `Header of "${columnName}" column`
  }).toContain(value)

// a negative check passes on a table that isn't rendered yet, so the table must be loaded: it has rows, none of them with
// the value, or there are no rows and the page shows that there is no data (the NoData block). One read, after the page
// settled: with a separate "loaded" check, the table unmounted by a reload (after a delete) had no values for a moment and
// the check passed before the row that was not deleted came back
export const isNotContainsValueInColumn = async (page, table, columnName, value) => {
  await waitForPageQuiet(page)
  await expect
    .poll(
      async () => {
        const values = await getColumnValues(page, table, columnName)

        if (values.length > 0) {
          return values.includes(value)
            ? `"${value}" is in the column: [${values}]`
            : 'not in the column'
        }

        return (await page.locator('[data-testid="no-data"]').first().isVisible())
          ? 'not in the column'
          : 'the table is not loaded: no rows and no "no data" message'
      },
      pollOptions(`"${value}" should not be in "${columnName}" column`)
    )
    .toBe('not in the column')
}

// the texts of the cells with their chips, read at once: a list being re-rendered (e.g. after filtering) can't be read
// cell by cell. The visible chips are rendered as disabled inputs (DRC FormChipCell -> NewChipForm), the rendered text
// doesn't include the input values: they are added as "key\n:\nvalue"
const getCellsTextWithChips = locator =>
  locator.evaluateAll(cells =>
    cells.map(cell => {
      const isVisible = cell.checkVisibility({ opacityProperty: true, visibilityProperty: true })
      const text = isVisible
        ? (cell.tagName === 'TEXTAREA' ? cell.value : (cell.innerText ?? cell.textContent))
            .replace(/\u00a0/g, ' ')
            .trim()
        : ''
      const chipsText = [...cell.querySelectorAll('.edit-chip-container')].map(chip =>
        [...chip.querySelectorAll('input')].map(input => input.value).join('\n:\n')
      )

      return [text, ...chipsText].join('\n')
    })
  )

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
    const arr = await getCellsTextWithChips(page.locator(table.tableColumns[columnName]))
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

// The dropdown chips checks follow a filter change, when the table can still show the rows of the previous filter (the
// rows are counted first, e.g. MLFS013: the rows of "my-key" checked for "type=featureSet"), so they are retried as a
// whole: the rows are counted and checked again until the table matches or the timeout. The visible chips are inputs:
// their values are not in the rendered text, the hidden ones (in the overlay) are text (see `getCellsTextWithChips`)
export const isContainsSubstringInColumnDropdownCells = async (page, table, column, value) => {
  const subString = value.replace('=', '\n:\n')

  await retryAssertion(async () => {
    await waitForPageQuiet(page)

    const rows = await getTableRows(page, table)

    expect(rows, 'The table has no rows').not.toBe(0)

    for (let i = 1; i <= rows; i++) {
      await openDropdown(page, table.tableFields[column](i))

      const options = await getOptionValues(page, table.tableFields[column](i).options)
      const chips = await getCellsTextWithChips(page.locator(table.tableFields[column](i).options))

      // TODO: that is a workarround for collapsing labels dropdown
      await selectOptionInDropdownWithoutCheck(page, table.tableFields[column](i), options[0])
      expect(
        chips.some(item => item.includes(subString)),
        `"${value}" is not found in "${column}" column of row ${i}: [${chips}]`
      ).toBe(true)
    }
  })
}

export const isContainsSubstringInColumnDropdownCellsOverlay = async (
  page,
  table,
  overlay,
  column,
  value
) => {
  const subString = value.replace('=', '\n:\n')

  await retryAssertion(async () => {
    await waitForPageQuiet(page)

    const rows = await getTableRows(page, table)

    expect(rows, 'The table has no rows').not.toBe(0)

    for (let i = 1; i <= rows; i++) {
      // the counter ("+N") shows the hidden chips. Not `openDropdown`: its "options" are the visible chips, always
      // shown, so it took the dropdown as open and never clicked the counter - the hidden chips were never read
      const counter = page.locator(table.tableFields[column](i).open_button).first()

      if ((await counter.count()) > 0 && !(await page.locator(overlay).first().isVisible())) {
        await waitForPageQuiet(page)
        await click(counter)
      }

      let options = []
      let optionsOverlay = []

      // the hidden chips are rendered in the overlay a moment after the counter is clicked
      await expect
        .poll(
          async () => {
            optionsOverlay = await getCellsTextWithChips(page.locator(overlay))
            options = (
              await getCellsTextWithChips(page.locator(table.tableFields[column](i).options))
            ).concat(optionsOverlay)

            return options.some(item => item.includes(subString))
          },
          { timeout: 3000 }
        )
        .toBe(true)
        .catch(() => {})

      // close the hidden chips (the counter toggles them): the open overlay covered the next clicked element (e.g.
      // the card)
      if (optionsOverlay.length > 0) {
        await click(page.locator(table.tableFields[column](i).open_button).first())
        await expect
          .poll(() => page.locator(overlay).count(), {
            timeout: expectTimeout,
            message: 'The hidden chips are not closed'
          })
          .toBe(0)
      }

      expect(
        options.some(item => item.includes(subString)),
        `"${value}" is not found in "${column}" column hidden chips of row ${i}: [${options}]`
      ).toBe(true)
    }
  })
}

// the text of the tooltip of a cell: the pointer is moved away first so the tooltip of the previous cell is gone, then
// the cell is hovered and the tooltip is given time to render. An empty text is returned if there is no tooltip
const readCellTooltip = async (page, cell) => {
  const hint = page.locator(cell['hint']).first()

  await page.mouse.move(0, 0)
  await hint.waitFor({ state: 'detached', timeout: 1000 }).catch(() => {})
  // centered, so the cell isn't covered by the sticky table header
  await scrollIntoView(page.locator(cell['label']).first(), { block: 'center' })
  await hoverComponent(page, cell['label'], false)

  return retryAssertion(async () => {
    const text = await getText(hint, { timeout: 1000 })

    expect(text, 'The tooltip has no text').not.toBe('')

    return text
  }, 3000).catch(() => '')
}

export const isContainsSubstringInColumnTooltipCells = async (
  page,
  table,
  column,
  value,
  atLeastOne = false
) => {
  // the table is rendered after the data is fetched, `wait load page` can pass before the loader appears
  await expect
    .poll(() => getTableRows(page, table), { timeout: expectTimeout })
    .toBeGreaterThan(0)
    .catch(() => {})
  // the tooltips are read row by row (hovered one at a time): a table that rendered more rows meanwhile had them not
  // checked, so the tooltips are read again when the number of rows changed
  for (let attempt = 1; ; attempt++) {
    const rows = await getTableRows(page, table)

    expect(rows).not.toBe(0)

    const arr = []

    for (let i = rows; i >= 1; i--) {
      arr.push(await readCellTooltip(page, table.tableFields[column](i)))
    }

    const rowsAfter = await getTableRows(page, table)

    if (rowsAfter !== rows && attempt < 3) continue

    expect(rowsAfter, `The table kept changing while its tooltips were read`).toBe(rows)
    expectColumnValuesContain(arr, value, column, atLeastOne)

    return
  }
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
  waitTimeout = expectTimeout
) => {
  let indexes = []

  await expect
    .poll(
      async () => {
        try {
          indexes = await findRowIndexesByColumnValue(page, table, columnName, value)
        } catch {
          indexes = []
        }

        return indexes.length > 0
      },
      { timeout: waitTimeout }
    )
    .toBe(true)
    .catch(() => {})

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
  waitTimeout = expectTimeout
) => {
  let indexes = []

  await expect
    .poll(
      async () => {
        indexes = await findRowIndexesByColumnValueAttribute(page, table, columnName, value)

        return indexes.length > 0
      },
      { timeout: waitTimeout }
    )
    .toBe(true)
    .catch(() => {})

  expect(
    indexes.length > 0,
    `Value "${value}" was not found in "${columnName}" column, values: [${await getColumnValuesAttribute(page, table, columnName)}]`
  ).toBe(true)

  return indexes
}

export const findRowIndexesByColumnTooltipsValue = async (page, table, columnName, value) => {
  const indexes = []

  // the table can be still rendering after the previous step
  await expect
    .poll(() => getTableRows(page, table), { timeout: expectTimeout })
    .toBeGreaterThan(0)
    .catch(() => {})

  const rowsNumber = await getTableRows(page, table)
  for (let row = rowsNumber; row >= 1; row--) {
    const temp = await getElementText(page, table.tableFields[columnName](row)['label'])
    if (temp) {
      if (temp === value) {
        indexes.push(row)
      }
    } else {
      const text = await readCellTooltip(page, table.tableFields[columnName](row))
      if (text === value) {
        indexes.push(row)
      }
    }
  }

  return indexes.reverse()
}

export const openActionMenuByIndex = async (page, table, index) => {
  if ((await page.locator(table.tableFields['action_menu'](index)).count()) === 0) {
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

    expect(arr.length > 0, `"${columnName}" column has no values`).toBe(true)
    expectSameItems(arr, values, `Values of "${columnName}" column`)

    return true
  })

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

  testContext[column] = await readNonEmptyText(cellElement, `"${column}" cell of row ${index}`)
  if (attribute) {
    testContext[attribute] = await getAttribute(cellElement, attribute)
  }
}

export const checkCellHintText = async (page, table, hintComponent, hintValue, index) => {
  await hoverComponent(page, table.tableFields['hintButton'](index))

  await expectText(page.locator(hintComponent).first(), hintValue, {
    normalize: true,
    message: 'Hint text'
  })
}
