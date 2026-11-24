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
import projectsApi from '../api/projects-api'
import projectReducer, {
  changeProjectState,
  createNewProject,
  editProject,
  fetchProjects,
  removeProject,
  setProjectTransition,
  upsertProject
} from './projectReducer'

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

vi.mock('../api/projects-api', () => ({
  default: { changeProjectState: vi.fn(), createProject: vi.fn(), editProject: vi.fn() }
}))
vi.mock('../api/projects-orca-api', () => ({ default: { getProject: vi.fn() } }))

vi.mock('igz-controls/utils/notification.util', () => ({
  showErrorNotification: vi.fn()
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

const makeProject = (name, status = { state: 'online' }, labels) => ({
  metadata: { name, ...(labels && { labels }) },
  spec: { owner: 'alice' },
  status
})

const makeState = (overrides = {}) => ({
  error: null,
  loading: false,
  projects: [],
  projectsInTransition: {},
  projectsNames: { data: [], error: null, loading: false },
  ...overrides
})

const rejectedAction = (arg, payload = 'Failed to fetch projects') =>
  fetchProjects.rejected(new Error('request failed'), 'request-id', arg, payload)

const fulfilledAction = (projects, arg = { params: {} }) =>
  fetchProjects.fulfilled(projects, 'request-id', arg)

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('projectReducer', () => {
  beforeEach(() => {
    mfMode.enabled = true
  })

  // ── setProjectTransition ────────────────────────────────────────────────────

  describe('setProjectTransition', () => {
    it('creates an entry for a project that carries an operation', () => {
      const state = projectReducer(
        makeState(),
        setProjectTransition({ projectName: 'my-project', operation: 'creating', polling: true })
      )

      expect(state.projectsInTransition['my-project']).toEqual({
        operation: 'creating',
        polling: true
      })
    })

    it('does not store the project name inside the entry', () => {
      const state = projectReducer(
        makeState(),
        setProjectTransition({ projectName: 'my-project', operation: 'creating' })
      )

      expect(state.projectsInTransition['my-project']).not.toHaveProperty('projectName')
    })

    it('ignores a partial update for an unknown project', () => {
      const state = projectReducer(
        makeState(),
        setProjectTransition({ projectName: 'my-project', hasSyncIssue: true })
      )

      expect(state.projectsInTransition).toEqual({})
    })

    it('ignores a polling-only update for an unknown project', () => {
      const state = projectReducer(
        makeState(),
        setProjectTransition({ projectName: 'my-project', polling: false })
      )

      expect(state.projectsInTransition).toEqual({})
    })

    it('deletes the entry when the operation is null', () => {
      const state = projectReducer(
        makeState({
          projectsInTransition: { 'my-project': { operation: 'deleting', polling: true } }
        }),
        setProjectTransition({ projectName: 'my-project', operation: null })
      )

      expect(state.projectsInTransition).toEqual({})
    })

    it('does not throw when clearing an unknown project', () => {
      const state = projectReducer(
        makeState(),
        setProjectTransition({ projectName: 'my-project', operation: null })
      )

      expect(state.projectsInTransition).toEqual({})
    })

    it('merges a sync issue into an existing entry without clobbering it', () => {
      const state = projectReducer(
        makeState({
          projectsInTransition: { 'my-project': { operation: 'creating', polling: true } }
        }),
        setProjectTransition({ projectName: 'my-project', hasSyncIssue: true })
      )

      expect(state.projectsInTransition['my-project']).toEqual({
        operation: 'creating',
        polling: true,
        hasSyncIssue: true
      })
    })

    it('merges a stopped poll into an existing entry without clobbering it', () => {
      const state = projectReducer(
        makeState({
          projectsInTransition: {
            'my-project': { operation: 'creating', polling: true, hasSyncIssue: true }
          }
        }),
        setProjectTransition({ projectName: 'my-project', polling: false })
      )

      expect(state.projectsInTransition['my-project']).toEqual({
        operation: 'creating',
        polling: false,
        hasSyncIssue: true
      })
    })

    it('leaves other projects in transition untouched', () => {
      const state = projectReducer(
        makeState({
          projectsInTransition: {
            'project-a': { operation: 'creating', polling: true },
            'project-b': { operation: 'deleting', polling: true }
          }
        }),
        setProjectTransition({ projectName: 'project-a', operation: null })
      )

      expect(Object.keys(state.projectsInTransition)).toEqual(['project-b'])
    })
  })

  // ── upsertProject ───────────────────────────────────────────────────────────

  describe('upsertProject', () => {
    it('inserts a project that is not in the list yet', () => {
      const state = projectReducer(makeState(), upsertProject(makeProject('my-project')))

      expect(state.projects).toHaveLength(1)
      expect(state.projects[0].metadata.name).toBe('my-project')
    })

    it('parses the labels of the inserted project', () => {
      const state = projectReducer(
        makeState(),
        upsertProject(makeProject('my-project', { state: 'online' }, { env: 'dev' }))
      )

      expect(state.projects[0].metadata.labels).toEqual([
        { id: 'env0', key: 'env', value: 'dev', delimiter: null, disabled: false, tooltip: null }
      ])
    })

    it('appends to an existing list', () => {
      const state = projectReducer(
        makeState({ projects: [makeProject('project-a')] }),
        upsertProject(makeProject('project-b'))
      )

      expect(state.projects.map(project => project.metadata.name)).toEqual([
        'project-a',
        'project-b'
      ])
    })

    it('is a no-op when a project of that name already exists', () => {
      const existing = makeProject('my-project')
      const state = projectReducer(
        makeState({ projects: [existing] }),
        upsertProject(makeProject('my-project', { state: 'creating' }))
      )

      expect(state.projects).toHaveLength(1)
      expect(state.projects[0].status.state).toBe('online')
    })

    it('ignores a payload with no project name', () => {
      const state = projectReducer(makeState(), upsertProject({ metadata: {} }))

      expect(state.projects).toEqual([])
    })
  })

  // ── removeProject ───────────────────────────────────────────────────────────

  describe('removeProject', () => {
    it('drops the project from the list', () => {
      const state = projectReducer(
        makeState({ projects: [makeProject('project-a'), makeProject('project-b')] }),
        removeProject('project-a')
      )

      expect(state.projects.map(project => project.metadata.name)).toEqual(['project-b'])
    })

    it('drops the project name from projectsNames', () => {
      const state = projectReducer(
        makeState({
          projects: [makeProject('project-a')],
          projectsNames: { data: ['project-a', 'project-b'], error: null, loading: false }
        }),
        removeProject('project-a')
      )

      expect(state.projectsNames.data).toEqual(['project-b'])
    })

    it('leaves the state alone for an unknown project', () => {
      const state = projectReducer(
        makeState({
          projects: [makeProject('project-a')],
          projectsNames: { data: ['project-a'], error: null, loading: false }
        }),
        removeProject('project-c')
      )

      expect(state.projects).toHaveLength(1)
      expect(state.projectsNames.data).toEqual(['project-a'])
    })
  })

  // ── fetchProjects.rejected ──────────────────────────────────────────────────

  describe('fetchProjects.rejected', () => {
    it('clears the projects for a normal request', () => {
      const state = projectReducer(
        makeState({ projects: [makeProject('project-a')] }),
        rejectedAction({ params: {} })
      )

      expect(state.projects).toEqual([])
    })

    it('preserves the projects for a silent request', () => {
      const state = projectReducer(
        makeState({ projects: [makeProject('project-a')] }),
        rejectedAction({ params: {}, silent: true })
      )

      expect(state.projects).toHaveLength(1)
    })

    it('stops the loader and stores the error either way', () => {
      const state = projectReducer(
        makeState({ loading: true, projects: [makeProject('project-a')] }),
        rejectedAction({ params: {}, silent: true })
      )

      expect(state.loading).toBe(false)
      expect(state.error).toBe('Failed to fetch projects')
    })
  })

  // ── fetchProjects.fulfilled ─────────────────────────────────────────────────

  describe('fetchProjects.fulfilled', () => {
    it('replaces the projects with the incoming list', () => {
      const state = projectReducer(
        makeState({ projects: [makeProject('project-a')] }),
        fulfilledAction([makeProject('project-b')])
      )

      expect(state.projects.map(project => project.metadata.name)).toEqual(['project-b'])
    })

    it('collects the names of the online projects only', () => {
      const state = projectReducer(
        makeState(),
        fulfilledAction([
          makeProject('project-a'),
          makeProject('project-b', { state: 'archived' }),
          makeProject('project-c', { state: 'creating' })
        ])
      )

      expect(state.projectsNames.data).toEqual(['project-a'])
    })

    it('stops the loader and clears the error', () => {
      const state = projectReducer(
        makeState({ loading: true, error: 'boom' }),
        fulfilledAction([makeProject('project-a')])
      )

      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
    })

    it('keeps a still-polling transition even when the incoming project has settled', () => {
      const state = projectReducer(
        makeState({
          projectsInTransition: { 'project-a': { operation: 'creating', polling: true } }
        }),
        fulfilledAction([makeProject('project-a')])
      )

      expect(state.projectsInTransition['project-a']).toEqual({
        operation: 'creating',
        polling: true
      })
    })

    it('drops a non-polling transition once the incoming project has settled', () => {
      const state = projectReducer(
        makeState({
          projectsInTransition: { 'project-a': { operation: 'creating', polling: false } }
        }),
        fulfilledAction([makeProject('project-a')])
      )

      expect(state.projectsInTransition).toEqual({})
    })

    it('keeps a non-polling transition while the incoming project is still transitional', () => {
      const state = projectReducer(
        makeState({
          projectsInTransition: { 'project-a': { operation: 'creating', polling: false } }
        }),
        fulfilledAction([makeProject('project-a', { state: 'creating' })])
      )

      expect(state.projectsInTransition['project-a']).toEqual({
        operation: 'creating',
        polling: false
      })
    })

    it('appends the stored snapshot of a project that is absent from the incoming list', () => {
      const snapshot = makeProject('project-b', { state: 'creating' })
      const state = projectReducer(
        makeState({
          projectsInTransition: {
            'project-b': { operation: 'creating', polling: true, project: snapshot }
          }
        }),
        fulfilledAction([makeProject('project-a')])
      )

      expect(state.projects.map(project => project.metadata.name)).toEqual([
        'project-a',
        'project-b'
      ])
      expect(state.projectsInTransition['project-b']).toBeDefined()
    })

    it('does not add the appended snapshot to the online project names', () => {
      const snapshot = makeProject('project-b')
      const state = projectReducer(
        makeState({
          projectsInTransition: {
            'project-b': { operation: 'creating', polling: true, project: snapshot }
          }
        }),
        fulfilledAction([makeProject('project-a')])
      )

      expect(state.projectsNames.data).toEqual(['project-a'])
    })

    it('appends the stored snapshot of a non-polling transition too', () => {
      const snapshot = makeProject('project-b', { state: 'deleting' })
      const state = projectReducer(
        makeState({
          projectsInTransition: {
            'project-b': { operation: 'deleting', polling: false, project: snapshot }
          }
        }),
        fulfilledAction([makeProject('project-a')])
      )

      expect(state.projects).toHaveLength(2)
      expect(state.projectsInTransition['project-b']).toBeDefined()
    })

    it('drops a non-polling transition that has no snapshot and is absent from the list', () => {
      const state = projectReducer(
        makeState({
          projectsInTransition: { 'project-b': { operation: 'deleting', polling: false } }
        }),
        fulfilledAction([makeProject('project-a')])
      )

      expect(state.projectsInTransition).toEqual({})
      expect(state.projects).toHaveLength(1)
    })

    it('keeps a polling transition that has no snapshot and is absent from the list', () => {
      const state = projectReducer(
        makeState({
          projectsInTransition: { 'project-b': { operation: 'deleting', polling: true } }
        }),
        fulfilledAction([makeProject('project-a')])
      )

      expect(state.projectsInTransition['project-b']).toBeDefined()
      expect(state.projects).toHaveLength(1)
    })

    it('leaves the transitions untouched in CE mode', () => {
      mfMode.enabled = false

      const state = projectReducer(
        makeState({
          projectsInTransition: { 'project-a': { operation: 'creating', polling: false } }
        }),
        fulfilledAction([makeProject('project-a')])
      )

      expect(state.projectsInTransition['project-a']).toBeDefined()
      expect(state.projects).toHaveLength(1)
    })
  })

  // ── editProject / changeProjectState ────────────────────────────────────────

  describe('updates in MF mode', () => {
    // An MLRun copy of the project, read before the latest leader change.
    const loadedProject = {
      metadata: { name: 'project-a' },
      spec: { owner: 'alice', source: 'git://repo' },
      status: { state: 'online', op_id: 'stale-op' }
    }
    const leaderProject = { spec: { owner: 'bob' }, status: { opId: 'current-op' } }
    const withCurrentWitness = {
      ...loadedProject,
      spec: { ...loadedProject.spec, owner: 'bob' },
      status: { ...loadedProject.status, opId: 'current-op' }
    }
    const run = thunk => thunk(vi.fn(), vi.fn(), undefined)

    beforeEach(() => {
      vi.clearAllMocks()
      orcaProjectsApi.getProject.mockResolvedValue(leaderProject)
    })

    describe('editProject', () => {
      it('sends the owner and op id the leader has right before the edit', async () => {
        projectsApi.editProject.mockResolvedValue({ status: 202 })

        await run(editProject({ projectName: 'project-a', project: loadedProject }))

        expect(orcaProjectsApi.getProject).toHaveBeenCalledWith('project-a')
        expect(projectsApi.editProject).toHaveBeenCalledWith('project-a', withCurrentWitness)
      })

      it('does not send the edit when the leader read fails', async () => {
        const error = { response: { status: 404 } }
        orcaProjectsApi.getProject.mockRejectedValue(error)

        const action = await run(editProject({ projectName: 'project-a', project: loadedProject }))

        expect(projectsApi.editProject).not.toHaveBeenCalled()
        expect(action.payload).toBe(error)
      })

      it('rejects with the error of the edit, so a 409 can be told apart', async () => {
        const error = { response: { status: 409 } }
        projectsApi.editProject.mockRejectedValue(error)

        const action = await run(editProject({ projectName: 'project-a', project: loadedProject }))

        expect(action.payload).toBe(error)
      })

      it('sends the project as given outside MF mode', async () => {
        mfMode.enabled = false
        projectsApi.editProject.mockResolvedValue({ data: loadedProject })

        await run(editProject({ projectName: 'project-a', project: loadedProject }))

        expect(orcaProjectsApi.getProject).not.toHaveBeenCalled()
        expect(projectsApi.editProject).toHaveBeenCalledWith('project-a', loadedProject)
      })
    })

    describe('changeProjectState', () => {
      it('sends the owner and op id the leader has right before the change', async () => {
        projectsApi.changeProjectState.mockResolvedValue({ status: 202 })

        await run(changeProjectState({ project: loadedProject, status: 'archived' }))

        expect(projectsApi.changeProjectState).toHaveBeenCalledWith(withCurrentWitness, 'archived')
      })

      it('does not send the change when the leader read fails', async () => {
        orcaProjectsApi.getProject.mockRejectedValue(new Error('network error'))

        const action = await run(changeProjectState({ project: loadedProject, status: 'archived' }))

        expect(projectsApi.changeProjectState).not.toHaveBeenCalled()
        expect(action.type).toBe(changeProjectState.rejected.type)
      })

      it('sends the project as given outside MF mode', async () => {
        mfMode.enabled = false
        projectsApi.changeProjectState.mockResolvedValue({ data: loadedProject })

        await run(changeProjectState({ project: loadedProject, status: 'archived' }))

        expect(orcaProjectsApi.getProject).not.toHaveBeenCalled()
        expect(projectsApi.changeProjectState).toHaveBeenCalledWith(loadedProject, 'archived')
      })
    })
  })

  // ── createNewProject ────────────────────────────────────────────────────────

  describe('createNewProject', () => {
    const postData = { metadata: { name: 'my-project' } }

    const runWithError = async error => {
      projectsApi.createProject.mockRejectedValue(error)

      const action = await createNewProject({ postData })(vi.fn(), vi.fn(), undefined)

      return action.payload
    }

    const orcaError = (status, errorMessage) => ({
      message: 'Request failed',
      response: { status, data: { status: { errorMessage, statusCode: status } } }
    })

    it('reports a name conflict', async () => {
      expect(await runWithError({ response: { status: 409 } })).toBe(
        'A project named "my-project" already exists.'
      )
    })

    it('reports a permission error', async () => {
      expect(await runWithError({ response: { status: 403 } })).toMatch(/^Permission denied/)
    })

    it('prefers the MLRun detail on a 500', async () => {
      expect(await runWithError({ response: { status: 500, data: { detail: 'db down' } } })).toBe(
        'db down'
      )
    })

    it('falls back to the maximum projects text on a 500 without a reason', async () => {
      expect(await runWithError({ response: { status: 500, data: {} } })).toMatch(
        /maximum number of projects/
      )
    })

    it('shows the leader reason for other failures in MF mode, e.g. create while deleting', async () => {
      expect(await runWithError(orcaError(412, 'project "my-project" is being deleted'))).toBe(
        'project "my-project" is being deleted'
      )
    })

    it('uses the generic error message outside MF mode', async () => {
      mfMode.enabled = false

      expect(await runWithError(orcaError(412, 'project is being deleted'))).toBe('Request failed')
    })
  })
})
