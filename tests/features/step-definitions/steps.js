import { Given, When, Then } from '@cucumber/cucumber'
import pageObjects from '../common/page-objects'
import { test_url, test_port } from '../../config'
import {
  navigateToPage,
  waiteUntilComponent,
  clickOnComponent,
  componentIsPresent,
  componentIsVisible,
  typeIntoInputField,
  verifyTypedText,
  waitPageLoad,
  deleteAPIMLProject,
  createAPIMLProject
} from '../common/actions/common.action'
import {
  isContainsValueInColumn,
  isNotContainsValueInColumn,
  findRowIndexesByColumnValue,
  getCellByIndexColumn
} from '../common/actions/table.action'
import {
  openActionMenu,
  selectOptionInActionMenu
} from '../common/actions/action-menu.action'
import {
  openDropdown,
  selectOptionInDropdown,
  checkDropdownSelectedOption
} from '../common/actions/dropdown.action'

Given('open url', async function() {
  await navigateToPage(this.driver, 'http://' + test_url + ':' + test_port)
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
  await componentIsPresent(this.driver, pageObjects[popup]['Title'])
  await componentIsVisible(this.driver, pageObjects[popup]['Title'])
})

Then(
  'type into {string} on {string} popup dialog {string} value',
  async function(component, wizard, value) {
    await typeIntoInputField(this.driver, pageObjects[wizard][component], value)
    await verifyTypedText(this.driver, pageObjects[wizard][component], value)
  }
)

Then(
  'check {string} value in {string} column in {string} table on {string} wizard',
  async function(value, column, table, wizard) {
    await waitPageLoad(this.driver, pageObjects[wizard]['loader'])
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
    await waitPageLoad(this.driver, pageObjects[wizard]['loader'])
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
    const indx = await findRowIndexesByColumnValue(
      this.driver,
      pageObjects[wizard][table],
      column,
      value
    ).then(async function(arr) {
      return arr[0]
    })
    let actionMenuSel = await getCellByIndexColumn(
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
    let actionMenuSel = await getCellByIndexColumn(
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
