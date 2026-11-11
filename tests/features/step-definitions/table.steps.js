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
import { When, Then } from '../support/world.js'
import { panGraphToElement } from '../common/actions/graph.action.js'
import pageObjects from '../common/page-objects.js'
import {
  clickNearComponent,
  clickOnComponent,
  componentIsNotPresent,
  componentIsPresent,
  componentIsNotVisible,
  componentIsVisible,
  hoverComponent,
  hoverElementCenter,
  isComponentContainsClass,
  scrollToElement,
  typeIntoInputField,
  verifyText,
  verifyComponentContainsAttributeValue,
  verifyTypedText,
  waitPageLoad,
  waiteUntilComponent,
  checkComponentHintTextWithHover
} from '../common/actions/common.action.js'
import {
  checkCellHintText,
  findRowIndexesByColumnTooltipsValue,
  waitForRowIndexesByColumnValue,
  waitForRowIndexesByColumnValueAttribute,
  findRowIndexesByColumnValueExpand,
  getCellByIndexColumn,
  getTableRows,
  waitForTableRows,
  isContainsSubstringInColumnCells,
  isContainsSubstringInColumnAttributeCells,
  isContainsSubstringInColumnAttributeListCells,
  isContainsSubstringInColumnDropdownCells,
  isContainsSubstringInColumnDropdownCellsOverlay,
  isContainsSubstringInColumnTooltipCells,
  isContainsValueInColumn,
  isContainsValueInHeaderColumn,
  isDatetimeCelsValueInRange,
  isNotContainsValueInColumn,
  putToTestContextCellParameters
} from '../common/actions/table.action.js'
import {
  checkActionMenuOptions,
  openActionMenu,
  verifyOptionInActionMenuEnabled,
  verifyOptionInActionMenuDisabled,
  selectOptionInActionMenu
} from '../common/actions/action-menu.action.js'
import { typeValue } from '../common/actions/input-group.action.js'
import {
  checkDropdownSelectedOption,
  openDropdown,
  selectOptionInDropdownWithoutCheck,
  selectOptionInDropdown
} from '../common/actions/dropdown.action.js'
import pageObjectsConsts from '../common-tools/common-consts.js'
import { expect } from '@playwright/test'
import { isRowActive } from '../common/actions/tab-selector.action.js'
import {
  getText,
  isDisplayed,
  retryAssertion,
  scrollIntoView,
  waitUntil
} from '../common-tools/element.js'

Then(
  'check {string} value in {string} column in {string} table on {string} wizard',
  async function (value, column, table, wizard) {
    await waitPageLoad(this.page, pageObjects['commonPagesHeader']['loader'])
    await isContainsValueInColumn(this.page, pageObjects[wizard][table], column, value)
  }
)

Then(
  'check {string} header value in {string} column in {string} table on {string} wizard',
  async function (value, column, table, wizard) {
    await waitPageLoad(this.page, pageObjects['commonPagesHeader']['loader'])

    await isContainsValueInHeaderColumn(this.page, pageObjects[wizard][table], column, value)
  }
)

Then(
  'check {string} value not in {string} column in {string} table on {string} wizard',
  async function (value, column, table, wizard) {
    await waitPageLoad(this.page, pageObjects['commonPagesHeader']['loader'])
    await isNotContainsValueInColumn(this.page, pageObjects[wizard][table], column, value)
  }
)

When('scroll to the {string} element on {string} wizard', async function (component, wizard) {
  await waiteUntilComponent(this.page, pageObjects[wizard][component])
  await scrollToElement(this.page, pageObjects[wizard][component])
})

When(
  'scroll to the element with {string} value in {string} column in {string} table on {string} wizard',
  async function (value, columnName, table, wizard) {
    const arr = await waitForRowIndexesByColumnValue(
      this.page,
      pageObjects[wizard][table],
      columnName,
      value
    )
    const indx = arr[0]

    await scrollToElement(this.page, pageObjects[wizard][table]['rowRoot'](indx))
  }
)

Then(
  'open action menu on {string} wizard in {string} table at row with {string} value in {string} column',
  async function (wizard, table, value, column) {
    const arr = await waitForRowIndexesByColumnValue(
      this.page,
      pageObjects[wizard][table],
      column,
      value
    )
    const indx = arr[0]
    const actionMenuSel = await getCellByIndexColumn(
      this.page,
      pageObjects[wizard][table],
      indx,
      'action_menu'
    )

    await openActionMenu(this.page, actionMenuSel)
  }
)

Then(
  'select {string} option in action menu on {string} wizard in {string} table at row with {string} value in {string} column with expand btn {string}',
  async function (option, wizard, table, value, column, expand_name) {
    const arr = await findRowIndexesByColumnValueExpand(
      this.page,
      pageObjects[wizard][table],
      column,
      value
    )
    const indx = arr[0]
    const actionMenuSel = await getCellByIndexColumn(
      this.page,
      pageObjects[wizard][table],
      indx,
      'action_menu'
    )

    await hoverComponent(
      this.page,
      pageObjects[wizard][table]['tableFields'][expand_name](indx),
      false // scroll ?
    )
    await openActionMenu(this.page, actionMenuSel)
    await this.page.waitForTimeout(500)
    await selectOptionInActionMenu(this.page, actionMenuSel, option)
  }
)

Then(
  'select {string} option in action menu on {string} wizard in {string} table at row with {string} value in {string} column',
  async function (option, wizard, table, value, column) {
    const arr = await waitForRowIndexesByColumnValue(
      this.page,
      pageObjects[wizard][table],
      column,
      value
    )
    const indx = arr[0]
    const menuType = column === 'name_expand_btn' ? 'action_menu_expand' : 'action_menu'
    const actionMenuSel = await getCellByIndexColumn(
      this.page,
      pageObjects[wizard][table],
      indx,
      menuType
    )

    await hoverComponent(
      this.page,
      pageObjects[wizard][table]['tableFields'][column](indx),
      false // scroll ?
    )
    await openActionMenu(this.page, actionMenuSel)
    await this.page.waitForTimeout(500)
    await selectOptionInActionMenu(this.page, actionMenuSel, option)
  }
)

When('add rows to {string} table on {string} wizard', async function (table, wizard, dataTable) {
  const inputFields = dataTable.raw()[0]
  const rows = dataTable.rows()

  for (const row_indx in rows) {
    await clickOnComponent(this.page, pageObjects[wizard][table]['add_row_btn'])
    await this.page.waitForTimeout(100)
    for (const i in inputFields) {
      await clickOnComponent(
        this.page,
        pageObjects[wizard][table]['tableFields'][inputFields[i]](parseInt(row_indx) + 1)
      )
      await typeIntoInputField(
        this.page,
        pageObjects[wizard][table]['tableFields'][inputFields[i]](parseInt(row_indx) + 1),
        rows[row_indx][i]
      )
    }
    await clickNearComponent(this.page, pageObjects[wizard][table]['root'])
    await this.page.waitForTimeout(250)
  }
})

When('add data to {string} table on {string} wizard', async function (table, wizard, dataTable) {
  const inputFields = dataTable.raw()[0]
  const rows = dataTable.rows()

  for (const row_indx in rows) {
    await clickOnComponent(this.page, pageObjects[wizard][table]['add_row_btn'])
    await this.page.waitForTimeout(100)
    await clickOnComponent(
      this.page,
      pageObjects[wizard][table]['tableFields'][inputFields[0]](parseInt(row_indx) + 2)
    )
    await this.page.waitForTimeout(250)
    await typeIntoInputField(
      this.page,
      pageObjects[wizard][table]['tableFields'][inputFields[0]](parseInt(row_indx) + 2),
      rows[row_indx][0]
    )
    await this.page.waitForTimeout(100)
    await openDropdown(
      this.page,
      pageObjects[wizard][table]['tableFields'][inputFields[1]](parseInt(row_indx) + 2)
    )
    await selectOptionInDropdownWithoutCheck(
      this.page,
      pageObjects[wizard][table]['tableFields'][inputFields[1]](parseInt(row_indx) + 2),
      rows[row_indx][1]
    )
    await this.page.waitForTimeout(100)
    await typeIntoInputField(
      this.page,
      pageObjects[wizard][table]['tableFields'][inputFields[2]](parseInt(row_indx) + 2),
      rows[row_indx][2]
    )
    await this.page.waitForTimeout(100)
    await hoverComponent(
      this.page,
      pageObjects[wizard][table]['tableFields']['apply_btn'](parseInt(row_indx) + 2)
    )
    await this.page.waitForTimeout(100)
    await clickOnComponent(
      this.page,
      pageObjects[wizard][table]['tableFields']['apply_btn'](parseInt(row_indx) + 2)
    )
    await this.page.waitForTimeout(100)
  }
})

