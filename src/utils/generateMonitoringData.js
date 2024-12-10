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
  DATES_FILTER,
  FILTER_ALL_ITEMS,
  JOBS_MONITORING_JOBS_TAB,
  JOBS_MONITORING_PAGE,
  JOBS_MONITORING_WORKFLOWS_TAB,
  JOB_KIND_JOB,
  JOB_KIND_WORKFLOW,
  STATUS_FILTER,
  TYPE_FILTER,
  ERROR_STATE,
  FAILED_STATE
} from '../constants'
import { ANY_TIME_DATE_OPTION } from './datePicker.util'

const IN_PROCESS = 'In Process'
const FAILED = 'Failed'
const SUCCEEDED = 'Succeeded'

export const generateMonitoringStats = (data, navigate, tab) => {
  const navigateToJobsMonitoringPage = (filters = {}) => {
    navigate(`/projects/*/${JOBS_MONITORING_PAGE}/${tab}?${new URLSearchParams(filters)}`)
  }

  return tab === JOBS_MONITORING_JOBS_TAB
    ? {
        total: {
          counter: data.total || 0,
          link: () => navigateToJobsMonitoringPage({ [STATUS_FILTER]: [FILTER_ALL_ITEMS] })
        },
        counters: [
          {
            counter: data.running,
            link: () =>
              navigateToJobsMonitoringPage({
                [STATUS_FILTER]: ['running', 'pending', 'aborting'],
                [DATES_FILTER]: ANY_TIME_DATE_OPTION
              }),
            statusClass: 'running',
            tooltip: 'Aborting, Pending, Running',
            label: IN_PROCESS
          },
          {
            counter: data.failed,
            link: () => navigateToJobsMonitoringPage({ [STATUS_FILTER]: [ERROR_STATE, 'aborted'] }),
            statusClass: 'failed',
            tooltip: 'Aborted, Error',
            label: FAILED
          },
          {
            counter: data.completed,
            link: () => navigateToJobsMonitoringPage({ [STATUS_FILTER]: ['completed'] }),
            statusClass: 'completed',
            tooltip: 'Completed',
            label: SUCCEEDED
          }
        ]
      }
    : tab === JOBS_MONITORING_WORKFLOWS_TAB
      ? {
          total: {
            counter: data.total || 0,
            link: () => navigateToJobsMonitoringPage({ [STATUS_FILTER]: [FILTER_ALL_ITEMS] })
          },
          counters: [
            {
              counter: data.running,
              link: () =>
                navigateToJobsMonitoringPage({
                  [STATUS_FILTER]: ['running'],
                  [DATES_FILTER]: ANY_TIME_DATE_OPTION
                }),
              statusClass: 'running',
              tooltip: 'Running',
              label: IN_PROCESS
            },
            {
              counter: data.failed,
              link: () =>
                navigateToJobsMonitoringPage({ [STATUS_FILTER]: [ERROR_STATE, FAILED_STATE] }),
              statusClass: 'failed',
              tooltip: 'Error, Failed',
              label: FAILED
            },
            {
              counter: data.completed,
              link: () => navigateToJobsMonitoringPage({ [STATUS_FILTER]: ['completed'] }),
              statusClass: 'completed',
              tooltip: 'Completed',
              label: SUCCEEDED
            }
          ]
        }
      : {
          total: {
            counter: data.total || 0,
            link: () => navigateToJobsMonitoringPage({ [TYPE_FILTER]: FILTER_ALL_ITEMS }, {})
          },
          jobs: {
            counter: data.jobs || 0,
            link: () => navigateToJobsMonitoringPage({ [TYPE_FILTER]: JOB_KIND_JOB }, {})
          },
          workflows: {
            counter: data.workflows || 0,
            link: () => navigateToJobsMonitoringPage({ [TYPE_FILTER]: JOB_KIND_WORKFLOW }, {})
          }
        }
}
