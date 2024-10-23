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
import {
  ANY_TIME_DATE_OPTION,
  datePickerPastOptions,
  getDatePickerFilterValue
} from './datePicker.util'
import { setFiltersValues, setModalFiltersValues } from '../reducers/filtersReducer'

export const generateMonitoringStats = (data, navigate, dispatch, tab) => {
  const navigateToJobsMonitoringPage = (modalFilters, filters = {}) => {
    dispatch(setFiltersValues({ name: tab, value: filters }))
    dispatch(setModalFiltersValues({ name: tab, value: modalFilters }))
    navigate(`/projects/*/${JOBS_MONITORING_PAGE}/${tab}`)
  }

  return tab === JOBS_MONITORING_JOBS_TAB
    ? {
        all: {
          counter: data.all,
          link: () => navigateToJobsMonitoringPage({ [STATUS_FILTER]: [FILTER_ALL_ITEMS] })
        },
        counters: [
          {
            counter: data.running,
            link: () =>
              navigateToJobsMonitoringPage(
                {
                  [STATUS_FILTER]: ['running', 'pending', 'aborting']
                },
                {
                  [DATES_FILTER]: getDatePickerFilterValue(
                    datePickerPastOptions,
                    ANY_TIME_DATE_OPTION
                  )
                }
              ),
            statusClass: 'running',
            tooltip: 'Aborting, Pending, Running'
          },
          {
            counter: data.failed,
            link: () => navigateToJobsMonitoringPage({ [STATUS_FILTER]: [ERROR_STATE, 'aborted'] }),
            statusClass: 'failed',
            tooltip: 'Aborted, Error'
          },
          {
            counter: data.completed,
            link: () => navigateToJobsMonitoringPage({ [STATUS_FILTER]: ['completed'] }),
            statusClass: 'completed',
            tooltip: 'Completed'
          }
        ]
      }
    : tab === JOBS_MONITORING_WORKFLOWS_TAB
      ? {
          all: {
            counter: data.all,
            link: () => navigateToJobsMonitoringPage({ [STATUS_FILTER]: [FILTER_ALL_ITEMS] })
          },
          counters: [
            {
              counter: data.running,
              link: () =>
                navigateToJobsMonitoringPage(
                  { [STATUS_FILTER]: ['running'] },
                  {
                    [DATES_FILTER]: getDatePickerFilterValue(
                      datePickerPastOptions,
                      ANY_TIME_DATE_OPTION
                    )
                  }
                ),
              statusClass: 'running',
              tooltip: 'Running'
            },
            {
              counter: data.failed,
              link: () => navigateToJobsMonitoringPage({ [STATUS_FILTER]: [ERROR_STATE, FAILED_STATE] }),
              statusClass: 'failed',
              tooltip: 'Error, Failed'
            },
            {
              counter: data.completed,
              link: () => navigateToJobsMonitoringPage({ [STATUS_FILTER]: ['completed'] }),
              statusClass: 'completed',
              tooltip: 'Completed'
            }
          ]
        }
      : {
          all: {
            counter: data.all,
            link: () => navigateToJobsMonitoringPage({ [TYPE_FILTER]: FILTER_ALL_ITEMS }, {})
          },
          jobs: {
            counter: data.jobs,
            link: () => navigateToJobsMonitoringPage({ [TYPE_FILTER]: JOB_KIND_JOB }, {})
          },
          workflows: {
            counter: data.workflows,
            link: () => navigateToJobsMonitoringPage({ [TYPE_FILTER]: JOB_KIND_WORKFLOW }, {})
          }
        }
}
