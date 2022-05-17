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
  if (/category=dataset/.test(path)) {
    return Promise.resolve({
      data: {
        artifacts: [
          {
            db_key: 'mlrun-8727a2-training_mydf',
            format: 'csv',
            hash: '8b6edc4fb4d71af093ff98f7c8f879416409eba5',
            header: ['index', 'A', 'B'],
            iter: 0,
            key: 'mydf',
            kind: 'dataset',
            length: 3,
            preview: [
              [0, 10, 100],
              [1, 11, 110],
              [2, 12, 120]
            ],
            producer: {},
            project: 'default',
            schema: {},
            size: 32,
            sources: [],
            stats: {},
            target_path: '/User/mlrun-repo/examples/data/mydf.csv',
            tree: '84b115d5673a498491a9392c2224acba',
            updated: '2020-11-17T10:57:39.404021+00:00'
          }
        ]
      }
    })
  } else if (/category=model/.test(path)) {
    return Promise.resolve({
      data: {
        artifacts: [
          {
            db_key: 'mlrun-8727a2-training_mymodel',
            framework: '',
            hash: '8170b9a53bbb1f4d52733bc6824955e3a362d4a1',
            inputs: [],
            iter: 0,
            key: 'mymodel',
            kind: 'model',
            labels: { framework: 'xgboost' },
            metrics: { accuracy: 0.85 },
            model_file: 'model.txt',
            outputs: [],
            parameters: { xx: 'abc', one_more: 5 },
            producer: {},
            project: 'default',
            size: 10,
            sources: [],
            target_path: '/User/mlrun-repo/examples/data/models/',
            tree: '84b115d5673a498491a9392c2224acba',
            updated: '2020-11-17T10:57:39.461590+00:00'
          }
        ]
      }
    })
  } else if (/functions/.test(path)) {
    return Promise.resolve({
      test: {
        metadata: {
          labels: {
            'nuclio.io/project-name': 'default'
          },
          name: 'test',
          namespace: 'default-tenant',
          resourceVersion: '13812'
        },
        spec: {
          alias: 'latest',
          build: {
            codeEntryType: 'sourceCode',
            functionSourceCode:
              'ZGVmIGhhbmRsZXIoY29udGV4dCwgZXZlbnQpOg0KICAgIHJldHVybiAiIg==',
            noBaseImagesPull: true,
            offline: true,
            runtimeAttributes: { repositories: [] },
            timestamp: 1606040751
          },
          eventTimeout: '',
          handler: 'main:handler',
          imageHash: '1606040704721554134',
          loggerSinks: [{ level: 'debug' }],
          platform: {},
          resources: {},
          runtime: 'python:3.6',
          scaleToZero: {
            scaleResources: [
              {
                metricName: 'nuclio_processor_handled_events_total',
                windowSize: '10m',
                threshold: 0
              }
            ]
          },
          securityContext: {},
          triggers: {
            'default-http': {
              attributes: { serviceType: 'ClusterIP' },
              class: '',
              kind: 'http',
              maxWorkers: 1,
              name: 'default-http'
            }
          },
          version: -1
        },
        status: {
          logs: [
            {
              level: 'info',
              message: 'Deploying function',
              name: 'test',
              time: 1606040704662.182
            },
            {
              level: 'info',
              message: 'Building',
              name: 'test',
              time: 1606040704662.2615,
              versionInfo:
                'Label: 1.5.5, Git commit: 2ceb670cda373d62c897e32eb6a5e86eadf9679e, OS: linux, Arch: amd64, Go version: go1.14.3'
            }
          ],
          scaleToZero: {
            lastScaleEvent: 'resourceUpdated',
            lastScaleEventTime: '2020-11-22T10:25:55.376549436Z'
          },
          state: 'ready'
        }
      }
    })
  } else if (/runs/.test(path)) {
    return Promise.resolve({
      data: {
        runs: []
      }
    })
  } else if (/projects/.test(path)) {
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
  }
})

jest.spyOn(mainHttpClient, 'post').mockImplementation(() => Promise.resolve())

jest.mock('igz-controls/images/close.svg', () => ({
  ReactComponent: 'close-icon'
}))

describe('Projects component', () => {
  let wrapper

  beforeEach(async () => {
    const props = {
      match: {
        params: {},
        path: '/projects',
        url: '/projects'
      }
    }

    await act(
      async () =>
        (wrapper = renderWithRedux(
          <MemoryRouter>
            <Projects {...props} />
          </MemoryRouter>
        ))
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
