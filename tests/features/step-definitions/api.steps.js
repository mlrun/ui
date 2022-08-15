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
