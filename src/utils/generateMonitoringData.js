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
  APPLICATION,
  ARTIFACTS_PAGE,
  DATES_FILTER,
  ERROR_STATE,
  FAILED_STATE,
  FILTER_ALL_ITEMS,
  JOBS_MONITORING_JOBS_TAB,
  JOBS_MONITORING_PAGE,
  JOBS_MONITORING_WORKFLOWS_TAB,
  JOB_KIND_JOB,
  JOB_KIND_WORKFLOW,
  MODELS_PAGE,
  MONITORING_APP_PAGE,
  MONITOR_WORKFLOWS_TAB,
  STATUS_FILTER,
  TYPE_FILTER
} from '../constants'
import {
  ANY_TIME_DATE_OPTION,
  PAST_24_HOUR_DATE_OPTION,
  NEXT_24_HOUR_DATE_OPTION
} from './datePicker.util'
import classNames from 'classnames'

const IN_PROCESS = 'In process'
const FAILED = 'Failed'
const SUCCEEDED = 'Succeeded'
const RUNNING = 'Running'

export const generateMonitoringStats = (data, navigate, tab, projectName) => {
  const linkClassNameDetails = (projectName, noLine) =>
    classNames(!noLine && 'stats__line', projectName && 'stats__link')

  const linkClassNameHeader = projectName => classNames(projectName && 'stats__link')

  const navigateToTab = (projectName, tab) => {
    projectName && navigate(`/projects/${projectName}/${tab}`)
  }

  const navigateToJobsMonitoringPage = (filters = {}) => {
    projectName
      ? navigate(`/projects/${projectName}/jobs/${tab}?${new URLSearchParams(filters)}`)
      : navigate(`/projects/*/${JOBS_MONITORING_PAGE}/${tab}?${new URLSearchParams(filters)}`)
  }

  return tab === JOBS_MONITORING_JOBS_TAB
    ? {
        total: {
          counter: data.total || 0,
          link: () =>
            navigateToJobsMonitoringPage({
              [STATUS_FILTER]: [FILTER_ALL_ITEMS],
              [DATES_FILTER]: PAST_24_HOUR_DATE_OPTION
            })
        },
        counters: [
          {
            counter: data.running || 0,
            className: classNames('stats__link', 'stats__line'),
            link: () =>
              navigateToJobsMonitoringPage({
                [STATUS_FILTER]: ['running', 'pending', 'pendingRetry', 'aborting'],
                [DATES_FILTER]: ANY_TIME_DATE_OPTION
              }),
            statusClass: 'running',
            tooltip: 'Aborting, Pending, Pending retry, Running',
            label: IN_PROCESS,
            counterClassName: 'stats__counter'
          },
          {
            counter: data.failed || 0,
            className: classNames('stats__link', 'stats__line'),
            link: () =>
              navigateToJobsMonitoringPage({
                [STATUS_FILTER]: [ERROR_STATE, 'aborted'],
                [DATES_FILTER]: PAST_24_HOUR_DATE_OPTION
              }),
            statusClass: 'failed',
            tooltip: 'Aborted, Error',
            label: FAILED,
            counterClassName: classNames('stats__counter', {
              stats__failed: data.failed > 0
            })
          },
          {
            counter: data.completed || 0,
            className: classNames('stats__link', 'stats__line'),
            link: () =>
              navigateToJobsMonitoringPage({
                [STATUS_FILTER]: ['completed'],
                [DATES_FILTER]: PAST_24_HOUR_DATE_OPTION
              }),
            statusClass: 'completed',
            tooltip: 'Completed',
            label: SUCCEEDED,
            counterClassName: 'stats__counter'
          }
        ]
      }
    : [JOBS_MONITORING_WORKFLOWS_TAB, MONITOR_WORKFLOWS_TAB].includes(tab)
      ? {
          total: {
            counter: data.total || 0,
            link: () =>
              navigateToJobsMonitoringPage({
                [STATUS_FILTER]: [FILTER_ALL_ITEMS],
                [DATES_FILTER]: PAST_24_HOUR_DATE_OPTION
              })
          },
          counters: [
            {
              counter: data.running || 0,
              link: () =>
                navigateToJobsMonitoringPage({
                  [STATUS_FILTER]: ['running', 'terminating'],
                  [DATES_FILTER]: ANY_TIME_DATE_OPTION
                }),
              className: classNames('stats__link', 'stats__line'),
              statusClass: 'running',
              tooltip: 'Running, Terminating',
              label: IN_PROCESS,
              counterClassName: 'stats__counter'
            },
            {
              counter: data.failed || 0,
              className: classNames('stats__link', 'stats__line'),
              link: () =>
                navigateToJobsMonitoringPage({
                  [STATUS_FILTER]: [ERROR_STATE, FAILED_STATE],
                  [DATES_FILTER]: PAST_24_HOUR_DATE_OPTION
                }),
              statusClass: 'failed',
              tooltip: 'Error, Failed',
              label: FAILED,
              counterClassName: classNames('stats__counter', {
                stats__failed: data.failed > 0
              })
            },
            {
              counter: data.completed || 0,
              className: classNames('stats__link', 'stats__line'),
              link: () =>
                navigateToJobsMonitoringPage({
                  [STATUS_FILTER]: ['completed'],
                  [DATES_FILTER]: PAST_24_HOUR_DATE_OPTION
                }),
              statusClass: 'completed',
              tooltip: 'Completed',
              label: SUCCEEDED,
              counterClassName: 'stats__counter'
            }
          ]
        }
      : tab === ARTIFACTS_PAGE
        ? {
            total: {
              counter: data.total || 0
            },
            datasets: {
              counter: data.datasets || 0,
              link: () => navigateToTab(projectName, 'datasets'),
              className: linkClassNameDetails(projectName)
            },
            documents: {
              counter: data.documents || 0,
              link: () => navigateToTab(projectName, 'documents'),
              className: linkClassNameDetails(projectName)
            },
            llm_prompt: {
              counter: data.llm_prompts || 0,
              link: () => navigateToTab(projectName, 'llm-prompts'),
              className: linkClassNameDetails(projectName)
            },
            files: {
              counter: data.files || 0,
              link: () => navigateToTab(projectName, 'files'),
              className: linkClassNameDetails(projectName)
            },
            list: [
              { key: 'datasets', label: 'Datasets' },
              { key: 'documents', label: 'Documents' },
              { key: 'llm_prompt', label: 'LLM prompt artifacts' },
              { key: 'files', label: 'Other artifacts' }
            ]
          }
        : tab === MODELS_PAGE
          ? {
              models: {
                counter: data || 0,
                link: () => navigateToTab(projectName, 'models'),
                className: linkClassNameHeader(projectName)
              }
            }
          : tab === APPLICATION
            ? {
                total: {
                  counter: data.total || 0,
                  link: () => navigateToTab(projectName, MONITORING_APP_PAGE),
                  className: `stats__counter_total ${linkClassNameHeader(projectName)}`
                },
                counters: [
                  {
                    counter: data.running || 0,
                    className: classNames(projectName && 'stats__link'),
                    link: () => navigateToTab(projectName, MONITORING_APP_PAGE),
                    statusClass: 'running',
                    label: RUNNING,
                    popUpClassName: classNames({ 'card-popup_text_link': projectName }),
                    tooltip: RUNNING
                  },
                  {
                    counter: data.failed || 0,
                    className: classNames(projectName && 'stats__link', {
                      stats__failed: data.failed > 0
                    }),
                    link: () => navigateToTab(projectName, MONITORING_APP_PAGE),
                    statusClass: 'failed',
                    label: FAILED,
                    popUpClassName: classNames({ 'card-popup_text_link': projectName }),
                    tooltip: 'Failed, Error, Unhealthy'
                  }
                ]
              }
            : {
                total: {
                  counter: data.total || 0,
                  link: () =>
                    navigateToJobsMonitoringPage({
                      [TYPE_FILTER]: FILTER_ALL_ITEMS,
                      [DATES_FILTER]: NEXT_24_HOUR_DATE_OPTION
                    })
                },
                jobs: {
                  counter: data.jobs || 0,
                  link: () =>
                    navigateToJobsMonitoringPage({
                      [TYPE_FILTER]: JOB_KIND_JOB,
                      [DATES_FILTER]: NEXT_24_HOUR_DATE_OPTION
                    })
                },
                workflows: {
                  counter: data.workflows || 0,
                  link: () =>
                    navigateToJobsMonitoringPage({
                      [TYPE_FILTER]: JOB_KIND_WORKFLOW,
                      [DATES_FILTER]: NEXT_24_HOUR_DATE_OPTION
                    })
                }
              }
}
