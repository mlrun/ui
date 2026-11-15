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
import { describe, it, expect, vi, beforeEach } from 'vitest'

import projectsIguazioApi from '../api/projects-iguazio-api'
import { checkProjectWriteAccess } from './projectAuth.util'

vi.mock('../constants', () => ({ IS_MF_MODE: true }))
vi.mock('../api/projects-iguazio-api', () => ({
  default: {
    getActiveUser: vi.fn(),
    getProjectPolicies: vi.fn()
  }
}))

const mockUser = groupIds => ({
  data: {
    metadata: { username: 'userx' },
    relationships: groupIds.map(id => ({ '@type': 'usergroup', metadata: { id } }))
  }
})

const mockPolicies = policies => ({
  data: {
    items: policies.map(([displayName, ...ids]) => ({
      spec: { displayName },
      status: { assignedMembers: ids.map(id => ({ id })) }
    }))
  }
})

describe('checkProjectWriteAccess (MF mode)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('grants access when only a group holds Admin', async () => {
    projectsIguazioApi.getActiveUser.mockResolvedValue(mockUser(['group-uuid']))
    projectsIguazioApi.getProjectPolicies.mockResolvedValue(mockPolicies([['Admin', 'group-uuid']]))

    expect(await checkProjectWriteAccess('project-a')).toBe(true)
  })

  it('grants access when a group holds Admin and the user has a direct Viewer role', async () => {
    projectsIguazioApi.getActiveUser.mockResolvedValue(mockUser(['group-uuid']))
    projectsIguazioApi.getProjectPolicies.mockResolvedValue(
      mockPolicies([
        ['Admin', 'group-uuid'],
        ['Viewer', 'userx']
      ])
    )

    expect(await checkProjectWriteAccess('project-a')).toBe(true)
  })

  it('denies access when the user only has a direct Viewer role', async () => {
    projectsIguazioApi.getActiveUser.mockResolvedValue(mockUser(['group-uuid']))
    projectsIguazioApi.getProjectPolicies.mockResolvedValue(mockPolicies([['Viewer', 'userx']]))

    expect(await checkProjectWriteAccess('project-a')).toBe(false)
  })

  it('denies access when the Admin group is not one of the user groups', async () => {
    projectsIguazioApi.getActiveUser.mockResolvedValue(mockUser(['other-group']))
    projectsIguazioApi.getProjectPolicies.mockResolvedValue(mockPolicies([['Admin', 'group-uuid']]))

    expect(await checkProjectWriteAccess('project-a')).toBe(false)
  })
})
