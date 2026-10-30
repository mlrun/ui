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
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import {
  Outlet,
  Route,
  RouterProvider,
  createMemoryRouter,
  createRoutesFromElements
} from 'react-router'

import { redirectToPath, redirectToProjectPageTab } from './routeRedirects'

// the same nesting of splat routes as in App.jsx
const routes = createRoutesFromElements(
  <Route path="" element={<Outlet />}>
    <Route path="projects" element={<div>projects page</div>} />
    <Route path="projects/*/jobs-monitoring/*" element={<Outlet />}>
      <Route path="jobs" element={<div>jobs monitoring page</div>} />
      <Route path="*" loader={redirectToPath('/projects/*/jobs-monitoring/jobs')} />
    </Route>
    <Route path="projects/:projectName/jobs/*" element={<Outlet />}>
      <Route path="monitor-jobs" element={<div>monitor jobs page</div>} />
      <Route path="*" loader={redirectToProjectPageTab('jobs', 'monitor-jobs')} />
    </Route>
    <Route path="projects/:projectName/models/*" element={<Outlet />}>
      <Route path="models" element={<div>models page</div>} />
      <Route path="*" loader={redirectToProjectPageTab('models', 'models')} />
    </Route>
    <Route path="*" loader={redirectToPath('/projects')} />
  </Route>
)

const renderAt = (url, basename) => {
  const router = createMemoryRouter(routes, { initialEntries: [url], basename })

  render(<RouterProvider router={router} />)

  return router
}

describe('catch-all route redirects', () => {
  it.each([
    ['/projects/default/models/INVALID', '/projects/default/models/models', 'models page'],
    [
      '/projects/default/models/INVALID/deeper/path',
      '/projects/default/models/models',
      'models page'
    ],
    ['/projects/default/jobs/INVALID', '/projects/default/jobs/monitor-jobs', 'monitor jobs page'],
    [
      '/projects/*/jobs-monitoring/INVALID',
      '/projects/*/jobs-monitoring/jobs',
      'jobs monitoring page'
    ],
    ['/INVALID', '/projects', 'projects page'],
    ['/projects/default/INVALID/general', '/projects', 'projects page']
  ])('redirects "%s" to "%s"', async (url, expectedPathname, expectedPage) => {
    const router = renderAt(url)

    expect(await screen.findByText(expectedPage)).toBeInTheDocument()
    expect(router.state.location.pathname).toBe(expectedPathname)
  })

  it('keeps special characters of the project name', async () => {
    const router = renderAt('/projects/my%20project/models/INVALID')

    expect(await screen.findByText('models page')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/projects/my%20project/models/models')
  })

  it('redirects within the router basename', async () => {
    const router = renderAt('/mlrun/projects/default/models/INVALID', '/mlrun')

    expect(await screen.findByText('models page')).toBeInTheDocument()
    // the basename is applied once, the redirect stays within the app
    expect(router.state.location.pathname).toBe('/mlrun/projects/default/models/models')
  })
})
