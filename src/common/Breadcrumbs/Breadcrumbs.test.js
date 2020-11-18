import React from 'react'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import { act, cleanup, render } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'

import Breadcrumbs from './Breadcrumbs'

import reducer from '../../reducers/reducers'
import { mainHttpClient } from '../../httpClient'
import { fireEvent } from '@testing-library/dom'

jest.mock('../../images/arrow.svg', () => ({
  ReactComponent: 'arrow-icon'
}))

jest.spyOn(mainHttpClient, 'get').mockImplementation(path => {
  if (/projects\?full=yes/.test(path)) {
    return Promise.resolve({
      data: {
        projects: [
          {
            created: '2020-08-26T17:15:09.708192',
            description: 'description',
            id: 1,
            name: 'default',
            owner: null,
            source: null,
            state: null,
            users: []
          }
        ]
      }
    })
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
  return { ...render(<Provider store={store}>{ui}</Provider>), store }
}

describe('Breadcrumbs component', () => {
  let wrapper

  beforeEach(async () => {
    const props = {
      match: {
        path: '/projects/:projectName',
        url: '/projects/default',
        params: {
          projectName: 'default',
          jobId: '123'
        }
      }
    }

    await act(
      async () =>
        (wrapper = renderWithRedux(
          <Router>
            <Breadcrumbs {...props} />
          </Router>
        ))
    )
  })

  afterEach(cleanup)

  it('renders without crashing', () => {
    expect(wrapper.queryByTestId('breadcrumbs')).not.toBeNull()
  })

  it('should show the last item as "default"', () => {
    const lastItem = wrapper.getByTestId('breadcrumbs-last-item')
    expect(lastItem.textContent).toEqual('default')
  })

  it('should display "jobId"', async () => {
    const props = {
      match: {
        path: '/projects/:projectName/jobs/:pageTab/:jobId/:tab',
        url:
          '/projects/default/jobs/monitor/a6422d0d93d24a8f91059992a6b1529e/info',
        params: {
          jobId: 'a6422d0d93d24a8f91059992a6b1529e',
          pageTab: 'monitor',
          projectName: 'default',
          tab: 'info'
        }
      }
    }

    await act(
      async () =>
        (wrapper = renderWithRedux(
          <Router>
            <Breadcrumbs {...props} />
          </Router>
        ))
    )

    expect(wrapper.queryByTestId('breadcrumbs-id')).not.toBeNull()
  })

  it('should change separator class when clicking on separator', () => {
    const separator = wrapper.getByTestId('separator')

    fireEvent.click(separator)

    expect(separator.className).toMatch('breadcrumbs__separator_active')
  })

  it('should show dropdown when clicking on separator', () => {
    const separator = wrapper.getByTestId('separator')

    fireEvent.click(separator)

    expect(wrapper.getByTestId('breadcrumbs-dropdown')).not.toBeNull()
  })

  it('should remove breadcrumbs__separator_active class from separator when clicking on dropdown link', () => {
    const separator = wrapper.getByTestId('separator')

    fireEvent.click(separator)

    const dropdownItem = wrapper.getByTestId('breadcrumbs-dropdown-item')

    fireEvent.click(dropdownItem)

    expect(separator.className).not.toMatch('breadcrumbs__separator_active')
  })
})
