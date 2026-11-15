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

import { isProjectMembersTabShown } from './projectSettings.util'

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
