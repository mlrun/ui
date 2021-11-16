import express from 'express'
import bodyParser from 'body-parser'
import yaml from 'js-yaml'
import fs from 'fs'
import crypto from 'crypto'
import { cloneDeep, remove } from 'lodash'

import frontendSpec from './data/frontendSpec.json'
import projects from './data/projects.json'
import projectsSummary from './data/summary.json'
import artifacts from './data/artifacts.json'
import featureSets from './data/featureSets.json'
import features from './data/features.json'
import entities from './data/entities.json'
import featureVectors from './data/featureVectors.json'
import runs from './data/runs.json'
import run from './data/run.json'
import pipelines from './data/pipelines.json'
import pipelineIDs from './data/piplineIDs.json'
import schedules from './data/schedules.json'
import artifactTags from './data/artifactsTags.json'
import funcs from './data/funcs.json'
import logs from './data/logs.json'

import nuclioFunctions from './data/nuclioFunctions.json'
import nuclioAPIGateways from './data/nuclioAPIGateways.json'

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
  files_count: 0,
  feature_sets_count: 0,
  models_count: 0,
  runs_failed_recent_count: 0,
  runs_running_count: 0,
  schedules_count: 0,
  pipelines_running_count: 0
}
const jobTemplate = { kind: 'run', metadata: {}, spec: {}, status: {} }
const projectExistsConflict = {
  detail: "MLRunConflictError('Conflict - Project already exists')"
}

// Mock consts
const mockHome = process.cwd() + '/tests/mockServer'
const mlrunAPIIngress =
  '/mlrun-api-ingress.default-tenant.app.vmdev36.lab.iguazeng.com'
const nuclioApiUrl =
  '/nuclio-ingress.default-tenant.app.vmdev36.lab.iguazeng.com'
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

function generateHash(txt) {
  return crypto
    .createHash('sha1')
    .update(JSON.stringify(txt))
    .digest('hex')
}

// Request Handlers
function getFrontendSpec(req, res) {
  res.send(frontendSpec)
}

function getFeatureSet(req, res) {
  let collectedFeatureSets = featureSets.feature_sets.filter(
    featureSet => featureSet.metadata.project === req.params['project']
  )

  if (req.query['name']) {
    collectedFeatureSets = collectedFeatureSets.filter(featureSet =>
      featureSet.metadata.name.includes(req.query['name'].slice(1))
    )
  }

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
    const project = cloneDeep(projectTemplate)
    project.metadata.name = req.body.metadata.name
    project.metadata.created = currentDate.toISOString()
    project.spec.description = req.body.spec.description
    projects.projects.push(project)
    const summary = cloneDeep(summuryTemplate)
    summary.name = req.body.metadata.name
    projectsSummary.project_summaries.push(summary)
    data = project
  } else {
    res.statusCode = 409
    data = projectExistsConflict
  }

  res.send(data)
}

function deleteProject(req, res) {
  // TODO: improve that hendler acording to the real rooles of deleting
  const collectedProject = projects.projects.filter(
    project => project.metadata.name === req.params['project']
  )
  if (collectedProject.length) {
    remove(
      projects.projects,
      project => project.metadata.name === req.params['project']
    )
    remove(
      projectsSummary.projects,
      project => project.name === req.params['project']
    )
    remove(
      featureSets.feature_sets,
      featureSet => featureSet.metadata.project === req.params['project']
    )
    remove(
      artifacts.artifacts,
      artifact => artifact.project === req.params['project']
    )

    res.statusCode = 204
  } else {
    res.statusCode = 500
  }

  res.send({})
}

function patchProject(req, res) {
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

  // TODO: Should be rewiwed
  if ('description' in req.body.spec) {
    project.spec['description'] = req.body.spec['description']
  }
  if ('goals' in req.body.spec) {
    project.spec['goals'] = req.body.spec['goals']
  }

  res.send(project)
}

function putProject(req, res) {
  for (const i in projects.projects) {
    if (projects.projects[i].metadata.name === req.body.metadata.name) {
      projects.projects[i] = req.body
    }
  }

  res.send(
    projects.projects.find(
      project => project.metadata.name === req.params['project']
    )
  )
}

function getProjectsSummaries(req, res) {
  res.send(projectsSummary)
}

