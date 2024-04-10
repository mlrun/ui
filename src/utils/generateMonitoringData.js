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
import { jobHasWorkflowLabel } from './parseJob'

import { JOBS_MONITORING_SCHEDULED_TAB } from '../constants'
import { setFilters } from '../reducers/filtersReducer'

export const generateMonitoringStats = (data, navigate, dispatch, tab) => {
  const navigateToJobsMonitoringPage = status => {
    dispatch(
      setFilters({
        state: status
      })
    )
    navigate(`/projects/jobs-monitoring/${tab}`)
  }

  return tab === JOBS_MONITORING_SCHEDULED_TAB
    ? {
        jobs: {
          counter: data.jobs.length,
          link: () => navigateToJobsMonitoringPage('jobs')
        },
        workflows: {
          counter: data.workflows.length,
          link: () => navigateToJobsMonitoringPage('workflows')
        }
      }
    : {
        all: {
          counter: data.all?.length,
          link: () => navigateToJobsMonitoringPage('')
        },
        counters: [
          {
            counter: data.running?.length,
            link: () => navigateToJobsMonitoringPage('running'),
            statusClass: 'running'
          },
          {
            counter: data.failed?.length,
            link: () => navigateToJobsMonitoringPage('failed'),
            statusClass: 'failed'
          },
          {
            counter: data.completed?.length,
            link: () => navigateToJobsMonitoringPage('completed'),
            statusClass: 'completed'
          }
        ]
      }
}

export const generateMonitoringGroupedData = (data, setData, handleDispatchData) => {
  const groupedData = {
    all: data,
    running: data.filter(
      element => element.status?.state === 'running' || element.state?.value === 'running'
    ),
    failed: data.filter(element =>
      ['aborting', 'aborted', 'error', 'failed'].includes(
        element.status?.state || element.state?.value
      )
    ),
    completed: data.filter(
      element => element.status?.state === 'completed' || element.state?.value === 'completed'
    )
  }

  setData(groupedData)
  handleDispatchData(groupedData)
}

export const generateScheduledMonitoringGroupedData = (
  data,
  filter,
  setData,
  handleDispatchData
) => {
  const groupedData = {
    all: data,
    jobs: filterScheduledByDate(data, filter).filter(
      job => job.kind === 'job' && !jobHasWorkflowLabel(job)
    ),
    workflows: filterScheduledByDate(data, filter).filter(job => jobHasWorkflowLabel(job))
  }

  setData(groupedData)
  handleDispatchData(groupedData)
}

const filterScheduledByDate = (scheduled, scheduledFilter) => {
  if (!scheduledFilter.dates.value[0] && !scheduledFilter.dates.value[1]) return scheduled

  return scheduled.filter(job => {
    const runTime = new Date(job.next_run_time)

    const start = new Date(scheduledFilter.dates.value[0])
    const end = new Date(scheduledFilter.dates.value[1])

    return runTime > start && runTime < end ? job : null
  })
}
