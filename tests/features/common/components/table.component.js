import { By } from 'selenium-webdriver'
import { locatorBuilder } from '../../common-tools/common-tools'

module.exports = function(tableStructure) {
  const table = tableStructure
  const sortersBuilder = locatorBuilder`${0} ${1} ${2}`
  const columnBuilder = locatorBuilder`${0} ${1} ${2} ${3}`
  const fieldBuilder = locatorBuilder`${0} ${1} ${2}:nth-of-type(${3}) ${4}`
  const sorters = {}
  const columnSelector = {}
  const fieldSelector = {}

  const root = By.css(table.root)
  for (const key in table.header.sorters) {
    sorters[key] = By.css(
      sortersBuilder(table.root, table.header.root, table.header.sorters[key])
    )
  }
  for (const key in table.body.row.fields) {
    columnSelector[key] = By.css(
      columnBuilder(
        table.root,
        table.body.root,
        table.body.row.root,
        table.body.row.fields[key]
      )
    )
    fieldSelector[key] = index =>
      By.css(
        fieldBuilder(
          table.root,
          table.body.root,
          table.body.row.root,
          index,
          table.body.row.fields[key]
        )
      )
  }
  return {
    root: root,
    headerSorters: sorters,
    tableColumns: columnSelector,
    tableFields: fieldSelector
  }
}
