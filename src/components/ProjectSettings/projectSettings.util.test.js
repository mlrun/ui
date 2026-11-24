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
import { describe, it, expect, vi } from 'vitest'

import {
  generateMembers,
  getHighestRole,
  getMemberDisplayName,
  isActiveUserProjectMember,
  isProjectMembersTabShown
} from './projectSettings.util'
import { membersActions } from '../../elements/MembersPopUp/membersReducer'

vi.mock('../../constants', async importOriginal => ({
  ...(await importOriginal()),
  IS_MF_MODE: true
}))

const buildState = ({ groupIds = [], members }) => ({
  activeUser: {
    data: {
      attributes: {
        username: 'userx',
        user_policies_collection: new Set(),
        user_group_ids: new Set(groupIds)
      }
    }
  },
  members
})

describe('isProjectMembersTabShown (MF mode)', () => {
  it('shows the tab when only a group holds Admin', () => {
    const state = buildState({
      groupIds: ['group-uuid'],
      members: [{ id: 'group-uuid', type: 'user_group', role: 'Admin' }]
    })

    expect(isProjectMembersTabShown(true, false, state)).toBe(true)
  })

  it('shows the tab when a group holds Admin and the user has a direct Viewer role', () => {
    const state = buildState({
      groupIds: ['group-uuid'],
      members: [
        { id: 'group-uuid', type: 'user_group', role: 'Admin' },
        { id: 'userx', type: 'user', role: 'Viewer' }
      ]
    })

    expect(isProjectMembersTabShown(true, false, state)).toBe(true)
  })

  it('hides the tab when the user only has a direct Viewer role', () => {
    const state = buildState({
      groupIds: ['group-uuid'],
      members: [{ id: 'userx', type: 'user', role: 'Viewer' }]
    })

    expect(isProjectMembersTabShown(true, false, state)).toBe(false)
  })
})

describe('getHighestRole', () => {
  it('prefers Admin, then Editor, then Viewer', () => {
    expect(getHighestRole(['Viewer', 'Admin'])).toBe('Admin')
    expect(getHighestRole(['Viewer', 'Editor'])).toBe('Editor')
    expect(getHighestRole(['Viewer'])).toBe('Viewer')
  })

  it('ranks Builder with Editor and Curator between Editor and Viewer', () => {
    expect(getHighestRole(['Viewer', 'Builder'])).toBe('Builder')
    expect(getHighestRole(['Viewer', 'Curator'])).toBe('Curator')
    expect(getHighestRole(['Curator', 'Editor'])).toBe('Editor')
  })

  it('puts any other role after the known ones', () => {
    expect(getHighestRole(['Custom', 'Viewer'])).toBe('Viewer')
    expect(getHighestRole(['Custom'])).toBe('Custom')
  })

  it('returns undefined for no roles', () => {
    expect(getHighestRole([])).toBeUndefined()
  })
})

describe('generateMembers (MF mode)', () => {
  const policy = (displayName, role, assignedMembers) => ({
    spec: { displayName, role, projectName: 'from-policy' },
    status: { assignedMembers }
  })
  const user = id => ({ id, name: id, kind: 'user' })

  // Admin is listed after Viewer, so the first policy a member appears in is not their highest role.
  const policiesResponse = {
    data: {
      items: [
        policy('Owner', 'owner', [user('new-owner')]),
        policy('Viewer', 'viewer', [user('old-owner'), user('new-owner')]),
        policy('Admin', 'admin', [user('old-owner')])
      ]
    }
  }

  const getDispatched = (dispatch, type) =>
    dispatch.mock.calls.find(([action]) => action.type === type)[0].payload

  it('shows a member with several roles under the highest one and keeps them all', () => {
    const dispatch = vi.fn()

    generateMembers(policiesResponse, dispatch, 'project-a')

    expect(getDispatched(dispatch, membersActions.SET_MEMBERS)).toEqual([
      expect.objectContaining({
        id: 'new-owner',
        role: 'Owner',
        initialRole: 'Owner',
        roles: ['Viewer']
      }),
      expect.objectContaining({
        id: 'old-owner',
        role: 'Admin',
        initialRole: 'Admin',
        roles: ['Viewer', 'Admin']
      })
    ])
  })

  it('takes the project name from the caller rather than from a policy', () => {
    const dispatch = vi.fn()

    generateMembers(policiesResponse, dispatch, 'project-a')

    expect(getDispatched(dispatch, membersActions.SET_PROJECT_INFO).id).toBe('project-a')
  })

  it('returns the members it dispatched', () => {
    const dispatch = vi.fn()

    expect(generateMembers(policiesResponse, dispatch, 'project-a')).toBe(
      getDispatched(dispatch, membersActions.SET_MEMBERS)
    )
  })

  it('shows the Members tab to a user who holds Admin on top of a lower role', () => {
    const dispatch = vi.fn()

    generateMembers(policiesResponse, dispatch, 'project-a')

    const state = {
      activeUser: { data: { attributes: { username: 'old-owner', user_group_ids: new Set() } } },
      members: getDispatched(dispatch, membersActions.SET_MEMBERS)
    }

    expect(isProjectMembersTabShown(true, false, state)).toBe(true)
  })
})

