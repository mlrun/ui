import { When, Then } from '@cucumber/cucumber'
import pageObjects from '../common/page-objects'
import {
  clickOnComponent,
  verifyText,
  waitPageLoad,
  clickNearComponent,
  typeIntoInputField,
  hoverComponent,
  componentIsVisible,
  componentIsNotVisible,
  scrollToElement
} from '../common/actions/common.action'
import {
  getTableRows,
  isContainsValueInColumn,
  isNotContainsValueInColumn,
  findRowIndexesByColumnValue,
  getCellByIndexColumn,
  isContainsSubstringInColumnCels,
  isContainsSubstringInColumnDropdownCels,
  isContainsSubstringInColumnTooltipCells,
  isDatetimeCelsValueInRange,
  findRowIndexesByColumnTooltipsValue
} from '../common/actions/table.action'
import {
  openActionMenu,
  selectOptionInActionMenu,
  checkActionMenuOptions
} from '../common/actions/action-menu.action'
import { typeValue } from '../common/actions/input-group.action'
import {
  openDropdown,
  selectOptionInDropdown,
  checkDropdownSelectedOption
} from '../common/actions/dropdown.action'
import pageObjectsConsts from '../common-tools/common-consts'

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
    await hoverComponent(
      this.driver,
      pageObjects[wizard][table]['tableFields'][column](indx),
      false // scroll ?
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

When(
  'click on {string} in {string} table on {string} wizard with offset {string}',
  async function(fieldName, tableName, wizardName, offsetFlag, dataTable) {
    const column = dataTable['rawTable'][0][0]
    const rows = dataTable.rows()
    for (const row_indx in rows) {
      const arr = await findRowIndexesByColumnValue(
        this.driver,
        pageObjects[wizardName][tableName],
        column,
        rows[row_indx][0]
      )

      let indx = arr[0]
      if (offsetFlag === 'true') {
        indx -= pageObjects[wizardName][tableName].offset
      }

      await hoverComponent(
        this.driver,
        pageObjects[wizardName][tableName]['tableFields'][fieldName](indx)
      )
      await clickOnComponent(
        this.driver,
        pageObjects[wizardName][tableName]['tableFields'][fieldName](indx)
      )
    }
  }
)

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
        const component = pageObjects[wizard][accordion][table]['tableFields'][
          inputFields[i]
        ](parseInt(row_indx) + 1)
        const inputField = component.inputField ?? component
        await typeIntoInputField(this.driver, inputField, rows[row_indx][i])
      }

      if (pageObjects[wizard][accordion][table]['tableFields']['add_row_btn']) {
        await clickOnComponent(
          this.driver,
          pageObjects[wizard][accordion][table]['tableFields']['add_row_btn'](
            parseInt(row_indx) + 1
          )
        )
      } else {
        await clickNearComponent(
          this.driver,
          pageObjects[wizard][accordion][table]['root']
        )
      }

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
  async function(field, tableName, accordionName, wizardName, dataTable) {
    const column = dataTable['rawTable'][0][0]
    const rows = dataTable.rows()
    for (const row_indx in rows) {
      const arr = await findRowIndexesByColumnValue(
        this.driver,
        pageObjects[wizardName][accordionName][tableName],
        column,
        rows[row_indx][0]
      )
      const indx =
        arr[0] - pageObjects[wizardName][accordionName][tableName].offset
      await hoverComponent(
        this.driver,
        pageObjects[wizardName][accordionName][tableName]['tableFields'][field](
          indx
        )
      )
      await clickOnComponent(
        this.driver,
        pageObjects[wizardName][accordionName][tableName]['tableFields'][field](
          indx
        )
      )
    }
  }
)

When('click on {string} in {string} table on {string} wizard', async function(
  field,
  tableName,
  wizardName,
  dataTable
) {
  const column = dataTable['rawTable'][0][0]
  const rows = dataTable.rows()
  for (const row_indx in rows) {
    const arr = await findRowIndexesByColumnValue(
      this.driver,
      pageObjects[wizardName][tableName],
      column,
      rows[row_indx][0]
    )
    const indx = arr[0] - pageObjects[wizardName][tableName].offset
    await hoverComponent(
      this.driver,
      pageObjects[wizardName][tableName]['tableFields'][field](indx)
    )
    await clickOnComponent(
      this.driver,
      pageObjects[wizardName][tableName]['tableFields'][field](indx)
    )
  }
})

