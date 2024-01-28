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
import { When, Then } from '@cucumber/cucumber'
import pageObjects from '../common/page-objects'
import {
  clickNearComponent,
  clickOnComponent,
  componentIsNotPresent,
  componentIsPresent,
  componentIsNotVisible,
  componentIsVisible,
  hoverComponent,
  isComponentContainsClass,
  scrollToElement,
  typeIntoInputField,
  verifyText,
  verifyComponentContainsAttributeValue,
  verifyTypedText,
  waitPageLoad,
  waiteUntilComponent
} from '../common/actions/common.action'
import {
  checkCellHintText,
  findRowIndexesByColumnTooltipsValue,
  findRowIndexesByColumnValue,
  findRowIndexesByColumnValueAttribute,
  findRowIndexesByColumnValueExpand,
  getCellByIndexColumn,
  getTableRows,
  isContainsSubstringInColumnCells,
  isContainsSubstringInColumnAttributrCells,
  isContainsSubstringInColumnDropdownCells,
  isContainsSubstringInColumnDropdownCellsOverlay,
  isContainsSubstringInColumnTooltipCells,
  isContainsValueInColumn,
  isDatetimeCelsValueInRange,
  isNotContainsValueInColumn,
  putToTestContextCellParameters
} from '../common/actions/table.action'
import {
  checkActionMenuOptions,
  openActionMenu,
  verifyOptionInActionMenuEnabled,
  verifyOptionInActionMenuDisabled,
  selectOptionInActionMenu
} from '../common/actions/action-menu.action'
import { typeValue } from '../common/actions/input-group.action'
import {
  checkDropdownSelectedOption,
  openDropdown,
  selectOptionInDropdownWithoutCheck,
  selectOptionInDropdown
} from '../common/actions/dropdown.action'
import pageObjectsConsts from '../common-tools/common-consts'
import { expect } from 'chai'
import { isRowActive } from '../common/actions/tab-selector.action'

Then(
  'check {string} value in {string} column in {string} table on {string} wizard',
  async function (value, column, table, wizard) {
    await waitPageLoad(this.driver, pageObjects['commonPagesHeader']['loader'])
    await isContainsValueInColumn(this.driver, pageObjects[wizard][table], column, value)
  }
)

Then(
  'check {string} value not in {string} column in {string} table on {string} wizard',
  async function (value, column, table, wizard) {
    await waitPageLoad(this.driver, pageObjects['commonPagesHeader']['loader'])
    await isNotContainsValueInColumn(this.driver, pageObjects[wizard][table], column, value)
  }
)