When(
  'add data to {string} table on {string} wizard with a pre-filled table',
  async function (table, wizard, dataTable) {
    const inputFields = dataTable.raw()[0]
    const rows = dataTable.rows()

    for (const row_indx in rows) {
      let rowsNumber = await getTableRows(this.page, pageObjects[wizard][table])

      await clickOnComponent(this.page, pageObjects[wizard][table]['add_row_btn'])
      await this.page.waitForTimeout(100)
      await clickOnComponent(
        this.page,
        pageObjects[wizard][table]['tableFields'][inputFields[0]](rowsNumber + 2)
      )
      await this.page.waitForTimeout(250)
      await typeIntoInputField(
        this.page,
        pageObjects[wizard][table]['tableFields'][inputFields[0]](rowsNumber + 2),
        rows[row_indx][0]
      )
      await this.page.waitForTimeout(100)
      await openDropdown(
        this.page,
        pageObjects[wizard][table]['tableFields'][inputFields[1]](rowsNumber + 2)
      )
      await selectOptionInDropdownWithoutCheck(
        this.page,
        pageObjects[wizard][table]['tableFields'][inputFields[1]](rowsNumber + 2),
        rows[row_indx][1]
      )
      await this.page.waitForTimeout(100)
      await typeIntoInputField(
        this.page,
        pageObjects[wizard][table]['tableFields'][inputFields[2]](rowsNumber + 2),
        rows[row_indx][2]
      )
      await this.page.waitForTimeout(100)
      await hoverComponent(
        this.page,
        pageObjects[wizard][table]['tableFields']['apply_btn'](rowsNumber + 2)
      )
      await this.page.waitForTimeout(100)
      await clickOnComponent(
        this.page,
        pageObjects[wizard][table]['tableFields']['apply_btn'](rowsNumber + 2)
      )
      await this.page.waitForTimeout(100)
    }
  }
)

When(
  'add custom parameters to {string} table on {string} wizard with a pre-filled table',
  async function (table, wizard, dataTable) {
    const inputFields = dataTable.raw()[0]
    const rows = dataTable.rows()

    for (const row_indx in rows) {
      let rowsNumber = await getTableRows(this.page, pageObjects[wizard][table])

      await clickOnComponent(this.page, pageObjects[wizard][table]['add_row_btn'])
      await this.page.waitForTimeout(100)
      await clickOnComponent(
        this.page,
        pageObjects[wizard][table]['tableFields'][inputFields[0]](rowsNumber + 1)
      )
      await this.page.waitForTimeout(250)
      await typeIntoInputField(
        this.page,
        pageObjects[wizard][table]['tableFields'][inputFields[0]](rowsNumber + 1),
        rows[row_indx][0]
      )
      await this.page.waitForTimeout(100)
      await openDropdown(
        this.page,
        pageObjects[wizard][table]['tableFields'][inputFields[1]](rowsNumber + 1)
      )
      await selectOptionInDropdownWithoutCheck(
        this.page,
        pageObjects[wizard][table]['tableFields'][inputFields[1]](rowsNumber + 1),
        rows[row_indx][1]
      )
      await this.page.waitForTimeout(100)
      await typeIntoInputField(
        this.page,
        pageObjects[wizard][table]['tableFields'][inputFields[2]](rowsNumber + 1),
        rows[row_indx][2]
      )
      await this.page.waitForTimeout(100)
      await hoverComponent(
        this.page,
        pageObjects[wizard][table]['tableFields']['apply_btn'](rowsNumber + 1)
      )
      await this.page.waitForTimeout(100)
      await clickOnComponent(
        this.page,
        pageObjects[wizard][table]['tableFields']['apply_btn'](rowsNumber + 1)
      )
      await this.page.waitForTimeout(100)
    }
  }
)

When(
  'add data to {string} table on {string} wizard with combobox',
  async function (table, wizard, dataTable) {
    const inputFields = dataTable.raw()[0]
    const rows = dataTable.rows()

    for (const row_indx in rows) {
      let rowsNumber = await getTableRows(this.page, pageObjects[wizard][table])

      await clickOnComponent(this.page, pageObjects[wizard][table]['add_row_btn'])
      await this.page.waitForTimeout(100)
      await clickOnComponent(
        this.page,
        pageObjects[wizard][table]['tableFields'][inputFields[0]](rowsNumber + 2)
      )
      await this.page.waitForTimeout(250)
      await typeIntoInputField(
        this.page,
        pageObjects[wizard][table]['tableFields'][inputFields[0]](rowsNumber + 2),
        rows[row_indx][0]
      )
      await this.page.waitForTimeout(100)
      await openDropdown(
        this.page,
        pageObjects[wizard][table]['tableFields'][inputFields[1]](rowsNumber + 2)
      )
      await selectOptionInDropdownWithoutCheck(
        this.page,
        pageObjects[wizard][table]['tableFields'][inputFields[1]](rowsNumber + 2),
        rows[row_indx][1]
      )
      await this.page.waitForTimeout(100)
      await selectOptionInDropdownWithoutCheck(
        this.page,
        pageObjects[wizard][table]['tableFields'][inputFields[2]](rowsNumber + 2),
        rows[row_indx][2]
      )
      await this.page.waitForTimeout(100)
      await selectOptionInDropdownWithoutCheck(
        this.page,
        pageObjects[wizard][table]['tableFields'][inputFields[3]](rowsNumber + 2),
        rows[row_indx][3]
      )
      await this.page.waitForTimeout(100)
      await selectOptionInDropdownWithoutCheck(
        this.page,
        pageObjects[wizard][table]['tableFields'][inputFields[4]](rowsNumber + 2),
        rows[row_indx][4]
      )
      await this.page.waitForTimeout(100)
      await selectOptionInDropdownWithoutCheck(
        this.page,
        pageObjects[wizard][table]['tableFields'][inputFields[4]](rowsNumber + 2),
        rows[row_indx][5]
      )
      await this.page.waitForTimeout(100)
      await hoverComponent(
        this.page,
        pageObjects[wizard][table]['tableFields']['apply_btn'](rowsNumber + 2)
      )
      await this.page.waitForTimeout(100)
      await clickOnComponent(
        this.page,
        pageObjects[wizard][table]['tableFields']['apply_btn'](rowsNumber + 2)
      )
      await this.page.waitForTimeout(100)
    }
  }
)

When(
  'add data to {string} table on {string} wizard with several inputs',
  async function (table, wizard, dataTable) {
    const inputFields = dataTable.raw()[0]
    const rows = dataTable.rows()

    for (const row_indx in rows) {
      await clickOnComponent(this.page, pageObjects[wizard][table]['add_row_btn'])
      await this.page.waitForTimeout(100)
      await clickOnComponent(
        this.page,
        pageObjects[wizard][table]['tableFields'][inputFields[0]](parseInt(row_indx) + 2)
      )
      await this.page.waitForTimeout(250)
      await typeIntoInputField(
        this.page,
        pageObjects[wizard][table]['tableFields'][inputFields[0]](parseInt(row_indx) + 2),
        rows[row_indx][0]
      )
      await this.page.waitForTimeout(100)
      await openDropdown(
        this.page,
        pageObjects[wizard][table]['tableFields'][inputFields[1]](parseInt(row_indx) + 2)
      )
      await selectOptionInDropdownWithoutCheck(
        this.page,
        pageObjects[wizard][table]['tableFields'][inputFields[1]](parseInt(row_indx) + 2),
        rows[row_indx][1]
      )
      await this.page.waitForTimeout(100)
      await typeIntoInputField(
        this.page,
        pageObjects[wizard][table]['tableFields'][inputFields[2]](parseInt(row_indx) + 2),
        rows[row_indx][2]
      )
      await this.page.waitForTimeout(100)

      if (rows[row_indx][3].length !== 0) {
        await typeIntoInputField(
          this.page,
          pageObjects[wizard][table]['tableFields'][inputFields[3]](parseInt(row_indx) + 2),
          rows[row_indx][3]
        )
        await this.page.waitForTimeout(100)
      }
      await hoverComponent(
        this.page,
        pageObjects[wizard][table]['tableFields']['apply_btn'](parseInt(row_indx) + 2)
      )
      await this.page.waitForTimeout(100)
      await clickOnComponent(
        this.page,
        pageObjects[wizard][table]['tableFields']['apply_btn'](parseInt(row_indx) + 2)
      )
      await this.page.waitForTimeout(100)
    }
  }
)

