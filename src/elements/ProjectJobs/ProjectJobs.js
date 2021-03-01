import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ProjectDataCard from '../ProjectDataCard/ProjectDataCard'

import { getJobsStatistics, getJobsTableData } from './projectJobs.utils'
import projectsAction from '../../actions/projects'

const ProjectJobs = ({
  fetchProjectJobs,
  fetchProjectScheduledJobs,
  fetchProjectWorkflows,
  match,
  projectStore
}) => {
  useEffect(() => {
    fetchProjectJobs(match.params.projectName)
    fetchProjectScheduledJobs(match.params.projectName)
    fetchProjectWorkflows(match.params.projectName)
  }, [
    match.params.projectName,
    fetchProjectJobs,
    fetchProjectScheduledJobs,
    fetchProjectWorkflows
  ])

  const jobsData = useMemo(() => {
    const statistics = getJobsStatistics(
      projectStore.project.jobs,
      match,
      projectStore.project.scheduledJobs,
      projectStore.project.workflows
    )
    const table = getJobsTableData(projectStore.project.jobs, match)

    return {
      statistics,
      table
    }
  }, [
    match,
    projectStore.project.jobs,
    projectStore.project.scheduledJobs,
    projectStore.project.workflows
  ])

  return (
    <ProjectDataCard
      content={projectStore.project.jobs}
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
  match: PropTypes.shape({}).isRequired
}

export default connect(
  projectStore => ({
    ...projectStore
  }),
  {
    ...projectsAction
  }
)(React.memo(ProjectJobs))
