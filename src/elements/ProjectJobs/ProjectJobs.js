import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useLocation } from 'react-router-dom'

import ProjectDataCard from '../ProjectDataCard/ProjectDataCard'

import { MONITOR_JOBS_TAB } from '../../constants'
import {
  getJobsStatistics,
  getJobsTableData,
  groupByName,
  sortByDate
} from './projectJobs.utils'
import projectsAction from '../../actions/projects'

const ProjectJobs = ({ fetchProjectJobs, match, projectStore }) => {
  const location = useLocation()
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
  }, [fetchProjectJobs, match.params.projectName])

  const jobsData = useMemo(() => {
    const statistics = getJobsStatistics(
      projectStore.projectCounters,
      match,
      location.search
    )
    const table = getJobsTableData(groupedLatestItem, match)

    return {
      statistics,
      table
    }
  }, [projectStore.projectCounters, match, location.search, groupedLatestItem])

  return (
    <ProjectDataCard
      content={projectStore.project.jobs}
      headerLink={`/projects/${match.params.projectName}/jobs/${MONITOR_JOBS_TAB}`}
      link={`/projects/${match.params.projectName}/jobs/${MONITOR_JOBS_TAB}`}
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
