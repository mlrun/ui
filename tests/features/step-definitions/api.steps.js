import { When, Then } from '@cucumber/cucumber'
import {
  createAPIArtifact,
  createAPIFunction,
  createAPIFeatureSet,
  createAPIFeatureVector,
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
  await this.driver.sleep(2000)
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
  'create {string} Function in {string} project with code {int}',
  async function(nameFunction, nameProject, status) {
    await createAPIFunction(nameProject, nameFunction, status)
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
  'create {string} Model in {string} project with code {int}',
  async function(nameArtifact, nameProject, status) {
    await createAPIArtifact(nameProject, nameArtifact, 'model', status)
  }
)

Then('create {string} File in {string} project with code {int}', async function(
  nameArtifact,
  nameProject,
  status
) {
  await createAPIArtifact(nameProject, nameArtifact, 'file', status)
})

Then(
  'create {string} Dataset in {string} project with code {int}',
  async function(nameArtifact, nameProject, status) {
    await createAPIArtifact(nameProject, nameArtifact, 'dataset', status)
  }
)