function getProjectSummary(req, res) {
  const collectedProjet = projectsSummary.project_summaries.find(
    item => item.name === req.params['project']
  )

  res.send(collectedProjet)
}

function getRuns(req, res) {
  let collectedRuns = runs.runs.filter(
    run => run.metadata.project === req.query['project']
  )

  if (req.query['start_time_from']) {
    collectedRuns = collectedRuns.filter(
      run =>
        Date.parse(run.status.start_time) >=
        Date.parse(req.query['start_time_from'])
    )
  }
  if (req.query['start_time_to']) {
    collectedRuns = collectedRuns.filter(
      run =>
        Date.parse(run.status.start_time) <=
        Date.parse(req.query['start_time_to'])
    )
  }

  if (req.query['label']) {
    let [key, value] = req.query['label'].split('=')
    collectedRuns = collectedRuns.filter(run => run.metadata.labels[key])
    if (req.query['label'].includes('=')) {
      collectedRuns = collectedRuns.filter(
        run => run.metadata.labels[key] === value
      )
    }
  }

  if (req.query['name']) {
    collectedRuns = collectedRuns.filter(run => {
      if (req.query['name'].includes('~')) {
        return run.metadata.name.includes(req.query['name'].slice(1))
      } else {
        return run.metadata.name === req.query['name']
      }
    })
  }

  if (req.query['state']) {
    collectedRuns = collectedRuns.filter(
      run => run.status.state === req.query['state']
    )
  }

  res.send({ runs: collectedRuns })
}

function getRun(req, res) {
  const run_prj_uid = run.data.find(
    item =>
      item.metadata.project === req.params['project'] &&
      item.metadata.uid === req.params['uid']
  )

  res.send({ data: run_prj_uid })
}

function getProjectsShedules(req, res) {
  let collectedShedules = schedules.schedules.filter(
    schedule =>
      schedule.scheduled_object.task.metadata.project === req.params['project']
  )

  res.send({ schedules: collectedShedules })
}

function getProjectsFeaturesEntities(req, res) {
  // console.log('requests log: ', req.method, req.url)
  // console.log('debug: ', req.params, req.query, req.body)

  const artifact = req.params.artifact
  let collectedArtifacts = []

  if (artifact === 'feature-vectors') {
    collectedArtifacts = featureVectors.feature_vectors.filter(
      item => item.metadata.project === req.params.project
    )
  }
  if (artifact === 'features') {
    collectedArtifacts = features.features.filter(
      item => item.feature_set_digest.metadata.project === req.params.project
    )
  }
  if (artifact === 'entities') {
    collectedArtifacts = entities.entities.filter(
      item => item.feature_set_digest.metadata.project === req.params.project
    )
  }
  if (artifact === 'pipelines') {
    collectedArtifacts = pipelines[req.params.project]
      ? pipelines[req.params.project]
      : pipelines['_empty']
  }

  if (collectedArtifacts.length) {
    if (req.query['tag']) {
      collectedArtifacts = collectedArtifacts.filter(item => {
        let tag = ''
        if (artifact === 'features' || artifact === 'entities') {
          tag = item.feature_set_digest.metadata.tag
        } else {
          tag = item.metadata.tag
        }

        return tag === req.query['tag']
      })
    }

    if (req.query['name']) {
      collectedArtifacts = collectedArtifacts.filter(feature => {
        if (req.query['name'].includes('~')) {
          return feature.feature.name.includes(req.query['name'].slice(1))
        } else {
          return feature.feature.name === req.query['name']
        }
      })
    }
  }

  let result = {}
  if (artifact === 'feature-vectors') {
    result = { feature_vectors: collectedArtifacts }
  }
  if (artifact === 'features') {
    result = { features: collectedArtifacts }
  }
  if (artifact === 'entities') {
    result = { entities: collectedArtifacts }
  }
  if (artifact === 'pipelines') {
    result = collectedArtifacts
  }

  res.send(result)
}

