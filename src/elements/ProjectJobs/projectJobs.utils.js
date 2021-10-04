import { orderBy } from 'lodash'

import {
  MONITOR_JOBS_TAB,
  MONITOR_WORKFLOWS_TAB,
  SCHEDULE_TAB
} from '../../constants'
import { formatDatetime } from '../../utils'
import measureTime from '../../utils/measureTime'
import { isDemoMode } from '../../utils/helper'

export const getJobsStatistics = (projectCounter, match, search) => {
  return {
    running: {
      value: projectCounter.error
        ? 'N/A'
        : projectCounter.data.runs_running_count,
      label: 'Running jobs',
      className:
        projectCounter.error || projectCounter.data.runs_running_count === 0
          ? 'default'
          : 'running',
      link: `/projects/${match.params.projectName}/jobs/${MONITOR_JOBS_TAB}`
    },
    workflows: {
      value: projectCounter.error
        ? 'N/A'
        : projectCounter.data.pipelines_running_count,
      label: 'Running workflows',
      className:
        projectCounter.error ||
        projectCounter.data.pipelines_running_count === 0
          ? 'default'
          : 'running',
      link: `/projects/${match.params.projectName}/jobs/${
        isDemoMode(search) ? MONITOR_WORKFLOWS_TAB : MONITOR_JOBS_TAB
      }`
    },
    failed: {
      value: projectCounter.error
        ? 'N/A'
        : projectCounter.data.runs_failed_recent_count,
      label: 'Failed',
      className:
        projectCounter.data.runs_failed_recent_count > 0 &&
        !projectCounter.error
          ? 'failed'
          : 'default',
      link: `/projects/${match.params.projectName}/jobs/${MONITOR_JOBS_TAB}`
    },
    scheduled: {
      value: projectCounter.error ? 'N/A' : projectCounter.data.schedules_count,
      label: 'Scheduled',
      className:
        projectCounter.error || projectCounter.data.schedules_count === 0
          ? 'default'
          : 'scheduled',
      link: `/projects/${match.params.projectName}/jobs/${SCHEDULE_TAB}`
    }
  }
}

export const getJobsTableData = (jobs, match) => {
  if (jobs) {
    const tableBody = jobs.slice(0, 5).map(job => {
      return {
        name: {
          value: job[0].metadata.name,
          link: `/projects/${match.params.projectName}/jobs/${MONITOR_JOBS_TAB}/${job[0].metadata.uid}/overview`,
          className: 'table-cell_big'
        },
        type: {
          value: job[0].metadata.kind ?? job[0].metadata.labels?.kind ?? '',
          class: 'project-data-card__table-cell table-cell_small'
        },
        status: {
          value: job.map(item => item.status.state),
          className: 'table-cell_medium'
        },
        startTime: {
          value: formatDatetime(
            new Date(job[0].status.start_time),
            job[0].status.state === 'aborted' ? 'N/A' : 'Not yet started'
          ),
          className: 'table-cell_big'
        },
        duration: {
          value: measureTime(
            new Date(job[0].status.start_time),
            new Date(job[0].status.last_update)
          ),
          className: 'table-cell_medium'
        }
      }
    })

    const tableHeader = [
      { value: 'Name', className: 'table-cell_big' },
      { value: 'Type', className: 'table-cell_small' },
      { value: 'Status', className: 'table-cell_medium' },
      { value: 'Started at', className: 'table-cell_big' },
      { value: 'Duration', className: 'table-cell_medium' }
    ]

    return {
      header: tableHeader,
      body: tableBody
    }
  }
}

export const groupByName = content => {
  const groupedItems = {}

  content.forEach(contentItem => {
    groupedItems[contentItem.metadata.name]
      ? groupedItems[contentItem.metadata.name].push(contentItem)
      : (groupedItems[contentItem.metadata.name] = [contentItem])
  })

  return Object.values(groupedItems)
}

export const sortByDate = groups => {
  return groups.map(group =>
    orderBy(group, ['status.last_update'], 'desc').slice(0, 5)
  )
}