Then(
  'open action menu on {string} wizard in {string} table at row with {string} value in {string} column',
  async function (wizard, table, value, column) {
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
  'select {string} option in action menu on {string} wizard in {string} table at row with {string} value in {string} column with expand btn {string}',
  async function (option, wizard, table, value, column, expand_name) {
    const arr = await findRowIndexesByColumnValueExpand(
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
      pageObjects[wizard][table]['tableFields'][expand_name](indx),
      false // scroll ?
    )
    await openActionMenu(this.driver, actionMenuSel)
    await this.driver.sleep(500)
    await selectOptionInActionMenu(this.driver, actionMenuSel, option)
  }
)

Then(
  'select {string} option in action menu on {string} wizard in {string} table at row with {string} value in {string} column',
  async function (option, wizard, table, value, column) {
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

When('add rows to {string} table on {string} wizard', async function (table, wizard, dataTable) {
  const inputFields = dataTable['rawTable'][0]
  const rows = dataTable.rows()
  for (const row_indx in rows) {
    await clickOnComponent(this.driver, pageObjects[wizard][table]['add_row_btn'])
    await this.driver.sleep(100)
    for (const i in inputFields) {
      await clickOnComponent(
        this.driver,
        pageObjects[wizard][table]['tableFields'][inputFields[i]](parseInt(row_indx) + 1)
      )
      await typeIntoInputField(
        this.driver,
        pageObjects[wizard][table]['tableFields'][inputFields[i]](parseInt(row_indx) + 1),
        rows[row_indx][i]
      )
    }
    await clickNearComponent(this.driver, pageObjects[wizard][table]['root'])
    await this.driver.sleep(100)
  }
})

When('add data to {string} table on {string} wizard', async function (table, wizard, dataTable) {
  const inputFields = dataTable['rawTable'][0]
  const rows = dataTable.rows()
  for (const row_indx in rows) {
    await clickOnComponent(this.driver, pageObjects[wizard][table]['add_row_btn'])
    await this.driver.sleep(100)
    await clickOnComponent(this.driver, pageObjects[wizard][table]['tableFields'][inputFields[0]](parseInt(row_indx) + 2))
    await this.driver.sleep(250)
    await typeIntoInputField(                                      
      this.driver,
      pageObjects[wizard][table]['tableFields'][inputFields[0]](parseInt(row_indx) + 2),
      rows[row_indx][0]
    )
    await this.driver.sleep(100)
    await openDropdown(this.driver, pageObjects[wizard][table]['tableFields'][inputFields[1]](parseInt(row_indx) + 2))
    await selectOptionInDropdownWithoutCheck(
      this.driver,
      pageObjects[wizard][table]['tableFields'][inputFields[1]](parseInt(row_indx) + 2),
      rows[row_indx][1]
    )
    await this.driver.sleep(100)
    await typeIntoInputField(
      this.driver,
      pageObjects[wizard][table]['tableFields'][inputFields[2]](parseInt(row_indx) + 2),
      rows[row_indx][2]
    )
    await this.driver.sleep(100)
    await hoverComponent(this.driver, pageObjects[wizard][table]['tableFields']['apply_btn'](parseInt(row_indx) + 2))
    await this.driver.sleep(100)
    await clickOnComponent(this.driver, pageObjects[wizard][table]['tableFields']['apply_btn'](parseInt(row_indx) + 2))
    await this.driver.sleep(100)
  }
})

When('add data to {string} table on {string} wizard with a pre-filled table', async function (table, wizard, dataTable) {
  const inputFields = dataTable['rawTable'][0]
  const rows = dataTable.rows()
  for (const row_indx in rows) {
    let rowsNumber = await getTableRows(this.driver, pageObjects[wizard][table])
    await clickOnComponent(this.driver, pageObjects[wizard][table]['add_row_btn'])
    await this.driver.sleep(100)
    await clickOnComponent(this.driver, pageObjects[wizard][table]['tableFields'][inputFields[0]](rowsNumber + 2))
    await this.driver.sleep(250)
    await typeIntoInputField(                                      
      this.driver,
      pageObjects[wizard][table]['tableFields'][inputFields[0]](rowsNumber + 2),
      rows[row_indx][0]
    )
    await this.driver.sleep(100)
    await openDropdown(this.driver, pageObjects[wizard][table]['tableFields'][inputFields[1]](rowsNumber + 2))
    await selectOptionInDropdownWithoutCheck(
      this.driver,
      pageObjects[wizard][table]['tableFields'][inputFields[1]](rowsNumber + 2),
      rows[row_indx][1]
    )
    await this.driver.sleep(100)
    await typeIntoInputField(
      this.driver,
      pageObjects[wizard][table]['tableFields'][inputFields[2]](rowsNumber + 2),
      rows[row_indx][2]
    )
    await this.driver.sleep(100)
    await hoverComponent(this.driver, pageObjects[wizard][table]['tableFields']['apply_btn'](rowsNumber + 2))
    await this.driver.sleep(100)
    await clickOnComponent(this.driver, pageObjects[wizard][table]['tableFields']['apply_btn'](rowsNumber + 2))
    await this.driver.sleep(100)
  }
})

When('add custom parameters to {string} table on {string} wizard with a pre-filled table', async function (table, wizard, dataTable) {
  const inputFields = dataTable['rawTable'][0]
  const rows = dataTable.rows()
  for (const row_indx in rows) {
    let rowsNumber = await getTableRows(this.driver, pageObjects[wizard][table])
    await clickOnComponent(this.driver, pageObjects[wizard][table]['add_row_btn'])
    await this.driver.sleep(100)
    await clickOnComponent(this.driver, pageObjects[wizard][table]['tableFields'][inputFields[0]](rowsNumber + 1))
    await this.driver.sleep(250)
    await typeIntoInputField(                                      
      this.driver,
      pageObjects[wizard][table]['tableFields'][inputFields[0]](rowsNumber + 1),
      rows[row_indx][0]
    )
    await this.driver.sleep(100)
    await openDropdown(this.driver, pageObjects[wizard][table]['tableFields'][inputFields[1]](rowsNumber + 1))
    await selectOptionInDropdownWithoutCheck(
      this.driver,
      pageObjects[wizard][table]['tableFields'][inputFields[1]](rowsNumber + 1),
      rows[row_indx][1]
    )
    await this.driver.sleep(100)
    await typeIntoInputField(
      this.driver,
      pageObjects[wizard][table]['tableFields'][inputFields[2]](rowsNumber + 1),
      rows[row_indx][2]
    )
    await this.driver.sleep(100)
    await hoverComponent(this.driver, pageObjects[wizard][table]['tableFields']['apply_btn'](rowsNumber + 1))
    await this.driver.sleep(100)
    await clickOnComponent(this.driver, pageObjects[wizard][table]['tableFields']['apply_btn'](rowsNumber + 1))
    await this.driver.sleep(100)
  }
})

When('add data to {string} table on {string} wizard with combobox', async function (table, wizard, dataTable) {
  const inputFields = dataTable['rawTable'][0]
  const rows = dataTable.rows()
  for (const row_indx in rows) {
    await clickOnComponent(this.driver, pageObjects[wizard][table]['add_row_btn'])
    await this.driver.sleep(100)
    await clickOnComponent(
      this.driver,
      pageObjects[wizard][table]['tableFields'][inputFields[0]](parseInt(row_indx) + 2)
    )
    await this.driver.sleep(250)
    await typeIntoInputField(
      this.driver,
      pageObjects[wizard][table]['tableFields'][inputFields[0]](parseInt(row_indx) + 2),
      rows[row_indx][0]
    )
    await this.driver.sleep(100)
    await openDropdown(
      this.driver,
      pageObjects[wizard][table]['tableFields'][inputFields[1]](parseInt(row_indx) + 2)
    )
    await selectOptionInDropdownWithoutCheck(
      this.driver,
      pageObjects[wizard][table]['tableFields'][inputFields[1]](parseInt(row_indx) + 2),
      rows[row_indx][1]
    )
    await this.driver.sleep(100)
    await selectOptionInDropdownWithoutCheck(
      this.driver,
      pageObjects[wizard][table]['tableFields'][inputFields[2]](parseInt(row_indx) + 2),
      rows[row_indx][2]
    )
    await this.driver.sleep(100)
    await selectOptionInDropdownWithoutCheck(
      this.driver,
      pageObjects[wizard][table]['tableFields'][inputFields[3]](parseInt(row_indx) + 2),
      rows[row_indx][3]
    )
    await this.driver.sleep(100)
    await selectOptionInDropdownWithoutCheck(
      this.driver,
      pageObjects[wizard][table]['tableFields'][inputFields[4]](parseInt(row_indx) + 2),
      rows[row_indx][4]
    )
    await this.driver.sleep(100)
    await hoverComponent(
      this.driver,
      pageObjects[wizard][table]['tableFields']['apply_btn'](parseInt(row_indx) + 2)
    )
    await this.driver.sleep(100)
    await clickOnComponent(
      this.driver,
      pageObjects[wizard][table]['tableFields']['apply_btn'](parseInt(row_indx) + 2)
    )
    await this.driver.sleep(100)
  }
})

When('add data to {string} table on {string} wizard with several inputs', async function (table, wizard, dataTable) {
  const inputFields = dataTable['rawTable'][0]
  const rows = dataTable.rows()
  for (const row_indx in rows) {
    await clickOnComponent(this.driver, pageObjects[wizard][table]['add_row_btn'])
    await this.driver.sleep(100)
    await clickOnComponent(
      this.driver,
      pageObjects[wizard][table]['tableFields'][inputFields[0]](parseInt(row_indx) + 2)
    )
    await this.driver.sleep(250)
    await typeIntoInputField(
      this.driver,
      pageObjects[wizard][table]['tableFields'][inputFields[0]](parseInt(row_indx) + 2),
      rows[row_indx][0]
    )
    await this.driver.sleep(100)
    await openDropdown(
      this.driver,
      pageObjects[wizard][table]['tableFields'][inputFields[1]](parseInt(row_indx) + 2)
    )
    await selectOptionInDropdownWithoutCheck(
      this.driver,
      pageObjects[wizard][table]['tableFields'][inputFields[1]](parseInt(row_indx) + 2),
      rows[row_indx][1]
    )
    await this.driver.sleep(100)
    await typeIntoInputField(
      this.driver,
      pageObjects[wizard][table]['tableFields'][inputFields[2]](parseInt(row_indx) + 2),
      rows[row_indx][2]
    )
    await this.driver.sleep(100)
    if (rows[row_indx][3].length !== 0){
      await typeIntoInputField(
        this.driver,
        pageObjects[wizard][table]['tableFields'][inputFields[3]](parseInt(row_indx) + 2),
        rows[row_indx][3]
      )
      await this.driver.sleep(100)
    }
    await hoverComponent(
      this.driver,
      pageObjects[wizard][table]['tableFields']['apply_btn'](parseInt(row_indx) + 2)
    )
    await this.driver.sleep(100)
    await clickOnComponent(
      this.driver,
      pageObjects[wizard][table]['tableFields']['apply_btn'](parseInt(row_indx) + 2)
    )
    await this.driver.sleep(100)
  }
})

When('fill data to {string} table on {string} wizard', async function (table, wizard, dataTable) {
  const inputFields = dataTable['rawTable'][0]
  const rows = dataTable.rows()
  for (const row_indx in rows) {
    await clickOnComponent(this.driver, pageObjects[wizard][table]['add_row_btn'])
    await this.driver.sleep(100)
    await clickOnComponent(this.driver, pageObjects[wizard][table]['tableFields'][inputFields[0]](parseInt(row_indx) + 3))
    await this.driver.sleep(250)
    await typeIntoInputField(                                      
      this.driver,
      pageObjects[wizard][table]['tableFields'][inputFields[0]](parseInt(row_indx) + 3),
      rows[row_indx][0]
    )
    await this.driver.sleep(100)
    await openDropdown(this.driver, pageObjects[wizard][table]['tableFields'][inputFields[1]](parseInt(row_indx) + 3))
    await selectOptionInDropdownWithoutCheck(
      this.driver,
      pageObjects[wizard][table]['tableFields'][inputFields[1]](parseInt(row_indx) + 3),
      rows[row_indx][1]
    )
    await this.driver.sleep(100)
    await typeIntoInputField(
      this.driver,
      pageObjects[wizard][table]['tableFields'][inputFields[2]](parseInt(row_indx) + 3),
      rows[row_indx][2]
    )
    await this.driver.sleep(250)
    await hoverComponent(this.driver, pageObjects[wizard][table]['tableFields']['apply_btn'](parseInt(row_indx) + 3))
    await this.driver.sleep(100)
    await clickOnComponent(this.driver, pageObjects[wizard][table]['tableFields']['apply_btn'](parseInt(row_indx) + 3))
    await this.driver.sleep(100)
  }
})
When(
  'add rows to {string} key-value table on {string} wizard',
  async function (table, wizard, dataTable) {
    const inputFields = dataTable['rawTable'][0]
    const rows = dataTable.rows()
    for (const row_indx in rows) {
      await clickOnComponent(this.driver, pageObjects[wizard][table]['add_row_btn'])
      await this.driver.sleep(100)
      for (const i in inputFields) {
        await typeIntoInputField(
          this.driver,
          pageObjects[wizard][table]['tableFields'][inputFields[i]](3),
          rows[row_indx][i]
        )
      }
      await clickOnComponent(this.driver, pageObjects[wizard][table]['save_row_btn'])
      await clickNearComponent(this.driver, pageObjects[wizard][table]['root'])
      await this.driver.sleep(100)
    }
  }
)

Then(
  'verify values in {string} table on {string} wizard',
  async function (table, wizard, dataTable) {
    const columns = dataTable['rawTable'][0]
    const rows = dataTable.rows()
    for (const row_indx in rows) {
      for (const i in columns) {
        await verifyText(
          this.driver,
          pageObjects[wizard][table]['tableFields'][columns[i]](parseInt(row_indx) + 1),
          rows[row_indx][i]
        )
      }
    }
  }
)

Then(
  'verify data in {string} table on {string} wizard',
  async function (table, wizard, dataTable) {
    const columns = dataTable['rawTable'][0]
    const rows = dataTable.rows()
    for (const row_indx in rows) {
      for (const i in columns) {
        await verifyText(
          this.driver,
          pageObjects[wizard][table]['tableFields'][columns[i]](parseInt(row_indx) + 2),
          rows[row_indx][i]
        )
      }
    }
  }
)

Then(
  'verify filled data in {string} table on {string} wizard',
  async function (table, wizard, dataTable) {
    const columns = dataTable['rawTable'][0]
    const rows = dataTable.rows()
    for (const row_indx in rows) {
      for (const i in columns) {
        await verifyText(
          this.driver,
          pageObjects[wizard][table]['tableFields'][columns[i]](parseInt(row_indx) + 3),
          rows[row_indx][i]
        )
      }
    }
  }
)

Then(
  'verify values in {string} table on {string} wizard with attribute',
  async function (table, wizard, dataTable) {
    const columns = dataTable['rawTable'][0]
    const rows = dataTable.rows()
    for (const row_indx in rows) {
      for (const i in columns) {
        await verifyTypedText (
          this.driver,
          pageObjects[wizard][table]['tableFields'][columns[i]](parseInt(row_indx) + 1),
          rows[row_indx][i]
        )
      }
    }
  }
)

When(
  'click on {string} in {string} table on {string} wizard with offset {string}',
  async function (fieldName, tableName, wizardName, offsetFlag, dataTable) {
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
  'click on {string} in {string} table on {string} wizard with sorters',
  async function (fieldName, tableName, wizardName) {
    await waiteUntilComponent(
      this.driver, 
      pageObjects[wizardName][tableName]['headerSorters'][fieldName])
    await clickOnComponent(
      this.driver,
      pageObjects[wizardName][tableName]['headerSorters'][fieldName]
    )
    await this.driver.sleep(250)
  }
)

When(
  'click on {string} with data in {string} table on {string} wizard with offset {string}',
  async function (fieldName, tableName, wizardName, offsetFlag, dataTable) {
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
        pageObjects[wizardName][tableName]['tableFields'][fieldName](indx + 1)
      )
      await clickOnComponent(
        this.driver,
        pageObjects[wizardName][tableName]['tableFields'][fieldName](indx + 1)
      )
    }
  }
)

When(
  'click on {string} with filled data in {string} table on {string} wizard with offset {string}',
  async function (fieldName, tableName, wizardName, offsetFlag, dataTable) {
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
        pageObjects[wizardName][tableName]['tableFields'][fieldName](indx + 2)
      )
      await clickOnComponent(
        this.driver,
        pageObjects[wizardName][tableName]['tableFields'][fieldName](indx + 2)
      )
    }
  }
)

