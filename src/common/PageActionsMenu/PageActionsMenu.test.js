import React from 'react'
import { cleanup, render } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import PageActionsMenu from './PageActionsMenu'

const renderComponent = props =>
  render(
    <Router>
      <PageActionsMenu {...props} />
    </Router>
  )

describe('PageActionsMenu component', () => {
  let wrapper

  beforeEach(() => {
    const props = {
      pageData: {
        page: 'JOBS'
      },
      match: {
        path: '/projects/:projectName/jobs/:jobTab/:jobId/:tab',
        url:
          '/projects/default/jobs/monitor/a6422d0d93d24a8f91059992a6b1529e/overview',
        params: {
          jobId: 'a6422d0d93d24a8f91059992a6b1529e',
          jobTab: 'monitor',
          projectName: 'default',
          tab: 'info'
        }
      }
    }
    wrapper = renderComponent(props)
  })

  afterEach(cleanup)

  it('renders without crashing', () => {
    expect(wrapper.queryByTestId('actions-link')).not.toBeNull()
  })

  it('should display link if props page is "JOBS"', () => {
    expect(
      wrapper.getByRole('link', {
        href: 'href="/projects/default/jobs/monitor/create-new-job"'
      })
    )
  })

  it('should display button if props page is "ARTIFACTS"', () => {
    wrapper.rerender(
      <Router>
        <PageActionsMenu
          match={{}}
          pageData={{
            page: 'ARTIFACTS',
            registerArtifactDialogTitle: 'Register artifact'
          }}
        />
      </Router>
    )

    expect(
      wrapper.getByRole('button', {
        name: /Register Artifact/i
      })
    )
  })

  it('should display button if props page is "PROJECTS"', () => {
    wrapper.rerender(
      <Router>
        <PageActionsMenu match={{}} pageData={{ page: 'PROJECTS' }} />
      </Router>
    )

    expect(
      wrapper.getByRole('button', {
        name: /New Project/i
      })
    )
  })
})
