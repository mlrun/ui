import express from 'express'
import bodyParser from 'body-parser'
import _ from 'lodash'

import frontendSpec from './data/frontendSpec.json'
import projects from './data/projects.json'
import projectsSummary from './data/summary.json'
import artifacts from './data/artifacts.json'
import featureSets from './data/featureSets.json'
import features from './data/features.json'
import featureVectors from './data/featureVectors.json'
import runs from './data/runs.json'
import pipelines from './data/pipelines.json'
import schedules from './data/schedules.json'
import artifactTags from './data/artifactsTags.json'

// Here we are configuring express to use body-parser as middle-ware.
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// MLRun object Templates
const projectTemplate = {
  kind: 'project',
  metadata: { name: '', created: '', labels: null, annotations: null },
  spec: {
    description: '',
    goals: null,
    params: null,
    functions: null,
    workflows: null,
    artifacts: null,
    artifact_path: null,
    conda: null,
    source: null,
    subpath: null,
    origin_url: null,
    desired_state: 'online'
  },
  status: { state: 'online' }
}
const summuryTemplate = {
  name: '',
  functions_count: 0,
  feature_sets_count: 0,
  models_count: 0,
  runs_failed_recent_count: 0,
  runs_running_count: 0
}
const projectExistsConflict = {
  detail: "MLRunConflictError('Conflict - Project already exists')"
}

// Mock consts
const mockHome = process.cwd() + '/tests/mockServer'
const mlrunAPIIngress =
  '/mlrun-api-ingress.default-tenant.app.ui-dev.iguazio-cd0.com'
const port = 30000

// Support function
function makeUID(length) {
  let result = ''
  const characters = 'abcdef0123456789'
  const charactersLength = characters.length

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}

// Request Handlers
function getFrontendSpec(req, res) {
  res.send(frontendSpec)
}

function getFeatureSet(req, res) {
  let collectedFeatureSets = featureSets.feature_sets.filter(
    featureSet => featureSet.metadata.project === req.params['project']
  )

  res.send({ feature_sets: collectedFeatureSets })
}

function createProjectsFeatureSet(req, res) {
  const currentDate = new Date()
  let featureSet = req.body
  featureSet.metadata['project'] = req.params['project']
  featureSet.metadata['uid'] = makeUID(40)
  featureSet.metadata['updated'] = currentDate.toISOString()
  featureSet.status['state'] = null
  featureSets.feature_sets.push(featureSet)

  res.send(featureSet)
}

function getProject(req, res) {
  res.send(
    projects.projects.find(
      project => project.metadata.name === req.params['project']
    )
  )
}

function getProjects(req, res) {
  let data = projects

  switch (req.query['format']) {
    case 'summary':
      data = projectsSummary
      break
    case 'name_only':
      data = { projects: [] }
      for (let project of projects.projects) {
        data['projects'].push(project.metadata.name)
      }
      break
    default:
      break
  }

  res.send(data)
}

function createNewProject(req, res) {
  const currentDate = new Date()
  let data = {}
  const collectedProjects = projects.projects.filter(
    project => project.metadata.name === req.body.metadata.name
  )

  if (!collectedProjects.length) {
    const project = _.cloneDeep(projectTemplate)
    project.metadata.name = req.body.metadata.name
    project.metadata.created = currentDate.toISOString()
    project.spec.description = req.body.spec.description
    projects.projects.push(project)
    const summary = _.cloneDeep(summuryTemplate)
    summary.name = req.body.metadata.name
    projectsSummary.projects.push(summary)
    data = project
  } else {
    res.statusCode = 409
    data = projectExistsConflict
  }

  res.send(data)
}

function deleteProject(req, res) {
  // TODO: improve that hendler acording to the real rooles of deleting
  _.remove(
    projects.projects,
    project => project.metadata.name === req.params['project']
  )
  _.remove(
    projectsSummary.projects,
    project => project.name === req.params['project']
  )
  _.remove(
    featureSets.feature_sets,
    featureSet => featureSet.metadata.project === req.params['project']
  )
  _.remove(
    artifacts.artifacts,
    artifact => artifact.project === req.params['project']
  )

  res.statusCode = 204
  res.send({})
}

function archiveProject(req, res) {
  const project = projects.projects.find(
    project => project.metadata.name === req.params['project']
  )

  switch (req.body.spec['desired_state']) {
    case 'archived':
      project.spec['desired_state'] = 'archived'
      project.status['state'] = 'archived'
      break
    case 'online':
      project.spec['desired_state'] = 'online'
      project.status['state'] = 'online'
      break
    default:
      break
  }

  res.send(project)
}

