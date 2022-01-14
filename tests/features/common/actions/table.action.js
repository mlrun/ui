import { expect } from 'chai'
import { differenceWith, isEqual } from 'lodash'
import {
  openDropdown,
  selectOptionInDropdownWithoutCheck,
  getOptionValues
} from './dropdown.action'
import { hoverComponent, getElementText } from './common.action'

import { DataFrame } from 'pandas-js'

async function getColumnValues(driver, table, columnName) {
  return await driver
    .findElements(table.tableColumns[columnName])
    .then(function(elements) {
      return Promise.all(elements.map(element => element.getText()))
    })
}

async function getTableRows(driver, table) {
  const arr = await driver
    .findElements(table.tableColumns[table.tableCulumnNames[0]])
    .then(function(elements) {
      return Promise.all(elements.map(element => element))
    })

  return await arr.length
}

const action = {
  getColumnValues: getColumnValues,
  getTableRows: getTableRows,
  isContainsValueInColumn: async function(driver, table, columnName, value) {
    const arr = await getColumnValues(driver, table, columnName)
    expect(arr.includes(value)).equal(true)
  },
  isNotContainsValueInColumn: async function(driver, table, columnName, value) {
    const arr = await getColumnValues(driver, table, columnName)
    expect(arr.includes(value)).equal(false)
  },
  isContainsSubstringInColumnCells: async function(
    driver,
    table,
    columnName,
    value
  ) {
    const arr = await getColumnValues(driver, table, columnName)
    expect(arr.length > 0).equal(true)
    expect(arr.every(item => item.includes(value))).equal(true)
  },
  isContainsSubstringInColumnDropdownCels: async function(
    driver,
    table,
    column,
    value
  ) {
    const subString = value.replace('=', '\n:\n')
    const rows = await getTableRows(driver, table)
    let flag = true

    expect(rows).not.equal(0)

    for (let i = 1; i <= rows; i++) {
      await openDropdown(driver, table.tableFields[column](i))
      const options = await getOptionValues(
        driver,
        table.tableFields[column](i).options
      )
      flag = flag && options.some(item => item.includes(subString))
      // TODO: that is a workarround for collapsing labels dropdown
      await selectOptionInDropdownWithoutCheck(
        driver,
        table.tableFields[column](i),
        options[0]
      )
    }

    expect(flag).equal(true)
  },
  isContainsSubstringInColumnTooltipCells: async function(
    driver,
    table,
    column,
    value
  ) {
    const rows = await getTableRows(driver, table)

    expect(rows).not.equal(0)

    const arr = []

    for (let i = rows; i >= 1; i--) {
      await hoverComponent(driver, table.tableFields[column](i)['label'])
      const text = await getElementText(
        driver,
        table.tableFields[column](i)['hint']
      )
      arr.push(text)
    }

    expect(arr.every(item => item.includes(value))).equal(true)
  },
  isDatetimeCelsValueInRange: async function(
    driver,
    table,
    column,
    fromDateTime,
    toDateTime
  ) {
    // const arr = await getColumnValues(driver, table, column)
    // TODO: wait while defect with year will be fixed
    console.log('TODO: Should be implemented')
  },
  findRowIndexesByColumnValue: async function(
    driver,
    table,
    columnName,
    value
  ) {
    const arr = await getColumnValues(driver, table, columnName)
    const indexes = []
    for (let indx in arr) {
      if (arr[indx] === value) {
        indexes.push(parseInt(indx) + 1)
      }
    }

    return indexes
  },
  findRowIndexesByColumnTooltipsValue: async function(
    driver,
    table,
    columnName,
    value
  ) {
    const indexes = []
    const rowsNumber = await getTableRows(driver, table)
    for (let row = rowsNumber; row >= 1; row--) {
      const temp = await getElementText(
        driver,
        table.tableFields[columnName](row)['label']
      )
      if (temp) {
        if (temp === value) {
          indexes.push(row)
        }
      } else {
        await hoverComponent(
          driver,
          table.tableFields[columnName](row)['label']
        )
        const text = await getElementText(
          driver,
          table.tableFields[columnName](row)['hint']
        )
        if (text === value) {
          indexes.push(row)
        }
      }
    }

    return indexes.reverse()
  },
  openActionMenuByIndex: async function(driver, table, index) {
    const elements = await driver.findElements(
      table.tableFields['action_menu'](index)
    )
    if (elements.length === 0) {
      const element = await driver.findElement(
        table.tableFields['action_menu_button'](index)
      )

      if (element) {
        await element.click()

        return table.tableFields['action_menu'](index)
      }
    }
  },
  getCellByIndexColumn: async function(driver, table, index, column) {
    return await table.tableFields[column](index)
  },
  isTableColumnSorted: async function(
    driver,
    table,
    columnName,
    order = 'asc'
  ) {
    const columnArray = await getColumnValues(driver, table, columnName)
    let sortedArr = []
    if (order === 'asc') {
      sortedArr = columnArray.sort()
    }
    if (order === 'desc') {
      sortedArr = columnArray.reverse()
    }

    expect(sortedArr).equal(columnArray)
  },
  checkTableColumnValues: async function(driver, table, columnName, values) {
    const arr = await getColumnValues(driver, table, columnName)
    const diff = differenceWith(arr, values, isEqual)

    expect(diff.length).equal(0, 'Diff arrays: ' + diff)
  },
  getAllCellsWithAttribute: async function(driver, table, attribute) {
    const result = []

    for (const column of table.tableCulumnNames) {
      const classes = await driver
        .findElements(table.tableColumns[column])
        .then(days =>
          Promise.all(days.map(day => day.getAttribute(attribute.attribute)))
        )

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
  },
  getRowsGeometry: async function(driver, table) {
    const rowsNumber = await getTableRows(driver, table)
    const result = []

    for (let i = 1; i <= rowsNumber; i++) {
      const rowRoot = await driver.findElement(table.rowRoot(i))
      const position = await rowRoot.getRect()

      result.push(position)
    }

    return result
  },
  getFieldsGeometry: async function(driver, table, column, attribute) {
    const rowsNumber = await getTableRows(driver, table)
    const result = []

    for (let i = 1; i <= rowsNumber; i++) {
      const rowRoot = await driver.findElement(table.tableFields[column](i))
      const coord = await rowRoot.getRect()
      result.push(coord)
    }

    return result
  },
  getNamedRowsGeometry: async function(driver, table, name = 'name') {
    const rowsNumber = await getTableRows(driver, table)
    const result = []

    for (let i = 1; i <= rowsNumber; i++) {
      const rowRoot = await driver.findElement(table.rowRoot(i))
      const rowName = await driver
        .findElement(table.tableFields[name](i))
        .getText()
      const position = await rowRoot.getRect()

      position['name'] = rowName
      result.push(position)
    }

    return new DataFrame(result)
  },
  getNamedFieldsGeometry: async function(driver, table, column) {
    const rowsNumber = await getTableRows(driver, table)
    const result = []

    for (let i = 1; i <= rowsNumber; i++) {
      const rowRoot = await driver.findElement(table.tableFields[column](i))
      const coord = await rowRoot.getRect()
      result.push(coord)
    }

    return new DataFrame(result)
  }
}

module.exports = action
