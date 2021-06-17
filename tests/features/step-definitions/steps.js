import { Given, When, Then } from '@cucumber/cucumber'
import pageObjects from '../common/page-objects'
import pageObjectsConsts from '../common-tools/common-consts'
import { test_url, test_port } from '../../config'
import {
  navigateToPage,
  waiteUntilComponent,
  clickOnComponent,
  componentIsPresent,
  componentIsVisible,
  verifyText,
  waitPageLoad,
  deleteAPIMLProject,
  createAPIMLProject,
  isComponentContainsAttributeValue,
  collapseAccorditionSection,
  isAccorditionSectionCollapsed,
  clickNearComponent,
  typeIntoInputField
} from '../common/actions/common.action'
import {
  isContainsValueInColumn,
  isNotContainsValueInColumn,
  findRowIndexesByColumnValue,
  getCellByIndexColumn,
  isTableColumnSorted,
  checkTableColumnValues
} from '../common/actions/table.action'
import {
  openActionMenu,
  selectOptionInActionMenu
} from '../common/actions/action-menu.action'
import {
  openDropdown,
  selectOptionInDropdown,
  checkDropdownSelectedOption,
  checkDropdownOptions
} from '../common/actions/dropdown.action'
import { isTabActive } from '../common/actions/tab-selector.action'
import {
  typeValue,
  checkHintText,
  verifyTypedValue,
  checkWarningHintText
} from '../common/actions/input-group.action'
import {
  checkCheckbox,
  isCheckboxUnchecked,
  isCheckboxChecked
} from '../common/actions/checkbox.action'

import { isRadioButtonSelected } from '../common/actions/radio-button.action'

Given('open url', async function() {
  await navigateToPage(this.driver, `http://${test_url}:${test_port}`)
})

When('turn on demo mode', async function() {
  const url = await this.driver.getCurrentUrl()
  await navigateToPage(this.driver, `${url}?demo=true`)
})

Then('wait load page', async function() {
  await waitPageLoad(this.driver, pageObjects['commonPagesHeader']['loader'])
})

Then('click on {string} element on {string} wizard', async function(
  component,
  wizard
) {
  await waiteUntilComponent(this.driver, pageObjects[wizard][component])
  await clickOnComponent(this.driver, pageObjects[wizard][component])
})

Then('verify if {string} popup dialog appears', async function(popup) {
  await waiteUntilComponent(this.driver, pageObjects[popup]['Title'])
  await this.driver.sleep(250)
  await componentIsPresent(this.driver, pageObjects[popup]['Title'])
  await componentIsVisible(this.driver, pageObjects[popup]['Title'])
})

Then(
  'type into {string} on {string} popup dialog {string} value',
  async function(component, wizard, value) {
    await typeValue(this.driver, pageObjects[wizard][component], value)
    await verifyTypedValue(this.driver, pageObjects[wizard][component], value)
  }
)

Then('type value {string} to {string} field on {string} wizard', async function(
  value,
  inputField,
  wizard
) {
  await typeValue(this.driver, pageObjects[wizard][inputField], value)
  await verifyTypedValue(this.driver, pageObjects[wizard][inputField], value)
})

Then(
  'type value {string} to {string} field on {string} on {string} wizard',
  async function(value, inputField, accordion, wizard) {
    await typeValue(
      this.driver,
      pageObjects[wizard][accordion][inputField],
      value
    )
    await verifyTypedValue(
      this.driver,
      pageObjects[wizard][accordion][inputField],
      value
    )
  }
)

Then(
  '{string} component on {string} should contains {string}.{string}',
  async function(component, wizard, constStorage, constValue) {
    await waiteUntilComponent(this.driver, pageObjects[wizard][component])
    await verifyText(
      this.driver,
      pageObjects[wizard][component],
      pageObjectsConsts[constStorage][constValue]
    )
  }
)

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
  'select {string} option in {string} dropdown on {string} wizard',
  async function(option, dropdown, wizard) {
    await openDropdown(this.driver, pageObjects[wizard][dropdown])
    await selectOptionInDropdown(
      this.driver,
      pageObjects[wizard][dropdown],
      option
    )
    await this.driver.sleep(500)
    await checkDropdownSelectedOption(
      this.driver,
      pageObjects[wizard][dropdown],
      option
    )
  }
)

Then(
  'verify {string} element in {string} on {string} wizard should contains {string}.{string}',
  async function(dropdown, accordion, wizard, constStorage, constValue) {
    await openDropdown(this.driver, pageObjects[wizard][accordion][dropdown])
    await checkDropdownOptions(
      this.driver,
      pageObjects[wizard][accordion][dropdown],
      pageObjectsConsts[constStorage][constValue]
    )
    // close dropdown options
    await clickNearComponent(
      this.driver,
      pageObjects[wizard][accordion][dropdown]['open_button']
    )
  }
)

Then('verify {string} element visibility on {string} wizard', async function(
  component,
  wizard
) {
  await componentIsVisible(this.driver, pageObjects[wizard][component])
})

Then(
  'verify {string} element visibility in {string} on {string} wizard',
  async function(component, accordion, wizard) {
    await componentIsVisible(
      this.driver,
      pageObjects[wizard][accordion][component]
    )
  }
)

