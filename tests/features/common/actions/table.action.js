import { expect } from 'chai'

function getColumnValues(driver, table, columnName) {
  return driver
    .findElements(table.tableColumns[columnName])
    .then(function(elements) {
      return Promise.all(elements.map(element => element.getText()))
    })
}

const action = {
  getColumnValues: getColumnValues,
  isContainsValueInColumn: async function(driver, table, columnName, value) {
    const arr = await getColumnValues(driver, table, columnName)
    expect(arr.includes(value)).equal(true)
  },
  isNotContainsValueInColumn: async function(driver, table, columnName, value) {
    const arr = await getColumnValues(driver, table, columnName)
    expect(arr.includes(value)).equal(false)
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
  }
}

module.exports = action
