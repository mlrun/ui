import React from 'react'
import { isNil } from 'lodash'

import {
  DATE_RANGE_TIME_FILTER,
  JOBS_PAGE,
  LABELS_FILTER,
  NAME_FILTER,
  PERIOD_FILTER,
  STATUS_FILTER
} from '../../../constants'
import { detailsMenu, getInfoHeaders, isJobAbortable, JOB_STEADY_STATES } from '../jobs.util'

import { ReactComponent as Run } from 'igz-controls/images/run.svg'
import { ReactComponent as Cancel } from 'igz-controls/images/close.svg'
import { ReactComponent as Yaml } from 'igz-controls/images/yaml.svg'

import jobsActions from '../../../actions/jobs'
import detailsActions from '../../../actions/details'
import filtersActions from '../../../actions/filters'
import notificationActions from '../../../actions/notification'

export const generateFilters = jobName => [
  { type: PERIOD_FILTER, label: 'Period:' },
  { type: STATUS_FILTER, label: 'Status:' },
  { type: NAME_FILTER, label: 'Name:', hidden: Boolean(jobName) },
  { type: LABELS_FILTER, label: 'Labels:' },
  { type: DATE_RANGE_TIME_FILTER, label: 'Start time:' }
]

export const generatePageData = (fetchJobLogs, removeJobLogs, selectedJob) => {
  return {
    page: JOBS_PAGE,
    details: {
      menu: detailsMenu,
      type: JOBS_PAGE,
      infoHeaders: getInfoHeaders(!isNil(selectedJob.ui_run)),
      refreshLogs: fetchJobLogs,
      removeLogs: removeJobLogs,
      withLogsRefreshBtn: true
    }
  }
}

export const generateActionsMenu = (
  job,
  handleRerunJob,
  jobs_dashboard_url,
  handleMonitoring,
  abortable_function_kinds,
  handleConfirmAbortJob,
  toggleConvertedYaml
) => {
  return job?.uid
    ? [
        {
          label: 'Re-run',
          icon: <Run />,
          hidden: ['local', ''].includes(job?.ui?.originalContent.metadata.labels.kind),
          onClick: handleRerunJob
        },
        {
          label: 'Monitoring',
          tooltip: !jobs_dashboard_url
            ? 'Grafana service unavailable'
            : job?.labels?.includes('kind: dask')
            ? 'Unavailable for Dask jobs'
            : '',
          disabled: !jobs_dashboard_url || job?.labels?.includes('kind: dask'),
          onClick: handleMonitoring
        },
        {
          label: 'Abort',
          icon: <Cancel />,
          onClick: handleConfirmAbortJob,
          tooltip: isJobAbortable(job, abortable_function_kinds)
            ? ''
            : 'Cannot abort jobs of this kind',
          disabled: !isJobAbortable(job, abortable_function_kinds),
          hidden: JOB_STEADY_STATES.includes(job?.state?.value)
        },
        {
          label: 'View YAML',
          icon: <Yaml />,
          onClick: toggleConvertedYaml
        }
      ]
    : [
        {
          label: 'View YAML',
          icon: <Yaml />,
          onClick: toggleConvertedYaml
        }
      ]
}

export const monitorJobsActionCreator = {
  abortJob: jobsActions.abortJob,
  fetchAllJobRuns: jobsActions.fetchAllJobRuns,
  fetchJob: jobsActions.fetchJob,
  fetchJobLogs: jobsActions.fetchJobLogs,
  fetchJobPods: detailsActions.fetchJobPods,
  fetchJobs: jobsActions.fetchJobs,
  removeJobLogs: jobsActions.removeJobLogs,
  removeNewJob: jobsActions.removeNewJob,
  removePods: detailsActions.removePods,
  setFilters: filtersActions.setFilters,
  setNotification: notificationActions.setNotification
}