When('fill data to {string} table on {string} wizard', async function (table, wizard, dataTable) {
  const inputFields = dataTable.raw()[0]
  const rows = dataTable.rows()

  for (const row_indx in rows) {
    await clickOnComponent(this.page, pageObjects[wizard][table]['add_row_btn'])
    await this.page.waitForTimeout(100)
    await clickOnComponent(
      this.page,
      pageObjects[wizard][table]['tableFields'][inputFields[0]](parseInt(row_indx) + 3)
    )
    await this.page.waitForTimeout(250)
    await typeIntoInputField(
      this.page,
      pageObjects[wizard][table]['tableFields'][inputFields[0]](parseInt(row_indx) + 3),
      rows[row_indx][0]
    )
    await this.page.waitForTimeout(100)
    await openDropdown(
      this.page,
      pageObjects[wizard][table]['tableFields'][inputFields[1]](parseInt(row_indx) + 3)
    )
    await selectOptionInDropdownWithoutCheck(
      this.page,
      pageObjects[wizard][table]['tableFields'][inputFields[1]](parseInt(row_indx) + 3),
      rows[row_indx][1]
    )
    await this.page.waitForTimeout(100)
    await typeIntoInputField(
      this.page,
      pageObjects[wizard][table]['tableFields'][inputFields[2]](parseInt(row_indx) + 3),
      rows[row_indx][2]
    )
    await this.page.waitForTimeout(250)
    await hoverComponent(
      this.page,
      pageObjects[wizard][table]['tableFields']['apply_btn'](parseInt(row_indx) + 3)
    )
    await this.page.waitForTimeout(100)
    await clickOnComponent(
      this.page,
      pageObjects[wizard][table]['tableFields']['apply_btn'](parseInt(row_indx) + 3)
    )
    await this.page.waitForTimeout(100)
  }
})

When(
  'add rows to {string} key-value table on {string} wizard',
  async function (table, wizard, dataTable) {
    const inputFields = dataTable.raw()[0]
    const rows = dataTable.rows()

    for (const row_indx in rows) {
      await clickOnComponent(this.page, pageObjects[wizard][table]['add_row_btn'])
      await this.page.waitForTimeout(500)
      for (const i in inputFields) {
        await typeIntoInputField(
          this.page,
          pageObjects[wizard][table]['tableColumns'][inputFields[i]],
          rows[row_indx][i]
        )
      }
      await clickOnComponent(this.page, pageObjects[wizard][table]['save_row_btn'])
      await clickNearComponent(this.page, pageObjects[wizard][table]['root'])
      await this.page.waitForTimeout(500)
    }
  }
)

When(
  'add rows to {string} invalid key-value table on {string} wizard',
  async function (table, wizard, dataTable) {
    const inputFields = dataTable.raw()[0]
    const rows = dataTable.rows()

    for (const row_indx in rows) {
      await clickOnComponent(this.page, pageObjects[wizard][table]['add_row_btn'])
      await this.page.waitForTimeout(500)
      for (const i in inputFields) {
        await typeIntoInputField(
          this.page,
          pageObjects[wizard][table]['tableColumns'][inputFields[i]],
          rows[row_indx][i]
        )
      }
      await clickOnComponent(this.page, pageObjects[wizard][table]['save_row_btn'])
      await this.page.waitForTimeout(500)
    }
  }
)

// the positional checks ("verify values/data in ... table") verified only the listed rows: a leftover (e.g. not removed)
// or an extra row passed. The row after the listed ones must not exist (`index` - its index in the step's indexing)
const expectNoRowAfter = (page, table, column, index) =>
  retryAssertion(async () => {
    const field = table['tableFields'][column](index)
    const selector = typeof field === 'string' ? field : field.root
    const extraRows = await page.locator(selector).count()

    expect(
      extraRows,
      `The table has more rows than the expected ones: row ${index} exists (${selector})`
    ).toBe(0)
  })

Then(
  'verify values in {string} table on {string} wizard',
  async function (table, wizard, dataTable) {
    const columns = dataTable.raw()[0]
    const rows = dataTable.rows()

    for (const row_indx in rows) {
      for (const i in columns) {
        await verifyText(
          this.page,
          pageObjects[wizard][table]['tableFields'][columns[i]](parseInt(row_indx) + 1),
          rows[row_indx][i]
        )
      }
    }

    await expectNoRowAfter(this.page, pageObjects[wizard][table], columns[0], rows.length + 1)
  }
)

Then('verify data in {string} table on {string} wizard', async function (table, wizard, dataTable) {
  const columns = dataTable.raw()[0]
  const rows = dataTable.rows()

  for (const row_indx in rows) {
    for (const i in columns) {
      await verifyText(
        this.page,
        pageObjects[wizard][table]['tableFields'][columns[i]](parseInt(row_indx) + 2),
        rows[row_indx][i]
      )
    }
  }

  await expectNoRowAfter(this.page, pageObjects[wizard][table], columns[0], rows.length + 2)
})

Then(
  'verify filled data in {string} table on {string} wizard',
  async function (table, wizard, dataTable) {
    const columns = dataTable.raw()[0]
    const rows = dataTable.rows()

    for (const row_indx in rows) {
      for (const i in columns) {
        await verifyText(
          this.page,
          pageObjects[wizard][table]['tableFields'][columns[i]](parseInt(row_indx) + 3),
          rows[row_indx][i]
        )
      }
    }

    await expectNoRowAfter(this.page, pageObjects[wizard][table], columns[0], rows.length + 3)
  }
)

Then(
  'verify values in {string} table on {string} wizard with attribute',
  async function (table, wizard, dataTable) {
    const columns = dataTable.raw()[0]
    const rows = dataTable.rows()

    for (const row_indx in rows) {
      for (const i in columns) {
        await verifyTypedText(
          this.page,
          pageObjects[wizard][table]['tableFields'][columns[i]](parseInt(row_indx) + 1),
          rows[row_indx][i]
        )
      }
    }

    await expectNoRowAfter(this.page, pageObjects[wizard][table], columns[0], rows.length + 1)
  }
)

Then(
  'verify values in {string} table in {string} on {string} wizard with attribute',
  async function (table, accordion, wizard, dataTable) {
    const columns = dataTable.raw()[0]
    const rows = dataTable.rows()

    for (const row_indx in rows) {
      for (const i in columns) {
        await verifyTypedText(
          this.page,
          pageObjects[wizard][accordion][table]['tableFields'][columns[i]](parseInt(row_indx) + 1),
          rows[row_indx][i]
        )
      }
    }

    await expectNoRowAfter(
      this.page,
      pageObjects[wizard][accordion][table],
      columns[0],
      rows.length + 1
    )
  }
)

When(
  'click on {string} in {string} table on {string} wizard with offset {string}',
  async function (fieldName, tableName, wizardName, offsetFlag, dataTable) {
    const column = dataTable.raw()[0][0]
    const rows = dataTable.rows()

    for (const row_indx in rows) {
      const arr = await waitForRowIndexesByColumnValue(
        this.page,
        pageObjects[wizardName][tableName],
        column,
        rows[row_indx][0]
      )
      let indx = arr[0]

      if (offsetFlag === 'true') {
        indx -= pageObjects[wizardName][tableName].offset
      }

      await hoverComponent(
        this.page,
        pageObjects[wizardName][tableName]['tableFields'][fieldName](indx)
      )
      await clickOnComponent(
        this.page,
        pageObjects[wizardName][tableName]['tableFields'][fieldName](indx)
      )
    }
  }
)

When(
  'click on {string} in {string} table on {string} wizard with sorters',
  async function (fieldName, tableName, wizardName) {
    await waiteUntilComponent(
      this.page,
      pageObjects[wizardName][tableName]['headerSorters'][fieldName]
    )
    await clickOnComponent(
      this.page,
      pageObjects[wizardName][tableName]['headerSorters'][fieldName]
    )
    await this.page.waitForTimeout(250)
  }
)

When(
  'click on {string} with data in {string} table on {string} wizard with offset {string}',
  async function (fieldName, tableName, wizardName, offsetFlag, dataTable) {
    const column = dataTable.raw()[0][0]
    const rows = dataTable.rows()

    for (const row_indx in rows) {
      const arr = await waitForRowIndexesByColumnValue(
        this.page,
        pageObjects[wizardName][tableName],
        column,
        rows[row_indx][0]
      )
      let indx = arr[0]

      if (offsetFlag === 'true') {
        indx -= pageObjects[wizardName][tableName].offset
      }

      await hoverComponent(
        this.page,
        pageObjects[wizardName][tableName]['tableFields'][fieldName](indx + 1)
      )
      await clickOnComponent(
        this.page,
        pageObjects[wizardName][tableName]['tableFields'][fieldName](indx + 1)
      )
    }
  }
)

When(
  'click on {string} with filled data in {string} table on {string} wizard with offset {string}',
  async function (fieldName, tableName, wizardName, offsetFlag, dataTable) {
    const column = dataTable.raw()[0][0]
    const rows = dataTable.rows()

    for (const row_indx in rows) {
      const arr = await waitForRowIndexesByColumnValue(
        this.page,
        pageObjects[wizardName][tableName],
        column,
        rows[row_indx][0]
      )
      let indx = arr[0]

      if (offsetFlag === 'true') {
        indx -= pageObjects[wizardName][tableName].offset
      }

      await hoverComponent(
        this.page,
        pageObjects[wizardName][tableName]['tableFields'][fieldName](indx + 2)
      )
      await clickOnComponent(
        this.page,
        pageObjects[wizardName][tableName]['tableFields'][fieldName](indx + 2)
      )
    }
  }
)