function getRuns(req, res) {
  let collectedRuns = runs.runs.filter(
    run => run.metadata.project === req.query['project']
  )

  res.send({ runs: collectedRuns })
}

function getProjectsShedules(req, res) {
  let collectedShedules = schedules.schedules.filter(
    schedule =>
      schedule.scheduled_object.task.metadata.project === req.params['project']
  )

  res.send({ schedules: collectedShedules })
}

function getProjectsPipelines(req, res) {
  let collectedPipelines = pipelines[req.params['project']]
    ? { runs: pipelines[req.params['project']] }
    : pipelines['_empty']

  res.send(collectedPipelines)
}

function getProjectsFeatures(req, res) {
  let collectedFeatures = features.features.filter(
    feature =>
      feature.feature_set_digest.metadata.project === req.params['project']
  )

  if (collectedFeatures.length) {
    if (req.query['tag']) {
      collectedFeatures = collectedFeatures.filter(
        feature => feature.feature_set_digest.metadata.tag === req.query['tag']
      )
    }

    if (req.query['name']) {
      collectedFeatures = collectedFeatures.filter(
        feature => feature.feature.name === req.query['name']
      )
    }
  }

  res.send({ features: collectedFeatures })
}

function getProjectsFeatureVectors(req, res) {
  let featureVector = featureVectors.feature_vectors.filter(
    vector => vector.metadata.project === req.params['project']
  )

  if (featureVector.length) {
    if (req.query['tag']) {
      featureVector = featureVector.filter(
        vector => vector.metadata.tag === req.query['tag']
      )
    }
    if (req.query['name']) {
      featureVector = featureVector.filter(
        vector => vector.metadata.name === req.query['name']
      )
    }
  }

  res.send({ feature_vectors: featureVector })
}

function getProjectsArtifactTags(req, res) {
  let artifactTag = artifactTags.find(
    aTag => aTag.project === req.params['project']
  )

  res.send(artifactTag)
}

function getArtifacts(req, res) {
  const categories = {
    dataset: ['dataset'],
    model: ['model'],
    other: ['', 'table', 'link']
  }
  let collectedArtifacts = artifacts.artifacts.filter(
    artifact => artifact.project === req.query['project']
  )

  if (req.query['category']) {
    collectedArtifacts = collectedArtifacts.filter(artifact =>
      categories[req.query['category']].includes(artifact.kind)
    )
  }

  res.send({ artifacts: collectedArtifacts })
}

function getFile(req, res) {
  const dataRoot = mockHome + '/data/'
  const filePath = dataRoot + req.query['path'].substring(8)

  res.sendFile(filePath)
}

// REQUESTS
app.get(`${mlrunAPIIngress}/api/frontend-spec`, getFrontendSpec)

app.get(`${mlrunAPIIngress}/api/projects/:project/feature-sets`, getFeatureSet)
app.post(
  `${mlrunAPIIngress}/api/projects/:project/feature-sets`,
  createProjectsFeatureSet
)

app.get(`${mlrunAPIIngress}/api/projects/:project`, getProject)
app.get(`${mlrunAPIIngress}/api/projects`, getProjects)
app.post(`${mlrunAPIIngress}/api/projects`, createNewProject)
app.delete(`${mlrunAPIIngress}/api/projects/:project`, deleteProject)
app.patch(`${mlrunAPIIngress}/api/projects/:project`, archiveProject)

app.get(`${mlrunAPIIngress}/api/runs`, getRuns)

app.get(
  `${mlrunAPIIngress}/api/projects/:project/schedules`,
  getProjectsShedules
)
app.get(
  `${mlrunAPIIngress}/api/projects/:project/pipelines`,
  getProjectsPipelines
)
app.get(
  `${mlrunAPIIngress}/api/projects/:project/features`,
  getProjectsFeatures
)
app.get(
  `${mlrunAPIIngress}/api/projects/:project/feature-vectors`,
  getProjectsFeatureVectors
)
app.get(
  `${mlrunAPIIngress}/api/projects/:project/artifact-tags`,
  getProjectsArtifactTags
)
app.get(`${mlrunAPIIngress}/api/artifacts`, getArtifacts)

app.get(`${mlrunAPIIngress}/api/files`, getFile)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
