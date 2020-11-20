import React from 'react'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import { MemoryRouter } from 'react-router-dom'
import thunk from 'redux-thunk'

import Projects from './Projects'

import reducer from '../../reducers/reducers'
import { mainHttpClient } from '../../httpClient'

const renderWithRedux = (
  ui,
  {
    initialState,
    store = createStore(reducer, initialState, applyMiddleware(thunk))
  } = {}
) => {
  return { ...render(<Provider store={store}>{ui}</Provider>) }
}

jest.spyOn(mainHttpClient, 'get').mockImplementation(path => {
  return Promise.resolve({
    data: {
      projects: [
        {
          created: '2020-08-26T17:15:09.708192',
          description: null,
          id: 1,
          name: 'default',
          owner: null,
          source: null,
          spec: null,
          state: null,
          users: []
        }
      ]
    }
  })
})

jest.spyOn(mainHttpClient, 'post').mockImplementation(() => Promise.resolve())

jest.mock('../../images/close.svg', () => ({
  ReactComponent: 'close-icon'
}))

describe('Projects component', () => {
  let wrapper

  beforeEach(() => {
    const props = {
      match: {
        params: {},
        path: '/projects',
        url: '/projects'
      }
    }
    wrapper = renderWithRedux(
      <MemoryRouter>
        <Projects {...props} />
      </MemoryRouter>
    )
  })

  afterEach(cleanup)

  it('render without crash', () => {
    expect(wrapper.getByText(/projects/i).textContent).toEqual('Projects')
  })

  it('should fetch data', async () => {
    const projectName = await wrapper.findByText(/default/i)

    expect(projectName.textContent).toEqual('default')
  })

  it('should open popup "Create new project"', () => {
    const buttonNewProject = wrapper.getByRole('button', {
      name: /New Project/i
    })

    fireEvent.click(buttonNewProject)

    const popup = wrapper.queryByTestId('pop-up-dialog')

    expect(popup).not.toBeNull()
  })

  it('should not sent request if project field in form is Empty', () => {
    const buttonNewProject = wrapper.getByRole('button', {
      name: /New Project/i
    })

    fireEvent.click(buttonNewProject)

    const buttonCreate = wrapper.getByRole('button', { name: /create/i })

    fireEvent.click(buttonCreate)

    expect(mainHttpClient.post).not.toHaveBeenCalled()
  })

  it('should change name field in popup dialog', () => {
    const buttonNewProject = wrapper.getByRole('button', {
      name: /New Project/i
    })

    fireEvent.click(buttonNewProject)

    let name = wrapper.getAllByTestId('input')[0]

    fireEvent.change(name, { target: { value: 'default 1' } })

    name = wrapper.getAllByTestId('input')[0]

    expect(name.value).toEqual('default 1')
  })

  it('should change description field in popup dialog', () => {
    const buttonNewProject = wrapper.getByRole('button', {
      name: /New Project/i
    })

    fireEvent.click(buttonNewProject)

    let description = wrapper.getAllByTestId('input')[1]

    fireEvent.change(description, { target: { value: 'description' } })

    description = wrapper.getAllByTestId('input')[1]

    expect(description.value).toEqual('description')
  })

  it('should close popup if click by close button', () => {
    const buttonNewProject = wrapper.getByRole('button', {
      name: /New Project/i
    })

    fireEvent.click(buttonNewProject)

    const closeButton = wrapper.getByRole('button', { name: /cancel/i })

    fireEvent.click(closeButton)

    const popup = wrapper.queryByTestId('pop-up-dialog')

    expect(popup).toBeNull()
  })

  it('should close the error in popup dialog', async () => {
    jest.clearAllMocks()

    jest
      .spyOn(mainHttpClient, 'post')
      .mockImplementation(() => Promise.reject({ message: 'error' }))

    const buttonNewProject = wrapper.getByRole('button', {
      name: /New Project/i
    })

    fireEvent.click(buttonNewProject)

    let [name, description] = wrapper.getAllByTestId('input')

    fireEvent.change(name, { target: { value: 'default' } })
    fireEvent.change(description, { target: { value: 'description' } })

    const createButton = wrapper.getByRole('button', { name: /create/i })

    fireEvent.click(createButton)

    const closeErrorMessageBtn = await wrapper.findByTestId('close')

    fireEvent.click(closeErrorMessageBtn)

    const errorMessage = wrapper.queryByTestId('error-message')

    expect(errorMessage).toBeNull()
  })

  it('should create new project', async () => {
    jest.clearAllMocks()

    const promise = Promise.resolve([])

    jest.spyOn(mainHttpClient, 'post').mockImplementation(() => promise)

    const buttonNewProject = wrapper.getByRole('button', {
      name: /New Project/i
    })

    fireEvent.click(buttonNewProject)

    let [name, description] = wrapper.getAllByTestId('input')

    fireEvent.change(name, { target: { value: 'default' } })
    fireEvent.change(description, { target: { value: 'description' } })

    const createButton = wrapper.getByRole('button', { name: /create/i })

    fireEvent.click(createButton)

    await act(() => promise)

    expect(mainHttpClient.get).toHaveBeenCalled()
  })

  it('should display and hide required message on name input project', async () => {
    const buttonNewProject = wrapper.getByRole('button', {
      name: /New Project/i
    })

    const promise = Promise.resolve([])

    jest.spyOn(mainHttpClient, 'post').mockImplementation(() => promise)

    fireEvent.click(buttonNewProject)

    const createButton = wrapper.getByRole('button', { name: /create/i })

    fireEvent.click(createButton)

    let name = wrapper.getAllByTestId('input')[0]

    expect(name.className).toMatch('input_required')

    fireEvent.change(name, { target: { value: 'default' } })

    fireEvent.click(createButton)

    name = wrapper.getAllByTestId('input')[0]

    expect(name.className).not.toMatch('input_required')

    await act(() => promise)
  })

  it('should close error message after close popup dialog', async () => {
    jest.clearAllMocks()

    const promise = Promise.reject({ message: 'error' })

    jest.spyOn(mainHttpClient, 'post').mockImplementation(() => promise)

    const buttonNewProject = wrapper.getByRole('button', {
      name: /New Project/i
    })

    fireEvent.click(buttonNewProject)

    let [name, description] = wrapper.getAllByTestId('input')

    fireEvent.change(name, { target: { value: 'default' } })
    fireEvent.change(description, { target: { value: 'description' } })

    const createButton = wrapper.getByRole('button', { name: /create/i })

    fireEvent.click(createButton)

    try {
      await act(() => promise)
    } catch {
      const closeButton = wrapper.getByRole('button', { name: /cancel/i })

      fireEvent.click(closeButton)

      const errorMessage = wrapper.queryByTestId('error-message')

      expect(errorMessage).toBeNull()
    }
  })
})
