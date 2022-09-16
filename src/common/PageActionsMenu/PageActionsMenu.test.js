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
