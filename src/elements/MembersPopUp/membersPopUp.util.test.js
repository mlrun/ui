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
import { describe, expect, it } from 'vitest'

import { buildProjectMembershipMF, DELETE_MODIFICATION } from './membersPopUp.util'

const policy = (displayName, role, memberIds) => ({
  spec: { displayName, role },
  status: { assignedMembers: memberIds.map(id => ({ id })) }
})

const policies = [
  policy('Owner', 'owner', ['owner']),
  policy('Admin', 'admin', ['owner', 'old-owner']),
  policy('Editor', 'editor', []),
  policy('Viewer', 'viewer', ['old-owner', 'viewer'])
]

const member = (id, role, modification = '') => ({ id, role, modification })

describe('buildProjectMembershipMF', () => {
  it('keeps every role of the members the user did not change', () => {
    const members = [
      member('owner', 'Owner'),
      member('old-owner', 'Admin'),
      member('viewer', 'Viewer', 'put')
    ]
    members[2].role = 'Editor'

    expect(buildProjectMembershipMF(policies, members)).toEqual({
      admin: { values: ['owner', 'old-owner'] },
      editor: { values: ['viewer'] },
      viewer: { values: ['old-owner'] }
    })
  })

  it('replaces all roles of a member whose role was changed', () => {
    const members = [member('owner', 'Owner'), member('old-owner', 'Editor', 'put')]

    expect(buildProjectMembershipMF(policies, members)).toEqual({
      admin: { values: ['owner'] },
      editor: { values: ['old-owner'] },
      viewer: { values: ['viewer'] }
    })
  })

  it('removes a deleted member from every role', () => {
    const members = [member('old-owner', 'Admin', DELETE_MODIFICATION)]

    expect(buildProjectMembershipMF(policies, members)).toEqual({
      admin: { values: ['owner'] },
      editor: { values: [] },
      viewer: { values: ['viewer'] }
    })
  })

  it('adds a new member to the chosen role', () => {
    const members = [member('new-user', 'Viewer', 'post')]

    expect(buildProjectMembershipMF(policies, members).viewer).toEqual({
      values: ['old-owner', 'viewer', 'new-user']
    })
  })

  it('never sends the Owner role', () => {
    expect(buildProjectMembershipMF(policies, [])).not.toHaveProperty('owner')
  })

  it('keeps Builder and Curator roles, which the role dropdown does not offer', () => {
    const allPolicies = [
      ...policies,
      policy('Builder', 'builder', ['builder-user']),
      policy('Curator', 'curator', ['curator-user', 'viewer'])
    ]
    const members = [member('builder-user', 'Builder'), member('old-owner', 'Admin', 'put')]
    members[1].role = 'Viewer'

    expect(buildProjectMembershipMF(allPolicies, members)).toEqual({
      admin: { values: ['owner'] },
      editor: { values: [] },
      viewer: { values: ['viewer', 'old-owner'] },
      builder: { values: ['builder-user'] },
      curator: { values: ['curator-user', 'viewer'] }
    })
  })

  it('handles policies loaded without assigned members', () => {
    const members = [member('new-user', 'Admin', 'post')]

    expect(
      buildProjectMembershipMF([{ spec: { displayName: 'Admin', role: 'admin' } }], members)
    ).toEqual({ admin: { values: ['new-user'] } })
  })
})
