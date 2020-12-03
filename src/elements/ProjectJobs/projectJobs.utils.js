import { formatDatetime } from '../../utils'
import measureTime from '../../utils/measureTime'

export const getJobsStatistics = (jobs, match, scheduledJobs, workflows) => {
  let jobsRunning = 0
  let jobsFailed = 0

  if (jobs.data) {
    jobsRunning = jobs.data.reduce(
      (prev, curr) => (curr.status.state === 'running' ? (prev += 1) : prev),
      0
    )
    jobsFailed = jobs.data.reduce(
      (prev, curr) => (curr.status.state === 'error' ? (prev += 1) : prev),
      0
    )
  }

  return {
    running: {
      value: jobs.error ? 'N/A' : jobsRunning,
      label: 'Running jobs',
      className: jobs.error ? 'default' : 'running',
      link: `/projects/${match.params.projectName}/jobs/monitor`
    },
    workflows: {
      value: workflows.error ? 'N/A' : workflows.data.length,
      label: 'Running workflows',
      className: workflows.error ? 'default' : 'running',
      link: `/projects/${match.params.projectName}/jobs/monitor`
    },
    failed: {
      value: jobs.error ? 'N/A' : jobsFailed,
      label: 'Failed',
      className: jobsFailed > 0 && !jobs.error ? 'failed' : 'default',
      link: `/projects/${match.params.projectName}/jobs/monitor`
    },
    scheduled: {
      value: scheduledJobs.error ? 'N/A' : scheduledJobs.data.length,
      label: 'Scheduled',
      className: scheduledJobs.error ? 'default' : 'scheduled',
      link: `/projects/${match.params.projectName}/jobs/schedule`
    }
  }
}

export const getJobsTableData = (jobs, match) => {
  if (jobs.data) {
    const tableBody = jobs.data.slice(0, 5).map(job => {
      return {
        name: {
          value: job.metadata.name,
          link: `/projects/${match.params.projectName}/jobs/monitor/${job.metadata.uid}/info`,
          className: 'table-cell_big'
        },
        type: {
          value: job.metadata.kind ?? '',
          class: 'project-data-card__table-cell table-cell_small'
        },
        status: {
          value: job.status.state === 'error' ? 'failed' : job.status.state,
          className: 'table-cell_medium'
        },
        startTime: {
          value: formatDatetime(
            new Date(job.status.start_time),
            'Not yet started'
          ),
          className: 'table-cell_big'
        },
        duration: {
          value: measureTime(
            new Date(job.status.start_time),
            new Date(job.status.last_update)
          ),
          className: 'table-cell_small'
        }
      }
    })

    const tableHeader = [
      { value: 'Name', className: 'table-cell_big' },
      { value: 'Type', className: 'table-cell_small' },
      { value: 'Status', className: 'table-cell_medium' },
      { value: 'Started at', className: 'table-cell_big' },
      { value: 'Duration', className: 'table-cell_small' }
    ]

    return {
      header: tableHeader,
      body: tableBody
    }
  }
}
