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
import itemsCatalog from './data/itemsCatalog.json'
import pipelines from './data/pipelines.json'
import secretKeys from './data/secretKeys.json'
import pipelineIDs from './data/piplineIDs.json'
import schedules from './data/schedules.json'
import artifactTags from './data/artifactsTags.json'
import funcs from './data/funcs.json'
import logs from './data/logs.json'
import modelEndpoints from './data/modelEndpoints.json'

import iguazioProjects from './data/iguazioProjects.json'
import iguazioUserGrops from './data/iguazioUserGroups.json'
import iguazioProjectAuthorizationRoles from './data/iguazioProjectAuthorizationRoles.json'
import iguazioUsers from './data/iguazioUsers.json'
import iguazioSelf from './data/iguazioSelf.json'
import iguazioUserRelations from './data/iguazioUserRelations.json'
import iguazioProjectsRelations from './data/iguazioProjectsRelations.json'

import nuclioFunctions from './data/nuclioFunctions.json'
import nuclioAPIGateways from './data/nuclioAPIGateways.json'
import nuclioStreams from './data/nuclioStreams.json'

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
const scheduleTemplate = {
  kind: 'job',
  scheduled_object: {
    task: {
      spec: {},
      metadata: {
        labels: {}
      }
    },
    function: {},
    schedule: '0 0 1 * *',
    credentials: { access_key: null }
  },
  labels: {}
}
const projectExistsConflict = {
  detail: "MLRunConflictError('Conflict - Project already exists')"
}
const projectsLimitReachedConflict = {
  detail: {
    reason:
      'MLRunHTTPError("405 Client Error: Method Not Allowed for url: https://dashboard.default-tenant.app.vmdev2.lab.iguazeng.com/api/projects: ' +
      "Failed creating project in Iguazio: [{'status': 405, 'detail': 'Resource limit reached. Cannot create more records'}]\")"
  }
}
const secretKeyTemplate = {
  provider: 'kubernetes',
  secret_keys: []
}

// Mock consts
const mockHome = process.cwd() + '/tests/mockServer'
const mlrunIngress = '/mlrun-api-ingress.default-tenant.app.vmdev36.lab.iguazeng.com'
const mlrunAPIIngress = `${mlrunIngress}/api/v1`
const mlrunAPIIngressV2 = `${mlrunIngress}/api/v2`
const nuclioApiUrl = '/nuclio-ingress.default-tenant.app.vmdev36.lab.iguazeng.com'
const iguazioApiUrl = '/platform-api.default-tenant.app.vmdev36.lab.iguazeng.com'
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
  return crypto.createHash('sha1').update(JSON.stringify(txt)).digest('hex')
}

// Request Handlers
function getFrontendSpec(req, res) {
  res.send(frontendSpec)
}

