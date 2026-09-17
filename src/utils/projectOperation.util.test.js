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
import orcaProjectsApi from '../api/projects-orca-api'
import {
  endProjectTransition,
  getProjectOperationId,
  isProjectOperationConflict,
  startProjectTransition,
  trackProjectMutation,
  withLatestOpId
} from './projectOperation.util'
import {
  getProjectTransition,
  getProjectTransitionTooltip,
  isProjectTransitioning
} from './projectTransition.util'

// ── Mocks ─────────────────────────────────────────────────────────────────────

// `IS_MF_MODE` is a module-scope const computed from `window.mlrunConfig`, so it is replaced with a
// getter over a mutable flag that every test can flip.
const mfMode = vi.hoisted(() => ({ enabled: true }))

vi.mock('../constants', async importOriginal => {
  const actual = await importOriginal()

  return {
    ...actual,
    get IS_MF_MODE() {
      return mfMode.enabled
    }
  }
})

vi.mock('../reducers/projectReducer', () => ({
  removeProject: vi.fn(projectName => ({ type: 'removeProject', payload: projectName })),
  setProjectTransition: vi.fn(payload => ({ type: 'setProjectTransition', payload }))
}))

vi.mock('../api/projects-orca-api', () => ({
  default: {
    getActionExecutions: vi.fn(),
    getProject: vi.fn()
  }
}))

