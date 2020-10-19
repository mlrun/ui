import React from 'react'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import {
  act,
  cleanup,
  fireEvent,
  render,
  waitFor
} from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import thunk from 'redux-thunk'

import Jobs from './Jobs'

import reducer from '../../reducers/reducers'
import { mainHttpClient } from '../../httpClient'

jest.mock('../../images/arrow.svg', () => ({
  ReactComponent: 'arrow-icon'
}))

jest.spyOn(mainHttpClient, 'delete').mockImplementation(path => {
  return Promise.resolve([])
})

jest.spyOn(mainHttpClient, 'get').mockImplementation(path => {
  if (/runs/.test(path)) {
    return Promise.resolve({
      data: {
        runs: [
          {
            kind: 'run',
            metadata: {
              annotations: {},
              iteration: 0,
              labels: {
                author: 'me',
                host: 'file-utils-5wrdr',
                kind: 'job',
                owner: 'pipelines',
                v3io_user: 'pipelines'
              },
              name: 'file-utils',
              project: 'default',
              uid: '716898186491548141284'
            },
            spec: {
              data_stores: [],
              function:
                'default/file-utils@aa7050617e238d8977236c735a90bd950f73f5dd',
              inputs: {},
              log_level: 'info',
              output_path: 'v3io:///users/pipelines/artifacts/default',
              outputs: [],
              parameters: { context: '', target_dir: '' }
            },
            status: {
              artifacts: [],
              error: "'NoneType' object has no attribute 'local'",
              last_update: '2020-10-09T10:12:06.160969+00:00',
              results: {},
              start_time: '2020-10-09T10:12:06.060112+00:00',
              state: 'error'
            }
          }
        ]
      }
    })
  } else if (/workflows/.test(path)) {
    return Promise.resolve({
      data: {
        next_page_token: null,
        runs: [
          {
            created_at: '2020-10-09 21:13:04+00:00',
            description: 'None',
            error: 'None',
            finished_at: '2020-10-09 21:15:13+00:00',
            id: '8388fac8-5a7a-4f80-8d8e-aed9da4b5d50',
            name: 'kfpipeline 2020-10-09 21-13-04',
            scheduled_at: '1970-01-01 00:00:00+00:00',
            status: 'Succeeded'
          }
        ]
      }
    })
  } else if (/schedules/.test(path)) {
    return Promise.resolve({
      data: {
        schedules: [
          {
            creation_time: '2020-09-03T11:45:09.542042',
            cron_trigger: {
              day: '*',
              day_of_week: '*',
              end_date: null,
              hour: 0,
              jitter: null,
              minute: 0,
              month: '*',
              second: null,
              start_date: null,
              timezone: null,
              week: null,
              year: null
            },
            desired_state: null,
            kind: 'job',
            name: 'aggregate',
            next_run_time: '2020-10-14T00:00:00+00:00',
            project: 'default',
            scheduled_object: {
              kind: '',
              spec: {}
            },
            schedule: '0 0 * * *',
            task: {}
          }
        ]
      }
    })
  }
})

const renderWithRedux = (
  ui,
  {
    initialState,
    store = createStore(reducer, initialState, applyMiddleware(thunk))
  } = {}
) => {
  return { ...render(<Provider store={store}>{ui}</Provider>), store }
}