function getProjectsFeatureArtifactTags(req, res) {
  let featureArtifactTags = []

  if (req.params.featureArtifact === 'feature-vectors') {
    featureArtifactTags = featureVectors.feature_vectors.filter(
      artifact => artifact.metadata.project === req.params.project
    )
  }
  if (req.params.featureArtifact === 'feature-sets') {
    featureArtifactTags = featureSets.feature_sets.filter(
      artifact => artifact.metadata.project === req.params.project
    )
  }
  featureArtifactTags = featureArtifactTags
    .map(item => item.metadata.tag)
    .filter(item => item !== null)
  featureArtifactTags = [...new Set(featureArtifactTags)]

  res.send({ tags: featureArtifactTags })
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
    artifact =>
      artifact.project === '' || artifact.project === req.query['project']
  )

  if (req.query['category']) {
    collectedArtifacts = collectedArtifacts.filter(artifact =>
      categories[req.query['category']].includes(artifact.kind)
    )
  }

  if (req.query['name']) {
    collectedArtifacts = collectedArtifacts.filter(artifact => {
      if (req.query['name'].includes('~')) {
        return artifact.db_key.includes(req.query['name'].slice(1))
      } else {
        return artifact.db_key === req.query['name']
      }
    })
  }

  if (req.query['tag']) {
    switch (req.query['tag']) {
      case '*':
        collectedArtifacts = collectedArtifacts.filter(artifact => artifact.tag)
        break
      default:
        collectedArtifacts = collectedArtifacts.filter(
          artifact => artifact.tag === req.query['tag']
        )
        break
    }
  }

  res.send({ artifacts: collectedArtifacts })
}

function postProjectsFeatureVectors(req, res) {
  const collectedFV = featureVectors.feature_vectors.filter(
    item => item.metadata.name === req.body.metadata.name
  )
  if (!collectedFV.length) {
    const currentDate = new Date()

    let newFeatureVector = req.body
    newFeatureVector.metadata.created = currentDate.toISOString()
    newFeatureVector.metadata.updated = currentDate.toISOString()
    newFeatureVector.metadata.uid = generateHash(40)
    newFeatureVector.status.state = null

    featureVectors.feature_vectors.push(newFeatureVector)

    res.send(newFeatureVector)
  } else {
    res.status = 409
    res.send({
      detail: {
        reason: `MLRunConflictError('Adding an already-existing FeatureVector - ${req.body.metadata.project}/${req.body.metadata.name}:${req.body.metadata.tag}')`
      }
    })
  }
}

function putProjectsFeatureVectors(req, res) {
  const collectedFV = featureVectors.feature_vectors
    .filter(item => item.metadata.project === req.body.metadata.project)
    .filter(item => item.metadata.name === req.body.metadata.name)
    .filter(item => item.metadata.tag === req.body.metadata.tag)

  collectedFV[0] = req.body

  res.send(req.body)
}

function patchProjectsFeatureVectors(req, res) {
  const currentDate = new Date()

  const collectedFV = featureVectors.feature_vectors
    .filter(item => item.metadata.project === req.params.project)
    .filter(item => item.metadata.name === req.params.name)
    .filter(item => item.metadata.tag === req.params.tag)

  if (collectedFV.length) {
    if (req.body.spec.features) {
      collectedFV[0].spec.features = req.body.spec.features
    }
    if (req.body.spec.label_feature) {
      collectedFV[0].spec.label_feature = req.body.spec.label_feature
    }
    collectedFV[0].metadata.updated = currentDate.toISOString()
    collectedFV[0].metadata.uid = generateHash(40)
  }

  res.send('')
}

function deleteProjectsFeatureVectors(req, res) {
  const collectedFV = featureVectors.feature_vectors
    .filter(item => item.metadata.project === req.params.project)
    .filter(item => item.metadata.name === req.params.name)

  if (collectedFV.length) {
    remove(
      featureVectors.feature_vectors,
      item =>
        item.metadata.project === req.params.project &&
        item.metadata.name === req.params.name
    )
    res.statusCode = 204
  }

  res.status = 204
  res.send('')
}

function getPipeline(req, res) {
  const collectedPipeline = pipelineIDs.find(
    item => item.run.id === req.params.pipelineID
  )

  res.send(collectedPipeline)
}

