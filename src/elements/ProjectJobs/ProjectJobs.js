import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'

import ProjectDataCard from '../ProjectDataCard/ProjectDataCard'

import { MONITOR_JOBS_TAB } from '../../constants'
import {
  getJobsStatistics,
  getJobsTableData,
  groupByName,
  sortByDate
} from './projectJobs.utils'
import projectsAction from '../../actions/projects'

const ProjectJobs = ({ fetchProjectJobs, projectStore }) => {
  const [groupedLatestItem, setGroupedLatestItem] = useState([])
  const params = useParams()

  useEffect(() => {
    if (projectStore.project.jobs.data) {
      setGroupedLatestItem(
        sortByDate(groupByName(projectStore.project.jobs.data))
      )
    }
  }, [projectStore.project.jobs.data])

  useEffect(() => {
    fetchProjectJobs(params.projectName)
  }, [fetchProjectJobs, params.projectName])

  const jobsData = useMemo(() => {
    const statistics = getJobsStatistics(projectStore.projectSummary, params.projectName)
    const table = getJobsTableData(groupedLatestItem, params.projectName)

    return {
      statistics,
      table
    }
  }, [groupedLatestItem, params.projectName, projectStore.projectSummary])

  return (
    <ProjectDataCard
      content={projectStore.project.jobs}
      headerLink={`/projects/${params.projectName}/jobs/${MONITOR_JOBS_TAB}`}
      link={`/projects/${params.projectName}/jobs/${MONITOR_JOBS_TAB}`}
      params={params}
      statistics={jobsData.statistics}
      table={jobsData.table}
      title="Jobs and workflows"
    />
  )
}

export default connect(
  projectStore => ({
    ...projectStore
  }),
  {
    ...projectsAction
  }
)(React.memo(ProjectJobs))
