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
import {
  JOBS_MONITORING_JOBS_TAB,
  JOBS_MONITORING_WORKFLOWS_TAB,
  JOB_KIND_JOB,
  JOB_KIND_WORKFLOW
} from '../constants'
import { setFilters, setModalFiltersValues } from '../reducers/filtersReducer'

export const generateMonitoringStats = (data, navigate, dispatch, tab) => {
  const navigateToJobsMonitoringPage = value => {
    dispatch(setFilters({ saveFilters: true }))
    dispatch(setModalFiltersValues({ name: tab, value }))
    navigate(`/projects/jobs-monitoring/${tab}`)
  }

  return tab === JOBS_MONITORING_JOBS_TAB
    ? {
        all: {
          counter: data.all,
          link: () => navigateToJobsMonitoringPage({ state: ['all'] })
        },
        counters: [
          {
            counter: data.running,
            link: () =>
              navigateToJobsMonitoringPage({
                state: ['running', 'created', 'pending', 'unknown', 'aborting']
              }),
            statusClass: 'running'
          },
          {
            counter: data.failed,
            link: () => navigateToJobsMonitoringPage({ state: ['error', 'aborted'] }),
            statusClass: 'failed'
          },
          {
            counter: data.completed,
            link: () => navigateToJobsMonitoringPage({ state: ['completed'] }),
            statusClass: 'completed'
          }
        ]
      }
    : tab === JOBS_MONITORING_WORKFLOWS_TAB
      ? {
          all: {
            counter: data.all,
            link: () => navigateToJobsMonitoringPage({ state: ['all'] })
          },
          counters: [
            {
              counter: data.running,
              link: () => navigateToJobsMonitoringPage({ state: ['running'] }),
              statusClass: 'running'
            },
            {
              counter: data.failed,
              link: () => navigateToJobsMonitoringPage({ state: ['error', 'failed'] }),
              statusClass: 'failed'
            },
            {
              counter: data.completed,
              link: () => navigateToJobsMonitoringPage({ state: ['succeeded'] }),
              statusClass: 'completed'
            }
          ]
        }
      : {
          jobs: {
            counter: data.jobs,
            link: () => navigateToJobsMonitoringPage({ type: JOB_KIND_JOB })
          },
          workflows: {
            counter: data.workflows,
            link: () => navigateToJobsMonitoringPage({ type: JOB_KIND_WORKFLOW })
          }
        }
}