When(
  'add rows to {string} table in {string} on {string} wizard',
  async function (table, accordion, wizard, dataTable) {
    const inputFields = dataTable['rawTable'][0]
    const rows = dataTable.rows()
    for (const row_indx in rows) {
      await clickOnComponent(this.driver, pageObjects[wizard][accordion][table]['add_row_btn'])
      await this.driver.sleep(100)
      for (const i in inputFields) {
        const component = pageObjects[wizard][accordion][table]['tableFields'][inputFields[i]](
          parseInt(row_indx) + 1
        )
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
        await clickNearComponent(this.driver, pageObjects[wizard][accordion][table]['root'])
      }

      await this.driver.sleep(100)
    }
  }
)

When(
  'add rows to {string} key-value table in {string} on {string} wizard',
  async function (table, accordion, wizard, dataTable) {
    const inputFields = dataTable['rawTable'][0]
    const rows = dataTable.rows()
    for (const row_indx in rows) {
      await clickOnComponent(this.driver, pageObjects[wizard][accordion][table]['add_row_btn'])
      await this.driver.sleep(100)
      for (const i in inputFields) {
        const component = pageObjects[wizard][accordion][table]['tableFields'][inputFields[i]](3)
        const inputField = component.inputField ?? component
        await typeIntoInputField(this.driver, inputField, rows[row_indx][i])
      }

      if (pageObjects[wizard][accordion][table]['save_row_btn']) {
        await clickOnComponent(this.driver, pageObjects[wizard][accordion][table]['save_row_btn'])
      } else {
        await clickNearComponent(this.driver, pageObjects[wizard][accordion][table]['root'])
      }

      await this.driver.sleep(100)
    }
  }
)

