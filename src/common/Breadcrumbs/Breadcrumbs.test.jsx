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
import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import Breadcrumbs from './Breadcrumbs'
import {
  DETAILS_OVERVIEW_TAB,
  FEATURE_STORE_PAGE_PATH,
  JOBS_PAGE_PATH,
  MONITORING_APP_PAGE
} from '../../constants'

const mockUseParams = vi.fn()
const mockUseLocation = vi.fn()

vi.mock('react-router-dom', () => ({
  useParams: () => mockUseParams(),
  useLocation: () => mockUseLocation()
}))

const mockUseSelector = vi.fn()
vi.mock('react-redux', () => ({
  useSelector: callback => callback(mockUseSelector())
}))

vi.mock('./BreadcrumbsStep/BreadcrumbsStep', () => ({
  default: ({ urlPart }) => <li data-testid="breadcrumb-step">{urlPart}</li>
}))

vi.mock('./breadcrumbs.util', () => ({
  generateMlrunScreens: vi.fn(() => [
    { id: FEATURE_STORE_PAGE_PATH, label: 'Feature Store' },
    { id: JOBS_PAGE_PATH, label: 'Jobs' },
    { id: MONITORING_APP_PAGE, label: 'Model Monitoring' }
  ]),
  generateTabsList: vi.fn(() => [{ id: DETAILS_OVERVIEW_TAB, label: 'Overview' }])
}))

vi.mock('../../utils/projects', () => ({
  generateProjectsList: vi.fn(() => ['project-1', 'project-2'])
}))

describe('Breadcrumbs Component', () => {
  const defaultStore = {
    projectStore: {
      projectsNames: {
        data: ['default-project']
      }
    }
  }

  beforeEach(() => {
    mockUseSelector.mockReturnValue(defaultStore)
    mockUseParams.mockReturnValue({})
    mockUseLocation.mockReturnValue({ pathname: '/' })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders the breadcrumbs container', () => {
    mockUseParams.mockReturnValue({ projectName: 'test-project' })
    mockUseLocation.mockReturnValue({ pathname: '/projects/test-project/jobs' })

    render(<Breadcrumbs />)

    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument()
  })

  it('generates correct steps when inside a project (Project Context)', () => {
    const projectName = 'my-project'
    const screenId = FEATURE_STORE_PAGE_PATH

    mockUseParams.mockReturnValue({ projectName })
    mockUseLocation.mockReturnValue({ pathname: `/projects/${projectName}/${screenId}` })

    render(<Breadcrumbs />)

    const steps = screen.getAllByTestId('breadcrumb-step')

    expect(steps).toHaveLength(3)
    expect(steps[0]).toHaveTextContent('projects')
    expect(steps[1]).toHaveTextContent(projectName)
    expect(steps[2]).toHaveTextContent('Feature Store')
  })

  it('generates correct steps when not inside a project (Cross Project Context)', () => {
    mockUseParams.mockReturnValue({})

    mockUseLocation.mockReturnValue({ pathname: '/root/projects/settings' })

    render(<Breadcrumbs />)

    const steps = screen.getAllByTestId('breadcrumb-step')

    expect(steps).toHaveLength(2)
    expect(steps[1]).toHaveTextContent('settings')
  })

  it('handles Monitoring Page specific logic', () => {
    const projectName = 'test-proj'

    mockUseParams.mockReturnValue({ projectName })
    mockUseLocation.mockReturnValue({ pathname: `/projects/${projectName}/${MONITORING_APP_PAGE}` })

    render(<Breadcrumbs />)

    const steps = screen.getAllByTestId('breadcrumb-step')

    expect(steps).toHaveLength(3)
    expect(steps[2]).toHaveTextContent('Model Monitoring')
  })

  it('calls onClick prop when passed', () => {
    const handleClick = vi.fn()
    mockUseParams.mockReturnValue({ projectName: 'p1' })
    mockUseLocation.mockReturnValue({ pathname: '/projects/p1/jobs' })

    render(<Breadcrumbs onClick={handleClick} />)

    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument()
  })
})
