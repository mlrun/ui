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

/* Mock of the ORIS leader (Orca) project lifecycle, kept apart from mock.js so the main handlers
 * stay readable. mock.js only calls `registerOrcaMock(app, deps)`.
 *
 * Failure scenarios are selected by project name:
 *   - "stuck" / "retry": every operation's execution keeps reporting `failed`, which exercises the
 *     UI's "issues detected, retrying" wording. The project stays on the leader when deleted.
 *   - "cas-conflict" (ORIS-4811): a project whose earlier update never converged. A delete is
 *     accepted (202) but its execution fails with a raw `op_id mismatch`; the project stays
 *     `deleting`, so a second delete is refused with a raw CAS conflict (409).
 * Other behaviour: creating a project whose name is `deleting` returns 412 (ORIS-4776), and
 * updates reject fields the leader does not know.
 * A few ready-made test projects are seeded (see below).
 */

import crypto from 'node:crypto'
import { cloneDeep, random, remove } from 'lodash'

const DEFAULT_FAILURE_ERROR = 'simulated sync failure, retrying'

const isStuckProject = name => /stuck|retry/.test(name ?? '')
const isCasConflictProject = name => /cas-conflict/.test(name ?? '')

/**
 * Describes how the sync execution of an operation on the named project should end.
 * @param {string} name - the project name.
 * @param {function} generateOpId - produces op ids used in the simulated mismatch text.
 * @returns {{shouldFail: boolean, lastError?: string}}
 */
function getOperationFailure(name, generateOpId) {
  if (isCasConflictProject(name)) {
    return {
      shouldFail: true,
      lastError: `op_id mismatch; requested:("${generateOpId()}"), stored:("${generateOpId()}")`
    }
  }

  return isStuckProject(name)
    ? { shouldFail: true, lastError: DEFAULT_FAILURE_ERROR }
    : { shouldFail: false }
}

/**
 * A project whose sync keeps failing stays on the leader (in `deleting`) instead of disappearing.
 * @param {string} name - the project name.
 * @returns {boolean}
 */
const staysAfterDelete = name => isStuckProject(name) || isCasConflictProject(name)

/**
 * The body of the 409 a repeated delete gets while the previous one is still unresolved, or `null`
 * when the delete should go through.
 * @param {Object} project - the leader's copy of the project.
 * @returns {Object|null}
 */
function getDeleteConflictBody(project) {
  if (isCasConflictProject(project.metadata.name) && project.status.state === 'deleting') {
    return {
      status: {
        errorMessage: `MLRunConflictError('CAS mismatch: stored op_id ${project.status.opId} does not match prev_op_id')`
      }
    }
  }

  return null
}

/**
 * Registers the leader's project and trackable-action routes on the mock server.
 * @param {Object} app - the express app.
 * @param {Object} deps - the mock's in-memory state and templates, shared with the MLRun routes.
 */