function getFuncs(req, res) {
  const dt = parseInt(Date.now())

  const collectedFuncsByPrjTime = funcs.funcs
    .filter(func => func.metadata.project === req.query.project)
    .filter(func => Date.parse(func.metadata.updated) > dt)

  let collectedFuncs = []
  const newArray = cloneDeep(funcs.funcs)
  if (collectedFuncsByPrjTime.length) {
    collectedFuncs = newArray.filter(
      func => func.metadata.project === req.query.project
    )

    collectedFuncs.forEach(func => {
      if (Date.parse(func.metadata.updated) > dt) {
        func.metadata.updated = new Date(dt).toISOString()
      }
    })
  } else {
    collectedFuncs = funcs.funcs
      .filter(func => func.metadata.project === req.query.project)
      .filter(func => func.metadata.tag === 'latest')
      .filter(func => func.status?.state === 'deploying')

    collectedFuncs.forEach(func => {
      func.status.state = 'ready'
    })

    collectedFuncs = funcs.funcs.filter(
      func => func.metadata.project === req.query.project
    )
  }

  if (req.query['name']) {
    collectedFuncs = collectedFuncs.filter(func => {
      if (req.query['name'].includes('~')) {
        return func.metadata.name.includes(req.query['name'].slice(1))
      } else {
        return func.metadata.name === func.query['name']
      }
    })
  }

  res.send({ funcs: collectedFuncs })
}

function getFunc(req, res) {
  const collectedFunc = funcs.funcs
    .filter(func => func.metadata.project === req.params['project'])
    .filter(func => func.metadata.name === req.params['func'])

  let respBody = {}
  if (collectedFunc.length === 0) {
    res.statusCode = 404
    respBody = {
      detail: {
        reason: `MLRunNotFoundError('Function tag not found ${req.params['project']}/${req.params['func']}')`
      }
    }
  } else {
    respBody = { func: collectedFunc[0] }
  }

  res.send(respBody)
}

function postFunc(req, res) {
  const hashPwd = generateHash(req.body)

  const dt0 = parseInt(Date.now())

  let baseFunc = req.body
  baseFunc.metadata.updated = new Date(dt0).toISOString()
  baseFunc.metadata.hash = hashPwd
  baseFunc.metadata.tag = 'latest'
  baseFunc.status = {}

  funcs.funcs.push(baseFunc)

  res.send({ hash_key: hashPwd })
}

function deleteFunc(req, res) {
  const collectedFunc = funcs.funcs
    .filter(func => func.metadata.project === req.params.project)
    .filter(func => func.metadata.name === req.params.func)

  if (collectedFunc.length) {
    remove(
      funcs.funcs,
      func =>
        func.metadata.project === req.params.project &&
        func.metadata.name === req.params.func
    )
    res.statusCode = 204
  } else {
    res.statusCode = 500
  }

  res.send()
}

function getBuildStatus(req, res) {
  const dt = parseInt(Date.now())

  const collectedFunc = funcs.funcs
    .filter(func => func.metadata.project === req.query.project)
    .filter(func => func.metadata.name === req.query.name)
    .filter(func => func.metadata.tag === req.query.tag)
    .filter(func => Date.parse(func.metadata.updated) > dt)

  let logText = ''
  if (collectedFunc.length === 0) {
    res.set({
      function_status: 'ready',
      'x-mlrun-function-status': 'ready'
    })
    logText = `ML Run mock log message for "${req.query.name}" function in "${req.query.project}" project`
  } else {
    res.set({
      function_status: 'running',
      'x-mlrun-function-status': 'running'
    })
  }

  res.send(logText)
}

function deployMLFunction(req, res) {
  const respBody = { data: cloneDeep(req.body.function) }
  respBody.data.metadata.categories = []
  delete respBody.data.spec.secret_sources
  respBody.data.spec.affinity = null
  respBody.data.spec.command = ''
  respBody.data.spec.disable_auto_mount = false
  respBody.data.spec.priority_class_name = ''
  respBody.data.spec.build.image = `.mlrun/func-${respBody.data.metadata.project}-${respBody.data.metadata.name}:latest`
  respBody.data.status = {
    build_pod: `mlrun-build-${respBody.data.metadata.name}-mocks`,
    state: 'deploying'
  }
  respBody.data.verbose = false
  respBody.ready = false

  const collectedFunc = funcs.funcs
    .filter(
      func => func.metadata.project === req.body.function.metadata.project
    )
    .filter(func => func.metadata.name === req.body.function.metadata.name)

  collectedFunc[0].metadata.tag = ''

  let baseFunc = cloneDeep(collectedFunc[0])

  const dt0 = Date.parse(baseFunc.metadata.updated)
  const dt1 = dt0 + 1000
  const dt2 = dt1 + 30000

  baseFunc = cloneDeep(baseFunc)
  baseFunc.metadata.hash = generateHash(baseFunc)
  baseFunc.metadata.updated = new Date(dt1).toISOString()
  baseFunc.metadata.categories = []
  baseFunc.spec.affinity = null
  baseFunc.spec.command = ''
  baseFunc.spec.disable_auto_mount = false
  baseFunc.spec.priority_class_name = ''
  baseFunc.verbose = false
  baseFunc.status = null
  funcs.funcs.push(baseFunc)

  baseFunc = cloneDeep(baseFunc)
  baseFunc.metadata.hash = generateHash(baseFunc)
  baseFunc.metadata.updated = new Date(dt2).toISOString()
  baseFunc.metadata.tag = 'latest'
  baseFunc.status = {
    build_pod: `mlrun-build-${respBody.data.metadata.name}-mocks`,
    state: 'deploying'
  }
  funcs.funcs.push(baseFunc)

  setTimeout(() => res.send(respBody), 1050)
}