When(
  'add data rows to {string} key-value table in {string} on {string} wizard',
  async function (table, accordion, wizard, dataTable) {
    const inputFields = dataTable['rawTable'][0]
    const rows = dataTable.rows()
    for (const row_indx in rows) {
      await clickOnComponent(this.driver, pageObjects[wizard][accordion][table]['add_row_btn'])
      await this.driver.sleep(100)
      for (const i in inputFields) {
        const component = pageObjects[wizard][accordion][table]['tableFields'][inputFields[i]](parseInt(row_indx) + 2)
        const inputField = component.inputField ?? component
        await typeIntoInputField(this.driver, inputField, rows[row_indx][i])
      }

      if (pageObjects[wizard][accordion][table]['save_row_btn']) {
        await clickOnComponent(this.driver, pageObjects[wizard][accordion][table]['save_row_btn'])
      } else {
        await hoverComponent(this.driver, pageObjects[wizard][accordion][table]['tableFields']['apply_edit_btn'](parseInt(row_indx) + 2))
        await this.driver.sleep(100)
        await clickOnComponent(this.driver, pageObjects[wizard][accordion][table]['tableFields']['apply_edit_btn'](parseInt(row_indx) + 2))
        await this.driver.sleep(100)
      }

      await this.driver.sleep(100)
    }
  }
)

