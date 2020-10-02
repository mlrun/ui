import { render } from '@testing-library/react'
import React from 'react'
import Breadcrumbs from './Breadcrumbs'
import { BrowserRouter as Router } from 'react-router-dom'

jest.mock('../../images/arrow.svg', () => ({
  ReactComponent: 'arrow-icon'
}))

const renderComponent = props =>
  render(
    <Router>
      <Breadcrumbs {...props} />
    </Router>
  )

describe('Breadcrumbs component', () => {
  let wrapper

  beforeEach(() => {
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
    wrapper = renderComponent(props)
  })

  it('renders without crashing', () => {
    expect(wrapper.queryByTestId('breadcrumbs')).not.toBeNull()
  })

  it('should show the last item as "default"', () => {
    const lastItem = wrapper.getByTestId('breadcrumbs-last-item')
    expect(lastItem.textContent).toEqual('default')
  })

  it('should display "jobId"', () => {
    const props = {
      match: {
        path: '/projects/:projectName/jobs/:jobTab/:jobId/:tab',
        url:
          '/projects/default/jobs/monitor/a6422d0d93d24a8f91059992a6b1529e/info',
        params: {
          jobId: 'a6422d0d93d24a8f91059992a6b1529e',
          jobTab: 'monitor',
          projectName: 'default',
          tab: 'info'
        }
      }
    }
    wrapper.rerender(
      <Router>
        <Breadcrumbs {...props} />
      </Router>
    )

    expect(wrapper.queryByTestId('breadcrumbs-id')).not.toBeNull()
  })
})