function getFile(req, res) {
  const dataRoot = mockHome + '/data/'
  const filePath = dataRoot + req.query['path'].substring(8)

  res.sendFile(filePath)
}

function getLog(req, res) {
  const collectedLog = logs.logs.find(log => log.uid === req.params['uid'])
  res.send(collectedLog.log)
}

function getRuntimeResources(req, res) {
  res.send({})
}

function postSubmitJob(req, res) {
  // console.log('requests log: ', req.method, req.url)
  // console.log('debug: ', req.params, req.query, req.body)

  const currentDate = new Date()

  let respTemplate = {
    data: {
      spec: {
        parameters: {},
        outputs: [],
        output_path: '',
        function: '',
        secret_sources: [],
        data_stores: []
      },
      metadata: {
        uid: '',
        name: '',
        labels: { v3io_user: 'admin', owner: 'admin', kind: 'job' },
        iteration: 0
      },
      status: {
        state: 'running',
        status_text:
          'Job is running in the background, pod: {{run.name}}-mocks',
        artifacts: [],
        start_time: '',
        last_update: ''
      }
    }
  }
  const runUID = makeUID(32)
  const runProject = req.body.task.metadata.project
  const runName = req.body.task.metadata.name
  const runAuthor = req.body.task.metadata.labels.author
  const outputPath = req.body.task.spec.output_path
    .replace('{{run.project}}', runProject)
    .replace('{{run.uid}}', runUID)
  const jobStart = currentDate.toISOString()

  respTemplate.data.metadata.uid = runUID
  respTemplate.data.metadata.project = runProject
  respTemplate.data.metadata.labels.author = runAuthor
  respTemplate.data.metadata.name = runName
  respTemplate.data.status.start_time = jobStart
  respTemplate.data.status.last_update = jobStart
  respTemplate.data.status.status_text = respTemplate.data.status.status_text.replace(
    '{{run.name}}',
    runName
  )
  respTemplate.data.spec.output_path = outputPath
  respTemplate.data.spec.parameters = req.body.task.spec.parameters

  let job = { ...jobTemplate }
  job.metadata = { ...respTemplate.data.metadata }
  job.metadata.anotations = {}
  job.spec = { ...respTemplate.data.spec }
  delete job.spec.secret_sources
  job.spec.hyper_param_options = {}
  job.spec.hyperparams = {}
  job.spec.inputs = {}
  job.spec.log_level = 'info'
  job.status = { ...respTemplate.data.status }
  delete job.status.status_text
  job.status.results = {}

  const funcYAMLPath = `./tests/mockServer/data/mlrun/functions/master/${req.body.task.spec.function.slice(
    6
  )}/function.yaml`
  const funcObject = yaml.load(fs.readFileSync(funcYAMLPath, 'utf8'))
  const funcUID = makeUID(32)
  // funcObject.kind = respTemplate.data.metadata.labels.kind
  funcObject.metadata.hash = funcUID
  funcObject.metadata.project = runProject
  funcObject.metadata.tag = 'latest'
  funcObject.metadata.updated = currentDate.toISOString()
  funcObject.spec.disable_auto_mount = false
  funcObject.spec.priority_class_name = ''
  funcObject.spec.volume_mounts = req.body.function.spec.volume_mounts
  funcObject.spec.volumes = req.body.function.spec.volumes
  funcObject.status = {}

  const functionSpec = `${runProject}/${req.body.task.spec.handler}@${funcUID}`
  respTemplate.data.spec.function = functionSpec
  job.spec.function = functionSpec

  const jobLogs = {
    uid: runUID,
    log: `> ${currentDate.toISOString()} Mock autogenerated log data`
  }

  runs.runs.push(job)
  funcs.funcs.push(funcObject)
  logs.logs.push(jobLogs)

  res.send(respTemplate)
}