When(
  'add data rows to {string} key-value table on {string} wizard',
  async function (table, wizard, dataTable) {
    const inputFields = dataTable['rawTable'][0]
    const rows = dataTable.rows()
    for (const row_indx in rows) {
      await clickOnComponent(this.driver, pageObjects[wizard][table]['add_row_btn'])
      await this.driver.sleep(100)
      for (const i in inputFields) {
        const component = pageObjects[wizard][table]['tableFields'][inputFields[i]](parseInt(row_indx) + 2)
        const inputField = component.inputField ?? component
        await typeIntoInputField(this.driver, inputField, rows[row_indx][i])
      }

      if (pageObjects[wizard][table]['save_row_btn']) {
        await clickOnComponent(this.driver, pageObjects[wizard][table]['save_row_btn'])
      } else {
        await hoverComponent(this.driver, pageObjects[wizard][table]['tableFields']['apply_edit_btn'](parseInt(row_indx) + 2))
        await this.driver.sleep(100)
        await clickOnComponent(this.driver, pageObjects[wizard][table]['tableFields']['apply_edit_btn'](parseInt(row_indx) + 2))
        await this.driver.sleep(100)
      }

      await this.driver.sleep(100)
    }
  }
)

When(
  'edit dropdown field {int} row in {string} key-value table on {string} wizard',
  async function (index, table, wizard, dataTable) {
    const inputFields = dataTable['rawTable'][0]
    const row = dataTable.rows()[0]
    await hoverComponent(
      this.driver,
      pageObjects[wizard][table]['tableFields']['edit_btn'](index + 1)
    )
    await clickOnComponent(
      this.driver,
      pageObjects[wizard][table]['tableFields']['edit_btn'](index + 1)
    )
    await openDropdown(
      this.driver,
      pageObjects[wizard][table]['tableFields'][inputFields[0]](index + 1)
    )
    await selectOptionInDropdownWithoutCheck(
      this.driver,
      pageObjects[wizard][table]['tableFields'][inputFields[0]](index + 1),
      row[0]
    )
    await this.driver.sleep(100)
    await typeIntoInputField(
      this.driver,
      pageObjects[wizard][table]['tableFields'][inputFields[1]](index + 1),
      row[1]
    )
    await this.driver.sleep(100)
    await typeIntoInputField(
      this.driver,
      pageObjects[wizard][table]['tableFields'][inputFields[2]](index + 1),
      row[2]
    )
    await this.driver.sleep(100)
    await hoverComponent(
      this.driver,
      pageObjects[wizard][table]['tableFields']['apply_btn'](index + 1)
    )
    await clickOnComponent(
      this.driver,
      pageObjects[wizard][table]['tableFields']['apply_btn'](index + 1)
    )
    await this.driver.sleep(100)
  }
)

When(
  'edit {int} row in {string} key-value table in {string} on {string} wizard',
  async function (index, table, accordion, wizard, dataTable) {
    const inputFields = dataTable['rawTable'][0]
    const row = dataTable.rows()[0]

    await hoverComponent(
      this.driver,
      pageObjects[wizard][accordion][table]['tableFields']['edit_btn'](index)
    )
    await clickOnComponent(
      this.driver,
      pageObjects[wizard][accordion][table]['tableFields']['edit_btn'](index)
    )
    for (const i in inputFields) {
      const component = pageObjects[wizard][accordion][table]['tableFields'][inputFields[i]](index)
      await typeIntoInputField(this.driver, component.inputField, row[i])
    }

    await clickOnComponent(
      this.driver,
      pageObjects[wizard][accordion][table]['tableFields']['apply_edit_btn'](index)
    )
    await this.driver.sleep(100)
  }
)

When(
  'edit {int} row in {string} key-value table on {string} wizard',
  async function (index, table, wizard, dataTable) {
    const inputFields = dataTable['rawTable'][0]
    const row = dataTable.rows()[0]
    await hoverComponent(
      this.driver,
      pageObjects[wizard][table]['tableFields']['edit_btn'](index + 1)
    )
    await clickOnComponent(
      this.driver,
      pageObjects[wizard][table]['tableFields']['edit_btn'](index + 1)
    )
    for (const i in inputFields) {
      await typeIntoInputField(
        this.driver,
        pageObjects[wizard][table]['tableFields'][inputFields[i]](index + 1),
        row[i]
      )
      await this.driver.sleep(100)
    }
    await clickOnComponent(
      this.driver,
      pageObjects[wizard][table]['tableFields']['apply_btn'](index + 1)
    )
    await this.driver.sleep(100)
  }
)

When(
  'edit {int} filled row in {string} key-value table on {string} wizard',
  async function (index, table, wizard, dataTable) {
    const inputFields = dataTable['rawTable'][0]
    const row = dataTable.rows()[0]
    await hoverComponent(
      this.driver,
      pageObjects[wizard][table]['tableFields']['edit_btn'](index + 2)
    )
    await clickOnComponent(
      this.driver,
      pageObjects[wizard][table]['tableFields']['edit_btn'](index + 2)
    )
    for (const i in inputFields) {
      await typeIntoInputField(
        this.driver,
        pageObjects[wizard][table]['tableFields'][inputFields[i]](index + 2),
        row[i]
      )
      await this.driver.sleep(100)
    }
    await clickOnComponent(
      this.driver,
      pageObjects[wizard][table]['tableFields']['apply_btn'](index + 2)
    )
    await this.driver.sleep(100)
  }
)

Then(
  'verify values in {string} table in {string} on {string} wizard',
  async function (table, accordion, wizard, dataTable) {
    const columns = dataTable['rawTable'][0]
    const rows = dataTable.rows()
    for (const row_indx in rows) {
      for (const i in columns) {
        await verifyText(
          this.driver,
          pageObjects[wizard][accordion][table]['tableFields'][columns[i]](parseInt(row_indx) + 1),
          rows[row_indx][i]
        )
      }
    }
  }
)
Then(
  'verify data values in {string} table in {string} on {string} wizard',
  async function (table, accordion, wizard, dataTable) {
    const columns = dataTable['rawTable'][0]
    const rows = dataTable.rows()
    for (const row_indx in rows) {
      for (const i in columns) {
        await verifyText(
          this.driver,
          pageObjects[wizard][accordion][table]['tableFields'][columns[i]](parseInt(row_indx) + 2),
          rows[row_indx][i]
        )
      }
    }
  }
)

