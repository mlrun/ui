import { expect } from 'chai'

function getColumnValues(driver, table, columnName) {
  return driver
    .findElements(table.tableColumns[columnName])
    .then(async function(elements) {
      return await Promise.all(
        elements.map(async function(element) {
          return await element.getText()
        })
      )
    })
}

const action = {
  getColumnValues: getColumnValues,
  isContainsValueInColumn: async function(driver, table, columnName, value) {
    await getColumnValues(driver, table, columnName)
      .then(arr => {
        return arr.includes(value)
      })
      .then(flag => expect(flag).equal(true))
  },
  isNotContainsValueInColumn: async function(driver, table, columnName, value) {
    await getColumnValues(driver, table, columnName)
      .then(arr => {
        return arr.includes(value)
      })
      .then(flag => expect(flag).equal(false))
  },
  findRowIndexesByColumnValue: async function(
    driver,
    table,
    columnName,
    value
  ) {
    return await getColumnValues(driver, table, columnName).then(arr => {
      let indexes = []
      for (let indx in arr) {
        if (arr[indx] === value) {
          indexes.push(parseInt(indx) + 1)
        }
      }
      return indexes
    })
  },
  openActionMenuByIndex: async function(driver, table, index) {
    return await driver
      .findElements(table.tableFields['action_menu'](index))
      .then(elements => {
        if (elements.length === 0) {
          return driver.findElement(
            table.tableFields['action_menu_button'](index)
          )
        }
      })
      .then(element => {
        if (element) {
          return element.click()
        }
      })
      .then(() => {
        return table.tableFields['action_menu'](index)
      })
  },
  getCellByIndexColumn: async function(driver, table, index, column) {
    return await table.tableFields[column](index)
  }
}

module.exports = action
