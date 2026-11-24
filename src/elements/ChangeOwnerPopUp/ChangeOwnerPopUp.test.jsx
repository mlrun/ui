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
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import ChangeOwnerPopUp from './ChangeOwnerPopUp'
import projectsIguazioApi from '../../api/projects-iguazio-api'
import { setNotification } from 'igz-controls/reducers/notificationReducer'
import { showErrorNotification } from 'igz-controls/utils/notification.util'

vi.mock('../../constants', async importOriginal => ({
  ...(await importOriginal()),
  IS_MF_MODE: true
}))
vi.mock('../../api/projects-iguazio-api', () => ({
  default: { searchUsersMetadata: vi.fn(), updateProjectOwner: vi.fn() }
}))
vi.mock('igz-controls/reducers/notificationReducer', () => ({
  setNotification: vi.fn(payload => ({ type: 'setNotification', payload }))
}))
vi.mock('igz-controls/utils/notification.util', () => ({
  showErrorNotification: vi.fn()
}))

const store = {
  dispatch: vi.fn(),
  getState: () => ({}),
  subscribe: () => () => {}
}

// Types the new owner's username; the pop-up picks the matching user once the debounced search
// returns, which enables Apply.
const chooseOwner = async username => {
  fireEvent.change(screen.getByPlaceholderText('Type to select new owner...'), {
    target: { value: username }
  })

  await waitFor(() => expect(screen.getByText('Apply').closest('button')).toBeEnabled(), {
    timeout: 2000
  })
}

const renderPopUp = changeOwnerCallback =>
  render(
    <Provider store={store}>
      <ChangeOwnerPopUp changeOwnerCallback={changeOwnerCallback} projectId="project-a" />
    </Provider>
  )

describe('ChangeOwnerPopUp (MF mode)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = '<div id="overlay_container"></div>'
    projectsIguazioApi.searchUsersMetadata.mockResolvedValue({
      data: { items: [{ firstName: 'Bob', lastName: 'Smith', username: 'bob' }] }
    })
  })

  it('transfers ownership, tells the user it may take a moment, then refreshes', async () => {
    const changeOwnerCallback = vi.fn(() => Promise.resolve())
    projectsIguazioApi.updateProjectOwner.mockResolvedValue({ status: 200 })
    renderPopUp(changeOwnerCallback)

    await chooseOwner('bob')
    await act(async () => {
      fireEvent.click(screen.getByText('Apply'))
    })

    expect(projectsIguazioApi.updateProjectOwner).toHaveBeenCalledWith('project-a', 'bob')
    expect(setNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Owner updated successfully. It may take a few moments to synchronize changes.'
      })
    )
    expect(changeOwnerCallback).toHaveBeenCalled()
    expect(showErrorNotification).not.toHaveBeenCalled()
  })

  it('reports a failed transfer without refreshing, and its retry sends the same owner', async () => {
    const changeOwnerCallback = vi.fn(() => Promise.resolve())
    projectsIguazioApi.updateProjectOwner
      .mockRejectedValueOnce({ response: { status: 403 } })
      .mockResolvedValueOnce({ status: 200 })
    renderPopUp(changeOwnerCallback)

    await chooseOwner('bob')
    await act(async () => {
      fireEvent.click(screen.getByText('Apply'))
    })

    expect(changeOwnerCallback).not.toHaveBeenCalled()
    expect(showErrorNotification).toHaveBeenCalledWith(
      expect.any(Function),
      { response: { status: 403 } },
      '',
      'Missing edit permission for the project',
      expect.any(Function)
    )

    // The pop-up has cleared its chosen owner by now, so the retry must carry it.
    const retry = showErrorNotification.mock.calls[0][4]
    await act(async () => {
      retry()
    })

    expect(projectsIguazioApi.updateProjectOwner).toHaveBeenLastCalledWith('project-a', 'bob')
    expect(changeOwnerCallback).toHaveBeenCalled()
  })
})