When(
  'click on {string} in {string} table in {string} on {string} wizard with offset {string}',
  async function(
    field,
    tableName,
    accordionName,
    wizardName,
    offsetFlag,
    dataTable
  ) {
    const column = dataTable['rawTable'][0][0]
    const rows = dataTable.rows()
    for (const row_indx in rows) {
      const arr = await findRowIndexesByColumnValue(
        this.driver,
        pageObjects[wizardName][accordionName][tableName],
        column,
        rows[row_indx][0]
      )

      let indx = arr[0]
      if (offsetFlag === 'true') {
        indx -= pageObjects[wizardName][accordionName][tableName].offset
      }
      await hoverComponent(
        this.driver,
        pageObjects[wizardName][accordionName][tableName]['tableFields'][
          column
        ](indx)
      )
      await clickOnComponent(
        this.driver,
        pageObjects[wizardName][accordionName][tableName]['tableFields'][field](
          indx
        )
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

    if (type === 'tooltip') {
      await isContainsSubstringInColumnTooltipCells(
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
  'verify options in action menu on {string} wizard in {string} table with {string} value in {string} column should contains {string}.{string}',
  async function(wizard, table, kindName, columnName, constWizard, constValue) {
    const arr = await findRowIndexesByColumnTooltipsValue(
      this.driver,
      pageObjects[wizard][table],
      columnName,
      kindName
    )
    const indx = arr[0]
    const actionMenuSel = await getCellByIndexColumn(
      this.driver,
      pageObjects[wizard][table],
      indx,
      'action_menu'
    )
    await hoverComponent(
      this.driver,
      pageObjects[wizard][table]['tableFields'][columnName](indx)['label']
    )
    await this.driver.sleep(500)
    await openActionMenu(this.driver, actionMenuSel)
    await this.driver.sleep(500)
    await checkActionMenuOptions(
      this.driver,
      pageObjects[wizard][table]['tableFields']['action_menu'](indx),
      pageObjectsConsts[constWizard][constValue]
    )
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

When(
  'add new volume rows to {string} table in {string} on {string} wizard using nontable inputs',
  async function(tableName, accordionName, wizardName, dataTable) {
    const pageComponents = dataTable['rawTable'][0]
    const rows = dataTable.rows()

    for (const row of rows) {
      await clickOnComponent(
        this.driver,
        pageObjects[wizardName][accordionName][tableName]['add_row_btn']
      )
      for (const indx in pageComponents) {
        if (pageComponents[indx].includes('Dropdown')) {
          await scrollToElement(
            this.driver,
            pageObjects[wizardName][accordionName][pageComponents[indx]].root
          )
          await openDropdown(
            this.driver,
            pageObjects[wizardName][accordionName][pageComponents[indx]]
          )
          // await scrollDown(this.driver)
          await selectOptionInDropdown(
            this.driver,
            pageObjects[wizardName][accordionName][pageComponents[indx]],
            row[indx]
          )
          await this.driver.sleep(500)
          await checkDropdownSelectedOption(
            this.driver,
            pageObjects[wizardName][accordionName][pageComponents[indx]],
            row[indx]
          )
        }

        if (pageComponents[indx].includes('Input')) {
          await typeValue(
            this.driver,
            pageObjects[wizardName][accordionName][pageComponents[indx]],
            row[indx]
          )
        }

        if (pageComponents[indx].includes('Button')) {
          if (row[indx] === 'yes') {
            await clickOnComponent(
              this.driver,
              pageObjects[wizardName][accordionName][pageComponents[indx]]
            )
          }
        }
      }
    }
  }
)

When(
  'add new rows to {string} table on {string} wizard using nontable inputs',
  async function(tableName, wizardName, dataTable) {
    const pageComponents = dataTable['rawTable'][0]
    const rows = dataTable.rows()

    for (const row of rows) {
      await clickOnComponent(
        this.driver,
        pageObjects[wizardName][tableName]['add_row_btn']
      )
      for (const indx in pageComponents) {
        if (pageComponents[indx].includes('Dropdown')) {
          await openDropdown(
            this.driver,
            pageObjects[wizardName][pageComponents[indx]]
          )
          await selectOptionInDropdown(
            this.driver,
            pageObjects[wizardName][pageComponents[indx]],
            row[indx]
          )
          await this.driver.sleep(500)
          await checkDropdownSelectedOption(
            this.driver,
            pageObjects[wizardName][pageComponents[indx]],
            row[indx]
          )
        }

        if (pageComponents[indx].includes('Input')) {
          await typeValue(
            this.driver,
            pageObjects[wizardName][pageComponents[indx]],
            row[indx]
          )
        }

        if (pageComponents[indx].includes('Button')) {
          if (row[indx] === 'yes') {
            await clickOnComponent(
              this.driver,
              pageObjects[wizardName][pageComponents[indx]]
            )
          }
        }
      }
    }
  }
)

When(
  'click on {string} in action menu in {string} table in {string} on {string} wizard',
  async function(option, tableName, accordionName, wizardName, dataTable) {
    const column = dataTable['rawTable'][0][0]
    const rows = dataTable.rows()

    for (const row_indx in rows) {
      const arr = await findRowIndexesByColumnValue(
        this.driver,
        pageObjects[wizardName][accordionName][tableName],
        column,
        rows[row_indx][0]
      )

      const indx =
        arr[0] - pageObjects[wizardName][accordionName][tableName].offset

      const cell = await getCellByIndexColumn(
        this.driver,
        pageObjects[wizardName][accordionName][tableName],
        indx,
        column
      )
      const actionMenuSel = await getCellByIndexColumn(
        this.driver,
        pageObjects[wizardName][accordionName][tableName],
        indx,
        'action_menu'
      )
      await hoverComponent(this.driver, cell)
      await this.driver.sleep(500)
      await openActionMenu(this.driver, actionMenuSel)
      await this.driver.sleep(500)
      await selectOptionInActionMenu(this.driver, actionMenuSel, option)
      await this.driver.sleep(500)
    }
  }
)

When(
  'click on {string} in action menu in {string} table in {string} on {string} wizard with offset {string}',
  async function(
    option,
    tableName,
    accordionName,
    wizardName,
    offsetFlag,
    dataTable
  ) {
    const column = dataTable['rawTable'][0][0]
    const rows = dataTable.rows()

    for (const row_indx in rows) {
      const arr = await findRowIndexesByColumnValue(
        this.driver,
        pageObjects[wizardName][accordionName][tableName],
        column,
        rows[row_indx][0]
      )

      let indx = arr[0]
      if (offsetFlag === 'true') {
        indx -= pageObjects[wizardName][accordionName][tableName].offset
      }

      const cell = await getCellByIndexColumn(
        this.driver,
        pageObjects[wizardName][accordionName][tableName],
        indx,
        column
      )
      const actionMenuSel = await getCellByIndexColumn(
        this.driver,
        pageObjects[wizardName][accordionName][tableName],
        indx,
        'action_menu'
      )
      await hoverComponent(this.driver, cell)
      await this.driver.sleep(500)
      await openActionMenu(this.driver, actionMenuSel)
      await this.driver.sleep(500)
      await selectOptionInActionMenu(this.driver, actionMenuSel, option)
      await this.driver.sleep(500)
    }
  }
)

Then('check {string} visibility in {string} on {string} wizard', async function(
  cellName,
  tableName,
  wizardName
) {
  const rowsNumber = await getTableRows(
    this.driver,
    pageObjects[wizardName][tableName]
  )
  for (let i = 0; i < rowsNumber; i++) {
    await componentIsVisible(
      this.driver,
      pageObjects[wizardName][tableName].tableFields[cellName](i + 1)
    )
  }
})

Then(
  'check {string} not visibile in {string} on {string} wizard',
  async function(cellName, tableName, wizardName) {
    const rowsNumber = await getTableRows(
      this.driver,
      pageObjects[wizardName][tableName]
    )
    for (let i = 0; i < rowsNumber; i++) {
      await componentIsNotVisible(
        this.driver,
        pageObjects[wizardName][tableName].tableFields[cellName](i + 1)
      )
    }
  }
)
