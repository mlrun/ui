import { formatDatetime } from '../../utils/datetime'
import measureTime from '../../utils/measureTime'

export const getJobsStatistics = (jobs, match) => {
  if (jobs.data) {
    const jobsRunning = jobs.data.length
    const jobsFailed = jobs.data.reduce(
      (prev, curr) => (curr.status.state === 'error' ? (prev += 1) : prev),
      0
    )

    return {
      running: {
        value: jobsRunning,
        label: 'Running jobs',
        className: 'running',
        link: `/projects/${match.params.projectName}/jobs/monitor`
      },
      workflows: {
        value: 0,
        label: 'Running workflows',
        className: 'running',
        link: `/projects/${match.params.projectName}/jobs/monitor`
      },
      failed: {
        value: jobsFailed,
        label: 'Failed',
        className: 'default',
        link: `/projects/${match.params.projectName}/jobs/monitor`
      },
      scheduled: {
        value: 0,
        label: 'Scheduled',
        className: 'scheduled',
        link: `/projects/${match.params.projectName}/jobs/schedule`
      }
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