When(
  'add rows to {string} table in {string} on {string} wizard',
  async function (table, accordion, wizard, dataTable) {
    const inputFields = dataTable.raw()[0]
    const rows = dataTable.rows()

    for (const row_indx in rows) {
      await clickOnComponent(this.page, pageObjects[wizard][accordion][table]['add_row_btn'])
      await this.page.waitForTimeout(100)
      for (const i in inputFields) {
        const component = pageObjects[wizard][accordion][table]['tableFields'][inputFields[i]](
          parseInt(row_indx) + 1
        )
        const inputField = component.inputField ?? component

        await typeIntoInputField(this.page, inputField, rows[row_indx][i])
      }

      if (pageObjects[wizard][accordion][table]['tableFields']['add_row_btn']) {
        await clickOnComponent(
          this.page,
          pageObjects[wizard][accordion][table]['tableFields']['add_row_btn'](
            parseInt(row_indx) + 1
          )
        )
      } else {
        await clickNearComponent(this.page, pageObjects[wizard][accordion][table]['root'])
      }

      await this.page.waitForTimeout(100)
    }
  }
)

When(
  'add rows to {string} key-value table in {string} on {string} wizard',
  async function (table, accordion, wizard, dataTable) {
    const inputFields = dataTable.raw()[0]
    const rows = dataTable.rows()

    for (const row_indx in rows) {
      await clickOnComponent(this.page, pageObjects[wizard][accordion][table]['add_row_btn'])
      await this.page.waitForTimeout(100)
      for (const i in inputFields) {
        const component = pageObjects[wizard][accordion][table]['tableFields'][inputFields[i]](3)
        // const component = pageObjects[wizard][accordion][table]['tableFields'][inputFields[i]]
        const inputField = component.inputField ?? component
        await typeIntoInputField(this.page, inputField, rows[row_indx][i])
      }

      if (pageObjects[wizard][accordion][table]['save_row_btn']) {
        await clickOnComponent(this.page, pageObjects[wizard][accordion][table]['save_row_btn'])
      } else {
        await clickNearComponent(this.page, pageObjects[wizard][accordion][table]['root'])
      }

      await this.page.waitForTimeout(100)
    }
  }
)

When(
  'add data rows to {string} key-value table in {string} on {string} wizard',
  async function (table, accordion, wizard, dataTable) {
    const inputFields = dataTable.raw()[0]
    const rows = dataTable.rows()

    for (const row_indx in rows) {
      await clickOnComponent(this.page, pageObjects[wizard][accordion][table]['add_row_btn'])
      await this.page.waitForTimeout(100)
      for (const i in inputFields) {
        const component = pageObjects[wizard][accordion][table]['tableFields'][inputFields[i]](
          parseInt(row_indx) + 2
        )
        const inputField = component.inputField ?? component
        await typeIntoInputField(this.page, inputField, rows[row_indx][i])
      }

      if (pageObjects[wizard][accordion][table]['save_row_btn']) {
        await clickOnComponent(this.page, pageObjects[wizard][accordion][table]['save_row_btn'])
      } else {
        await hoverComponent(
          this.page,
          pageObjects[wizard][accordion][table]['tableFields']['apply_edit_btn'](
            parseInt(row_indx) + 2
          )
        )
        await this.page.waitForTimeout(100)
        await clickOnComponent(
          this.page,
          pageObjects[wizard][accordion][table]['tableFields']['apply_edit_btn'](
            parseInt(row_indx) + 2
          )
        )
        await this.page.waitForTimeout(100)
      }

      await this.page.waitForTimeout(100)
    }
  }
)

When(
  'add data rows to {string} key-value table on {string} wizard',
  async function (table, wizard, dataTable) {
    const inputFields = dataTable.raw()[0]
    const rows = dataTable.rows()

    for (const row_indx in rows) {
      await clickOnComponent(this.page, pageObjects[wizard][table]['add_row_btn'])
      await this.page.waitForTimeout(100)
      for (const i in inputFields) {
        const component = pageObjects[wizard][table]['tableFields'][inputFields[i]](
          parseInt(row_indx) + 2
        )
        const inputField = component.inputField ?? component
        await typeIntoInputField(this.page, inputField, rows[row_indx][i])
      }

      if (pageObjects[wizard][table]['save_row_btn']) {
        await clickOnComponent(this.page, pageObjects[wizard][table]['save_row_btn'])
      } else {
        await hoverComponent(
          this.page,
          pageObjects[wizard][table]['tableFields']['apply_edit_btn'](parseInt(row_indx) + 2)
        )
        await this.page.waitForTimeout(100)
        await clickOnComponent(
          this.page,
          pageObjects[wizard][table]['tableFields']['apply_edit_btn'](parseInt(row_indx) + 2)
        )
        await this.page.waitForTimeout(100)
      }

      await this.page.waitForTimeout(100)
    }
  }
)

When(
  'edit dropdown field {int} row in {string} key-value table on {string} wizard',
  async function (index, table, wizard, dataTable) {
    const inputFields = dataTable.raw()[0]
    const row = dataTable.rows()[0]

    await hoverComponent(
      this.page,
      pageObjects[wizard][table]['tableFields']['edit_btn'](index + 1)
    )
    await clickOnComponent(
      this.page,
      pageObjects[wizard][table]['tableFields']['edit_btn'](index + 1)
    )
    await openDropdown(
      this.page,
      pageObjects[wizard][table]['tableFields'][inputFields[0]](index + 1)
    )
    await selectOptionInDropdownWithoutCheck(
      this.page,
      pageObjects[wizard][table]['tableFields'][inputFields[0]](index + 1),
      row[0]
    )
    await this.page.waitForTimeout(100)
    await typeIntoInputField(
      this.page,
      pageObjects[wizard][table]['tableFields'][inputFields[1]](index + 1),
      row[1]
    )
    await this.page.waitForTimeout(100)
    await typeIntoInputField(
      this.page,
      pageObjects[wizard][table]['tableFields'][inputFields[2]](index + 1),
      row[2]
    )
    await this.page.waitForTimeout(100)
    await hoverComponent(
      this.page,
      pageObjects[wizard][table]['tableFields']['apply_btn'](index + 1)
    )
    await clickOnComponent(
      this.page,
      pageObjects[wizard][table]['tableFields']['apply_btn'](index + 1)
    )
    await this.page.waitForTimeout(100)
  }
)

When(
  'edit {int} row in {string} key-value table in {string} on {string} wizard',
  async function (index, table, accordion, wizard, dataTable) {
    const inputFields = dataTable.raw()[0]
    const row = dataTable.rows()[0]

    await hoverComponent(
      this.page,
      pageObjects[wizard][accordion][table]['tableFields']['edit_btn'](index)
    )
    await clickOnComponent(
      this.page,
      pageObjects[wizard][accordion][table]['tableFields']['edit_btn'](index)
    )

    for (const i in inputFields) {
      const component = pageObjects[wizard][accordion][table]['tableFields'][inputFields[i]](index)

      await typeIntoInputField(this.page, component.inputField, row[i])
    }

    await clickOnComponent(
      this.page,
      pageObjects[wizard][accordion][table]['tableFields']['apply_edit_btn'](index)
    )
    await this.page.waitForTimeout(100)
  }
)

When(
  'edit {int} row in {string} key-value table on {string} wizard',
  async function (index, table, wizard, dataTable) {
    const inputFields = dataTable.raw()[0]
    const row = dataTable.rows()[0]

    await hoverComponent(
      this.page,
      pageObjects[wizard][table]['tableFields']['edit_btn'](index + 1)
    )
    await clickOnComponent(
      this.page,
      pageObjects[wizard][table]['tableFields']['edit_btn'](index + 1)
    )
    // the row switches to edit mode asynchronously
    const firstInput = pageObjects[wizard][table]['tableFields'][inputFields[0]](index + 1)
    await waiteUntilComponent(this.page, firstInput.root ?? firstInput)

    for (const i in inputFields) {
      await typeIntoInputField(
        this.page,
        pageObjects[wizard][table]['tableFields'][inputFields[i]](index + 1),
        row[i]
      )
      await this.page.waitForTimeout(100)
    }
    await clickOnComponent(
      this.page,
      pageObjects[wizard][table]['tableFields']['apply_btn'](index + 1)
    )
    await this.page.waitForTimeout(100)
  }
)

When(
  'edit {int} filled row in {string} key-value table on {string} wizard',
  async function (index, table, wizard, dataTable) {
    const inputFields = dataTable.raw()[0]
    const row = dataTable.rows()[0]

    await hoverComponent(
      this.page,
      pageObjects[wizard][table]['tableFields']['edit_btn'](index + 2)
    )
    await clickOnComponent(
      this.page,
      pageObjects[wizard][table]['tableFields']['edit_btn'](index + 2)
    )

    for (const i in inputFields) {
      await typeIntoInputField(
        this.page,
        pageObjects[wizard][table]['tableFields'][inputFields[i]](index + 2),
        row[i]
      )
      await this.page.waitForTimeout(100)
    }
    await clickOnComponent(
      this.page,
      pageObjects[wizard][table]['tableFields']['apply_btn'](index + 2)
    )
    await this.page.waitForTimeout(100)
  }
)

