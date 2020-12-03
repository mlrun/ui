import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'

import ProjectDataCard from '../ProjectDataCard/ProjectDataCard'
import { getJobsStatistics, getJobsTableData } from './projectJobs.utils'

const ProjectJobs = ({
  fetchProjectJobs,
  fetchProjectScheduledJobs,
  fetchProjectWorkflows,
  jobs,
  match,
  scheduledJobs,
  workflows
}) => {
  useEffect(() => {
    fetchProjectJobs(match.params.projectName)
    fetchProjectScheduledJobs(match.params.projectName)
    fetchProjectWorkflows()
  }, [
    match.params.projectName,
    fetchProjectJobs,
    fetchProjectScheduledJobs,
    fetchProjectWorkflows
  ])

  const jobsData = useMemo(() => {
    const statistics = getJobsStatistics(jobs, match, scheduledJobs, workflows)
    const table = getJobsTableData(jobs, match)

    return {
      statistics,
      table
    }
  }, [jobs, match, scheduledJobs, workflows])

  return (
    <ProjectDataCard
      content={jobs}
      headerLink={`/projects/${match.params.projectName}/jobs/monitor`}
      link={`/projects/${match.params.projectName}/jobs/monitor`}
      match={match}
      statistics={jobsData.statistics}
      table={jobsData.table}
      title="Jobs and workflows"
    />
  )
}

ProjectJobs.propTypes = {
  fetchProjectJobs: PropTypes.func.isRequired,
  fetchProjectScheduledJobs: PropTypes.func.isRequired,
  fetchProjectWorkflows: PropTypes.func.isRequired,
  jobs: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  scheduledJobs: PropTypes.shape({}).isRequired
}

export default React.memo(ProjectJobs)