function getFeatureSet(req, res) {
  let collectedFeatureSets = featureSets.feature_sets.filter(
    featureSet => featureSet.metadata.project === req.params['project']
  )

  if (req.query['tag']) {
    collectedFeatureSets = collectedFeatureSets.filter(
      featureSet => featureSet.metadata.tag === req.query['tag']
    )
  }

  if (req.query['name']) {
    collectedFeatureSets = collectedFeatureSets.filter(featureSet =>
      featureSet.metadata.name.includes(req.query['name'].slice(1))
    )
  }

  if (req.query['label']) {
    let [key, value] = req.query['label'].split('=')
    collectedFeatureSets = collectedFeatureSets.filter(featureSet => {
      if (featureSet.metadata.labels) {
        return featureSet.metadata.labels[key]
      }
    })
    if (req.query['label'].includes('=')) {
      collectedFeatureSets = collectedFeatureSets.filter(featureSet => {
        if (featureSet.metadata.labels) {
          return featureSet.metadata.labels[key] === value
        }
      })
    }
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

function deleteFeatureSet(req, res) {
  const collecledFeatureSet = featureSets.feature_sets
    .filter(featureSet => featureSet.metadata.project === req.params.project)
    .filter(featureSet => featureSet.metadata.name === req.params.featureSet)
  if (collecledFeatureSet.length) {
    remove(featureSets.feature_sets, item => item.metadata.name === req.params.featureSet)
    res.statusCode = 204
  } else {
    res.statusCode = 500
  }

  res.send()
}

function getProject(req, res) {
  res.send(projects.projects.find(project => project.metadata.name === req.params['project']))
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
  if (projects.projects.length > 50) {
    res.statusCode = 500
    data = projectsLimitReachedConflict
  } else if (!collectedProjects.length) {
    const project = cloneDeep(projectTemplate)
    project.metadata.name = req.body.metadata.name
    project.metadata.created = currentDate.toISOString()
    project.spec.description = req.body.spec.description
    projects.projects.push(project)
    const summary = cloneDeep(summuryTemplate)
    summary.name = req.body.metadata.name
    projectsSummary.project_summaries.push(summary)
    data = project
    secretKeys[req.body.metadata.name] = secretKeyTemplate
    res.statusCode = 201
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
    remove(projects.projects, project => project.metadata.name === req.params['project'])
    remove(projectsSummary.projects, project => project.name === req.params['project'])
    remove(
      featureSets.feature_sets,
      featureSet => featureSet.metadata.project === req.params['project']
    )
    remove(artifacts.artifacts, artifact => artifact.project === req.params['project'])
    remove(run.data, artifact => artifact.metadata.project === req.params['project'])
    remove(run.data, artifact => artifact.metadata.project === req.params['project'])
    delete secretKeys[req.params.project]
    res.statusCode = 204
  } else {
    res.statusCode = 500
  }

  res.send({})
}

function patchProject(req, res) {
  const project = projects.projects.find(project => project.metadata.name === req.params['project'])

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

  res.send(projects.projects.find(project => project.metadata.name === req.params['project']))
}

function getSecretKeys(req, res) {
  res.send(secretKeys[req.params['project']])
}

function postSecretKeys(req, res) {
  secretKeys[req.params['project']].secret_keys.push(Object.keys(req.body.secrets)[0])

  res.statusCode = 201
  res.send('')
}

function deleteSecretKeys(req, res) {
  secretKeys[req.params['project']].secret_keys = secretKeys[
    req.params['project']
  ].secret_keys.filter(item => item !== req.query.secret)

  res.statusCode = 204
  res.send('')
}

function getProjectsSummaries(req, res) {
  res.send(projectsSummary)
}

function getFunctionItem(req, res) {
  const funcName = req.params.uid === 'batch_inference_v2' ? 'batch-inference-v2' : req.params.uid
  const hubItem = itemsCatalog.catalog.find(item => item.metadata.name === funcName)
  
  res.send(hubItem)
}

function getFunctionObject (req, res) {
  const urlParams = req.query.url
  const urlArray = urlParams.split('/')
  const funcYAMLPath = `./tests/mockServer/data/mlrun/functions/${urlArray[6]}/${urlArray[6]}.yaml`
  const funcObject = fs.readFileSync(funcYAMLPath, 'utf8')

  res.send(funcObject)
}

function getProjectSummary(req, res) {
  const collectedProject = projectsSummary.project_summaries.find(
    item => item.name === req.params['project']
  )

  res.send(collectedProject)
}

function getRuns(req, res) {
  let collectedRuns = runs.runs.filter(run => run.metadata.project === req.query['project'])

  if (req.query['start_time_from']) {
    collectedRuns = collectedRuns.filter(
      run => Date.parse(run.status.start_time) >= Date.parse(req.query['start_time_from'])
    )
  }
  if (req.query['start_time_to']) {
    collectedRuns = collectedRuns.filter(
      run => Date.parse(run.status.start_time) <= Date.parse(req.query['start_time_to'])
    )
  }

  if (req.query['label']) {
    let [key, value] = req.query['label'].split('=')
    collectedRuns = collectedRuns.filter(run =>
      run.metadata.labels ? run.metadata.labels[key] : false
    )
    if (req.query['label'].includes('=')) {
      collectedRuns = collectedRuns.filter(run => run.metadata.labels[key] === value)
    } else {
      collectedRuns = collectedRuns.filter(run => run.metadata.labels[key] || false)
    }
  }

  if (req.query['name']) {
    collectedRuns = collectedRuns.filter(run => {
      if (req.query['name'].includes('~')) {
        return run.metadata.name ? run.metadata.name.includes(req.query['name'].slice(1)) : false
      } else {
        return run.metadata.name === req.query['name']
      }
    })
  }

  if (req.query['state']) {
    collectedRuns = collectedRuns.filter(run => run.status.state === req.query['state'])
  }

  res.send({ runs: collectedRuns })
}

function getRun(req, res) {
  const run_prj_uid = run.data.find(
    item =>
      item.metadata.project === req.params['project'] && item.metadata.uid === req.params['uid']
  )

  res.send({ data: run_prj_uid })
}

function patchRun(req, res) {
  const collectedRun = runs.runs
    .filter(run => run.metadata.project === req.params.project)
    .filter(run => run.metadata.uid === req.params.uid)

  collectedRun[0].status.state = req.body['status.state']

  res.send()
}

function deleteRun(req, res) {
  const collectedRun = runs.runs
    .find (run => run.metadata.project === req.params.project && run.metadata.uid === req.params.uid)
  
  if (collectedRun) {
    remove(
      runs.runs,
      run => run.metadata.project === req.params.project && run.metadata.uid === req.params.uid
    )
  }

  res.send()
}

function deleteRuns(req, res) {
  const collectedRuns = runs.runs
    .filter (run => run.metadata.project === req.params.project && run.metadata.name === req.query.name)
  
  if (collectedRuns?.length > 0) {
    collectedRuns.forEach(collectedRun => remove(runs.runs, collectedRun))    
  }

  res.send()
}

function getFunctionCatalog(req, res) {
  res.send(itemsCatalog)
}

function getFunctionTemplate(req, res) {
  const funcYAMLPath = `./tests/mockServer/data/mlrun/functions/${req.params.function}/${req.params.function}.yaml`
  const funcObject = fs.readFileSync(funcYAMLPath, 'utf8')

  res.send(funcObject)
}

function getProjectsSchedules(req, res) {
  let collectedSchedules = schedules.schedules.filter(
    schedule => schedule.scheduled_object.task.metadata.project === req.params['project']
  )

  if (req.query['name']) {
    collectedSchedules = collectedSchedules.filter(schedule =>
      schedule.name.includes(req.query['name'].slice(1))
    )
  }
  if (req.query['labels']) {
    let [key, value] = req.query['labels'].split('=')
    collectedSchedules = collectedSchedules.filter(schedule => {
      return schedule.labels[key]
    })
    if (req.query['labels'].includes('=')) {
      collectedSchedules = collectedSchedules.filter(schedule => schedule.labels[key] === value)
    }
  }

  res.send({ schedules: collectedSchedules })
}

function getProjectsSchedule(req, res) {
  const collectedSchedule = schedules.schedules.find(item => item.name === req.params['schedule'])

  res.send(collectedSchedule)
}

function getProjectsFeaturesEntities(req, res) {
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
          if (artifact === 'feature-vectors') {
            return feature.metadata.name.includes(req.query['name'].slice(1))
          } else if (artifact === 'features') {
            return feature.feature.name.includes(req.query['name'].slice(1))
          } else if (artifact === 'entities') {
            return feature.entity.name.includes(req.query['name'].slice(1))
          }
        } else {
          if (artifact === 'feature-vectors') {
            return feature.metadata.name.includes(req.query['name'].slice(1))
          } else if (artifact === 'features') {
            return feature.feature.name === req.query['name']
          } else if (artifact === 'entities') {
            return feature.entity.name === req.query['name']
          }
        }
      })
    }

    if (req.query['label']) {
      let [key, value] = req.query['label'].split('=')

      collectedArtifacts = collectedArtifacts.filter(item => {
        if (artifact === 'feature-vectors' && item.metadata.labels) {
          return item.metadata.labels[key]
        } else if (item.feature?.labels) {
          return item.feature.labels[key]
        } else if (item.entity?.labels) {
          return item.entity.labels[key]
        }
      })

      if (req.query['label'].includes('=')) {
        collectedArtifacts = collectedArtifacts.filter(item => {
          if (artifact === 'feature-vectors' && item.metadata.labels) {
            return item.metadata.labels[key] === value
          }
          if (artifact === 'features') {
            return item.feature.labels[key] === value
          } else if (artifact === 'entities') {
            return item.entity.labels[key] === value
          }
        })
      }
    }

    if (req.query['entity']) {
      collectedArtifacts = collectedArtifacts.filter(feature => {
        return feature.feature_set_digest.spec.entities.some(
          item => item.name === req.query['entity']
        )
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
  let artifactTag = artifactTags.find(aTag => aTag.project === req.params['project'])

  res.send(artifactTag)
}

function getArtifacts(req, res) {
  const categories = {
    dataset: ['dataset'],
    model: ['model'],
    other: ['', 'table', 'link', 'plot', 'chart', 'plotly']
  }
  let collectedArtifacts = artifacts.artifacts.filter(
    artifact => (artifact.metadata?.project === req.params.project) 
    || artifact.project === req.params.project
  )

  if (req.query['category']) {
    collectedArtifacts = collectedArtifacts.filter(artifact =>
      categories[req.query['category']].includes(artifact.kind)
    )
  }
  if (req.query['label']) {
    let [key, value] = req.query['label'].split('=')
    collectedArtifacts = collectedArtifacts.filter(artifact => {
      if (artifact.labels) {
        return artifact.labels[key]
      }
    })
    if (req.query['label'].includes('=')) {
      collectedArtifacts = collectedArtifacts.filter(artifact => {
        if (artifact.labels) {
          return artifact.labels[key] === value
        }
      })
    }
  }

  if (req.query['name']) {
    collectedArtifacts = collectedArtifacts.filter(artifact => {
      if (req.query['name'].includes('~')) {
        const value = artifact.spec?.db_key ?? artifact.db_key
        if (req.query['name'].includes('~')) {
          return value.includes(req.query['name'].slice(1))
        } 
        else {
          return value.includes(req.query['name'])
        }
      } 
      else {
        return (artifact.spec && artifact.spec.db_key === req.query['name']) || artifact.db_key === req.query['name']
      }
    })
  }

  if (req.query['tag']) {
    switch (req.query['tag']) {
      case '*':
        collectedArtifacts = collectedArtifacts.filter(artifact => artifact.metadata?.tree || artifact.tree)
        break
      default:
        collectedArtifacts = collectedArtifacts.filter(
          artifact => (artifact.metadata?.tag === req.query['tag']) || artifact.tag === req.query['tag']
        )
        break
    }
  }

  res.send({ artifacts: collectedArtifacts })
}

function getProjectsFeatureSets(req, res) {
  const featureArtifactTags = featureSets.feature_sets
    .filter(artifact => artifact.metadata.project === req.params.project)
    .filter(artifact => artifact.metadata.name === req.params.name)
    .filter(artifact => artifact.metadata.tag === req.params.tag)

  res.send(featureArtifactTags[0])
}

function patchProjectsFeatureSets(req, res) {
  const featureArtifactTags = featureSets.feature_sets
    .filter(artifact => artifact.metadata.project === req.params.project)
    .filter(artifact => artifact.metadata.name === req.params.name)
    .filter(artifact => artifact.metadata.tag === req.params.tag)

  if (featureArtifactTags.length) {
    featureArtifactTags[0].metadata.labels = req.body.metadata.labels
  }
  res.send(featureArtifactTags[0])
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
    res.statusCode = 409
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
      item => item.metadata.project === req.params.project && item.metadata.name === req.params.name
    )
    res.statusCode = 204
  }

  res.status = 204
  res.send('')
}