function getNuclioFunctions(req, res) {
  res.send(nuclioFunctions)
}

function getNuclioAPIGateways(req, res) {
  res.send(nuclioAPIGateways)
}

// REQUESTS
app.get(`${mlrunAPIIngress}/api/frontend-spec`, getFrontendSpec)

app.get(`${mlrunAPIIngress}/api/projects/:project/feature-sets`, getFeatureSet)
app.post(
  `${mlrunAPIIngress}/api/projects/:project/feature-sets`,
  createProjectsFeatureSet
)

app.get(`${mlrunAPIIngress}/api/projects`, getProjects)
app.post(`${mlrunAPIIngress}/api/projects`, createNewProject)
app.get(`${mlrunAPIIngress}/api/projects/:project`, getProject)
app.delete(`${mlrunAPIIngress}/api/projects/:project`, deleteProject)
app.patch(`${mlrunAPIIngress}/api/projects/:project`, patchProject)
app.put(`${mlrunAPIIngress}/api/projects/:project`, putProject)

app.get(`${mlrunAPIIngress}/api/project-summaries`, getProjectsSummaries)
app.get(`${mlrunAPIIngress}/api/project-summaries/:project`, getProjectSummary)

app.get(`${mlrunAPIIngress}/api/runs`, getRuns)

app.get(`${mlrunAPIIngress}/api/run/:project/:uid`, getRun)

app.get(
  `${mlrunAPIIngress}/api/projects/:project/schedules`,
  getProjectsShedules
)
app.get(
  `${mlrunAPIIngress}/api/projects/:project/:artifact`,
  getProjectsFeaturesEntities
)
app.get(
  `${mlrunAPIIngress}/api/projects/:project/artifact-tags`,
  getProjectsArtifactTags
)
app.get(`${mlrunAPIIngress}/api/artifacts`, getArtifacts)

app.post(
  `${mlrunAPIIngress}/api/projects/:project/feature-vectors`,
  postProjectsFeatureVectors
)
app.put(
  `${mlrunAPIIngress}/api/projects/:project/feature-vectors/:name/references/:tag`,
  putProjectsFeatureVectors
)
app.patch(
  `${mlrunAPIIngress}/api/projects/:project/feature-vectors/:name/references/:tag`,
  patchProjectsFeatureVectors
)
app.delete(
  `${mlrunAPIIngress}/api/projects/:project/feature-vectors/:name`,
  deleteProjectsFeatureVectors
)

app.get(`${mlrunAPIIngress}/api/pipelines/:pipelineID`, getPipeline)

app.get(`${mlrunAPIIngress}/api/funcs`, getFuncs)

app.get(`${mlrunAPIIngress}/api/func/:project/:func`, getFunc)
app.post(`${mlrunAPIIngress}/api/func/:project/:func`, postFunc)

app.get(
  `${mlrunAPIIngress}/api/projects/:project/:featureArtifact/*/tags`,
  getProjectsFeatureArtifactTags
)

app.delete(
  `${mlrunAPIIngress}/api/projects/:project/functions/:func`,
  deleteFunc
)

app.get(`${mlrunAPIIngress}/api/build/status`, getBuildStatus)
app.post(`${mlrunAPIIngress}/api/build/function`, deployMLFunction)

app.get(`${mlrunAPIIngress}/api/files`, getFile)

app.get(`${mlrunAPIIngress}/api/log/:project/:uid`, getLog)

app.get(
  `${mlrunAPIIngress}/api/projects/:project/runtime-resources`,
  getRuntimeResources
)

app.post(`${mlrunAPIIngress}/api/submit_job`, postSubmitJob)

app.get(`${nuclioApiUrl}/api/functions`, getNuclioFunctions)

app.get(`${nuclioApiUrl}/api/api_gateways`, getNuclioAPIGateways)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
