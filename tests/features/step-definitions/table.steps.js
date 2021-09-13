import { When, Then } from '@cucumber/cucumber'
import pageObjects from '../common/page-objects'
import {
  clickOnComponent,
  verifyText,
  waitPageLoad,
  clickNearComponent,
  typeIntoInputField
} from '../common/actions/common.action'
import {
  getTableRows,
  isContainsValueInColumn,
  isNotContainsValueInColumn,
  findRowIndexesByColumnValue,
  getCellByIndexColumn,
  isContainsSubstringInColumnCels,
  isContainsSubstringInColumnDropdownCels,
  isDatetimeCelsValueInRange
} from '../common/actions/table.action'
import {
  openActionMenu,
  selectOptionInActionMenu
} from '../common/actions/action-menu.action'

Then(
  'check {string} value in {string} column in {string} table on {string} wizard',
  async function(value, column, table, wizard) {
    await waitPageLoad(this.driver, pageObjects['commonPagesHeader']['loader'])
    await isContainsValueInColumn(
      this.driver,
      pageObjects[wizard][table],
      column,
      value
    )
  }
)

Then(
  'check {string} value not in {string} column in {string} table on {string} wizard',
  async function(value, column, table, wizard) {
    await waitPageLoad(this.driver, pageObjects['commonPagesHeader']['loader'])
    await isNotContainsValueInColumn(
      this.driver,
      pageObjects[wizard][table],
      column,
      value
    )
  }
)

Then(
  'open action menu on {string} wizard in {string} table at row with {string} value in {string} column',
  async function(wizard, table, value, column) {
    const arr = await findRowIndexesByColumnValue(
      this.driver,
      pageObjects[wizard][table],
      column,
      value
    )
    const indx = arr[0]
    const actionMenuSel = await getCellByIndexColumn(
      this.driver,
      pageObjects[wizard][table],
      indx,
      'action_menu'
    )
    await openActionMenu(this.driver, actionMenuSel)
  }
)

Then(
  'select {string} option in action menu on {string} wizard in {string} table at row with {string} value in {string} column',
  async function(option, wizard, table, value, column) {
    const arr = await findRowIndexesByColumnValue(
      this.driver,
      pageObjects[wizard][table],
      column,
      value
    )
    const indx = arr[0]
    const actionMenuSel = await getCellByIndexColumn(
      this.driver,
      pageObjects[wizard][table],
      indx,
      'action_menu'
    )
    await openActionMenu(this.driver, actionMenuSel)
    await this.driver.sleep(500)
    await selectOptionInActionMenu(this.driver, actionMenuSel, option)
  }
)

When('add rows to {string} table on {string} wizard', async function(
  table,
  wizard,
  dataTable
) {
  const inputFields = dataTable['rawTable'][0]
  const rows = dataTable.rows()
  for (const row_indx in rows) {
    await clickOnComponent(
      this.driver,
      pageObjects[wizard][table]['add_row_btn']
    )
    await this.driver.sleep(100)
    for (const i in inputFields) {
      await typeIntoInputField(
        this.driver,
        pageObjects[wizard][table]['tableFields'][inputFields[i]](
          parseInt(row_indx) + 1
        ),
        rows[row_indx][i]
      )
    }
    await clickNearComponent(this.driver, pageObjects[wizard][table]['root'])
    await this.driver.sleep(100)
  }
})

Then('verify values in {string} table on {string} wizard', async function(
  table,
  wizard,
  dataTable
) {
  const columns = dataTable['rawTable'][0]
  const rows = dataTable.rows()
  for (const row_indx in rows) {
    for (const i in columns) {
      await verifyText(
        this.driver,
        pageObjects[wizard][table]['tableFields'][columns[i]](
          parseInt(row_indx) + 1
        ),
        rows[row_indx][i]
      )
    }
  }
})

When('click on {string} in {string} table on {string} wizard', async function(
  field,
  table,
  wizard,
  dataTable
) {
  const column = dataTable['rawTable'][0][0]
  const rows = dataTable.rows()
  for (const row_indx in rows) {
    const arr = await findRowIndexesByColumnValue(
      this.driver,
      pageObjects[wizard][table],
      column,
      rows[row_indx][0]
    )
    const indx = arr[0]
    await clickOnComponent(
      this.driver,
      pageObjects[wizard][table]['tableFields'][field](indx)
    )
  }
})

When(
  'add rows to {string} table in {string} on {string} wizard',
  async function(table, accordion, wizard, dataTable) {
    const inputFields = dataTable['rawTable'][0]
    const rows = dataTable.rows()
    for (const row_indx in rows) {
      await clickOnComponent(
        this.driver,
        pageObjects[wizard][accordion][table]['add_row_btn']
      )
      await this.driver.sleep(100)
      for (const i in inputFields) {
        await typeIntoInputField(
          this.driver,
          pageObjects[wizard][accordion][table]['tableFields'][inputFields[i]](
            parseInt(row_indx) + 1
          ),
          rows[row_indx][i]
        )
      }
      await clickOnComponent(
        this.driver,
        pageObjects[wizard][accordion][table]['tableFields']['add_row_btn'](
          parseInt(row_indx) + 1
        )
      )
      await this.driver.sleep(100)
    }
  }
)

Then(
  'verify values in {string} table in {string} on {string} wizard',
  async function(table, accordion, wizard, dataTable) {
    const columns = dataTable['rawTable'][0]
    const rows = dataTable.rows()
    for (const row_indx in rows) {
      for (const i in columns) {
        await verifyText(
          this.driver,
          pageObjects[wizard][accordion][table]['tableFields'][columns[i]](
            parseInt(row_indx) + 1
          ),
          rows[row_indx][i]
        )
      }
    }
  }
)