vi.mock('igz-controls/utils/notification.util', () => ({
  showErrorNotification: vi.fn()
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

const makeProject = (name = 'my-project', status = {}) => ({
  metadata: { name },
  spec: { owner: 'alice' },
  status
})

const transitionAction = payload => ({ type: 'setProjectTransition', payload })

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('projectOperation.util', () => {
  beforeEach(() => {
    mfMode.enabled = true
    vi.clearAllMocks()
    // Nothing resolves this poll, so the tracking promise stays pending and the test never waits.
    orcaProjectsApi.getActionExecutions.mockReturnValue(new Promise(() => {}))
  })

  // ── getProjectOperationId ───────────────────────────────────────────────────

  describe('getProjectOperationId', () => {
    it('reads status.opId from a bare project body', () => {
      expect(getProjectOperationId({ status: { opId: 'op-1' } })).toBe('op-1')
    })

    it('reads the snake_case status.op_id from a bare project body', () => {
      expect(getProjectOperationId({ status: { op_id: 'op-2' } })).toBe('op-2')
    })

    it('reads status.opId from an axios-style response', () => {
      expect(getProjectOperationId({ data: { status: { opId: 'op-3' } } })).toBe('op-3')
    })

    it('reads the snake_case status.op_id from an axios-style response', () => {
      expect(getProjectOperationId({ data: { status: { op_id: 'op-4' } } })).toBe('op-4')
    })

    it('prefers the camelCase opId over the snake_case op_id', () => {
      expect(getProjectOperationId({ status: { opId: 'camel', op_id: 'snake' } })).toBe('camel')
    })

    it('returns undefined when the project has no status', () => {
      expect(getProjectOperationId({ metadata: { name: 'my-project' } })).toBeUndefined()
    })

    it('returns undefined when the status carries no operation id', () => {
      expect(getProjectOperationId({ status: { state: 'online' } })).toBeUndefined()
    })

    it('returns undefined for an undefined payload', () => {
      expect(getProjectOperationId(undefined)).toBeUndefined()
    })

    it('returns undefined for a null payload', () => {
      expect(getProjectOperationId(null)).toBeUndefined()
    })
  })

  // ── isProjectOperationConflict ──────────────────────────────────────────────

  describe('isProjectOperationConflict', () => {
    it('returns true for a 409 in MF mode', () => {
      expect(isProjectOperationConflict({ response: { status: 409 } })).toBe(true)
    })

    it('returns false for a 409 in CE mode', () => {
      mfMode.enabled = false

      expect(isProjectOperationConflict({ response: { status: 409 } })).toBe(false)
    })

    it('returns false for a 404', () => {
      expect(isProjectOperationConflict({ response: { status: 404 } })).toBe(false)
    })

    it('returns false for a 500', () => {
      expect(isProjectOperationConflict({ response: { status: 500 } })).toBe(false)
    })

    it('returns false for an error without a response', () => {
      expect(isProjectOperationConflict(new Error('network error'))).toBe(false)
    })

    it('returns false for an undefined error', () => {
      expect(isProjectOperationConflict(undefined)).toBe(false)
    })
  })

  // ── getProjectTransition ────────────────────────────────────────────────────

  describe('getProjectTransition', () => {
    it('returns null in CE mode even for a creating project', () => {
      mfMode.enabled = false

      expect(getProjectTransition(makeProject('my-project', { state: 'creating' }), {})).toBeNull()
    })

    it('returns null for an archived project', () => {
      expect(getProjectTransition(makeProject('my-project', { state: 'archived' }), {})).toBeNull()
    })

    it('returns null for an archived project even when a phase is reported', () => {
      const project = makeProject('my-project', { state: 'archived', phase: 'updating' })

      expect(getProjectTransition(project, {})).toBeNull()
    })

    it('prefers a locally recorded operation over an archived state, so an unarchive shows', () => {
      const project = makeProject('my-project', { state: 'archived' })
      const projectsInTransition = { 'my-project': { operation: 'updating', polling: true } }

      expect(getProjectTransition(project, projectsInTransition)).toBe('updating')
    })

    it('prefers the locally recorded operation over the leader-reported state', () => {
      const project = makeProject('my-project', { state: 'creating' })
      const projectsInTransition = { 'my-project': { operation: 'deleting', polling: true } }

      expect(getProjectTransition(project, projectsInTransition)).toBe('deleting')
    })

    it('uses the locally recorded operation for a settled project', () => {
      const project = makeProject('my-project', { state: 'online' })
      const projectsInTransition = { 'my-project': { operation: 'updating', polling: true } }

      expect(getProjectTransition(project, projectsInTransition)).toBe('updating')
    })

    it('falls back to the reported state when the transition entry has no operation', () => {
      const project = makeProject('my-project', { state: 'creating' })
      const projectsInTransition = { 'my-project': { polling: true } }

      expect(getProjectTransition(project, projectsInTransition)).toBe('creating')
    })

    it('returns creating for a leader-reported creating project', () => {
      expect(getProjectTransition(makeProject('my-project', { state: 'creating' }), {})).toBe(
        'creating'
      )
    })

    it('returns deleting for a leader-reported deleting project', () => {
      expect(getProjectTransition(makeProject('my-project', { state: 'deleting' }), {})).toBe(
        'deleting'
      )
    })

    it('returns updating when a phase is reported', () => {
      const project = makeProject('my-project', { state: 'online', phase: 'online' })

      expect(getProjectTransition(project, {})).toBe('updating')
    })

    it('returns null when the reported phase is null', () => {
      const project = makeProject('my-project', { state: 'online', phase: null })

      expect(getProjectTransition(project, {})).toBeNull()
    })

    it('returns null for a settled project', () => {
      expect(getProjectTransition(makeProject('my-project', { state: 'online' }), {})).toBeNull()
    })

    it('defaults projectsInTransition to an empty object', () => {
      expect(getProjectTransition(makeProject('my-project', { state: 'creating' }))).toBe(
        'creating'
      )
      expect(getProjectTransition(makeProject('my-project', { state: 'online' }))).toBeNull()
    })

    it('returns null for an undefined project', () => {
      expect(getProjectTransition(undefined)).toBeNull()
    })
  })

  // ── isProjectTransitioning ──────────────────────────────────────────────────

  describe('isProjectTransitioning', () => {
    it('returns true for a creating project', () => {
      expect(isProjectTransitioning(makeProject('my-project', { state: 'creating' }), {})).toBe(
        true
      )
    })

    it('returns true for a locally recorded operation', () => {
      const project = makeProject('my-project', { state: 'online' })
      const projectsInTransition = { 'my-project': { operation: 'updating' } }

      expect(isProjectTransitioning(project, projectsInTransition)).toBe(true)
    })

    it('returns false for a settled project', () => {
      expect(isProjectTransitioning(makeProject('my-project', { state: 'online' }), {})).toBe(false)
    })

    it('returns false in CE mode', () => {
      mfMode.enabled = false

      expect(isProjectTransitioning(makeProject('my-project', { state: 'creating' }), {})).toBe(
        false
      )
    })
  })

  // ── getProjectTransitionTooltip ─────────────────────────────────────────────

  describe('getProjectTransitionTooltip', () => {
    it('describes a creation in progress', () => {
      expect(getProjectTransitionTooltip('creating')).toBe('The project is in creation process.')
    })

    it('describes a deletion in progress', () => {
      expect(getProjectTransitionTooltip('deleting')).toBe('The project is in deletion process.')
    })

    it('describes an update in progress', () => {
      expect(getProjectTransitionTooltip('updating')).toBe('The project is in update process.')
    })

    it('reports sync issues while creating', () => {
      expect(getProjectTransitionTooltip('creating', true)).toBe(
        'Issues were detected while creating the project. ' +
          'The system will automatically retry; no manual action is needed.'
      )
    })

    it('reports sync issues while deleting', () => {
      expect(getProjectTransitionTooltip('deleting', true)).toBe(
        'Issues were detected while deleting the project. ' +
          'The system will automatically retry; no manual action is needed.'
      )
    })

    it('reports sync issues while updating', () => {
      expect(getProjectTransitionTooltip('updating', true)).toBe(
        'Issues were detected while updating the project. ' +
          'The system will automatically retry; no manual action is needed.'
      )
    })

    it('falls back to the update wording for an unknown transition', () => {
      expect(getProjectTransitionTooltip('exploding')).toBe('The project is in update process.')
    })

    it('falls back to the update wording for an undefined transition', () => {
      expect(getProjectTransitionTooltip(undefined)).toBe('The project is in update process.')
    })

    it('falls back to the update wording for an unknown transition with sync issues', () => {
      expect(getProjectTransitionTooltip('exploding', true)).toBe(
        'Issues were detected while updating the project. ' +
          'The system will automatically retry; no manual action is needed.'
      )
    })

    it('describes the process when hasSyncIssue is false', () => {
      expect(getProjectTransitionTooltip('creating', false)).toBe(
        'The project is in creation process.'
      )
    })
  })

  // ── withLatestOpId ──────────────────────────────────────────────────────────

  describe('withLatestOpId', () => {
    it('takes the opId from the latest read', () => {
      const project = makeProject('my-project', { state: 'online', opId: 'stale-op' })
      const latest = { status: { opId: 'fresh-op' } }

      expect(withLatestOpId(project, latest).status.opId).toBe('fresh-op')
    })

    it('takes the opId from an axios-style latest read', () => {
      const project = makeProject('my-project', { opId: 'stale-op' })
      const latest = { data: { status: { op_id: 'fresh-op' } } }

      expect(withLatestOpId(project, latest).status.opId).toBe('fresh-op')
    })

    it('preserves the rest of the project', () => {
      const project = makeProject('my-project', { state: 'online', phase: 'online' })

      expect(withLatestOpId(project, { status: { opId: 'fresh-op' } })).toEqual({
        metadata: { name: 'my-project' },
        spec: { owner: 'alice' },
        status: { state: 'online', phase: 'online', opId: 'fresh-op' }
      })
    })

    it('does not mutate the project it was given', () => {
      const project = makeProject('my-project', { state: 'online', opId: 'stale-op' })

      withLatestOpId(project, { status: { opId: 'fresh-op' } })

      expect(project.status.opId).toBe('stale-op')
    })

    it('returns a new object', () => {
      const project = makeProject()

      expect(withLatestOpId(project, {})).not.toBe(project)
    })

    it('sets an undefined opId when the latest read carries none', () => {
      const project = makeProject('my-project', { state: 'online', opId: 'stale-op' })

      expect(withLatestOpId(project, {}).status.opId).toBeUndefined()
    })

    it('does not throw for an undefined project', () => {
      expect(withLatestOpId(undefined, { status: { opId: 'fresh-op' } })).toEqual({
        status: { opId: 'fresh-op' }
      })
    })
  })

  // ── startProjectTransition ──────────────────────────────────────────────────

  describe('startProjectTransition', () => {
    it('dispatches a polling transition', () => {
      const dispatch = vi.fn()

      startProjectTransition(dispatch, 'my-project', 'creating')

      expect(dispatch).toHaveBeenCalledTimes(1)
      expect(dispatch).toHaveBeenCalledWith(
        transitionAction({ projectName: 'my-project', operation: 'creating', polling: true })
      )
    })

    it('includes the project snapshot when one is given', () => {
      const dispatch = vi.fn()
      const project = makeProject('my-project', { state: 'creating' })

      startProjectTransition(dispatch, 'my-project', 'creating', project)

      expect(dispatch).toHaveBeenCalledWith(
        transitionAction({
          projectName: 'my-project',
          operation: 'creating',
          polling: true,
          project
        })
      )
    })

    it('omits the project key when no snapshot is given', () => {
      const dispatch = vi.fn()

      startProjectTransition(dispatch, 'my-project', 'deleting')

      expect(dispatch.mock.calls[0][0].payload).not.toHaveProperty('project')
    })

    it('dispatches nothing in CE mode', () => {
      mfMode.enabled = false
      const dispatch = vi.fn()

      startProjectTransition(dispatch, 'my-project', 'creating')

      expect(dispatch).not.toHaveBeenCalled()
    })
  })

  // ── endProjectTransition ────────────────────────────────────────────────────

  describe('endProjectTransition', () => {
    it('dispatches a null operation to clear the transition', () => {
      const dispatch = vi.fn()

      endProjectTransition(dispatch, 'my-project')

      expect(dispatch).toHaveBeenCalledTimes(1)
      expect(dispatch).toHaveBeenCalledWith(
        transitionAction({ projectName: 'my-project', operation: null })
      )
    })

    it('dispatches nothing in CE mode', () => {
      mfMode.enabled = false
      const dispatch = vi.fn()

      endProjectTransition(dispatch, 'my-project')

      expect(dispatch).not.toHaveBeenCalled()
    })
  })

  // ── trackProjectMutation ────────────────────────────────────────────────────

  describe('trackProjectMutation', () => {
    it('returns false and dispatches nothing in CE mode', () => {
      mfMode.enabled = false
      const dispatch = vi.fn()

      const tracked = trackProjectMutation(
        { data: { status: { opId: 'op-1' } } },
        { dispatch, projectName: 'my-project' }
      )

      expect(tracked).toBe(false)
      expect(dispatch).not.toHaveBeenCalled()
      expect(orcaProjectsApi.getActionExecutions).not.toHaveBeenCalled()
    })

    it('returns false when the payload carries no opId', () => {
      const dispatch = vi.fn()

      const tracked = trackProjectMutation(
        { data: { metadata: { name: 'my-project' } } },
        { dispatch, projectName: 'my-project' }
      )

      expect(tracked).toBe(false)
    })

    it('ends the transition when the payload carries no opId', () => {
      const dispatch = vi.fn()

      trackProjectMutation(
        { data: { metadata: { name: 'my-project' } } },
        { dispatch, projectName: 'my-project' }
      )

      expect(dispatch).toHaveBeenCalledWith(
        transitionAction({ projectName: 'my-project', operation: null })
      )
    })

    it('does not poll when the payload carries no opId', () => {
      trackProjectMutation({ data: {} }, { dispatch: vi.fn(), projectName: 'my-project' })

      expect(orcaProjectsApi.getActionExecutions).not.toHaveBeenCalled()
    })

    it('returns true when the payload carries an opId', () => {
      const tracked = trackProjectMutation(
        { data: { status: { opId: 'op-1' } } },
        { dispatch: vi.fn(), projectName: 'my-project', operation: 'creating' }
      )

      expect(tracked).toBe(true)
    })

    it('returns true for a bare project body carrying an opId', () => {
      const tracked = trackProjectMutation(
        { status: { op_id: 'op-2' } },
        { dispatch: vi.fn(), projectName: 'my-project', operation: 'deleting' }
      )

      expect(tracked).toBe(true)
    })

    it('polls the execution of the returned operation', () => {
      trackProjectMutation(
        { data: { status: { opId: 'op-1' } } },
        { dispatch: vi.fn(), projectName: 'my-project', operation: 'creating' }
      )

      expect(orcaProjectsApi.getActionExecutions).toHaveBeenCalledWith({
        correlationId: 'op-1',
        actionType: 'sync-project',
        subdomain: 'projects',
        limit: 1
      })
    })

    it('does not end the transition while the operation is tracked', () => {
      const dispatch = vi.fn()

      trackProjectMutation(
        { data: { status: { opId: 'op-1' } } },
        { dispatch, projectName: 'my-project', operation: 'creating' }
      )

      expect(dispatch).not.toHaveBeenCalled()
    })
  })
})
