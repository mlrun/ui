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
// The steps of the scenarios that run the app in ORIS (Module Federation) mode, where project changes go to the leader
// (Orca) and its authorization service: see tests/features/common/actions/oris.actions.js
import { expect } from '@playwright/test'
import { Given, When, Then } from '../support/world.js'
import { test_port, test_url } from '../../config.js'
import { waitForPageQuiet } from '../common-tools/element.js'
import { navigateToPage } from '../common/actions/common.action.js'
import {
  ORCA_DESIRED_STATES,
  addLeaderProjectMembers,
  createLeaderProject,
  enableOrisMode,
  getLeaderProject,
  getLeaderProjectMembers,
  recordLeaderProjectUpdates,
  transferLeaderProjectOwner,
  verifyOrisApiProxy
} from '../common/actions/oris.actions.js'

const OWNER_NAME = '.settings__owner-row .row-name'
const OWNER_SEARCH_INPUT = '.change-owner input'
const DESCRIPTION_TEXTAREA = 'textarea#description'

const getMemberRow = (page, member) =>
  page.locator('.members-table .table-row', {
    has: page.locator('.member-name', { hasText: new RegExp(`^${member}$`) })
  })

// `a, b` -> ['a', 'b'], an empty cell -> []
const parseMembers = cell =>
  cell
    .split(',')
    .map(member => member.trim())
    .filter(Boolean)

const getProjectUpdates = (world, project) =>
  (world.testContext.leaderUpdates ?? []).filter(update => update.project === project)

// The precondition of every ORIS scenario, before its first navigation
Given('the app runs in ORIS mode', async function () {
  await verifyOrisApiProxy()
  await enableOrisMode(this.page)

  this.testContext.leaderUpdates = []
  recordLeaderProjectUpdates(this.page, this.testContext.leaderUpdates)
})

Given('{string} project is created on the leader by {string}', async function (project, owner) {
  await createLeaderProject(project, owner)
})

// e.g. the owner changed in another tab, or by another user, after the page was loaded
Given('the leader transfers {string} project to {string}', async function (project, owner) {
  await transferLeaderProjectOwner(project, owner)
})

// rows: | role | members |, the role is the leader's key (e.g. `viewer`), the members are comma-separated
Given('the leader adds members to {string} project:', async function (project, dataTable) {
  await addLeaderProjectMembers(
    project,
    Object.fromEntries(dataTable.rows().map(([role, members]) => [role, parseMembers(members)]))
  )
})

When('open the {string} tab of {string} project settings', async function (tab, project) {
  await navigateToPage(
    this.page,
    `http://${test_url}:${test_port}/projects/${project}/settings/${tab}`
  )
  await waitForPageQuiet(this.page)
})

When('change the project description to {string}', async function (description) {
  const textarea = this.page.locator(DESCRIPTION_TEXTAREA)
  const project = this.page.url().match(/\/projects\/([^/]+)\//)[1]
  const updatesBefore = getProjectUpdates(this, project).length

  await textarea.fill(description)
  // the General tab saves when a field loses the focus
  await textarea.blur()
  await expect
    .poll(() => getProjectUpdates(this, project).length, {
      message: `The description change of the "${project}" project is not sent to the leader`
    })
    .toBeGreaterThan(updatesBefore)
  await waitForPageQuiet(this.page)
})

When('change the project owner to {string} in the owner box', async function (owner) {
  const ownerBox = this.page.locator('.change-owner')
  const applyButton = ownerBox.getByRole('button', { name: 'Apply' })

  await this.page.locator(OWNER_SEARCH_INPUT).fill(owner)
  // the owner box picks the matching user once its debounced search answers
  await expect(applyButton).toBeEnabled()
  await applyButton.click()
  await waitForPageQuiet(this.page)
})

When('remove {string} member from project members', async function (member) {
  const row = getMemberRow(this.page, member)

  // the row's actions show on hover
  await row.hover()
  await row.locator('.member-actions button').click()
  await this.page.getByRole('button', { name: 'Remove member' }).click()
})

When('apply the project members changes', async function () {
  await this.page.locator('.apply-discard-buttons').getByRole('button', { name: 'Apply' }).click()
  await waitForPageQuiet(this.page)
})

Then('the project owner in the owner box is {string}', async function (owner) {
  await expect(this.page.locator(OWNER_NAME)).toHaveText(owner)
})

Then('{string} member is shown with the {string} role', async function (member, role) {
  await expect(getMemberRow(this.page, member).locator('.member-roles')).toContainText(role)
})

Then('{string} member is not shown', async function (member) {
  await expect(getMemberRow(this.page, member)).toHaveCount(0)
})

// The leader accepted the last update (202): its `prevOpId` was the op id the leader had (a stale one gets a 409), and
// its owner is the given one (a stale owner would transfer the ownership back)
Then(
  'the last update of {string} project is accepted by the leader with {string} owner',
  async function (project, owner) {
    await expect
      .poll(() => getProjectUpdates(this, project).at(-1)?.status, {
        message: `The last update of the "${project}" project: ${JSON.stringify(getProjectUpdates(this, project).at(-1))}`
      })
      .toBe(202)
    expect(getProjectUpdates(this, project).at(-1).body.owner).toBe(owner)
  }
)

Then(
  'the last update of {string} project requests the {string} state from the leader',
  async function (project, state) {
    const lastUpdate = () => getProjectUpdates(this, project).at(-1)

    await expect
      .poll(() => lastUpdate()?.body?.desiredState, {
        message: `The last update of the "${project}" project: ${JSON.stringify(lastUpdate())}`
      })
      .toBe(ORCA_DESIRED_STATES[state])
    await expect.poll(() => lastUpdate().status).toBe(202)
  }
)

Then('{string} project is {string} on the leader', async function (project, state) {
  await expect.poll(async () => (await getLeaderProject(project)).status.state).toBe(state)
})

Then('{string} project is owned by {string} on the leader', async function (project, owner) {
  expect((await getLeaderProject(project)).spec.owner).toBe(owner)
})

// rows: | role | members |, the role is its display name (e.g. `Viewer`), the members are comma-separated
Then('the members of {string} project on the leader are:', async function (project, dataTable) {
  const expected = Object.fromEntries(
    dataTable.rows().map(([role, members]) => [role, parseMembers(members)])
  )
  const actual = await getLeaderProjectMembers(project)

  Object.entries(expected).forEach(([role, members]) => {
    expect([...(actual[role] ?? [])].sort(), `The ${role} members`).toEqual([...members].sort())
  })
})