When(
  'click on {string} in {string} table in {string} on {string} wizard',
  async function(field, table, accordion, wizard, dataTable) {
    const column = dataTable['rawTable'][0][0]
    const rows = dataTable.rows()
    for (const row_indx in rows) {
      const arr = await findRowIndexesByColumnValue(
        this.driver,
        pageObjects[wizard][accordion][table],
        column,
        rows[row_indx][0]
      )
      const indx = arr[0]
      await clickOnComponent(
        this.driver,
        pageObjects[wizard][accordion][table]['tableFields'][field](indx)
      )
    }
  }
)

Then(
  'value in {string} column with {string} in {string} on {string} wizard should contains {string}',
  async function(column, type, table, wizard, substring) {
    if (type === 'text') {
      await isContainsSubstringInColumnCels(
        this.driver,
        pageObjects[wizard][table],
        column,
        substring
      )
    }
    if (type === 'dropdowns') {
      await isContainsSubstringInColumnDropdownCels(
        this.driver,
        pageObjects[wizard][table],
        column,
        substring
      )
    }
  }
)

Then(
  'value in {string} column with {string} in {string} in {string} on {string} wizard should contains {string}',
  async function(column, type, table, accordion, wizard, substring) {
    if (type === 'text') {
      await isContainsSubstringInColumnCels(
        this.driver,
        pageObjects[wizard][accordion][table],
        column,
        substring
      )
    }
    if (type === 'dropdowns') {
      await isContainsSubstringInColumnDropdownCels(
        this.driver,
        pageObjects[wizard][accordion][table],
        column,
        substring
      )
    }
  }
)

Then(
  'subtable column {string} in {string} in {string} on {string} wizard should contains {string} in {string} column',
  async function(subTable, table, accordion, wizard, subString, subColumn) {
    const numOfRows = await getTableRows(
      this.driver,
      pageObjects[wizard][accordion][table]
    )
    for (let i = 1; i <= numOfRows; i++) {
      const cellTable = await getCellByIndexColumn(
        this.driver,
        pageObjects[wizard][accordion][table],
        i,
        subTable
      )
      await isContainsSubstringInColumnCels(
        this.driver,
        cellTable,
        subColumn,
        subString
      )
    }
  }
)

When(
  'expand each row in {string} in {string} on {string} wizard',
  async function(table, accordion, wizard) {
    const numOfRows = await getTableRows(
      this.driver,
      pageObjects[wizard][accordion][table]
    )
    for (let i = 1; i <= numOfRows; i++) {
      const expandBtn = await getCellByIndexColumn(
        this.driver,
        pageObjects[wizard][accordion][table],
        i,
        'expand_btn'
      )
      await clickOnComponent(this.driver, expandBtn)
    }
  }
)

When(
  'expand row with {string} at {string} in {string} in {string} on {string} wizard',
  async function(value, column, table, accordion, wizard) {
    // TODO: without creating link to the table component step works unstable
    await this.driver.sleep(500)
    const tableElement = pageObjects[wizard][accordion][table]
    const arr = await findRowIndexesByColumnValue(
      this.driver,
      tableElement,
      column,
      value
    )
    const indx = arr[0]
    const expandBtn = await getCellByIndexColumn(
      this.driver,
      tableElement,
      indx,
      'expand_btn'
    )
    // console.log('debug path: ', expandBtn)
    await clickOnComponent(this.driver, expandBtn)
  }
)

When(
  'select {string} in subcolumn {string} at {string} column in {string} row by {string} at {string} in {string} on {string} wizard',
  async function(
    value,
    subColumn,
    subTable,
    rowValue,
    searchColumn,
    table,
    accordion,
    wizard
  ) {
    const arr = await findRowIndexesByColumnValue(
      this.driver,
      pageObjects[wizard][accordion][table],
      searchColumn,
      rowValue
    )
    const indx = arr[0]
    const cellTable = await getCellByIndexColumn(
      this.driver,
      pageObjects[wizard][accordion][table],
      indx,
      subTable
    )

    const subArr = await findRowIndexesByColumnValue(
      this.driver,
      cellTable,
      searchColumn,
      value
    )
    const subIndx = subArr[0]
    const option = await getCellByIndexColumn(
      this.driver,
      cellTable,
      subIndx,
      subColumn
    )
    await clickOnComponent(this.driver, option)
  }
)

Then(
  'value in {string} column in {string} on {string} wizard should be from {string} to {string}',
  async function(column, table, wizard, fromDateTime, toDateTime) {
    await isDatetimeCelsValueInRange(
      this.driver,
      pageObjects[wizard][table],
      column,
      fromDateTime,
      toDateTime
    )
  }
)

When(
  'click on cell with value {string} in {string} column in {string} table on {string} wizard',
  async function(value, columnName, table, wizard) {
    const arr = await findRowIndexesByColumnValue(
      this.driver,
      pageObjects[wizard][table],
      columnName,
      value
    )
    const indx = arr[0]
    await clickOnComponent(
      this.driver,
      pageObjects[wizard][table]['tableFields'][columnName](indx)
    )
  }
)

When(
  'click on cell with row index {int} in {string} column in {string} table on {string} wizard',
  async function(indx, columnName, table, wizard) {
    await clickOnComponent(
      this.driver,
      pageObjects[wizard][table]['tableFields'][columnName](indx)
    )
  }
)