describe('after an owner change, whatever role the old owner is given (MF mode)', () => {
  const user = id => ({ id, name: id, kind: 'user' })
  const policiesWithOldOwnerIn = role => ({
    data: {
      items: [
        {
          spec: { displayName: 'Owner', role: 'owner' },
          status: { assignedMembers: [user('bob')] }
        },
        ...['Admin', 'Editor', 'Viewer'].map(displayName => ({
          spec: { displayName, role: displayName.toLowerCase() },
          status: { assignedMembers: displayName === role ? [user('alice')] : [] }
        }))
      ]
    }
  })
  const activeUser = username => ({
    data: { attributes: { username, user_group_ids: new Set() } }
  })

  it.each([
    ['Admin', true],
    ['Editor', false],
    ['Viewer', false]
  ])('shows the old owner as %s, with the Members tab only for Admin', (role, tabShown) => {
    const members = generateMembers(policiesWithOldOwnerIn(role), vi.fn(), 'project-a')

    expect(members.find(member => member.id === 'alice').role).toBe(role)
    expect(
      isProjectMembersTabShown(true, false, { activeUser: activeUser('alice'), members })
    ).toBe(tabShown)
    expect(isActiveUserProjectMember(activeUser('alice'), members)).toBe(true)
  })

  it('drops the old owner when they are given no role', () => {
    const members = generateMembers(policiesWithOldOwnerIn(null), vi.fn(), 'project-a')

    expect(members.map(member => member.id)).toEqual(['bob'])
    expect(isActiveUserProjectMember(activeUser('alice'), members)).toBe(false)
  })
})

describe('isActiveUserProjectMember', () => {
  const activeUser = {
    data: { attributes: { username: 'userx', user_group_ids: new Set(['g1']) } }
  }

  it('holds for a direct role', () => {
    expect(isActiveUserProjectMember(activeUser, [{ id: 'userx', type: 'user' }])).toBe(true)
  })

  it('holds for a role through a group', () => {
    expect(isActiveUserProjectMember(activeUser, [{ id: 'g1', type: 'user_group' }])).toBe(true)
  })

  it('does not hold for another member', () => {
    expect(isActiveUserProjectMember(activeUser, [{ id: 'other', type: 'user' }])).toBe(false)
  })
})

describe('getMemberDisplayName', () => {
  it('drops the leading slash of a top-level group path', () => {
    expect(getMemberDisplayName({ id: 'uuid', name: '/test-1' })).toBe('test-1')
  })

  it('formats a nested group path', () => {
    expect(getMemberDisplayName({ id: 'uuid', name: '/g1/g2' })).toBe('g1 / g2')
  })

  it('falls back to the id when name is empty or missing', () => {
    expect(getMemberDisplayName({ id: 'uuid', name: '' })).toBe('uuid')
    expect(getMemberDisplayName({ id: 'uuid' })).toBe('uuid')
  })

  it('falls back to the id when name is whitespace only or empty after formatting', () => {
    expect(getMemberDisplayName({ id: 'uuid', name: '   ' })).toBe('uuid')
    expect(getMemberDisplayName({ id: 'uuid', name: '/' })).toBe('uuid')
    expect(getMemberDisplayName({ id: 'uuid', name: null })).toBe('uuid')
  })

  it('returns an empty string when both name and id are missing', () => {
    expect(getMemberDisplayName({})).toBe('')
  })

  it('returns the username for a user', () => {
    expect(getMemberDisplayName({ id: 'admin', name: 'admin' })).toBe('admin')
  })
})