When(
  'click on {string} in {string} table in {string} on {string} wizard',
  async function (field, tableName, accordionName, wizardName, dataTable) {
    const column = dataTable['rawTable'][0][0]
    const rows = dataTable.rows()
    for (const row_indx in rows) {
      const arr = await findRowIndexesByColumnValue(
        this.driver,
        pageObjects[wizardName][accordionName][tableName],
        column,
        rows[row_indx][0]
      )
      const indx = arr[0] - pageObjects[wizardName][accordionName][tableName].offset
      await hoverComponent(
        this.driver,
        pageObjects[wizardName][accordionName][tableName]['tableFields'][field](indx)
      )
      await clickOnComponent(
        this.driver,
        pageObjects[wizardName][accordionName][tableName]['tableFields'][field](indx)
      )
    }
  }
)

When(
  'click on {string} in {string} table on {string} wizard',
  async function (field, tableName, wizardName, dataTable) {
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
        pageObjects[wizardName][tableName]['tableFields'][field](indx),
        false
      )
      await clickOnComponent(
        this.driver,
        pageObjects[wizardName][tableName]['tableFields'][field](indx)
      )
    }
  }
)

When(
  'click on {string} in {string} table on {string} wizard with attribute',
  async function (field, tableName, wizardName, dataTable) {
    const column = dataTable['rawTable'][0][0]
    const rows = dataTable.rows()
    for (const row_indx in rows) {
      const arr = await findRowIndexesByColumnValueAttribute(
        this.driver,
        pageObjects[wizardName][tableName],
        column,
        rows[row_indx][0]
      )
      const indx = arr[0] - pageObjects[wizardName][tableName].offset
      await hoverComponent(
        this.driver,
        pageObjects[wizardName][tableName]['tableFields'][field](indx),
        false
      )
      await clickOnComponent(
        this.driver,
        pageObjects[wizardName][tableName]['tableFields'][field](indx)
      )
    }
  }
)

When(
  'click on {string} in {string} table in {string} on {string} wizard with offset {string}',
  async function (field, tableName, accordionName, wizardName, offsetFlag, dataTable) {
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
        pageObjects[wizardName][accordionName][tableName]['tableFields'][column](indx)
      )
      await clickOnComponent(
        this.driver,
        pageObjects[wizardName][accordionName][tableName]['tableFields'][field](indx)
      )
    }
  }
)

Then(
  'value in {string} column with {string} in {string} on {string} wizard should contains {string} in {string}',
  async function (column, type, table, wizard, substring, overlay) {
    if (type === 'dropdowns') {
      await isContainsSubstringInColumnDropdownCellsOverlay(
        this.driver,
        pageObjects[wizard][table],
        pageObjects[wizard][overlay],
        column,
        substring
      )
    }
  }
)

Then(
  'verify {string} on {string} wizard should contains {string} value', 
  async function(componentName, wizardName, value) {
  await verifyComponentContainsAttributeValue(
    this.driver,
    pageObjects[wizardName][componentName],
    'value',
    value
  )
})

