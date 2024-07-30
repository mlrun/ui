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
  JOBS_MONITORING_SCHEDULED_TAB,
  NAME_FILTER,
  GROUP_BY_FILTER,
  DATE_RANGE_TIME_FILTER
} from '../../constants'
import jobsActions from '../../actions/jobs'
import functionsActions from '../../actions/functions'

export const STATS_TOTAL_CARD = 'total'
export const STATS_RUNNING_CARD = 'running'
export const STATS_FAILED_CARD = 'failed'
export const STATS_COMPLETED_CARD = 'completed'
export const STATS_JOBS_CARD = 'jobs'
export const STATS_WORKFLOWS_CARD = 'workflows'

export const tabs = [
  { id: JOBS_MONITORING_JOBS_TAB, label: 'Jobs' },
  { id: JOBS_MONITORING_WORKFLOWS_TAB, label: 'Workflows' },
  { id: JOBS_MONITORING_SCHEDULED_TAB, label: 'Scheduled' }
]

export const jobMonitoringFilters = [
  { type: NAME_FILTER, label: 'Search by name:' },
  { type: GROUP_BY_FILTER, label: 'Group by' },
  { type: DATE_RANGE_TIME_FILTER, label: 'Timeframe:' }
]

export const generateStatsData = (cardsData, tab) =>
  tab === JOBS_MONITORING_SCHEDULED_TAB
    ? [
        {
          id: STATS_TOTAL_CARD,
          className: 'total',
          counter: cardsData.all.length,
          subTitle: 'Total',
          tooltip: 'Click to see all'
        },
        {
          id: STATS_JOBS_CARD,
          className: 'total',
          counter: cardsData.jobs.length,
          subTitle: 'Jobs',
          tooltip: 'Click to see only jobs'
        },
        {
          id: STATS_WORKFLOWS_CARD,
          className: 'total',
          counter: cardsData.workflows.length,
          subTitle: 'Workflows',
          tooltip: 'Click to see only workflows'
        }
      ]
    : [
        {
          id: STATS_TOTAL_CARD,
          className: 'total',
          counter: cardsData.all.length,
          subTitle: 'Total',
          tooltip: 'Click to see all'
        },
        {
          id: STATS_RUNNING_CARD,
          className: 'running',
          counter: cardsData.running.length,
          statusClass: 'running',
          subTitle: 'Running',
          tooltip: 'Click to filter by status running'
        },
        {
          id: STATS_FAILED_CARD,
          className: 'failed',
          counter: cardsData.failed.length,
          statusClass: 'failed',
          subTitle: 'Failed',
          tooltip: 'Click to filter by status failed'
        },
        {
          id: STATS_COMPLETED_CARD,
          className: 'completed',
          counter: cardsData.completed.length,
          statusClass: 'completed',
          subTitle: 'Completed',
          tooltip: 'Click to filter by status completed'
        }
      ]

export const actionCreator = {
  fetchAllJobRuns: jobsActions.fetchAllJobRuns,
  fetchFunctionLogs: functionsActions.fetchFunctionLogs,
  fetchJobFunction: jobsActions.fetchJobFunction,
  fetchJobs: jobsActions.fetchJobs
}