function getPipelines(req, res) {
  const collectedPipelines = { ...pipelines[req.params.project] }

  if (req.query.filter) {
    const nameFilter = JSON.parse(req.query.filter).predicates.find(item => item.key === 'name')
    const statusFilter = JSON.parse(req.query.filter).predicates.find(item => item.key === 'status')

    if (nameFilter) {
      collectedPipelines.runs = collectedPipelines.runs.filter(pipeline => {
        return pipeline.name.includes(nameFilter.string_value)
      })
    }

    if (statusFilter) {
      collectedPipelines.runs = collectedPipelines.runs.filter(pipeline => {
        return pipeline.status.includes(statusFilter.string_value)
      })
    }
  }

  res.send(collectedPipelines)
}

function getPipeline(req, res) {
  const collectedPipeline = pipelineIDs.find(item => item.run.id === req.params.pipelineID)

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
    collectedFuncs = newArray.filter(func => func.metadata.project === req.query.project)

    collectedFuncs.forEach(func => {
      if (Date.parse(func.metadata.updated) > dt) {
        func.metadata.updated = new Date(dt).toISOString()
      }
    })
  } 
  else if (req.query['hash_key']) {
    collectedFuncs = funcs.funcs
    .filter(func => func.metadata.hash === req.query.hash_key)
  }
  else {
    collectedFuncs = funcs.funcs
      .filter(func => func.metadata.project === req.params['project']) 
      .filter(func => func.metadata.tag === 'latest')
      .filter(func => func.status?.state === 'deploying')

    collectedFuncs.forEach(func => {
      func.status.state = 'ready'
    })

    collectedFuncs = funcs.funcs.filter(func => func.metadata.project === req.params['project'])
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
    .filter(func => func.metadata.hash === req.query.hash_key)

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
      func => func.metadata.project === req.params.project && func.metadata.name === req.params.func
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
    .filter(func => func.metadata.project === req.body.function.metadata.project)
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
  baseFunc.spec.priority_class_name = req.body.function.spec.priority_class_name
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

function deleteSchedule(req, res) {
  const collectedSchedule = schedules.schedules
    .filter(schedule => schedule.project === req.params.project)
    .filter(schedule => schedule.name === req.params.schedule)

  if (collectedSchedule.length) {
    remove(schedules.schedules, item => item.name === req.params.schedule)
    res.statusCode = 204
  } else {
    res.statusCode = 500
  }

  res.send()
}

function getLog(req, res) {
  const collectedLog = logs.find(log => log.uid === req.params['uid'])
  res.send(collectedLog.log)
}

function getRuntimeResources(req, res) {
  res.send({})
}

function postSubmitJob(req, res) {
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
        status_text: 'Job is running in the background, pod: {{run.name}}-mocks',
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

  if (req.body.schedule) {
    if (
      schedules.schedules.find(
        schedule =>
          schedule.name === runName &&
          schedule.scheduled_object.task.metadata.project === runProject
      )
    ) {
      res.statusCode = 409
      return res.send({
        detail: {
          reason: `MLRunConflictError('Conflict - Schedule already exists: ${runProject}/${runName}')`
        }
      })
    }
    let schedule = { ...scheduleTemplate }
    schedule.name = runName
    schedule.project = runProject
    schedule.scheduled_object.task.metadata.name = runName
    schedule.scheduled_object.task.metadata.project = runProject
    schedule.scheduled_object.task.metadata.labels.author = runAuthor
    schedule.scheduled_object.task.spec.function = req.body.task.spec.function
    schedule.creation_time = currentDate.toISOString()

    schedules.schedules.push(schedule)
  } else {
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

    let funcObject
    if (req.body.task.spec.function.includes('@') && req.body.task.spec.function.includes('/')) {
      const filterPRJ = req.body.task.spec.function.split('/')[0]
      const filterFunc = req.body.task.spec.function.split('/')[1].split('@')[0]
      const filterFuncHash = req.body.task.spec.function.split('/')[1].split('@')[1]
      funcObject = funcs.funcs
        .filter(item => item.metadata.hash === filterFuncHash)
        .filter(item => item.metadata.project === filterPRJ)
        .filter(item => item.metadata.name === filterFunc)[0]
    } else {
      const funcYAMLPath = `./tests/mockServer/data/mlrun/functions/${req.body.task.spec.function.slice(
        6
      )}/${req.body.task.spec.function.slice(6)}.yaml`
      funcObject = yaml.load(fs.readFileSync(funcYAMLPath, 'utf8'))
    }

    const funcUID = makeUID(32)
    // funcObject.kind = respTemplate.data.metadata.labels.kind
    funcObject.metadata.hash = funcUID
    funcObject.metadata.project = runProject
    funcObject.metadata.tag = 'latest'
    funcObject.metadata.updated = currentDate.toISOString()
    funcObject.spec.disable_auto_mount = false
    funcObject.spec.priority_class_name = req.body.function.spec.priority_class_name
    funcObject.spec.preemption_mode = req.body.function.spec.preemption_mode
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
    logs.push(jobLogs)
  }

  res.send(respTemplate)
}

function putTags(req, res) {
  const tagName = req.params.tag
  const projectName = req.params.project

  const collectedArtifacts = artifacts.artifacts
    .filter(artifact => { 
      const artifactMetaData = artifact.metadata ?? artifact
      const artifactSpecData = artifact.spec ?? artifact
      
      return artifactMetaData?.project === req.params.project 
        && artifact.kind === req.body.identifiers[0].kind
        && (artifactMetaData?.uid === req.body.identifiers[0].uid || artifactMetaData?.tree === req.body.identifiers[0].uid) 
        && artifactSpecData?.db_key === req.body.identifiers[0].key
    }  
  )

  if (collectedArtifacts?.length > 0) {
    let editedTag = cloneDeep(collectedArtifacts[0])
    editedTag.metadata ? editedTag.metadata.tag = tagName : editedTag.tag = tagName
    artifacts.artifacts.push(editedTag)
  }

  res.send({
    name: tagName,
    project: projectName
  })
}

function deleteTags(req, res) {
  const collectedArtifacts = artifacts.artifacts
    .filter(artifact => {
      const artifactMetaData = artifact.metadata ?? artifact
      const artifactSpecData = artifact.spec ?? artifact

      return artifactMetaData?.project === req.params.project 
        && artifact.kind === req.body.identifiers[0].kind
        && (artifactMetaData?.uid === req.body.identifiers[0].uid || artifactMetaData?.tree === req.body.identifiers[0].uid) 
        && artifactSpecData?.db_key === req.body.identifiers[0].key
    }
  )
  
  if (collectedArtifacts?.length > 1) {
    const artifactByTag = collectedArtifacts.find(artifact => (artifact.metadata?.tag === req.params.tag || artifact.tag === req.params.tag))
    remove(artifacts.artifacts, artifactByTag)
  } else if (collectedArtifacts?.length === 1) {
    collectedArtifacts[0].metadata ? delete collectedArtifacts[0].metadata.tag : delete collectedArtifacts[0].tag
  }

  res.send()
}

function postArtifact(req, res) {
  const currentDate = new Date()
  const artifactTag = req.body.metadata.tag || 'latest'
  const tagObject = artifactTags.find(artifact => artifact.metadata?.project === req.body.metadata.project 
    || artifact.project === req.body.metadata.project)
  const artifactUID = makeUID(40)

  const artifactTemplate = {
    kind: req.body.kind,
    metadata: {
      description: req.body.metadata.description,
      labels: req.body.metadata.labels,
      key: req.body.metadata.key,
      project: req.body.metadata.project,
      tree: req.body.metadata.tree,
      updated: currentDate.toISOString(),
      uid: artifactUID,
      created: currentDate.toISOString()
    },
    spec: {
      db_key: req.body.spec.db_key,
      producer: {
        kind: req.body.spec.producer.kind,
        uri: req.body.spec.producer.uri
      },
      target_path: req.body.spec.target_path
    },
    status: req.body.status,
    project: req.body.metadata.project
  }
  const artifactTemplateLatest = cloneDeep(artifactTemplate)
  
  if (req.body.kind === 'model') {
    artifactTemplate.model_file = req.body.spec.model_file
  }

  if (artifactTag === 'latest') {
    artifactTemplate.metadata['tag'] = artifactTag
    artifacts.artifacts.push(artifactTemplate)
  }
  else{
    artifactTemplate.metadata['tag'] = artifactTag
    artifactTemplateLatest.metadata['tag'] = 'latest'
    artifacts.artifacts.push(artifactTemplate)
    artifacts.artifacts.push(artifactTemplateLatest)
  }

  if (tagObject) {
    tagObject.tags.push(artifactTag)
  } else {
    artifactTags.push({
      project: req.body.metadata.project,
      tags: [artifactTag]
    })
  }

  res.send()
}

function deleteArtifact(req, res) {
  const collectedArtifacts = artifacts.artifacts
    .filter (artifact => {
      const artifactMetaData = artifact.metadata ?? artifact
      const artifactSpecData = artifact.spec ?? artifact

      return artifactMetaData?.project === req.params.project 
        && artifactMetaData?.tree === req.query.tree
        && artifactSpecData?.db_key === req.params.key
    }
  )
  if (collectedArtifacts?.length > 0) {
    collectedArtifacts.forEach(collectedArtifact => remove(artifacts.artifacts, collectedArtifact))    
  }

  res.send({})
}

function getModelEndpoints(req, res) {
  let collectedEndpoints = modelEndpoints.endpoints
    .filter(endpoint => endpoint.metadata.project === req.params.project)
    .map(endpoint => ({
      ...endpoint,
      status: {
        ...endpoint.status,
        drift_measures: null,
        features: null
      }
    }))
  if (req.query['label']) {
    let [key, value] = req.query['label'].split('=')

    collectedEndpoints = collectedEndpoints.filter(endpoint =>
      req.query['label'].includes('=')
        ? endpoint.metadata.labels[key] === value
        : endpoint.metadata.labels[key]
    )
  }

  res.send({ endpoints: collectedEndpoints })
}

function getModelEndpoint(req, res) {
  const endpoint = modelEndpoints.endpoints.find(
    item => item.metadata.project === req.params.project && item.metadata.uid === req.params.uid
  )

  res.send(endpoint)
}

function getNuclioFunctions(req, res) {
  res.send(nuclioFunctions)
}

function getNuclioAPIGateways(req, res) {
  res.send(nuclioAPIGateways)
}

// Iguazio
function getIguazioProjects(req, res) {
  let resultTemplate = cloneDeep(iguazioProjects)

  let filteredProject = {}
  if (req.query.filter.name) {
    filteredProject = cloneDeep(
      iguazioProjects.data.find(item => item.attributes.name === req.query.filter.name)
    )
  }

  let owner
  if (req.query.include === 'owner') {
    let ownerID
    const keys = Object.keys(iguazioUserRelations)
    for (let key of keys) {
      const filterArr = iguazioUserRelations[key]
        .filter(item => item.type === 'project')
        .find(item => item.id === filteredProject.id)
      if (filterArr) {
        ownerID = key
        break
      }
    }
    owner = iguazioUsers.data.find(item => item.id === ownerID)
  }

  filteredProject.attributes.owner_username = owner.attributes.username
  filteredProject.relationships = {
    owner: {
      data: {
        type: owner.type,
        id: owner.id
      }
    }
  }

  delete resultTemplate.data
  resultTemplate.data = [filteredProject]
  resultTemplate.included.push(owner)

  res.send(resultTemplate)
}

function getIguazioAuthorization(req, res) {
  res.send({ data: [], meta: { ctx: 11661436569072727632 } })
}

function getIguazioSelf(req, res) {
  res.send(iguazioSelf)
}

function getIguazioProject(req, res) {
  let filteredProject = iguazioProjects.data.find(item => item.id === req.params.id)

  let filteredAuthRoles = []
  if (req.query.include.includes('project_authorization_roles')) {
    filteredAuthRoles = cloneDeep(
      iguazioProjectAuthorizationRoles.data.filter(
        item => item.relationships.project.data.id === req.params.id
      )
    )
  }
  const authRolesIDs = filteredAuthRoles.map(item => item.id)
  for (let authRole of filteredAuthRoles) {
    delete authRole.relationships
  }

  let filteredPrincipalUsers = []
  if (req.query.include.includes('project_authorization_roles.principal_users')) {
    let principalUserIDs = []
    for (let authID of authRolesIDs) {
      let tmp = iguazioProjectsRelations[req.params.id].find(
        item => item.id === authID
      )?.relationships
      if (tmp) {
        let tmpIDs = tmp.principal_users?.data.map(item => item.id)
        if (tmpIDs) {
          principalUserIDs = [...principalUserIDs, ...tmpIDs]
        }

        filteredAuthRoles.find(item => item.id === authID).relationships = tmp
      }
    }
    for (let userID of principalUserIDs) {
      filteredPrincipalUsers.push(iguazioUsers.data.find(item => item.id === userID))
    }
  }

  let filteredPrincipalUserGroups = []
  if (req.query.include.includes('project_authorization_roles.principal_user_groups')) {
    let principalUserGroupIDs = []
    for (let authID of authRolesIDs) {
      let tmp = iguazioProjectsRelations[req.params.id].find(
        item => item.id === authID
      )?.relationships
      if (tmp) {
        let tmpIDs = tmp.principal_user_groups?.data.map(item => item.id)
        if (tmpIDs) {
          principalUserGroupIDs = [...principalUserGroupIDs, ...tmpIDs]
        }

        filteredAuthRoles.find(item => item.id === authID).relationships = tmp
      }
    }
    for (let groupID of principalUserGroupIDs) {
      filteredPrincipalUserGroups.push(iguazioUserGrops.data.find(item => item.id === groupID))
    }
  }

  res.send({
    data: filteredProject,
    included: [...filteredAuthRoles, ...filteredPrincipalUsers, ...filteredPrincipalUserGroups],
    meta: iguazioProjectAuthorizationRoles.meta
  })
}

function putIguazioProject(req, res) {
  const prevOwner = req.params.id
  const newOwner = req.body.data.relationships.owner.data.id
  const filteredProject = iguazioProjects.data.find(item => item.id === req.params.id)
  const keys = Object.keys(iguazioUserRelations)
  const relationTemplate = {
    type: 'project',
    id: req.params.id,
    relationships: null
  }

  for (let key of keys) {
    iguazioUserRelations[key] = iguazioUserRelations[key].filter(
      item => item.type === 'project' && item.id !== prevOwner
    )
  }

  if (iguazioUserRelations[newOwner]) {
    iguazioUserRelations[newOwner].push(relationTemplate)
  } else {
    iguazioUserRelations[newOwner] = [relationTemplate]
  }

  res.send({
    data: filteredProject,
    included: [],
    meta: iguazioProjectAuthorizationRoles.meta
  })
}

function postProjectMembers(req, res) {
  const projectId = req.body.data.attributes.metadata.project_ids[0]
  const items = req.body.data.attributes.requests
  const projectRelations = cloneDeep(iguazioProjectsRelations[projectId])

  items.forEach(item => {
    const authRoleId = item.resource.split('/')[1]
    const relationshipsTemplate = {
      principal_users: item.body.data.relationships.principal_users,
      principal_user_groups: item.body.data.relationships.principal_user_groups
    }

    if (projectRelations.some(relation => relation.id === authRoleId)) {
      const index = projectRelations.findIndex(relation => {
        return relation.id === authRoleId
      })
      projectRelations[index] = {
        ...projectRelations[index],
        relationships: relationshipsTemplate
      }
    } else {
      projectRelations.push({
        type: 'project_authorization_role',
        id: authRoleId,
        relationships: relationshipsTemplate
      })
    }
  })

  iguazioProjectsRelations[projectId] = projectRelations

  res.send({
    data: {
      type: 'job',
      id: '2f9e2b29-edfc-4107-a4c7-9f6579e69a76'
    },
    meta: {
      ctx: '09778294116375957090'
    }
  })
}

function getIguazioUserGrops(req, res) {
  res.send(iguazioUserGrops)
}

function getIguazioUsers(req, res) {
  res.send(iguazioUsers)
}

function getNuclioStreams(req, res) {
  res.send(nuclioStreams[req.headers['x-nuclio-project-name']])
}

function getNuclioShardLags(req, res) {
  res.send({
    [`${req.body.containerName}${req.body.streamPath}`]: {
      [req.body.consumerGroup]: {
        'shard-id-0': {
          committed: '0_123',
          current: '0_456',
          lag: '0_789'
        },
        'shard-id-1': {
          committed: '1_123',
          current: '1_456',
          lag: '1_789'
        }
      }
    }
  })
}

function getIguazioJob(req, res) {
  res.send({
    data: {
      attributes: {
        state: 'completed'
      }
    }
  })
}

// REQUESTS
app.get(`${mlrunAPIIngress}/frontend-spec`, getFrontendSpec)

app.get(`${mlrunAPIIngress}/projects/:project/feature-sets`, getFeatureSet)

// POST request after ferification should be deleted
app.post(`${mlrunAPIIngress}/projects/:project/feature-sets`, createProjectsFeatureSet)
app.put(
  `${mlrunAPIIngress}/projects/:project/feature-sets/:name/references/:tag`,
  createProjectsFeatureSet
)
app.delete(`${mlrunAPIIngress}/projects/:project/feature-sets/:featureSet`, deleteFeatureSet)

app.get(`${mlrunAPIIngress}/projects`, getProjects)
app.post(`${mlrunAPIIngress}/projects`, createNewProject)
app.get(`${mlrunAPIIngress}/projects/:project`, getProject)
app.delete(`${mlrunAPIIngress}/projects/:project`, deleteProject)
app.patch(`${mlrunAPIIngress}/projects/:project`, patchProject)
app.put(`${mlrunAPIIngress}/projects/:project`, putProject)
app.get(`${mlrunAPIIngress}/projects/:project/secret-keys`, getSecretKeys)
app.post(`${mlrunAPIIngress}/projects/:project/secrets`, postSecretKeys)
app.delete(`${mlrunAPIIngress}/projects/:project/secrets`, deleteSecretKeys)

app.get(`${mlrunAPIIngress}/project-summaries`, getProjectsSummaries)
app.get(`${mlrunAPIIngress}/project-summaries/:project`, getProjectSummary)

app.get(`${mlrunAPIIngress}/runs`, getRuns)
app.get(`${mlrunAPIIngress}/run/:project/:uid`, getRun)
app.patch(`${mlrunAPIIngress}/run/:project/:uid`, patchRun)
app.delete(`${mlrunAPIIngress}/projects/:project/runs/:uid`, deleteRun)
app.delete(`${mlrunAPIIngress}/projects/:project/runs`, deleteRuns)
app.get(`${mlrunIngress}/catalog.json`, getFunctionCatalog)
app.get(`${mlrunAPIIngress}/hub/sources/:project/items`, getFunctionCatalog)
app.get(`${mlrunAPIIngress}/hub/sources/:project/items/:uid`, getFunctionItem)
app.get(`${mlrunAPIIngress}/hub/sources/:project/item-object`, getFunctionObject)
app.get(`${mlrunIngress}/:function/function.yaml`, getFunctionTemplate)

app.get(`${mlrunAPIIngress}/projects/:project/schedules`, getProjectsSchedules)
app.get(`${mlrunAPIIngress}/projects/:project/schedules/:schedule`, getProjectsSchedule)
app.delete(`${mlrunAPIIngress}/projects/:project/schedules/:schedule`, deleteSchedule)

app.get(`${mlrunAPIIngress}/projects/:project/pipelines`, getPipelines)
app.get(`${mlrunAPIIngress}/projects/:project/pipelines/:pipelineID`, getPipeline)

app.get(`${mlrunAPIIngress}/projects/:project/artifact-tags`, getProjectsArtifactTags)
app.get(`${mlrunAPIIngressV2}/projects/:project/artifacts`, getArtifacts)
app.post(`${mlrunAPIIngressV2}/projects/:project/artifacts`, postArtifact)
app.delete(`${mlrunAPIIngressV2}/projects/:project/artifacts/:key`, deleteArtifact)

app.put(`${mlrunAPIIngress}/projects/:project/tags/:tag`, putTags)
app.delete(`${mlrunAPIIngress}/projects/:project/tags/:tag`, deleteTags)

app.get(
  `${mlrunAPIIngress}/projects/:project/feature-sets/:name/references/:tag`,
  getProjectsFeatureSets
)
app.patch(
  `${mlrunAPIIngress}/projects/:project/feature-sets/:name/references/:tag`,
  patchProjectsFeatureSets
)
app.post(`${mlrunAPIIngress}/projects/:project/feature-vectors`, postProjectsFeatureVectors)
app.put(
  `${mlrunAPIIngress}/projects/:project/feature-vectors/:name/references/:tag`,
  putProjectsFeatureVectors
)
app.patch(
  `${mlrunAPIIngress}/projects/:project/feature-vectors/:name/references/:tag`,
  patchProjectsFeatureVectors
)
app.delete(
  `${mlrunAPIIngress}/projects/:project/feature-vectors/:name`,
  deleteProjectsFeatureVectors
)

app.get(`${mlrunAPIIngress}/projects/:project/functions`, getFuncs)

app.get(`${mlrunAPIIngress}/projects/:project/functions/:func`, getFunc)
app.post(`${mlrunAPIIngress}/projects/:project/functions/:func`, postFunc)

app.get(
  `${mlrunAPIIngress}/projects/:project/:featureArtifact/*/tags`,
  getProjectsFeatureArtifactTags
)

app.delete(`${mlrunAPIIngress}/projects/:project/functions/:func`, deleteFunc)

app.get(`${mlrunAPIIngress}/build/status`, getBuildStatus)
app.post(`${mlrunAPIIngress}/build/function`, deployMLFunction)

app.get(`${mlrunAPIIngress}/files`, getFile)

app.get(`${mlrunAPIIngress}/log/:project/:uid`, getLog)

app.get(`${mlrunAPIIngress}/projects/:project/runtime-resources`, getRuntimeResources)

app.get(`${mlrunAPIIngress}/projects/:project/model-endpoints`, getModelEndpoints)
app.get(`${mlrunAPIIngress}/projects/:project/model-endpoints/:uid`, getModelEndpoint)

app.get(`${mlrunAPIIngress}/projects/:project/:artifact`, getProjectsFeaturesEntities)

app.post(`${mlrunAPIIngress}/submit_job`, postSubmitJob)

app.get(`${nuclioApiUrl}/api/functions`, getNuclioFunctions)

app.get(`${nuclioApiUrl}/api/api_gateways`, getNuclioAPIGateways)

app.get(`${nuclioApiUrl}/api/v3io_streams`, getNuclioStreams)

app.post(`${nuclioApiUrl}/api/v3io_streams/get_shard_lags`, getNuclioShardLags)

app.get(`${iguazioApiUrl}/api/projects`, getIguazioProjects)

app.get(`${iguazioApiUrl}/api/projects/__name__/:project/authorization`, getIguazioAuthorization)

app.get(`${iguazioApiUrl}/api/self`, getIguazioSelf)

app.get(`${iguazioApiUrl}/api/projects/:id`, getIguazioProject)

app.put(`${iguazioApiUrl}/api/projects/:id`, putIguazioProject)

app.post(`${iguazioApiUrl}/api/async_transactions`, postProjectMembers)

app.get(`${iguazioApiUrl}/api/user_groups`, getIguazioUserGrops)

app.get(`${iguazioApiUrl}/api/scrubbed_user_groups`, getIguazioUserGrops)

app.get(`${iguazioApiUrl}/api/users`, getIguazioUsers)

app.get(`${iguazioApiUrl}/api/scrubbed_users`, getIguazioUsers)

app.get(`${iguazioApiUrl}/api/jobs/:id`, getIguazioJob)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
