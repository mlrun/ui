import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ProjectDataCard from '../ProjectDataCard/ProjectDataCard'

import {
  getJobsStatistics,
  getJobsTableData,
  groupByName,
  sortByDate
} from './projectJobs.utils'
import projectsAction from '../../actions/projects'

const ProjectJobs = ({
  fetchProjectJobs,
  fetchProjectScheduledJobs,
  fetchProjectWorkflows,
  match,
  projectStore
}) => {
  const [groupedLatestItem, setGroupedLatestItem] = useState([])

  useEffect(() => {
    if (projectStore.project.jobs.data) {
      setGroupedLatestItem(
        sortByDate(groupByName(projectStore.project.jobs.data))
      )
    }
  }, [projectStore.project.jobs.data])

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
    const table = getJobsTableData(groupedLatestItem, match)

    return {
      statistics,
      table
    }
  }, [
    groupedLatestItem,
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