Then(
  'value in {string} column with {string} in {string} on {string} wizard should contains {string}',
  async function (column, type, table, wizard, substring) {
    if (type === 'attribute') {
      await isContainsSubstringInColumnAttributrCells(
        this.driver,
        pageObjects[wizard][table],
        column,
        substring
      )
    }
    if (type === 'text') {
      await isContainsSubstringInColumnCells(
        this.driver,
        pageObjects[wizard][table],
        column,
        substring
      )
    }
    if (type === 'dropdowns') {
      await isContainsSubstringInColumnDropdownCells(
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
  async function (column, type, table, accordion, wizard, substring) {
    if (type === 'text') {
      await isContainsSubstringInColumnCells(
        this.driver,
        pageObjects[wizard][accordion][table],
        column,
        substring
      )
    }
    if (type === 'dropdowns') {
      await isContainsSubstringInColumnDropdownCells(
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
  async function (wizard, table, kindName, columnName, constWizard, constValue) {
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
  'verify action menu on {string} wizard in {string} table with {string} value in {string} column should contains {string}.{string}',
  async function (wizard, table, value, column, constWizard, constValue) {
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
      pageObjects[wizard][table]['tableFields'][column](indx)
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
  'verify that in action menu on {string} wizard in {string} table with {string} value in {string} column {string} option is enabled',
  async function (wizard, table, value, column, option) {
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
      pageObjects[wizard][table]['tableFields'][column](indx)
    )
    await this.driver.sleep(500)
    await openActionMenu(this.driver, actionMenuSel)
    await this.driver.sleep(500)
    await verifyOptionInActionMenuEnabled (this.driver, actionMenuSel, option)
  }
)

Then(
  'verify that in action menu on {string} wizard in {string} table with {string} value in {string} column {string} option is disabled',
  async function (wizard, table, value, column, option) {
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
      pageObjects[wizard][table]['tableFields'][column](indx)
    )
    await this.driver.sleep(500)
    await openActionMenu(this.driver, actionMenuSel)
    await this.driver.sleep(500)
    await verifyOptionInActionMenuDisabled (this.driver, actionMenuSel, option)
  }
)

Then(
  'verify {string} option is present on {string} wizard in {string} table with {string} value in {string} column',
  async function (option, wizard, table, value, column) {
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
      option
    )
    await hoverComponent(
      this.driver,
      pageObjects[wizard][table]['tableFields'][column](indx)
    )
    await this.driver.sleep(500)
    await componentIsPresent(this.driver, actionMenuSel)
  }
)

Then(
  'click on {string} option on {string} wizard in {string} table with {string} value in {string} column',
  async function (option, wizard, table, value, column) {
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
      option
    )
    await hoverComponent(
      this.driver,
      pageObjects[wizard][table]['tableFields'][column](indx)
    )
    await this.driver.sleep(250)
    await clickOnComponent(this.driver, actionMenuSel)
    await this.driver.sleep(500)
  }
)

Then(
  'subtable column {string} in {string} in {string} on {string} wizard should contains {string} in {string} column',
  async function (subTable, table, accordion, wizard, subString, subColumn) {
    const numOfRows = await getTableRows(this.driver, pageObjects[wizard][accordion][table])
    for (let i = 1; i <= numOfRows; i++) {
      const cellTable = await getCellByIndexColumn(
        this.driver,
        pageObjects[wizard][accordion][table],
        i,
        subTable
      )
      await isContainsSubstringInColumnCells(this.driver, cellTable, subColumn, subString)
    }
  }
)

When(
  'expand each row in {string} in {string} on {string} wizard',
  async function (table, accordion, wizard) {
    const numOfRows = await getTableRows(this.driver, pageObjects[wizard][accordion][table])
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
  async function (value, column, table, accordion, wizard) {
    // TODO: without creating link to the table component step works unstable
    await this.driver.sleep(500)
    const tableElement = pageObjects[wizard][accordion][table]
    const arr = await findRowIndexesByColumnValue(this.driver, tableElement, column, value)
    const indx = arr[0]
    const expandBtn = await getCellByIndexColumn(this.driver, tableElement, indx, 'expand_btn')
    await clickOnComponent(this.driver, expandBtn)
  }
)

When(
  'select {string} in subcolumn {string} at {string} column in {string} row by {string} at {string} in {string} on {string} wizard',
  async function (value, subColumn, subTable, rowValue, searchColumn, table, accordion, wizard) {
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

    const subArr = await findRowIndexesByColumnValue(this.driver, cellTable, searchColumn, value)
    const subIndx = subArr[0]
    const option = await getCellByIndexColumn(this.driver, cellTable, subIndx, subColumn)
    await clickOnComponent(this.driver, option)
  }
)

Then(
  'value in {string} column in {string} on {string} wizard should be from {string} to {string}',
  async function (column, table, wizard, fromDateTime, toDateTime) {
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
  async function (value, columnName, table, wizard) {
    const arr = await findRowIndexesByColumnValue(
      this.driver,
      pageObjects[wizard][table],
      columnName,
      value
    )
    const indx = arr[0]
    await clickOnComponent(this.driver, pageObjects[wizard][table]['tableFields'][columnName](indx))
  }
)

When(
  'click on row root with value {string} in {string} column in {string} table on {string} wizard',
  async function (value, columnName, table, wizard) {
    const arr = await findRowIndexesByColumnValue(
      this.driver,
      pageObjects[wizard][table],
      columnName,
      value
    )
    const indx = arr[0]
    await clickOnComponent(this.driver, pageObjects[wizard][table]['rowRoot'](indx))
  }
)

When(
  'click on row root with value {string} in {string} column in {string} table in {string} on {string} wizard',
  async function (value, columnName, table, accordion, wizard) {
    const arr = await findRowIndexesByColumnValue(
      this.driver,
      pageObjects[wizard][accordion][table],
      columnName,
      value
    )
    const indx = arr[0]
    await clickOnComponent(this.driver, pageObjects[wizard][accordion][table]['rowRoot'](indx))
  }
)

When(
  'click on cell with row index {int} in {string} column in {string} table on {string} wizard',
  async function (indx, columnName, table, wizard) {
    await clickOnComponent(this.driver, pageObjects[wizard][table]['tableFields'][columnName](indx))
  }
)

Then(
  'hover on cell with row index {int} in {string} column in {string} table on {string} wizard',
  async function (indx, columnName, table, wizard) {
    await hoverComponent(this.driver, pageObjects[wizard][table]['tableFields'][columnName](indx), false)
  }
)

Then( 
  'verify that row index {int} is active in {string} table on {string} wizard',
  async function (indx, table, wizard) {
    await isRowActive(this.driver, pageObjects[wizard][table], indx) 
  }
)

Then( 
  'verify that row index {int} is NOT active in {string} table on {string} wizard',
  async function (indx, table, wizard) {
    await isRowActive(this.driver, pageObjects[wizard][table], indx)
  }
)

When(
  'add new volume rows to {string} table in {string} on {string} wizard using nontable inputs',
  async function (tableName, accordionName, wizardName, dataTable) {
    const pageComponents = dataTable['rawTable'][0]
    const rows = dataTable.rows()

    for (const row of rows) {
      await clickOnComponent(
        this.driver,
        pageObjects[wizardName][accordionName][tableName]['add_row_btn']
      )

      for (let indx = 0; indx < pageComponents.length; indx++) {
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
            await hoverComponent(this.driver, pageObjects[wizardName][accordionName][pageComponents[indx]], false)
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
  async function (tableName, wizardName, dataTable) {
    const pageComponents = dataTable['rawTable'][0]
    const rows = dataTable.rows()

    for (const row of rows) {
      await clickOnComponent(this.driver, pageObjects[wizardName][tableName]['add_row_btn'])
      for (const indx in pageComponents) {
        if (pageComponents[indx].includes('Dropdown')) {
          await openDropdown(this.driver, pageObjects[wizardName][pageComponents[indx]])
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
          await typeValue(this.driver, pageObjects[wizardName][pageComponents[indx]], row[indx])
          await this.driver.sleep(250)
        }

        if (pageComponents[indx].includes('Button')) {
          if (row[indx] === 'yes') {
            await clickOnComponent(this.driver, pageObjects[wizardName][pageComponents[indx]])
            await this.driver.sleep(250)
          }
        }
      }
    }
  }
)

When(
  'click on {string} in action menu in {string} table in {string} on {string} wizard',
  async function (option, tableName, accordionName, wizardName, dataTable) {
    const column = dataTable['rawTable'][0][0]
    const rows = dataTable.rows()

    for (const row_indx in rows) {
      const arr = await findRowIndexesByColumnValue(
        this.driver,
        pageObjects[wizardName][accordionName][tableName],
        column,
        rows[row_indx][0]
      )

      const indx = arr[0] - pageObjects[wizardName][accordionName][tableName].offset

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
  async function (option, tableName, accordionName, wizardName, offsetFlag, dataTable) {
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

Then(
  'check {string} visibility in {string} on {string} wizard',
  async function (cellName, tableName, wizardName) {
    const rowsNumber = await getTableRows(this.driver, pageObjects[wizardName][tableName])
    for (let i = 0; i < rowsNumber; i++) {
      await componentIsVisible(
        this.driver,
        pageObjects[wizardName][tableName].tableFields[cellName](i + 1)
      )
    }
  }
)

Then(
  'check {string} not presented in {string} on {string} wizard',
  async function (cellName, tableName, wizardName) {
    const rowsNumber = await getTableRows(this.driver, pageObjects[wizardName][tableName])
    for (let i = 0; i < rowsNumber; i++) {
      await componentIsNotPresent(
        this.driver,
        pageObjects[wizardName][tableName].tableFields[cellName](i + 1)
      )
    }
  }
)

Then(
  'check {string} not visible in {string} on {string} wizard',
  async function (cellName, tableName, wizardName) {
    const rowsNumber = await getTableRows(this.driver, pageObjects[wizardName][tableName])
    for (let i = 0; i < rowsNumber; i++) {
      await componentIsNotVisible(
        this.driver,
        pageObjects[wizardName][tableName].tableFields[cellName](i + 1)
      )
    }
  }
)

When(
  'click on node with index {int} in {string} graph on {string} wizard',
  async function (index, graphName, wizardName) {
    await clickOnComponent(
      this.driver,
      pageObjects[wizardName][graphName].nodesTable.tableFields['name'](index)
    )
    await this.driver.sleep(250)
    await isComponentContainsClass(
      this.driver,
      pageObjects[wizardName][graphName].nodesTable.rowRoot(index),
      'selected'
    )
  }
)

When(
  'save to context {string} column and {string} attribute on {int} row from {string} table on {string} wizard',
  async function (columnName, attributeName, rowIndex, tableName, wizardName) {
    await putToTestContextCellParameters(
      this.driver,
      this.testContext,
      pageObjects[wizardName][tableName],
      rowIndex,
      columnName,
      attributeName
    )
  }
)

When(
  'save to context {string} column on {int} row from {string} table on {string} wizard',
  async function (columnName, rowIndex, tableName, wizardName) {
    await putToTestContextCellParameters(
      this.driver,
      this.testContext,
      pageObjects[wizardName][tableName],
      rowIndex,
      columnName
    )
  }
)

When(
  'save to context {string} column and {string} attributes row where header {string} is {string} from {string} table on {string} wizard',
  async function (valueColumnName, attributeName, keyName, keyValue, overviewTable, wizardName) {
    const arr = await findRowIndexesByColumnValue(
      this.driver,
      pageObjects[wizardName][overviewTable],
      keyName,
      keyValue
    )
    const index = arr[0]

    await putToTestContextCellParameters(
      this.driver,
      this.testContext,
      pageObjects[wizardName][overviewTable],
      index,
      valueColumnName,
      attributeName
    )
  }
)

When(
  'click on {string} value where option is {string} in {string} on {string} wizard',
  async function (fieldType, nameValue, overviewTable, wizardName) {
    const arr = await findRowIndexesByColumnValue(
      this.driver,
      pageObjects[wizardName][overviewTable],
      'key',
      nameValue
    )
    const index = arr[0]

    await clickOnComponent(
      this.driver,
      pageObjects[wizardName][overviewTable].tableFields[fieldType](index)
    )
  }
)

Then(
  'verify {string} values {string} values from {string} on {string} with {string} context value',
  async function (keyColumn, keys, overviewTable, wizardName, contextContainer) {
    const keysArr = keys.split(',')

    for (let key of keysArr) {
      const arr = await findRowIndexesByColumnValue(
        this.driver,
        pageObjects[wizardName][overviewTable],
        keyColumn,
        key
      )
      const cellComponent = await this.driver.findElement(
        pageObjects[wizardName][overviewTable].tableFields['value'](arr[0])
      )
      const cellValue = await cellComponent.getText()
      expect(this.testContext[contextContainer].includes(cellValue)).equal(
        true,
        `"${key}" value "${cellValue}" is not in link "${this.testContext[
          contextContainer
        ].includes(cellValue)}"`
      )
    }
  }
)

Then(
  'verify cell with {string} value in {string} column in {string} table on {string} wizard should display {string}.{string}',
  async function (fieldName, columnName, tableName, wizardName, constStorage, constValue) {
    const arr = await findRowIndexesByColumnValue(
      this.driver,
      pageObjects[wizardName][tableName],
      columnName,
      fieldName
    )
    const indx = arr[0]

    await checkCellHintText(
      this.driver,
      pageObjects[wizardName][tableName],
      pageObjects['commonPagesHeader']['Common_Hint'],
      pageObjectsConsts[constStorage][constValue],
      indx
    )
  }
)
