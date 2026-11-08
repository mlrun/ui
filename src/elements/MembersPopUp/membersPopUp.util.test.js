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
import { describe, it, expect } from 'vitest'

import { getRoleOptions } from './membersPopUp.util'

const policy = (name, displayName) => ({
  metadata: { name: `oris-project-${name}` },
  spec: { displayName, role: displayName }
})

const policies = [
  policy('editor', 'Editor'),
  policy('owner', 'Owner'),
  policy('curator', 'Curator'),
  policy('admin', 'Admin'),
  policy('viewer', 'Viewer'),
  policy('builder', 'Builder')
]

const visibleIds = options => options.filter(option => !option.hidden).map(option => option.id)

describe('getRoleOptions', () => {
  it('builds options from policies, excluding Owner and Builder', () => {
    expect(visibleIds(getRoleOptions('', false, policies))).toEqual([
      'Editor',
      'Curator',
      'Admin',
      'Viewer'
    ])
  })

  it('falls back to the base roles when there are no policies', () => {
    expect(visibleIds(getRoleOptions())).toEqual(['Viewer', 'Editor', 'Admin'])
  })

  it('shows the All option only when requested', () => {
    expect(visibleIds(getRoleOptions('', true, policies))).toContain('All')
    expect(visibleIds(getRoleOptions('', false, policies))).not.toContain('All')
  })

  it('keeps a current non-assignable role as a hidden option', () => {
    const options = getRoleOptions('Builder', false, policies)

    expect(options).toContainEqual({ id: 'Builder', label: 'Builder', hidden: true })
    expect(visibleIds(options)).not.toContain('Builder')
  })
})
