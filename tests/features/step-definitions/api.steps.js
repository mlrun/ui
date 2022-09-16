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
import {
  createAPIArtifact,
  createAPIFeatureSet,
  createAPIFeatureVector,
  createAPIFunction,
  createAPIMLProject,
  createAPISchedule,
  deleteAPIMLProject,
  getProjects
} from '../common/actions/api.actions'

Then(
  'set tear-down property {string} created with {string} value',
  async function(type, name) {
    this.createdItems.push({ name, type })
  }
)

Then(
  'set tear-down property {string} created in {string} project with {string} value',
  async function(type, project, name) {
    this.createdItems.push({ project, name, type })
  }
)

When('create {string} MLRun Project with code {int}', async function(
  nameProject,
  status
) {
  await createAPIMLProject(nameProject, status)
  await this.driver.sleep(1000)
})

Then('remove {string} MLRun Project with code {int}', async function(
  nameProject,
  status
) {
  await deleteAPIMLProject(this.driver, nameProject, status)
})

Then('create up to limit projects with code {int}', async function(status) {
  const projects = await getProjects()
  const projectsLimit = 50

  for (let i = 0; i <= projectsLimit - projects.length; i++) {
    const name = `automation-test-name${i}`
    await createAPIMLProject(name, status)
    this.createdItems.push({ name, type: 'project' })
  }
})

Then(
  'create {string} Function with {string} kind and {string} tag in {string} project with code {int}',
  async function (nameFunction, kindName, tagName, nameProject, status) {
    await createAPIFunction(nameProject, kindName, tagName, nameFunction, status)
  }
)

Then(
  'create {string} Schedule in {string} project with code {int}',
  async function(nameSchedule, nameProject, status) {
    await createAPISchedule(nameProject, nameSchedule, status)
  }
)

Then(
  'create {string} Feature Set in {string} project with code {int}',
  async function(nameSchedule, nameProject, status) {
    await createAPIFeatureSet(nameProject, nameSchedule, status)
  }
)

Then(
  'create {string} Feature Vector in {string} project with code {int}',
  async function(nameSchedule, nameProject, status) {
    await createAPIFeatureVector(nameProject, nameSchedule, status)
  }
)

Then(
  'create {string} Model with {string} tag in {string} project with code {int}',
  async function(nameArtifact, tag, nameProject, status) {
    await createAPIArtifact(nameProject, nameArtifact, tag, 'model', status)
  }
)

Then(
  'create {string} File with {string} tag in {string} project with code {int}',
  async function(nameArtifact, tag, nameProject, status) {
    await createAPIArtifact(nameProject, nameArtifact, tag, 'file', status)
  }
)

Then(
  'create {string} Dataset with {string} tag in {string} project with code {int}',
  async function(nameArtifact, tag, nameProject, status) {
    await createAPIArtifact(nameProject, nameArtifact, tag, 'dataset', status)
  }
)