describe('JobsPage component', () => {
  let wrapper

  beforeEach(async () => {
    const props = {
      match: {
        params: {
          jobTab: 'monitor',
          projectName: 'default'
        },
        path: '/projects/:projectName/jobs/:jobTab',
        url: '/projects/default/jobs/monitor'
      },
      history: {}
    }

    await act(
      async () =>
        (wrapper = renderWithRedux(
          <Router>
            <Jobs {...props} />
          </Router>
        ))
    )
  })

  afterEach(cleanup)

  it('renders without crashing', async () => {
    const jobsLink = await wrapper.findByText(/Jobs/i)

    expect(jobsLink.textContent).toEqual('Jobs')
  })

  it('should fetch jobs', async () => {
    const name = await wrapper.findByText(/file-utils/i)

    expect(name.textContent).toEqual('file-utils')
  })

  it('should display details component', () => {
    const linkDetails = wrapper.getByRole('link', {
      name: /file-utils/i
    })

    fireEvent.click(linkDetails)

    const tabLogs = wrapper.getByRole('link', { name: /logs/i })

    expect(tabLogs.textContent).toEqual('logs')
  })

  it('should close details component', () => {
    const linkDetails = wrapper.getByRole('link', {
      name: /file-utils/i
    })

    fireEvent.click(linkDetails)

    const closeBtn = wrapper.getByTestId('details-close-btn')

    fireEvent.click(closeBtn)

    expect(wrapper.queryByRole('link', { name: /logs/i })).toBeNull()
  })

  it('should be change filter status to "completed"', async () => {
    const filterStatus = wrapper.getByText(/status/i)

    fireEvent.click(filterStatus)

    const completedItem = wrapper.getByText(/completed/i)

    fireEvent.click(completedItem)

    const selectOption = await wrapper.findByText(/Completed/i)

    expect(selectOption.textContent).toEqual('Completed')
  })

  it('should change filter group to "none"', async () => {
    const filterGroup = wrapper.getByText(/group By:/i)

    fireEvent.click(filterGroup)

    const noneItem = wrapper.getByText(/none/i)

    fireEvent.click(noneItem)

    const selectOption = await wrapper.findByText(/none/i)

    expect(selectOption.textContent).toEqual('None')
  })

  it('should redirect to jobs if do not match "JobId"', async () => {
    cleanup()
    const mockHistoryPush = jest.fn()
    const props = {
      match: {
        params: {
          projectName: 'default',
          jobTab: 'monitor',
          jobId: 'a6422d0d93d24a8f91059992a6b1529e',
          tab: 'info'
        },
        path: '/projects/:projectName/jobs/:jobTab/:jobId/:tab',
        url:
          '/projects/default/jobs/monitor/a6422d0d93d24a8f91059992a6b1529e/info'
      },
      history: { push: mockHistoryPush }
    }

    await act(
      async () =>
        (wrapper = renderWithRedux(
          <Router>
            <Jobs {...props} />
          </Router>
        ))
    )
    expect(mockHistoryPush).toHaveBeenCalledWith(
      '/projects/default/jobs/monitor'
    )
  })

  it('should active schedule tab', async () => {
    cleanup()
    const props = {
      match: {
        params: {
          jobTab: 'schedule',
          projectName: 'default'
        },
        path: '/projects/:projectName/jobs/:jobTab',
        url: '/projects/default/jobs/schedule'
      },
      history: {}
    }

    await act(
      async () =>
        (wrapper = renderWithRedux(
          <Router>
            <Jobs {...props} />
          </Router>
        ))
    )

    const schedule = wrapper.getByTestId('schedule')

    expect(schedule.className).toMatch('active')
  })

  it('should remove one item of schedule', async () => {
    cleanup()
    const props = {
      match: {
        params: {
          jobTab: 'schedule',
          projectName: 'default'
        },
        path: '/projects/:projectName/jobs/:jobTab',
        url: '/projects/default/jobs/schedule'
      },
      history: {}
    }

    await act(
      async () =>
        (wrapper = renderWithRedux(
          <Router>
            <Jobs {...props} />
          </Router>
        ))
    )

    const actionMenu = wrapper.getByTestId('actions-menu-btn')

    fireEvent.click(actionMenu)

    const removeItem = wrapper.getByText(/remove/i)

    fireEvent.click(removeItem)

    await waitFor(() => {
      expect(mainHttpClient.delete).toHaveBeenCalled()
    })
  })

  it('should display details page at first renders', async () => {
    cleanup()
    const mockHistoryPush = jest.fn()
    const props = {
      match: {
        params: {
          projectName: 'default',
          jobTab: 'monitor',
          jobId: '716898186491548141284',
          tab: 'info'
        },
        path: '/projects/:projectName/jobs/:jobTab/:jobId/:tab',
        url: '/projects/default/jobs/monitor/716898186491548141284/info'
      },
      history: { push: mockHistoryPush }
    }

    await act(
      async () =>
        (wrapper = renderWithRedux(
          <Router>
            <Jobs {...props} />
          </Router>
        ))
    )

    const tabLogs = wrapper.getByRole('link', { name: /logs/i })

    expect(tabLogs.textContent).toEqual('logs')
  })

  it('should add default value if some properties is null after received data', async () => {
    jest.clearAllMocks()
    jest.spyOn(mainHttpClient, 'get').mockImplementation(path => {
      if (/runs/.test(path)) {
        return Promise.resolve({
          data: {
            runs: [
              {
                kind: 'run',
                metadata: {
                  annotations: {},
                  iteration: 0,
                  labels: null,
                  name: 'file-utils',
                  project: 'default',
                  uid: '716898186491548141284'
                },
                spec: {
                  data_stores: [],
                  function: null,
                  inputs: null,
                  log_level: 'info',
                  output_path: 'v3io:///users/pipelines/artifacts/default',
                  outputs: [],
                  parameters: null
                },
                status: {
                  artifacts: null,
                  error: "'NoneType' object has no attribute 'local'",
                  last_update: '2020-10-09T10:12:06.160969+00:00',
                  results: null,
                  start_time: '2020-10-09T10:12:06.060112+00:00',
                  state: 'error',
                  iterations: null
                }
              }
            ]
          }
        })
      }
      return Promise.resolve()
    })

    const props = {
      match: {
        params: {
          projectName: 'default',
          jobTab: 'monitor'
        },
        path: '/projects/:projectName/jobs/:jobTab',
        url: '/projects/default/jobs/monitor'
      },
      history: {}
    }

    await act(
      async () =>
        (wrapper = renderWithRedux(
          <Router>
            <Jobs {...props} />
          </Router>
        ))
    )

    const jobsStore = wrapper.store.getState().jobsStore

    expect(jobsStore.jobs[0].spec.inputs).toEqual(null)
  })
})
