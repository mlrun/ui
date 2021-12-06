import { expect } from 'chai'
import { differenceWith, isEqual } from 'lodash'
import {
  openDropdown,
  selectOptionInDropdownWithoutCheck,
  getOptionValues
} from './dropdown.action'
import { hoverComponent, getElementText } from './common.action'

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
  isContainsSubstringInColumnCels: async function(
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
    const subStirng = value.replace('=', '\n:\n')
    const rows = await getTableRows(driver, table)
    expect(rows).not.equal(0)
    let flag = true
    for (let i = 1; i <= rows; i++) {
      await openDropdown(driver, table.tableFields[column](i))
      const options = await getOptionValues(
        driver,
        table.tableFields[column](i).options
      )
      flag = flag && options.some(item => item.includes(subStirng))
      // TODO: that is a workarround for collapsing labels dropdown
      await selectOptionInDropdownWithoutCheck(
        driver,
        table.tableFields[column](i),
        options[0]
      )
    }
    expect(flag).equal(true)
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
    expect(differenceWith(arr, values, isEqual).length).equal(0)
  },
  getAllCellsWithAttribute: async function(driver, table, attribute) {
    let result = []

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
  }
}

module.exports = action
