import React from 'react'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'

import Project from './Project'

import reducer from '../../reducers/reducers'
import { mainHttpClient } from '../../httpClient'

jest.mock('../../images/arrow.svg', () => ({
  ReactComponent: 'arrow-icon'
}))

jest.spyOn(mainHttpClient, 'post').mockImplementation(() => {
  return Promise.resolve()
})

const mockHistoryPush = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush
  })
}))

jest.spyOn(mainHttpClient, 'get').mockImplementation(path => {
  if (/project\/default/.test(path)) {
    return Promise.resolve({
      data: {
        project: {
          created: '2020-08-26T17:15:09.708192',
          description: 'description',
          id: 1,
          name: 'default',
          owner: null,
          source: null,
          state: null,
          users: []
        }
      }
    })
  } else if (/runs\?project=default/.test(path)) {
    return Promise.resolve()
  } else if (/funcs\?project=default/.test(path)) {
    return Promise.resolve()
  }

  return Promise.resolve()
})

const renderWithRedux = (
  ui,
  {
    initialState,
    store = createStore(reducer, initialState, applyMiddleware(thunk))
  } = {}
) => {
  return { ...render(<Provider store={store}>{ui}</Provider>) }
}

describe('Project component', () => {
  let wrapper

  beforeEach(() => {
    const props = {
      match: {
        params: { projectName: 'default' },
        path: '/projects/:projectName',
        url: '/projects/default'
      }
    }
    window.mlrunConfig = { nuclioUiUrl: 'http://localhost:8070' }

    wrapper = renderWithRedux(
      <Router>
        <Project {...props} />
      </Router>
    )
  })

  afterEach(cleanup)

  it('render without crash', () => {
    const projectName = wrapper.getByTestId('breadcrumbs-last-item')
    expect(projectName.textContent).toEqual('default')
  })

  it('should edit project name', () => {
    const projectName = wrapper.getByTestId('project-name')

    fireEvent.click(projectName)

    const input = wrapper.getByRole('textbox')

    expect(input.value).toEqual('default')
  })

  it('should close editing mode if click outside input', () => {
    const projectName = wrapper.getByTestId('project-name')

    fireEvent.click(projectName)

    let input = wrapper.getByRole('textbox')

    fireEvent.click(wrapper.container)

    input = wrapper.queryByRole('textbox')

    expect(input).toBeNull()
  })

  it('should set the project to the default value if an error message is received after the edit mode', async () => {
    jest.clearAllMocks()

    const promise = Promise.reject()

    jest.spyOn(mainHttpClient, 'post').mockImplementation(() => promise)

    let projectName = wrapper.getByTestId('project-name')

    fireEvent.click(projectName)

    const input = wrapper.getByRole('textbox')

    fireEvent.change(input, { target: { value: 'default123' } })

    fireEvent.click(wrapper.container)

    projectName = await wrapper.findByTestId('project-name')

    expect(projectName.textContent).toEqual('default')
  })

  it('should close editing mode if press "Enter"', async () => {
    let projectName = wrapper.getByTestId('project-name')

    fireEvent.click(projectName)

    const input = wrapper.getByRole('textbox')

    fireEvent.keyDown(input, { keyCode: 13 })

    projectName = await wrapper.findByTestId('project-name')

    expect(projectName.textContent).toEqual('default')
  })

  it('should go to create job page if click by "create new->job" option', () => {
    const selectCreateNew = wrapper.getByText(/create new/i)

    fireEvent.click(selectCreateNew)

    const selectOptionJob = wrapper.getByText(/^job$/i)

    fireEvent.click(selectOptionJob)

    expect(mockHistoryPush).toHaveBeenCalled()
  })

  it('should open register artifact popup if click by "create new->register artifact" option', () => {
    const selectCreateNew = wrapper.getByText(/create new/i)

    fireEvent.click(selectCreateNew)

    const selectOptionRegisterArtifact = wrapper.getByText(/^register/i)

    fireEvent.click(selectOptionRegisterArtifact)

    const popupDialog = wrapper.queryByTestId('pop-up-dialog')

    expect(popupDialog).not.toBeNull()
  })

  it('should change description of project to "project description"', async () => {
    jest.clearAllMocks()

    jest.spyOn(mainHttpClient, 'post').mockImplementation(path => {
      if (/default/.test(path)) {
        return Promise.resolve({
          data: {
            project: {
              created: '2020-08-26T17:15:09.708192',
              description: 'project description',
              id: 1,
              name: 'default 123',
              owner: null,
              source: null,
              state: null,
              users: []
            }
          }
        })
      }
    })

    let projectDescription = wrapper.getByTestId('project-description')

    fireEvent.click(projectDescription)

    const input = wrapper.getByRole('textbox')

    fireEvent.change(input, { target: { value: 'project description' } })

    fireEvent.keyDown(input, { keyCode: 13 })

    projectDescription = await wrapper.findByText(/project description/i)

    expect(projectDescription.textContent).toMatch(/description/)
  })

  it('should not send a request in edit mode until press Enter', () => {
    jest.clearAllMocks()

    const postRequest = jest.spyOn(mainHttpClient, 'post')

    let projectName = wrapper.getByTestId('project-name')

    fireEvent.click(projectName)

    const input = wrapper.getByRole('textbox')

    fireEvent.keyDown(input, { keyCode: 19 })

    expect(postRequest).not.toHaveBeenCalled()
  })

  it('should not send a request in edit mode if click second time by input', () => {
    jest.clearAllMocks()

    const postRequest = jest.spyOn(mainHttpClient, 'post')

    let projectName = wrapper.getByTestId('project-name')

    fireEvent.click(projectName)

    const input = wrapper.getByRole('textbox')

    fireEvent.click(input.parentNode)

    expect(postRequest).not.toHaveBeenCalled()
  })
})
