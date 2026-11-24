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

/*
 * Temporary shim: Orca does not accept MLRun's `{ metadata, spec }` project body. Its endpoints are
 * a gRPC-gateway proxy, so the MLRun body fails with `proto: unknown field "metadata"`. It expects
 * a flat message instead, which is what this module produces.
 *
 * Every MLRun -> Orca payload difference is confined to this file so that, once the leader accepts
 * the MLRun shape, this module can be deleted and `projects-orca-api.js` can pass its payloads
 * straight through.
 *
 * TODO: the flattening below forwards every `spec`/`metadata` key the UI holds, including the
 * MLRun-only settings (artifact path, source, goals, params, node selectors, default image) that
 * the leader has no field for. Whether it ignores or rejects them is a leader-side bug being fixed
 * on the backend; until that lands, Project Settings saves in ORIS mode are unverified. Link the
 * Orca ticket here once it is filed.
 */

import { pick } from 'lodash-es'

import { PROJECT_ARCHIVED_STATE, PROJECT_ONLINE_STATUS } from '../constants'

// The only fields the leader's update accepts besides the identity/CAS base. It rejects unknown
// fields (e.g. MLRun-only `artifact_path`), so everything else must be left out of the body.
const ORCA_UPDATABLE_FIELDS = ['description', 'labels', 'annotations']

// The leader's ProjectState enum: 0 unspecified, 1 creating, 2 online, 3 deleting, 4 archived. Only
// online and archived may be requested; the leader refuses creating and deleting with a 400.
const ORCA_DESIRED_STATE_BY_MLRUN_STATE = {
  [PROJECT_ONLINE_STATUS]: 2,
  [PROJECT_ARCHIVED_STATE]: 4
}

/**
 * Flattens MLRun's `{ metadata, spec }` project body into the fields the leader accepts. Metadata
 * keys win over spec keys on collision. `metadata` itself is not sent.
 * @param {Object} [project]
 * @returns {Object}
 */
const toOrcaProjectFields = (project = {}) => {
  const { metadata = {}, spec = {} } = project

  return {
    ...(spec && { ...spec }),
    ...(metadata && { ...metadata })
  }
}

const readOpId = project => project?.status?.opId ?? project?.status?.op_id

/**
 * CAS witness and identity fields required on every mutation of an existing project.
 * `prevOpId` is omitted when the project has none, rather than sending a stale value.
 * @param {Object} [project]
 * @returns {{name: (string|undefined), owner: (string|undefined), prevOpId?: string}}
 */
const toOrcaMutationBase = (project = {}) => {
  const prevOpId = readOpId(project)

  return {
    name: project.metadata?.name,
    owner: project.spec?.owner,
    ...(prevOpId && { prevOpId })
  }
}

/**
 * Reads the CAS witness from a leader project: its owner and op id. Both are kept together because
 * every owner change produces a new op id, so a pair read at the same time is either current or
 * gets a 409, while an old owner sent with a new op id would transfer ownership back.
 * @param {Object} [latest] - a leader project body or axios response.
 * @returns {{owner: (string|undefined), opId: (string|undefined)}}
 */
export const getLeaderWitness = latest => {
  const project = latest?.data ?? latest

  return { owner: project?.spec?.owner, opId: readOpId(project) }
}

/**
 * Puts a leader witness onto `project` without mutating either: `spec.owner` and `status.opId`
 * come from the witness, everything else from the project.
 * @param {Object} project
 * @param {{owner: string, opId: string}} witness - see `getLeaderWitness`.
 * @returns {Object} a new project object.
 */
export const withLeaderWitness = (project, { owner, opId }) => ({
  ...project,
  spec: { ...project?.spec, owner },
  status: { ...project?.status, opId }
})

/**
 * Body for `POST /v1/projects/projects`. Create does not take a CAS witness.
 * @param {Object} project - MLRun-shaped `{ metadata, spec }` project.
 * @returns {Object}
 */
export const toOrcaCreatePayload = project => toOrcaProjectFields(project)

/**
 * Body for `PUT`/`PATCH /v1/projects/projects/{name}`. Includes `prevOpId` when the project
 * already carries one so the leader can reject a stale write with 409.
 * @param {Object} project - MLRun-shaped `{ metadata, spec }` project.
 * @returns {Object}
 */
export const toOrcaUpdatePayload = project => {
  const fields = toOrcaProjectFields(project)

  return {
    ...toOrcaMutationBase(project),
    ...pick(fields, ORCA_UPDATABLE_FIELDS)
  }
}

/**
 * Body for archive/unarchive (`PATCH` with `desiredState`). Maps MLRun's `'online'`/`'archived'`
 * strings onto the leader's integer enum (2 and 4). An unrecognised state yields
 * `desiredState: undefined`.
 * @param {string} state - MLRun desired state (`'online'` or `'archived'`).
 * @param {Object} project - MLRun-shaped `{ metadata, spec }` project; supplies name, owner and
 *     the CAS witness.
 * @returns {Object}
 */
export const toOrcaStatePayload = (state, project) => ({
  ...toOrcaMutationBase(project),
  desiredState: ORCA_DESIRED_STATE_BY_MLRUN_STATE[state]
})