When('collapse {string} on {string} wizard', async function(accordion, wizard) {
  collapseAccorditionSection(
    this.driver,
    pageObjects[wizard][accordion]['Collapse_Button']
  )
  await this.driver.sleep(100)
})

Then('verify {string} is collapsed on {string} wizard', async function(
  accordion,
  wizard
) {
  await isAccorditionSectionCollapsed(
    this.driver,
    pageObjects[wizard][accordion]['Collapse_Button']
  )
})

Then('sort projects in ascending order', async function() {
  const upSorted = await isComponentContainsAttributeValue(
    this.driver,
    pageObjects['Projects']['Projects_Sorter'],
    'class',
    'sort_up'
  )
  if (upSorted) {
    await isTableColumnSorted(
      this.driver,
      pageObjects['Projects']['Projects_Table'],
      'name'
    )
  }
})

Then('sort projects in descending order', async function() {
  const downSorted = await isComponentContainsAttributeValue(
    this.driver,
    pageObjects['Projects']['Projects_Sorter'],
    'class',
    'sort_down'
  )
  if (!downSorted) {
    clickOnComponent(this.driver, pageObjects['Projects']['Projects_Sorter'])
  }
  await isTableColumnSorted(
    this.driver,
    pageObjects['Projects']['Projects_Table'],
    'name',
    'desc'
  )
})

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

Then(
  'verify {string} tab is activ in {string} on {string} wizard',
  async function(tabName, tabSelector, wizard) {
    const arr = await findRowIndexesByColumnValue(
      this.driver,
      pageObjects[wizard][tabSelector],
      'tab',
      tabName
    )
    const indx = arr[0]
    await isTabActive(this.driver, pageObjects[wizard][tabSelector], indx)
  }
)

Then(
  'verify {string} on {string} wizard should contains {string}.{string}',
  async function(tabSelector, wizard, constWizard, constValue) {
    await checkTableColumnValues(
      this.driver,
      pageObjects[wizard][tabSelector],
      'tab',
      pageObjectsConsts[constWizard][constValue]
    )
  }
)

When('select {string} tab in {string} on {string} wizard', async function(
  tabName,
  tabSelector,
  wizard
) {
  const arr = await findRowIndexesByColumnValue(
    this.driver,
    pageObjects[wizard][tabSelector],
    'tab',
    tabName
  )
  const indx = arr[0]
  await clickOnComponent(
    this.driver,
    pageObjects[wizard][tabSelector]['tableFields']['tab'](indx)
  )
})

Then(
  'verify {string} on {string} wizard should display {string}.{string}',
  async function(inputField, wizard, constStorage, constValue) {
    await checkHintText(
      this.driver,
      pageObjects[wizard][inputField],
      pageObjects['commonPagesHeader']['Common_Hint'],
      pageObjectsConsts[constStorage][constValue]
    )
  }
)

Then(
  'verify {string} on {string} wizard should display warning {string}.{string}',
  async function(input, wizard, constStorage, constValue) {
    await clickOnComponent(
      this.driver,
      pageObjects[wizard][input]['inputField']
    )
    await clickNearComponent(
      this.driver,
      pageObjects[wizard][input]['inputField']
    )
    await checkWarningHintText(
      this.driver,
      pageObjects[wizard][input],
      pageObjects[wizard][input]['warningText'],
      pageObjectsConsts[constStorage][constValue]
    )
  }
)

Then(
  'verify {string} element in {string} on {string} wizard should display warning {string}.{string}',
  async function(input, accordion, wizard, constStorage, constValue) {
    await clickOnComponent(
      this.driver,
      pageObjects[wizard][accordion][input]['inputField']
    )
    await clickNearComponent(
      this.driver,
      pageObjects[wizard][accordion][input]['inputField']
    )
    await checkWarningHintText(
      this.driver,
      pageObjects[wizard][accordion][input],
      pageObjects[wizard][accordion][input]['warningText'],
      pageObjectsConsts[constStorage][constValue]
    )
  }
)

When('check {string} element in {string} on {string} wizard', async function(
  checkbox,
  accordion,
  wizard
) {
  await checkCheckbox(this.driver, pageObjects[wizard][accordion][checkbox])
})

Then(
  '{string} element should be unchecked in {string} on {string} wizard',
  async function(checkbox, accordion, wizard) {
    await isCheckboxUnchecked(
      this.driver,
      pageObjects[wizard][accordion][checkbox]
    )
  }
)

Then(
  '{string} element should be checked in {string} on {string} wizard',
  async function(checkbox, accordion, wizard) {
    await isCheckboxChecked(
      this.driver,
      pageObjects[wizard][accordion][checkbox]
    )
  }
)

Then('is {string} on {string} selected', async function(radiobutton, wizard) {
  await isRadioButtonSelected(this.driver, pageObjects[wizard][radiobutton])
})

Then('remove {string} MLRun Project with code {int}', async function(
  nameProject,
  status
) {
  await deleteAPIMLProject(nameProject, status)
})

When('create {string} MLRun Project with code {int}', async function(
  nameProject,
  status
) {
  await createAPIMLProject(nameProject, status)
  await this.driver.sleep(2000)
})