Then(
  'verify values in {string} table in {string} on {string} wizard',
  async function (table, accordion, wizard, dataTable) {
    const columns = dataTable.raw()[0]
    const rows = dataTable.rows()

    for (const row_indx in rows) {
      for (const i in columns) {
        await verifyText(
          this.page,
          pageObjects[wizard][accordion][table]['tableFields'][columns[i]](parseInt(row_indx) + 1),
          rows[row_indx][i]
        )
      }
    }

    await expectNoRowAfter(
      this.page,
      pageObjects[wizard][accordion][table],
      columns[0],
      rows.length + 1
    )
  }
)
Then(
  'verify data values in {string} table in {string} on {string} wizard',
  async function (table, accordion, wizard, dataTable) {
    const columns = dataTable.raw()[0]
    const rows = dataTable.rows()

    for (const row_indx in rows) {
      for (const i in columns) {
        await verifyText(
          this.page,
          pageObjects[wizard][accordion][table]['tableFields'][columns[i]](parseInt(row_indx) + 2),
          rows[row_indx][i]
        )
      }
    }

    await expectNoRowAfter(
      this.page,
      pageObjects[wizard][accordion][table],
      columns[0],
      rows.length + 2
    )
  }
)

When(
  'click on {string} in {string} table in {string} on {string} wizard',
  async function (field, tableName, accordionName, wizardName, dataTable) {
    const column = dataTable.raw()[0][0]
    const rows = dataTable.rows()

    for (const row_indx in rows) {
      const arr = await waitForRowIndexesByColumnValue(
        this.page,
        pageObjects[wizardName][accordionName][tableName],
        column,
        rows[row_indx][0]
      )
      const indx = arr[0] - pageObjects[wizardName][accordionName][tableName].offset

      // after a row is removed the next one moves under the unmoved pointer and `:hover` isn't recalculated,
      // move the pointer away so hover-only buttons (e.g. "remove") become visible
      await this.page.mouse.move(0, 0)
      await hoverComponent(
        this.page,
        pageObjects[wizardName][accordionName][tableName]['tableFields'][field](indx)
      )
      await clickOnComponent(
        this.page,
        pageObjects[wizardName][accordionName][tableName]['tableFields'][field](indx)
      )
    }
  }
)

When(
  'click on {string} in {string} table on {string} wizard',
  async function (field, tableName, wizardName, dataTable) {
    const column = dataTable.raw()[0][0]
    const rows = dataTable.rows()

    for (const row_indx in rows) {
      const arr = await waitForRowIndexesByColumnValue(
        this.page,
        pageObjects[wizardName][tableName],
        column,
        rows[row_indx][0]
      )
      const indx = arr[0] - pageObjects[wizardName][tableName].offset
      const table = pageObjects[wizardName][tableName]
      const button = table['tableFields'][field](indx)

      // row action buttons are visible only on row hover: rows move up after a removal (`:hover` isn't
      // recalculated under the unmoved pointer), and the row can be at the edge of a scrollable panel,
      // so move the pointer away, center the row, hover it and wait for the button
      await this.page.mouse.move(0, 0)
      if (table.rowRoot) {
        const rowElement = this.page.locator(table.rowRoot(indx)).first()

        await scrollIntoView(rowElement, { block: 'center' })
        await this.page.waitForTimeout(250)
        await hoverElementCenter(this.page, rowElement)
      } else {
        await hoverComponent(this.page, button, false)
      }
      await waitUntil(
        () => isDisplayed(this.page.locator(button).first(), { timeout: 1000 }),
        3000
      ).catch(() => {})
      await clickOnComponent(this.page, button)
    }
  }
)

When(
  'click on data {string} in {string} table in {string} on {string} wizard',
  async function (field, tableName, accordion, wizardName, dataTable) {
    const column = dataTable.raw()[0][0]
    const rows = dataTable.rows()

    for (const row_indx in rows) {
      const arr = await waitForRowIndexesByColumnValue(
        this.page,
        pageObjects[wizardName][accordion][tableName],
        column,
        rows[row_indx][0]
      )
      const indx = arr[0] - pageObjects[wizardName][accordion][tableName].offset

      await hoverComponent(
        this.page,
        pageObjects[wizardName][accordion][tableName]['tableFields'][field](indx + 1),
        false
      )
      await clickOnComponent(
        this.page,
        pageObjects[wizardName][accordion][tableName]['tableFields'][field](indx + 1)
      )
    }
  }
)

When(
  'click on data {string} in {string} table on {string} wizard',
  async function (field, tableName, wizardName, dataTable) {
    const column = dataTable.raw()[0][0]
    const rows = dataTable.rows()

    for (const row_indx in rows) {
      const arr = await waitForRowIndexesByColumnValue(
        this.page,
        pageObjects[wizardName][tableName],
        column,
        rows[row_indx][0]
      )
      const indx = arr[0] - pageObjects[wizardName][tableName].offset

      await hoverComponent(
        this.page,
        pageObjects[wizardName][tableName]['tableFields'][field](indx + 1),
        false
      )
      await clickOnComponent(
        this.page,
        pageObjects[wizardName][tableName]['tableFields'][field](indx + 1)
      )
    }
  }
)

When(
  'click on {string} in {string} table on {string} wizard with attribute',
  async function (field, tableName, wizardName, dataTable) {
    const column = dataTable.raw()[0][0]
    const rows = dataTable.rows()

    for (const row_indx in rows) {
      const arr = await waitForRowIndexesByColumnValueAttribute(
        this.page,
        pageObjects[wizardName][tableName],
        column,
        rows[row_indx][0]
      )
      const indx = arr[0] - pageObjects[wizardName][tableName].offset

      await hoverComponent(
        this.page,
        pageObjects[wizardName][tableName]['tableFields'][field](indx),
        true
      )
      await this.page.waitForTimeout(500)
      await clickOnComponent(
        this.page,
        pageObjects[wizardName][tableName]['tableFields'][field](indx)
      )
    }
  }
)

When(
  'click on {string} in {string} table in {string} on {string} wizard with attribute',
  async function (field, tableName, accordion, wizardName, dataTable) {
    const column = dataTable.raw()[0][0]
    const rows = dataTable.rows()

    for (const row_indx in rows) {
      const arr = await waitForRowIndexesByColumnValueAttribute(
        this.page,
        pageObjects[wizardName][accordion][tableName],
        column,
        rows[row_indx][0]
      )
      const indx = arr[0] - pageObjects[wizardName][accordion][tableName].offset

      await hoverComponent(
        this.page,
        pageObjects[wizardName][accordion][tableName]['tableFields'][field](indx),
        true
      )
      await this.page.waitForTimeout(500)
      await clickOnComponent(
        this.page,
        pageObjects[wizardName][accordion][tableName]['tableFields'][field](indx)
      )
    }
  }
)

When(
  'click on {string} in {string} table in {string} on {string} wizard with offset {string}',
  async function (field, tableName, accordionName, wizardName, offsetFlag, dataTable) {
    const column = dataTable.raw()[0][0]
    const rows = dataTable.rows()

    for (const row_indx in rows) {
      const arr = await waitForRowIndexesByColumnValue(
        this.page,
        pageObjects[wizardName][accordionName][tableName],
        column,
        rows[row_indx][0]
      )
      let indx = arr[0]

      if (offsetFlag === 'true') {
        indx -= pageObjects[wizardName][accordionName][tableName].offset
      }

      await hoverComponent(
        this.page,
        pageObjects[wizardName][accordionName][tableName]['tableFields'][column](indx)
      )
      await clickOnComponent(
        this.page,
        pageObjects[wizardName][accordionName][tableName]['tableFields'][field](indx)
      )
    }
  }
)

When(
  'click on {string} with data in {string} table in {string} on {string} wizard with offset {string}',
  async function (field, tableName, accordionName, wizardName, offsetFlag, dataTable) {
    const column = dataTable.raw()[0][0]
    const rows = dataTable.rows()

    for (const row_indx in rows) {
      const arr = await waitForRowIndexesByColumnValue(
        this.page,
        pageObjects[wizardName][accordionName][tableName],
        column,
        rows[row_indx][0]
      )
      let indx = arr[0]

      if (offsetFlag === 'true') {
        indx -= pageObjects[wizardName][accordionName][tableName].offset
      }

      await hoverComponent(
        this.page,
        pageObjects[wizardName][accordionName][tableName]['tableFields'][column](indx + 1)
      )
      await clickOnComponent(
        this.page,
        pageObjects[wizardName][accordionName][tableName]['tableFields'][field](indx + 1)
      )
    }
  }
)