function registerOrcaMock(
  app,
  {
    iguazioApiUrl,
    projects,
    projectsSummary,
    secretKeys,
    projectTemplate,
    summuryTemplate,
    secretKeyTemplate
  }
) {
  /* ============================ ORIS project lifecycle (Orca) ============================
   *
   * In ORIS the leader (Orca) owns project mutations while reads stay on MLRun, so these handlers
   * sit alongside the MLRun ones above rather than replacing them (ORIS-3384). They mirror the
   * live leader's contract as verified against it:
   *
   *   - Every mutation answers 202 with the project body, whose `status.opId` identifies the
   *     operation. The outcome is then polled from the trackable-actions endpoint (ML-12907).
   *   - Bodies are flat, not MLRun's `{metadata, spec}`: the endpoints are a gRPC-gateway proxy
   *     that rejects unknown fields. `desiredState` is a protobuf enum taken as an integer.
   *   - PATCH and PUT require `owner`. Existing projects also need a compare-and-swap witness
   *     `prevOpId` holding the leader's current op id; a stale witness is 409. PUT upserts when
   *     the project is absent and ignores prevOpId; PATCH returns 404.
   */

  const ORCA_ONLINE_STATE = 1
  const ORCA_ARCHIVED_STATE = 3

  // Keyed by op id, mirroring the real `sync-project` execution ({status: {state, lastError}}).
  const trackableActionExecutions = {}

  const nextOpId = () => crypto.randomBytes(18).toString('hex')

  function createSyncExecution(
    opId,
    { shouldFail = false, settleAfter = random(1000, 3000), lastError = DEFAULT_FAILURE_ERROR } = {}
  ) {
    trackableActionExecutions[opId] = { status: { state: 'running' } }

    setTimeout(() => {
      trackableActionExecutions[opId] = shouldFail
        ? { status: { state: 'failed', lastError } }
        : { status: { state: 'succeeded' } }
    }, settleAfter)
  }

  const findProject = name => projects.projects.find(project => project.metadata.name === name)

  // Records an operation against a project. The leader's own copy is updated at once - what takes
  // time, and what the UI actually tracks, is the trackable-action execution that syncs the change
  // to MLRun. Keeping the record itself immediate is also what makes the e2e suite deterministic:
  // tests drive settling through the execution endpoint (see ui-browser-tests/lib/orcaMode.js), and
  // a project record that changed on a timer of its own would race that.
  function startOperation(project, { shouldFail = false, lastError } = {}) {
    const opId = nextOpId()

    project.status.opId = opId
    project.status.phase = null

    createSyncExecution(opId, { shouldFail, ...(lastError && { lastError }) })

    return opId
  }

  function checkCasWitness(req, res, project) {
    if (!req.body.owner) {
      res.status(400).send({ status: { errorMessage: 'Project owner is required' } })
      return false
    }

    if (!req.body.prevOpId) {
      res.status(400).send({
        status: { errorMessage: 'prevOpId is required (use the current op_id from GET)' }
      })
      return false
    }

    if (project.status.opId && req.body.prevOpId !== project.status.opId) {
      res.status(409).send({
        status: {
          errorMessage: `CAS mismatch: stored op_id ${project.status.opId} does not match prev_op_id ${req.body.prevOpId}`
        }
      })
      return false
    }

    return true
  }

  function applyDesiredState(project, body) {
    if (body.desiredState === ORCA_ARCHIVED_STATE) {
      project.spec.desired_state = 'archived'
      project.status.state = 'archived'
    } else if (body.desiredState === ORCA_ONLINE_STATE) {
      project.spec.desired_state = 'online'
      project.status.state = 'online'
    }
  }

  function applyOrcaFields(project, body) {
    if (body.description != null) project.spec.description = body.description
    if (body.owner != null) project.spec.owner = body.owner
    if (body.labels != null) project.metadata.labels = body.labels
    if (body.annotations != null) project.metadata.annotations = body.annotations
  }

  function listOrcaProjects(req, res) {
    res.send({ items: projects.projects })
  }

  function getOrcaProject(req, res) {
    const project = findProject(req.params.name)

    if (!project) {
      res.status(404).send({ status: { errorMessage: `Project ${req.params.name} not found` } })
      return
    }

    res.send(project)
  }

  // Fields the leader's update accepts; it is strict and rejects anything else (e.g. MLRun-only
  // `artifact_path`) with 400.
  const ORCA_UPDATE_FIELDS = [
    'name',
    'owner',
    'prevOpId',
    'description',
    'labels',
    'annotations',
    'desiredState'
  ]

  function checkUpdateFields(req, res) {
    const unknownField = Object.keys(req.body).find(key => !ORCA_UPDATE_FIELDS.includes(key))

    if (unknownField) {
      res.status(400).send({
        status: {
          errorMessage: `Failed to convert request body to proto message: unknown field "${unknownField}"`,
          statusCode: 400
        }
      })

      return false
    }

    return true
  }

  function createOrcaProject(req, res) {
    const existingProject = findProject(req.body.name)

    if (existingProject?.status.state === 'deleting') {
      res.status(412).send({
        status: {
          errorMessage: `Cannot create project while it is deleting (name=${req.body.name})`,
          statusCode: 412
        }
      })
      return
    }

    if (existingProject) {
      res.status(409).send({ status: { errorMessage: `Project ${req.body.name} already exists` } })
      return
    }

    const project = cloneDeep(projectTemplate)

    project.metadata.name = req.body.name
    project.metadata.created = new Date().toISOString()
    // The leader assigns the requesting user as owner even when the body carries none, and every
    // later write requires one.
    project.spec.owner = req.body.owner ?? 'admin'
    applyOrcaFields(project, req.body)
    projects.projects.push(project)

    const summary = cloneDeep(summuryTemplate)
    summary.name = project.metadata.name
    projectsSummary.project_summaries.push(summary)
    secretKeys[project.metadata.name] = secretKeyTemplate

    startOperation(project, getOperationFailure(project.metadata.name, nextOpId))

    res.status(202).send(project)
  }

  function patchOrcaProject(req, res) {
    const project = findProject(req.params.name)

    if (!project) {
      res.status(404).send({ status: { errorMessage: `Project ${req.params.name} not found` } })
      return
    }

    if (!checkUpdateFields(req, res) || !checkCasWitness(req, res, project)) return

    applyOrcaFields(project, req.body)
    applyDesiredState(project, req.body)
    startOperation(project, getOperationFailure(project.metadata.name, nextOpId))

    res.status(202).send(project)
  }

  function putOrcaProject(req, res) {
    if (!checkUpdateFields(req, res)) return

    let project = findProject(req.params.name)

    if (!project) {
      project = cloneDeep(projectTemplate)
      project.metadata.name = req.body.name ?? req.params.name
      project.metadata.created = new Date().toISOString()
      project.spec.owner = req.body.owner ?? 'admin'
      applyOrcaFields(project, req.body)
      applyDesiredState(project, req.body)
      projects.projects.push(project)

      const summary = cloneDeep(summuryTemplate)
      summary.name = project.metadata.name
      projectsSummary.project_summaries.push(summary)
      secretKeys[project.metadata.name] = secretKeyTemplate

      startOperation(project, getOperationFailure(project.metadata.name, nextOpId))
      res.status(202).send(project)
      return
    }

    if (!checkCasWitness(req, res, project)) return

    applyOrcaFields(project, req.body)
    applyDesiredState(project, req.body)
    startOperation(project, getOperationFailure(project.metadata.name, nextOpId))

    res.status(202).send(project)
  }

  function deleteOrcaProject(req, res) {
    const project = findProject(req.params.name)

    if (!project) {
      res.status(404).send({ status: { errorMessage: `Project ${req.params.name} not found` } })
      return
    }

    const conflictBody = getDeleteConflictBody(project)

    if (conflictBody) {
      res.status(409).send(conflictBody)
      return
    }

    project.status.state = 'deleting'
    startOperation(project, getOperationFailure(project.metadata.name, nextOpId))

    const body = cloneDeep(project)

    // A project whose sync keeps failing stays on the leader in its `deleting` state; otherwise it
    // is gone, and the UI will see that on the read it does once the operation reports success.
    if (!staysAfterDelete(project.metadata.name)) {
      remove(projects.projects, ({ metadata }) => metadata.name === req.params.name)
      remove(projectsSummary.project_summaries, ({ name }) => name === req.params.name)
    }

    res.status(202).send(body)
  }

  // An empty `items` array means the dispatch is not visible yet, which the UI treats as "still
  // running" rather than as an outcome.
  function getOrcaActionExecution(req, res) {
    const execution = trackableActionExecutions[req.query.correlationId]

    res.send({ items: execution ? [execution] : [] })
  }

  // Test projects for the scenarios below. Each carries an `opId`, which every Orca mutation needs
  // as its CAS witness; the stock projects have none.
  //
  //   - orca-demo:         behaves normally.
  //   - cas-conflict-demo: delete is accepted (202) but its execution fails with a raw `op_id
  //                        mismatch`; the project stays `deleting` (ORIS-4811).
  //   - stuck-demo:        every operation's execution keeps failing ("issues detected, retrying").
  //   - deleting-demo:     already `deleting`; creating a project with this name returns 412
  //                        (ORIS-4776).
  const ORCA_TEST_PROJECTS = [
    { name: 'orca-demo', state: 'online' },
    { name: 'cas-conflict-demo', state: 'online' },
    { name: 'stuck-demo', state: 'online' },
    { name: 'deleting-demo', state: 'deleting' }
  ]

  ORCA_TEST_PROJECTS.forEach(({ name, state }) => {
    if (findProject(name)) return

    const project = cloneDeep(projectTemplate)

    project.metadata.name = name
    project.metadata.created = new Date().toISOString()
    project.metadata.labels = { env: 'test' }
    project.spec.owner = 'admin'
    project.spec.description = `Orca test project (${name})`
    project.status.state = state
    project.status.opId = nextOpId()
    projects.projects.push(project)

    const summary = cloneDeep(summuryTemplate)
    summary.name = name
    projectsSummary.project_summaries.push(summary)
    secretKeys[name] = secretKeyTemplate
  })

  /* ====================== end ORIS project lifecycle (Orca) ====================== */

  // Served under the platform prefix (what `/iguazio/api` is proxied to) and under `/oris`, the
  // base `iguazioHttpClient` uses in ORIS mode.
  ;[iguazioApiUrl, '/oris'].forEach(prefix => {
    app.get(`${prefix}/api/v1/projects/projects`, listOrcaProjects)
    app.get(`${prefix}/api/v1/projects/projects/:name`, getOrcaProject)
    app.post(`${prefix}/api/v1/projects/projects`, createOrcaProject)
    app.patch(`${prefix}/api/v1/projects/projects/:name`, patchOrcaProject)
    app.put(`${prefix}/api/v1/projects/projects/:name`, putOrcaProject)
    app.delete(`${prefix}/api/v1/projects/projects/:name`, deleteOrcaProject)
    app.get(`${prefix}/api/v1/trackable-actions/executions`, getOrcaActionExecution)
  })
}

export { registerOrcaMock }
