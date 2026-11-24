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
import { act, fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import MembersPopUp from './MembersPopUp'
import projectsIguazioApi from '../../api/projects-iguazio-api'

vi.mock('../../constants', async importOriginal => ({
  ...(await importOriginal()),
  IS_MF_MODE: true
}))
vi.mock('../../api/projects-iguazio-api', () => ({
  default: { setProjectMembership: vi.fn() }
}))

const store = {
  dispatch: vi.fn(),
  getState: () => ({}),
  subscribe: () => () => {}
}

const buildMembersState = ({ groupIds, members }) => ({
  activeUser: {
    data: { attributes: { username: 'userx', user_group_ids: new Set(groupIds) } }
  },
  members,
  groupedOriginalMembers: {},
  projectInfo: { id: 'project-a' },
  projectAuthorizationRoles: [
    { spec: { displayName: 'Admin', role: 'admin' } },
    { spec: { displayName: 'Viewer', role: 'viewer' } }
  ]
})

const groupMember = (id, modification = '') => ({
  id,
  name: `group-${id}`,
  type: 'user_group',
  role: 'Admin',
  initialRole: 'Admin',
  modification
})

const renderAndApply = async membersState => {
  const changeMembersCallback = vi.fn()

  render(
    <Provider store={store}>
      <MembersPopUp
        changeMembersCallback={changeMembersCallback}
        membersDispatch={vi.fn()}
        membersState={membersState}
      />
    </Provider>
  )

  await act(async () => {
    fireEvent.click(screen.getByText('Apply'))
  })

  return changeMembersCallback
}

describe('MembersPopUp "user is still a member" check (MF mode)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = '<div id="overlay_container"></div>'
    projectsIguazioApi.setProjectMembership.mockResolvedValue({})
  })

  it('keeps the user a member when a group they belong to (by ID) still has a role', async () => {
    const callback = await renderAndApply(
      buildMembersState({
        groupIds: ['group-uuid-1'],
        members: [groupMember('group-uuid-1'), groupMember('group-uuid-2', 'delete')]
      })
    )

    expect(callback).toHaveBeenCalledWith(true)
  })

  it('drops the user when the only group giving them a role is removed', async () => {
    const callback = await renderAndApply(
      buildMembersState({
        groupIds: ['group-uuid-2'],
        members: [groupMember('group-uuid-1'), groupMember('group-uuid-2', 'delete')]
      })
    )

    expect(callback).toHaveBeenCalledWith(false)
  })

  it('does not match a group by its name', async () => {
    const callback = await renderAndApply(
      buildMembersState({
        groupIds: ['group-uuid-1'],
        members: [
          { ...groupMember('other-uuid'), name: 'group-uuid-1' },
          groupMember('group-uuid-2', 'delete')
        ]
      })
    )

    expect(callback).toHaveBeenCalledWith(false)
  })
})

describe('MembersPopUp save (MF mode)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = '<div id="overlay_container"></div>'
    projectsIguazioApi.setProjectMembership.mockResolvedValue({})
  })

  it('keeps the roles of a member the save did not touch', async () => {
    const membersState = {
      ...buildMembersState({
        groupIds: [],
        members: [
          { id: 'userx', name: 'userx', type: 'user', role: 'Admin', initialRole: 'Admin' },
          groupMember('group-uuid-1', 'delete')
        ]
      }),
      projectAuthorizationRoles: [
        {
          spec: { displayName: 'Admin', role: 'admin' },
          status: { assignedMembers: [{ id: 'userx' }, { id: 'group-uuid-1' }] }
        },
        {
          spec: { displayName: 'Viewer', role: 'viewer' },
          status: { assignedMembers: [{ id: 'userx' }] }
        }
      ]
    }

    await renderAndApply(membersState)

    expect(projectsIguazioApi.setProjectMembership).toHaveBeenCalledWith('project-a', {
      membership: { admin: { values: ['userx'] }, viewer: { values: ['userx'] } },
      override: true
    })
  })
})