Then(
  'value in {string} column with {string} in {string} on {string} wizard should contains {string} in {string}',
  async function (column, type, table, wizard, substring, overlay) {
    if (type === 'dropdowns') {
      await isContainsSubstringInColumnDropdownCellsOverlay(
        this.page,
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
  async function (componentName, wizardName, value) {
    await verifyComponentContainsAttributeValue(
      this.page,
      pageObjects[wizardName][componentName],
      'value',
      value
    )
  }
)

// "value in ... should contains" requires every value of the column to contain the substring; this one - at least one
// value, for the tables whose rows differ by design (e.g. the status of the only aborted job among the other ones)
Then(
  'at least one value in {string} column with {string} in {string} on {string} wizard should contains {string}',
  async function (column, type, table, wizard, substring) {
    const checks = {
      text: isContainsSubstringInColumnCells,
      attribute: isContainsSubstringInColumnAttributeCells,
      tooltip: isContainsSubstringInColumnTooltipCells
    }

    expect(Object.keys(checks), `"${type}" type is not supported`).toContain(type)

    await checks[type](this.page, pageObjects[wizard][table], column, substring, true)
  }
)

Then(
  'value in {string} column with {string} in {string} on {string} wizard should contains {string}',
  async function (column, type, table, wizard, substring) {
    if (type === 'attribute') {
      await isContainsSubstringInColumnAttributeCells(
        this.page,
        pageObjects[wizard][table],
        column,
        substring
      )
    }

    if (type === 'attribute_list') {
      await isContainsSubstringInColumnAttributeListCells(
        this.page,
        pageObjects[wizard][table],
        column,
        substring
      )
    }

    if (type === 'text') {
      await isContainsSubstringInColumnCells(
        this.page,
        pageObjects[wizard][table],
        column,
        substring
      )
    }

    if (type === 'dropdowns') {
      await isContainsSubstringInColumnDropdownCells(
        this.page,
        pageObjects[wizard][table],
        column,
        substring
      )
    }

    if (type === 'tooltip') {
      await isContainsSubstringInColumnTooltipCells(
        this.page,
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
        this.page,
        pageObjects[wizard][accordion][table],
        column,
        substring
      )
    }

    if (type === 'dropdowns') {
      await isContainsSubstringInColumnDropdownCells(
        this.page,
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
      this.page,
      pageObjects[wizard][table],
      columnName,
      kindName
    )
    const indx = arr[0]
    const actionMenuSel = await getCellByIndexColumn(
      this.page,
      pageObjects[wizard][table],
      indx,
      'action_menu'
    )

    await hoverComponent(
      this.page,
      pageObjects[wizard][table]['tableFields'][columnName](indx)['label']
    )
    await this.page.waitForTimeout(500)
    await openActionMenu(this.page, actionMenuSel)
    await this.page.waitForTimeout(500)
    await checkActionMenuOptions(
      this.page,
      pageObjects[wizard][table]['tableFields']['action_menu'](indx),
      pageObjectsConsts[constWizard][constValue]
    )
  }
)

Then(
  'verify action menu on {string} wizard in {string} table with {string} value in {string} column should contains {string}.{string}',
  async function (wizard, table, value, column, constWizard, constValue) {
    const arr = await waitForRowIndexesByColumnValue(
      this.page,
      pageObjects[wizard][table],
      column,
      value
    )
    const indx = arr[0]
    const actionMenuSel = await getCellByIndexColumn(
      this.page,
      pageObjects[wizard][table],
      indx,
      'action_menu'
    )

    await hoverComponent(this.page, pageObjects[wizard][table]['tableFields'][column](indx))
    await this.page.waitForTimeout(500)
    await openActionMenu(this.page, actionMenuSel)
    await this.page.waitForTimeout(500)
    await checkActionMenuOptions(
      this.page,
      pageObjects[wizard][table]['tableFields']['action_menu'](indx),
      pageObjectsConsts[constWizard][constValue]
    )
  }
)

Then(
  'verify action menu on {string} wizard in {string} table with {string} value in {string} column should contains {string}.{string} without scroll',
  async function (wizard, table, value, column, constWizard, constValue) {
    const arr = await waitForRowIndexesByColumnValue(
      this.page,
      pageObjects[wizard][table],
      column,
      value
    )
    const indx = arr[0]
    const actionMenuSel = await getCellByIndexColumn(
      this.page,
      pageObjects[wizard][table],
      indx,
      'action_menu'
    )

    await hoverComponent(this.page, pageObjects[wizard][table]['tableFields'][column](indx), false)
    await this.page.waitForTimeout(500)
    await openActionMenu(this.page, actionMenuSel)
    await this.page.waitForTimeout(500)
    await checkActionMenuOptions(
      this.page,
      pageObjects[wizard][table]['tableFields']['action_menu'](indx),
      pageObjectsConsts[constWizard][constValue]
    )
  }
)

Then(
  'verify that in action menu on {string} wizard in {string} table with {string} value in {string} column {string} option is enabled',
  async function (wizard, table, value, column, option) {
    const arr = await waitForRowIndexesByColumnValue(
      this.page,
      pageObjects[wizard][table],
      column,
      value
    )
    const indx = arr[0]
    const actionMenuSel = await getCellByIndexColumn(
      this.page,
      pageObjects[wizard][table],
      indx,
      'action_menu'
    )

    await hoverComponent(this.page, pageObjects[wizard][table]['tableFields'][column](indx))
    await this.page.waitForTimeout(500)
    await openActionMenu(this.page, actionMenuSel)
    await this.page.waitForTimeout(500)
    await verifyOptionInActionMenuEnabled(this.page, actionMenuSel, option)
  }
)

Then(
  'verify that in action menu on {string} wizard in {string} table with {string} value in {string} column {string} option is disabled',
  async function (wizard, table, value, column, option) {
    const arr = await waitForRowIndexesByColumnValue(
      this.page,
      pageObjects[wizard][table],
      column,
      value
    )
    const indx = arr[0]
    const actionMenuSel = await getCellByIndexColumn(
      this.page,
      pageObjects[wizard][table],
      indx,
      'action_menu'
    )

    await hoverComponent(this.page, pageObjects[wizard][table]['tableFields'][column](indx))
    await this.page.waitForTimeout(500)
    await openActionMenu(this.page, actionMenuSel)
    await this.page.waitForTimeout(500)
    await verifyOptionInActionMenuDisabled(this.page, actionMenuSel, option)
  }
)

Then(
  'verify {string} option is present on {string} wizard in {string} table with {string} value in {string} column',
  async function (option, wizard, table, value, column) {
    const arr = await waitForRowIndexesByColumnValue(
      this.page,
      pageObjects[wizard][table],
      column,
      value
    )
    const indx = arr[0]
    const actionMenuSel = await getCellByIndexColumn(
      this.page,
      pageObjects[wizard][table],
      indx,
      option
    )

    await hoverComponent(this.page, pageObjects[wizard][table]['tableFields'][column](indx), false)
    await this.page.waitForTimeout(500)
    await componentIsPresent(this.page, actionMenuSel)
  }
)

Then(
  'verify {string} option on {string} wizard in {string} table with {string} value in {string} column should display hover tooltip {string}.{string} with scroll {string}',
  async function (option, wizard, table, value, column, constStorage, constValue, scroll) {
    const arr = await waitForRowIndexesByColumnValue(
      this.page,
      pageObjects[wizard][table],
      column,
      value
    )
    const indx = arr[0]
    const actionMenuSel = await getCellByIndexColumn(
      this.page,
      pageObjects[wizard][table],
      indx,
      option
    )

    await hoverComponent(
      this.page,
      pageObjects[wizard][table]['tableFields'][column](indx),
      ...(scroll === 'false' ? [false] : [])
    )
    await this.page.waitForTimeout(500)
    await checkComponentHintTextWithHover(
      this.page,
      actionMenuSel,
      pageObjects['commonPagesHeader']['Common_Tolltip'],
      pageObjectsConsts[constStorage][constValue]
    )
  }
)

Then(
  'verify that {string} type is displayed in {string} kind on {string} wizard in {string} table with {string} value in {string} column',
  async function (type, kind, wizard, table, value, column) {
    const arr = await waitForRowIndexesByColumnValue(
      this.page,
      pageObjects[wizard][table],
      column,
      value
    )
    const indx = arr[0]
    const tabelCell = await getCellByIndexColumn(this.page, pageObjects[wizard][table], indx, kind)

    await hoverComponent(this.page, tabelCell['label'])
    await verifyText(this.page, tabelCell['hint'], type)
  }
)

Then(
  'click on {string} option on {string} wizard in {string} table with {string} value in {string} column with scroll {string}',
  async function (option, wizard, table, value, column, scroll) {
    const arr = await waitForRowIndexesByColumnValue(
      this.page,
      pageObjects[wizard][table],
      column,
      value
    )
    const indx = arr[0]
    const actionMenuSel = await getCellByIndexColumn(
      this.page,
      pageObjects[wizard][table],
      indx,
      option
    )

    await hoverComponent(
      this.page,
      pageObjects[wizard][table]['tableFields'][column](indx),
      ...(scroll === 'false' ? [false] : [])
    )
    await this.page.waitForTimeout(250)
    await clickOnComponent(this.page, actionMenuSel)
    await this.page.waitForTimeout(500)
  }
)

Then(
  'subtable column {string} in {string} in {string} on {string} wizard should contains {string} in {string} column',
  async function (subTable, table, accordion, wizard, subString, subColumn) {
    const numOfRows = await getTableRows(this.page, pageObjects[wizard][accordion][table])

    for (let i = 1; i <= numOfRows; i++) {
      const cellTable = await getCellByIndexColumn(
        this.page,
        pageObjects[wizard][accordion][table],
        i,
        subTable
      )

      await isContainsSubstringInColumnCells(this.page, cellTable, subColumn, subString)
    }
  }
)

When(
  'expand each row in {string} in {string} on {string} wizard',
  async function (table, accordion, wizard) {
    const numOfRows = await getTableRows(this.page, pageObjects[wizard][accordion][table])

    for (let i = 1; i <= numOfRows; i++) {
      const expandBtn = await getCellByIndexColumn(
        this.page,
        pageObjects[wizard][accordion][table],
        i,
        'expand_btn'
      )

      await clickOnComponent(this.page, expandBtn)
    }
  }
)

When(
  'expand row with {string} at {string} in {string} in {string} on {string} wizard',
  async function (value, column, table, accordion, wizard) {
    // TODO: without creating link to the table component step works unstable
    await this.page.waitForTimeout(500)
    const tableElement = pageObjects[wizard][accordion][table]
    const arr = await waitForRowIndexesByColumnValue(this.page, tableElement, column, value)
    const indx = arr[0]
    const expandBtn = await getCellByIndexColumn(this.page, tableElement, indx, 'expand_btn')

    await clickOnComponent(this.page, expandBtn)
  }
)

When(
  'select {string} in subcolumn {string} at {string} column in {string} row by {string} at {string} in {string} on {string} wizard',
  async function (value, subColumn, subTable, rowValue, searchColumn, table, accordion, wizard) {
    const arr = await waitForRowIndexesByColumnValue(
      this.page,
      pageObjects[wizard][accordion][table],
      searchColumn,
      rowValue
    )
    const indx = arr[0]
    const cellTable = await getCellByIndexColumn(
      this.page,
      pageObjects[wizard][accordion][table],
      indx,
      subTable
    )
    const subArr = await waitForRowIndexesByColumnValue(this.page, cellTable, searchColumn, value)
    const subIndx = subArr[0]
    const option = await getCellByIndexColumn(this.page, cellTable, subIndx, subColumn)

    await clickOnComponent(this.page, option)
  }
)

Then(
  'value in {string} column in {string} on {string} wizard should be from {string} to {string}',
  async function (column, table, wizard, fromDateTime, toDateTime) {
    await isDatetimeCelsValueInRange(
      this.page,
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
    const arr = await waitForRowIndexesByColumnValue(
      this.page,
      pageObjects[wizard][table],
      columnName,
      value
    )
    const indx = arr[0]

    await clickOnComponent(this.page, pageObjects[wizard][table]['tableFields'][columnName](indx))
  }
)

When(
  'click on row root with value {string} in {string} column in {string} table on {string} wizard',
  async function (value, columnName, table, wizard) {
    const arr = await waitForRowIndexesByColumnValue(
      this.page,
      pageObjects[wizard][table],
      columnName,
      value
    )
    const indx = arr[0]

    await clickOnComponent(this.page, pageObjects[wizard][table]['rowRoot'](indx))
  }
)

When(
  'click on row root with value {string} in {string} column in {string} table in {string} on {string} wizard',
  async function (value, columnName, table, accordion, wizard) {
    const arr = await waitForRowIndexesByColumnValue(
      this.page,
      pageObjects[wizard][accordion][table],
      columnName,
      value
    )
    const indx = arr[0]

    await clickOnComponent(this.page, pageObjects[wizard][accordion][table]['rowRoot'](indx))
  }
)

When(
  'click on cell with row index {int} in {string} column in {string} table on {string} wizard',
  async function (indx, columnName, table, wizard) {
    const cell = pageObjects[wizard][table]['tableFields'][columnName](indx)

    // the table is rendered after the data is fetched, `wait load page` can pass before the loader appears
    await waiteUntilComponent(this.page, cell)
    await clickOnComponent(this.page, cell)
  }
)

Then(
  'hover on cell with row index {int} in {string} column in {string} table on {string} wizard',
  async function (indx, columnName, table, wizard) {
    await hoverComponent(
      this.page,
      pageObjects[wizard][table]['tableFields'][columnName](indx),
      false
    )
  }
)

Then(
  'verify that row index {int} is active in {string} table on {string} wizard',
  async function (indx, table, wizard) {
    await isRowActive(this.page, pageObjects[wizard][table], indx)
  }
)

Then(
  'verify that row index {int} is NOT active in {string} table on {string} wizard',
  async function (indx, table, wizard) {
    await isRowActive(this.page, pageObjects[wizard][table], indx, false)
  }
)

When(
  'add new volume rows to {string} table in {string} on {string} wizard using nontable inputs',
  async function (tableName, accordionName, wizardName, dataTable) {
    const pageComponents = dataTable.raw()[0]
    const rows = dataTable.rows()

    for (const row of rows) {
      await clickOnComponent(
        this.page,
        pageObjects[wizardName][accordionName][tableName]['add_row_btn']
      )

      for (let indx = 0; indx < pageComponents.length; indx++) {
        if (pageComponents[indx].includes('Dropdown')) {
          await scrollToElement(
            this.page,
            pageObjects[wizardName][accordionName][pageComponents[indx]].root
          )
          await openDropdown(
            this.page,
            pageObjects[wizardName][accordionName][pageComponents[indx]]
          )
          await selectOptionInDropdown(
            this.page,
            pageObjects[wizardName][accordionName][pageComponents[indx]],
            row[indx]
          )
          await this.page.waitForTimeout(500)
          await checkDropdownSelectedOption(
            this.page,
            pageObjects[wizardName][accordionName][pageComponents[indx]],
            row[indx]
          )
        }

        if (pageComponents[indx].includes('Input')) {
          await typeValue(
            this.page,
            pageObjects[wizardName][accordionName][pageComponents[indx]],
            row[indx]
          )
        }

        if (pageComponents[indx].includes('Button')) {
          if (row[indx] === 'yes') {
            await hoverComponent(
              this.page,
              pageObjects[wizardName][accordionName][pageComponents[indx]],
              true
            )
            await clickOnComponent(
              this.page,
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
    const pageComponents = dataTable.raw()[0]
    const rows = dataTable.rows()

    for (const row of rows) {
      await clickOnComponent(this.page, pageObjects[wizardName][tableName]['add_row_btn'])
      for (const indx in pageComponents) {
        if (pageComponents[indx].includes('Dropdown')) {
          await openDropdown(this.page, pageObjects[wizardName][pageComponents[indx]])
          await selectOptionInDropdown(
            this.page,
            pageObjects[wizardName][pageComponents[indx]],
            row[indx]
          )
          await this.page.waitForTimeout(500)
          await checkDropdownSelectedOption(
            this.page,
            pageObjects[wizardName][pageComponents[indx]],
            row[indx]
          )
        }

        if (pageComponents[indx].includes('Input')) {
          await typeValue(this.page, pageObjects[wizardName][pageComponents[indx]], row[indx])
          await this.page.waitForTimeout(250)
        }

        if (pageComponents[indx].includes('Button')) {
          if (row[indx] === 'yes') {
            await clickOnComponent(this.page, pageObjects[wizardName][pageComponents[indx]])
            await this.page.waitForTimeout(250)
          }
        }
      }
    }
  }
)

When(
  'add new rows to {string} table on {string} wizard using nontable inputs with notification pop-up',
  async function (tableName, wizardName, dataTable) {
    const pageComponents = dataTable.raw()[0]
    const rows = dataTable.rows()

    for (const row of rows) {
      await clickOnComponent(this.page, pageObjects[wizardName][tableName]['add_row_btn'])
      for (const indx in pageComponents) {
        if (pageComponents[indx].includes('Dropdown')) {
          await openDropdown(this.page, pageObjects[wizardName][pageComponents[indx]])
          await selectOptionInDropdown(
            this.page,
            pageObjects[wizardName][pageComponents[indx]],
            row[indx]
          )
          await this.page.waitForTimeout(500)
          await checkDropdownSelectedOption(
            this.page,
            pageObjects[wizardName][pageComponents[indx]],
            row[indx]
          )
        }

        if (pageComponents[indx].includes('Input')) {
          await typeValue(this.page, pageObjects[wizardName][pageComponents[indx]], row[indx])
          await this.page.waitForTimeout(500)
        }

        if (pageComponents[indx].includes('Button')) {
          if (row[indx] === 'yes') {
            await clickOnComponent(this.page, pageObjects[wizardName][pageComponents[indx]])
            await this.page.waitForTimeout(500)
          }
        }

        if (pageComponents[indx].includes('Add')) {
          if (row[indx] === 'yes') {
            await this.page.waitForTimeout(500)
            await waiteUntilComponent(
              this.page,
              pageObjects['Notification_Popup']['Notification_Pop_Up_Cross_Close_Button']
            )
            await clickOnComponent(
              this.page,
              pageObjects['Notification_Popup']['Notification_Pop_Up_Cross_Close_Button']
            )
            await this.page.waitForTimeout(500)
          }
        }
      }
    }
  }
)

When(
  'click on {string} in action menu in {string} table in {string} on {string} wizard',
  async function (option, tableName, accordionName, wizardName, dataTable) {
    const column = dataTable.raw()[0][0]
    const rows = dataTable.rows()

    for (const row_indx in rows) {
      const arr = await waitForRowIndexesByColumnValue(
        this.page,
        pageObjects[wizardName][accordionName][tableName],
        column,
        rows[row_indx][0]
      )
      const indx = arr[0] - pageObjects[wizardName][accordionName][tableName].offset
      const cell = await getCellByIndexColumn(
        this.page,
        pageObjects[wizardName][accordionName][tableName],
        indx,
        column
      )
      const actionMenuSel = await getCellByIndexColumn(
        this.page,
        pageObjects[wizardName][accordionName][tableName],
        indx,
        'action_menu'
      )

      await hoverComponent(this.page, cell)
      await this.page.waitForTimeout(500)
      await openActionMenu(this.page, actionMenuSel)
      await this.page.waitForTimeout(500)
      await selectOptionInActionMenu(this.page, actionMenuSel, option)
      await this.page.waitForTimeout(500)
    }
  }
)

When(
  'click on {string} in action menu in {string} table in {string} on {string} wizard with offset {string}',
  async function (option, tableName, accordionName, wizardName, offsetFlag, dataTable) {
    const column = dataTable.raw()[0][0]
    const rows = dataTable.rows()

    for (const row_indx in rows) {
      const arr = await waitForRowIndexesByColumnValue(
        this.page,
        pageObjects[wizardName][accordionName][tableName],
        column,
        rows[row_indx][0]
      )
      let indx = arr[0]

      if (offsetFlag === 'true') {
        indx -= pageObjects[wizardName][accordionName][tableName].offset
      }

      const cell = await getCellByIndexColumn(
        this.page,
        pageObjects[wizardName][accordionName][tableName],
        indx,
        column
      )
      const actionMenuSel = await getCellByIndexColumn(
        this.page,
        pageObjects[wizardName][accordionName][tableName],
        indx,
        'action_menu'
      )

      await hoverComponent(this.page, cell)
      await this.page.waitForTimeout(500)
      await openActionMenu(this.page, actionMenuSel)
      await this.page.waitForTimeout(500)
      await selectOptionInActionMenu(this.page, actionMenuSel, option)
      await this.page.waitForTimeout(500)
    }
  }
)

Then(
  'verify that {int} row elements are displayed in {string} on {string} wizard',
  async function (rowElement, tableName, wizardName) {
    // retried: the table can still be re-rendering (filtering, scrolling) when the step starts
    await retryAssertion(async () => {
      const rowsNumber = await getTableRows(this.page, pageObjects[wizardName][tableName])

      expect(
        rowsNumber,
        `${rowsNumber} row elements are not equal expected ${rowElement} row elements`
      ).toBe(rowElement)
    })
  }
)

Then(
  'check {string} visibility in {string} on {string} wizard with {int} offset',
  async function (cellName, tableName, wizardName, indexOffset) {
    const rowsNumber = await waitForTableRows(this.page, pageObjects[wizardName][tableName])

    for (let i = 0; i < rowsNumber; i++) {
      await componentIsVisible(
        this.page,
        pageObjects[wizardName][tableName].tableFields[cellName](i + 1 + indexOffset)
      )
    }
  }
)

Then(
  'check {string} not presented in {string} on {string} wizard',
  async function (cellName, tableName, wizardName) {
    const rowsNumber = await waitForTableRows(this.page, pageObjects[wizardName][tableName])

    for (let i = 0; i < rowsNumber; i++) {
      await componentIsNotPresent(
        this.page,
        pageObjects[wizardName][tableName].tableFields[cellName](i + 1)
      )
    }
  }
)

Then(
  'check {string} not visible in {string} on {string} wizard',
  async function (cellName, tableName, wizardName) {
    const rowsNumber = await waitForTableRows(this.page, pageObjects[wizardName][tableName])

    for (let i = 0; i < rowsNumber; i++) {
      await componentIsNotVisible(
        this.page,
        pageObjects[wizardName][tableName].tableFields[cellName](i + 1)
      )
    }
  }
)

When(
  'click on node with index {int} in {string} graph on {string} wizard',
  async function (index, graphName, wizardName) {
    await panGraphToElement(
      this.page,
      pageObjects[wizardName][graphName].root,
      pageObjects[wizardName][graphName].nodesTable.tableFields['name'](index)
    )
    await clickOnComponent(
      this.page,
      pageObjects[wizardName][graphName].nodesTable.tableFields['name'](index)
    )
    await this.page.waitForTimeout(350)
    await isComponentContainsClass(
      this.page,
      pageObjects[wizardName][graphName].nodesTable.rowRoot(index),
      'selected'
    )
  }
)

When(
  'click on node with index {int} in {string} column in {string} graph on {string} wizard',
  async function (index, column, graphName, wizard) {
    await clickOnComponent(
      this.page,
      pageObjects[wizard][graphName].nodesTable.tableFields[column](index)
    )
    await this.page.waitForTimeout(250)
    await isComponentContainsClass(
      this.page,
      pageObjects[wizard][graphName].nodesTable.rowRoot(index),
      'selected'
    )
  }
)

When(
  'save to context {string} column and {string} attribute on {int} row from {string} table on {string} wizard',
  async function (columnName, attributeName, rowIndex, tableName, wizardName) {
    await putToTestContextCellParameters(
      this.page,
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
      this.page,
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
    const arr = await waitForRowIndexesByColumnValue(
      this.page,
      pageObjects[wizardName][overviewTable],
      keyName,
      keyValue
    )
    const index = arr[0]

    await putToTestContextCellParameters(
      this.page,
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
    const arr = await waitForRowIndexesByColumnValue(
      this.page,
      pageObjects[wizardName][overviewTable],
      'key',
      nameValue
    )
    const index = arr[0]

    await clickOnComponent(
      this.page,
      pageObjects[wizardName][overviewTable].tableFields[fieldType](index)
    )
  }
)

Then(
  'verify {string} values {string} values from {string} on {string} with {string} context value',
  async function (keyColumn, keys, overviewTable, wizardName, contextContainer) {
    const keysArr = keys.split(',')

    for (let key of keysArr) {
      const arr = await waitForRowIndexesByColumnValue(
        this.page,
        pageObjects[wizardName][overviewTable],
        keyColumn,
        key
      )
      const cellComponent = this.page
        .locator(pageObjects[wizardName][overviewTable].tableFields['value'](arr[0]))
        .first()
      const cellValue = await getText(cellComponent)

      expect(
        this.testContext[contextContainer].includes(cellValue),
        `"${key}" value "${cellValue}" is not in link "${this.testContext[
          contextContainer
        ].includes(cellValue)}"`
      ).toBe(true)
    }
  }
)

Then(
  'verify {string} values {string} values from {string} on {string} with {string} context value with split',
  async function (keyColumn, keys, overviewTable, wizardName, contextContainer) {
    const keysArr = keys.split(',')

    for (let key of keysArr) {
      const arr = await waitForRowIndexesByColumnValue(
        this.page,
        pageObjects[wizardName][overviewTable],
        keyColumn,
        key
      )
      const cellComponent = this.page
        .locator(pageObjects[wizardName][overviewTable].tableFields['value'](arr[0]))
        .first()
      const cellValue = await getText(cellComponent)
      const contextSplit = this.testContext[contextContainer].split(/[/@]/)

      expect(
        contextSplit.includes(cellValue),
        `"${key}" value "${cellValue}" is not in link "${contextSplit}"`
      ).toBe(true)
    }
  }
)

Then(
  'verify cell with {string} value in {string} column in {string} table on {string} wizard should display {string}.{string}',
  async function (fieldName, columnName, tableName, wizardName, constStorage, constValue) {
    const arr = await waitForRowIndexesByColumnValue(
      this.page,
      pageObjects[wizardName][tableName],
      columnName,
      fieldName
    )
    const indx = arr[0]

    await checkCellHintText(
      this.page,
      pageObjects[wizardName][tableName],
      pageObjects['commonPagesHeader']['Common_Hint'],
      pageObjectsConsts[constStorage][constValue],
      indx
    )
  }
)
