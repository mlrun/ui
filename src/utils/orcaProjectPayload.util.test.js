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
import { PROJECT_ARCHIVED_STATE, PROJECT_ONLINE_STATUS } from '../constants'
import {
  toOrcaCreatePayload,
  toOrcaStatePayload,
  toOrcaUpdatePayload
} from './orcaProjectPayload.util'

// ── Helpers ───────────────────────────────────────────────────────────────────

const makeProject = ({ metadata = {}, spec = {}, status } = {}) => ({
  metadata: { name: 'my-project', ...metadata },
  spec: { owner: 'alice', ...spec },
  ...(status && { status })
})

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('orcaProjectPayload.util', () => {
  // ── toOrcaCreatePayload ─────────────────────────────────────────────────────

  describe('toOrcaCreatePayload', () => {
    it('flattens metadata and spec into a single object', () => {
      const payload = toOrcaCreatePayload({
        metadata: { name: 'my-project', labels: { env: 'dev' } },
        spec: { owner: 'alice', description: 'my description' }
      })

      expect(payload).toEqual({
        name: 'my-project',
        labels: { env: 'dev' },
        owner: 'alice',
        description: 'my description'
      })
    })

    it('does not keep the metadata and spec wrappers', () => {
      const payload = toOrcaCreatePayload(makeProject())

      expect(payload).not.toHaveProperty('metadata')
      expect(payload).not.toHaveProperty('spec')
    })

    it('lets metadata keys win over spec keys on collision', () => {
      const payload = toOrcaCreatePayload({
        metadata: { name: 'metadata-name', description: 'from metadata' },
        spec: { name: 'spec-name', description: 'from spec' }
      })

      expect(payload.name).toBe('metadata-name')
      expect(payload.description).toBe('from metadata')
    })

    it('drops the status section', () => {
      const payload = toOrcaCreatePayload(makeProject({ status: { opId: 'op-1' } }))

      expect(payload).not.toHaveProperty('status')
      expect(payload).not.toHaveProperty('prevOpId')
    })

    it('returns an empty object for an undefined project', () => {
      expect(toOrcaCreatePayload()).toEqual({})
    })

    it('returns an empty object for an empty project', () => {
      expect(toOrcaCreatePayload({})).toEqual({})
    })

    it('handles a project with only metadata', () => {
      expect(toOrcaCreatePayload({ metadata: { name: 'only-metadata' } })).toEqual({
        name: 'only-metadata'
      })
    })

    it('handles a project with only spec', () => {
      expect(toOrcaCreatePayload({ spec: { owner: 'bob' } })).toEqual({ owner: 'bob' })
    })

    it('handles null metadata and spec sections', () => {
      expect(toOrcaCreatePayload({ metadata: null, spec: null })).toEqual({})
    })
  })

  // ── toOrcaUpdatePayload ─────────────────────────────────────────────────────

  describe('toOrcaUpdatePayload', () => {
    it('takes name from metadata.name and owner from spec.owner', () => {
      const payload = toOrcaUpdatePayload(makeProject())

      expect(payload.name).toBe('my-project')
      expect(payload.owner).toBe('alice')
    })

    it('flattens metadata and spec alongside the mutation base', () => {
      const payload = toOrcaUpdatePayload(
        makeProject({
          metadata: { labels: { env: 'dev' } },
          spec: { description: 'my description' }
        })
      )

      expect(payload).toEqual({
        name: 'my-project',
        owner: 'alice',
        labels: { env: 'dev' },
        description: 'my description'
      })
    })

    it('includes prevOpId when status.opId is present', () => {
      const payload = toOrcaUpdatePayload(makeProject({ status: { opId: 'op-1' } }))

      expect(payload.prevOpId).toBe('op-1')
    })

    it('includes prevOpId when the snake_case status.op_id is present', () => {
      const payload = toOrcaUpdatePayload(makeProject({ status: { op_id: 'op-2' } }))

      expect(payload.prevOpId).toBe('op-2')
    })

    it('prefers the camelCase opId over the snake_case op_id', () => {
      const payload = toOrcaUpdatePayload(
        makeProject({ status: { opId: 'camel-op', op_id: 'snake-op' } })
      )

      expect(payload.prevOpId).toBe('camel-op')
    })

    it('omits prevOpId when there is no status', () => {
      expect(toOrcaUpdatePayload(makeProject())).not.toHaveProperty('prevOpId')
    })

    it('omits prevOpId when the opId is an empty string', () => {
      const payload = toOrcaUpdatePayload(makeProject({ status: { opId: '' } }))

      expect(payload).not.toHaveProperty('prevOpId')
    })

    it('omits prevOpId when the opId is null', () => {
      const payload = toOrcaUpdatePayload(makeProject({ status: { opId: null } }))

      expect(payload).not.toHaveProperty('prevOpId')
    })

    it('leaves name and owner undefined when metadata and spec do not carry them', () => {
      const payload = toOrcaUpdatePayload({ metadata: {}, spec: {} })

      expect(payload.name).toBeUndefined()
      expect(payload.owner).toBeUndefined()
    })

    it('does not throw for an undefined project', () => {
      expect(() => toOrcaUpdatePayload()).not.toThrow()
      expect(toOrcaUpdatePayload()).toEqual({ name: undefined, owner: undefined })
    })

    it('does not throw for an empty project', () => {
      expect(toOrcaUpdatePayload({})).toEqual({ name: undefined, owner: undefined })
    })
  })

  // ── toOrcaStatePayload ──────────────────────────────────────────────────────

  describe('toOrcaStatePayload', () => {
    it('maps the online state to desiredState 1', () => {
      expect(toOrcaStatePayload(PROJECT_ONLINE_STATUS, makeProject()).desiredState).toBe(1)
    })

    it('maps the archived state to desiredState 3', () => {
      expect(toOrcaStatePayload(PROJECT_ARCHIVED_STATE, makeProject()).desiredState).toBe(3)
    })

    it('yields an undefined desiredState for an unrecognised state', () => {
      expect(toOrcaStatePayload('creating', makeProject()).desiredState).toBeUndefined()
    })

    it('yields an undefined desiredState when no state is given', () => {
      expect(toOrcaStatePayload(undefined, makeProject()).desiredState).toBeUndefined()
    })

    it('includes the mutation base alongside the desired state', () => {
      const payload = toOrcaStatePayload(PROJECT_ONLINE_STATUS, makeProject())

      expect(payload).toEqual({ name: 'my-project', owner: 'alice', desiredState: 1 })
    })

    it('includes prevOpId when the project carries an opId', () => {
      const payload = toOrcaStatePayload(
        PROJECT_ARCHIVED_STATE,
        makeProject({ status: { opId: 'op-1' } })
      )

      expect(payload).toEqual({
        name: 'my-project',
        owner: 'alice',
        prevOpId: 'op-1',
        desiredState: 3
      })
    })

    it('does not flatten metadata and spec into the state payload', () => {
      const payload = toOrcaStatePayload(
        PROJECT_ONLINE_STATUS,
        makeProject({ spec: { description: 'my description' } })
      )

      expect(payload).not.toHaveProperty('description')
    })

    it('does not throw when no project is given', () => {
      expect(() => toOrcaStatePayload(PROJECT_ONLINE_STATUS)).not.toThrow()
      expect(toOrcaStatePayload(PROJECT_ONLINE_STATUS)).toEqual({
        name: undefined,
        owner: undefined,
        desiredState: 1
      })
    })
  })
})
