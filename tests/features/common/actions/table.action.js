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
import { differenceWith, isEqual } from 'lodash'
import {
  getOptionValues,
  openDropdown,
  selectOptionInDropdownWithoutCheck
} from './dropdown.action'
import { getElementText, hoverComponent } from './common.action'

import { DataFrame } from 'pandas-js'

async function getColumnValues(driver, table, columnName) {
  return await driver
    .findElements(table.tableColumns[columnName])
    .then(function(elements) {

      return Promise.all(elements.map(element => element.getText()))
    })
}

async function getColumnValuesAttribute(driver, table, columnName) {
  return await driver
    .findElements(table.tableColumns[columnName])
    .then(function(elements) {

      return Promise.all(elements.map(element => element.getAttribute('value')))
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
    expect(arr.includes(value)).equal(true, `Column values [${arr}] is not equal with "${value}" `)
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
    const subString = value.replace('=', '\n:\n')
    expect(arr.length > 0).equal(true)
    expect(arr.some(item => item.includes(subString))).equal(
      true,
      `Value "${subString}" does not includes in all values: [${arr}]`
    )
  },
  isContainsSubstringInColumnAttributrCells: async function(
    driver,
    table,
    columnName,
    value
  ) {
    const arr = await getColumnValuesAttribute(driver, table, columnName)
    expect(arr.length > 0).equal(true)
    expect(arr.every(item => item.includes(value))).equal(
      true,
      `Value "${value}" does not includes in all values: [${arr}]`
    )
  },
  isContainsSubstringInColumnDropdownCells: async function(
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
  isContainsSubstringInColumnDropdownCellsOverlay: async function(
    driver,
    table,
    overlay,
    column,
    value
  ) {
    const subString = value.replace('=', '\n:\n')
    const rows = await getTableRows(driver, table)
    let flag = true

    expect(rows).not.equal(0)

    for (let i = 1; i <= rows; i++) {
      await openDropdown(driver, table.tableFields[column](i))
      const optionsRow = await getOptionValues(
        driver,
        table.tableFields[column](i).options
      )
      const optionsOverlay = await getOptionValues(
        driver,
        overlay
      )
      const options = optionsRow.concat(optionsOverlay)

      flag = flag && options.some(item => item.includes(subString))
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
      await driver.sleep(250)
    }

    expect(arr.every(item => item.includes(value))).equal(true)
  },
  isDatetimeCelsValueInRange: async function(
    driver,
    table,
    columnName,
    fromDateTime,
    toDateTime
  ) {
    const arr = await getColumnValues(driver, table, columnName)

    const minDate = new Date(fromDateTime)
    const maxDate = new Date(toDateTime)

    const minStamp = Date.parse(
      minDate.toString().slice(0, 11) + minDate.toString().slice(16, 24)
    )
    const maxStamp = Date.parse(
      maxDate.toString().slice(0, 11) + maxDate.toString().slice(16, 24)
    )

    const flag = arr.every(
      item => minStamp < Date.parse(item) && maxStamp > Date.parse(item)
    )
    expect(flag).equal(
      true,
      `values "${arr}" is not in range: (${fromDateTime}..${toDateTime})`
    )
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
  findRowIndexesByColumnValueExpand: async function(
    driver,
    table,
    columnName,
    value
  ) {
    const columnValues = await getColumnValues(driver, table, columnName)

    return columnValues.reduce((acc, currentValue, index) => {
      if (currentValue === value){
        acc.push(index)
      }  
      
      return acc
    }, [])
  },
  findRowIndexesByColumnValueAttribute: async function(
    driver,
    table,
    columnName,
    value
  ) {
    const arr = await getColumnValuesAttribute(driver, table, columnName)
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
    if (arr.length === 0) {
      expect(arr.length > 0).equal(
        true,
        'Array is empty, nothing to compare'
      )
    }
    const diff = differenceWith(arr, values, isEqual)

    expect(diff.length).equal(
      0,
      `Arrays not equal: web "${arr}" vs. const "${values} diff "${diff}"`
    )
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
  },
  putToTestContextCellParameters: async function(
    driver,
    testContext,
    table,
    index,
    column,
    attribute
  ) {
    const cellElement = await driver.findElement(
      table.tableFields[column](index)
    )

    testContext[column] = await cellElement.getText()
    if (attribute) {
      testContext[attribute] = await cellElement.getAttribute(attribute)
    }
  },
  checkCellHintText: async function (driver, table, hintComponent, hintValue, index) {
    await hoverComponent(driver, table.tableFields['hintButton'](index))
    await driver.sleep(250)
    const hint = await driver.findElement(hintComponent)
    const text = await hint.getText(hint)

    expect(text).equal(hintValue)
  }
}

module.exports = action
